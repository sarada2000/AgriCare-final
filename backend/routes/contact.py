"""Contact numbers for each district, and "please call me" requests from farmers.

GET   /api/contacts                        public: numbers to call / SMS / WhatsApp
PUT   /api/admin/contacts                  officer: save the numbers
POST  /api/contact-requests                anyone: ask AgriCare to call back
GET   /api/admin/contact-requests          officer: list requests (?status=new|done|all)
PATCH /api/admin/contact-requests/<id>     officer: mark done / new
"""
import re

from flask import Blueprint, jsonify, request

from auth import DISTRICTS, current_user_from_request, error, normalize_phone, officer_required
from db import get_db, rows
from plans_data import utc_now

bp = Blueprint("contact", __name__, url_prefix="/api")
MAIN = "_main"


def clean_number(raw):
    """Keep +, digits and spaces. Accept mobiles, land lines and short numbers (3-15 digits)."""
    text = re.sub(r"[^\d+ ]", "", str(raw or "")).strip()
    digits = re.sub(r"\D", "", text)
    if not digits:
        return ""
    if not 3 <= len(digits) <= 15:
        return None
    return text


@bp.get("/contacts")
def contacts():
    out = {r["district"]: {k: r[k] or "" for k in ("name", "phone", "whatsapp", "hours")}
           for r in rows(get_db().execute("SELECT * FROM contacts"))}
    return jsonify({"contacts": out})


@bp.put("/admin/contacts")
@officer_required
def save_contacts():
    data = (request.get_json(silent=True) or {}).get("contacts")
    if not isinstance(data, dict):
        return error("Send the contacts.")
    db = get_db()
    for district, c in data.items():
        if district != MAIN and district not in DISTRICTS:
            return error(f"Unknown district: {district}")
        c = c if isinstance(c, dict) else {}
        phone, whatsapp = clean_number(c.get("phone")), clean_number(c.get("whatsapp"))
        if phone is None or whatsapp is None:
            return error(f"Check the number for {'the main line' if district == MAIN else district}.", field=district)
        if not phone and not whatsapp:
            db.execute("DELETE FROM contacts WHERE district = ?", (district,))
            continue
        db.execute("""INSERT INTO contacts (district, name, phone, whatsapp, hours, updated_at) VALUES (?,?,?,?,?,?)
                      ON CONFLICT(district) DO UPDATE SET name=excluded.name, phone=excluded.phone,
                      whatsapp=excluded.whatsapp, hours=excluded.hours, updated_at=excluded.updated_at""",
                   (district, str(c.get("name") or "")[:80], phone or whatsapp, whatsapp, str(c.get("hours") or "")[:80], utc_now()))
    db.commit()
    return contacts()


@bp.post("/contact-requests")
def create_request():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name") or "").strip()[:80]
    phone = normalize_phone(data.get("phone"))
    district = data.get("district") if data.get("district") in DISTRICTS else None
    message = str(data.get("message") or "").strip()[:1000]
    language = data.get("language") if data.get("language") in ("en", "si", "ta") else "en"
    if len(name) < 2:
        return error("Enter your name.", field="name")
    if not phone:
        return error("Enter a valid mobile number, e.g. 0771234567.", field="phone")
    db = get_db()
    today = db.execute("SELECT COUNT(*) FROM contact_requests WHERE phone = ? AND created_at >= strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 day')",
                       (phone,)).fetchone()[0]
    if today >= 5:
        return error("We already have your request. We will call you soon.", 429)
    user = current_user_from_request()
    cur = db.execute("INSERT INTO contact_requests (user_id, name, phone, district, message, language) VALUES (?,?,?,?,?,?)",
                     (user["id"] if user else None, name, phone, district, message, language))
    db.commit()
    return jsonify({"ok": True, "id": cur.lastrowid}), 201


@bp.get("/admin/contact-requests")
@officer_required
def list_requests():
    status = request.args.get("status", "new")
    q = "SELECT * FROM contact_requests"
    args = ()
    if status in ("new", "done"):
        q += " WHERE status = ?"
        args = (status,)
    q += " ORDER BY created_at DESC, id DESC LIMIT 200"
    return jsonify({"requests": rows(get_db().execute(q, args))})


@bp.patch("/admin/contact-requests/<int:rid>")
@officer_required
def update_request(rid):
    status = (request.get_json(silent=True) or {}).get("status")
    if status not in ("new", "done"):
        return error("Status must be new or done.")
    db = get_db()
    cur = db.execute("UPDATE contact_requests SET status = ?, done_at = ? WHERE id = ?",
                     (status, utc_now() if status == "done" else None, rid))
    db.commit()
    if not cur.rowcount:
        return error("Request not found.", 404)
    return jsonify({"ok": True})
