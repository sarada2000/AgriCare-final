"""Accounts: register, log in, profile. Passwords are hashed; logins return a signed token (JWT)."""
import os
import re
import time
from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import Blueprint, current_app, g, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from db import get_db, row

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

DISTRICTS = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota",
    "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara",
    "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya",
]
LANGS = ("en", "si", "ta")

# simple protection against password guessing: 8 failed tries per phone per 15 minutes
MAX_TRIES, WINDOW = 8, 15 * 60


def _failed():
    return current_app.extensions.setdefault("login_failures", {})


def error(message, status=400, field=None):
    body = {"error": message}
    if field:
        body["field"] = field
    return jsonify(body), status


def normalize_phone(raw):
    """Accept 0771234567, 077 123 4567, +94771234567 or 94771234567 -> 0771234567."""
    digits = re.sub(r"\D", "", raw or "")
    if digits.startswith("94") and len(digits) == 11:
        digits = "0" + digits[2:]
    if len(digits) == 9 and digits.startswith("7"):
        digits = "0" + digits
    return digits if re.fullmatch(r"0\d{9}", digits) else None


def public_user(u):
    return {
        "id": u["id"], "name": u["name"], "phone": u["phone"], "role": u["role"],
        "district": u["district"], "language": u["language"], "smsReminders": bool(u["sms_reminders"]),
        "createdAt": u["created_at"],
    }


def make_token(user):
    now = datetime.now(timezone.utc)
    payload = {"sub": str(user["id"]), "role": user["role"], "iat": now,
               "exp": now + timedelta(hours=current_app.config["TOKEN_HOURS"])}
    return jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")


def current_user_from_request():
    header = request.headers.get("Authorization", "")
    token = header[7:] if header.startswith("Bearer ") else None
    if not token:
        return None
    try:
        data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
    except jwt.PyJWTError:
        return None
    return row(get_db().execute("SELECT * FROM users WHERE id = ?", (int(data["sub"]),)).fetchone())


def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = current_user_from_request()
        if not user:
            return error("Please log in again.", 401)
        g.user = user
        return fn(*args, **kwargs)
    return wrapper


def officer_required(fn):
    @wraps(fn)
    @login_required
    def wrapper(*args, **kwargs):
        if g.user["role"] != "officer":
            return error("Only agriculture officers can do this.", 403)
        return fn(*args, **kwargs)
    return wrapper


@bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    phone = normalize_phone(data.get("phone"))
    password = data.get("password") or ""
    district = data.get("district") or None
    language = data.get("language") or "en"

    if len(name) < 2:
        return error("Enter your name.", field="name")
    if not phone:
        return error("Enter a 10-digit Sri Lankan mobile number, e.g. 0771234567.", field="phone")
    if len(password) < 6:
        return error("Password must be at least 6 characters.", field="password")
    if district and district not in DISTRICTS:
        return error("Choose a district from the list.", field="district")
    if language not in LANGS:
        language = "en"

    db = get_db()
    if db.execute("SELECT 1 FROM users WHERE phone = ?", (phone,)).fetchone():
        return error("This mobile number already has an account. Log in instead.", 409, field="phone")
    cur = db.execute(
        "INSERT INTO users (name, phone, password_hash, district, language, sms_reminders) VALUES (?,?,?,?,?,?)",
        (name[:80], phone, generate_password_hash(password), district, language, 1 if data.get("smsReminders", True) else 0),
    )
    db.commit()
    user = row(db.execute("SELECT * FROM users WHERE id = ?", (cur.lastrowid,)).fetchone())
    return jsonify({"token": make_token(user), "user": public_user(user)}), 201


@bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    phone = normalize_phone(data.get("phone"))
    password = data.get("password") or ""
    if not phone or not password:
        return error("Enter your mobile number and password.")

    now = time.time()
    tries = [t for t in _failed().get(phone, []) if now - t < WINDOW]
    if len(tries) >= MAX_TRIES:
        return error("Too many wrong tries. Wait 15 minutes and try again.", 429)

    db = get_db()
    user = row(db.execute("SELECT * FROM users WHERE phone = ?", (phone,)).fetchone())
    if not user or not check_password_hash(user["password_hash"], password):
        tries.append(now)
        _failed()[phone] = tries
        return error("Mobile number or password is wrong.", 401)

    _failed().pop(phone, None)
    db.execute("UPDATE users SET last_login_at = strftime('%Y-%m-%dT%H:%M:%SZ','now') WHERE id = ?", (user["id"],))
    db.commit()
    return jsonify({"token": make_token(user), "user": public_user(user)})


@bp.get("/me")
@login_required
def me():
    return jsonify({"user": public_user(g.user)})


@bp.patch("/me")
@login_required
def update_me():
    data = request.get_json(silent=True) or {}
    fields, values = [], []
    if "name" in data and len((data["name"] or "").strip()) >= 2:
        fields.append("name = ?"); values.append(data["name"].strip()[:80])
    if "district" in data and (data["district"] in DISTRICTS or data["district"] is None):
        fields.append("district = ?"); values.append(data["district"])
    if data.get("language") in LANGS:
        fields.append("language = ?"); values.append(data["language"])
    if "smsReminders" in data:
        fields.append("sms_reminders = ?"); values.append(1 if data["smsReminders"] else 0)
    if data.get("newPassword"):
        if not check_password_hash(g.user["password_hash"], data.get("currentPassword") or ""):
            return error("Current password is wrong.", 400, field="currentPassword")
        if len(data["newPassword"]) < 6:
            return error("Password must be at least 6 characters.", field="newPassword")
        fields.append("password_hash = ?"); values.append(generate_password_hash(data["newPassword"]))
    if fields:
        db = get_db()
        db.execute(f"UPDATE users SET {', '.join(fields)} WHERE id = ?", (*values, g.user["id"]))
        db.commit()
    user = row(get_db().execute("SELECT * FROM users WHERE id = ?", (g.user["id"],)).fetchone())
    return jsonify({"user": public_user(user)})


@bp.delete("/me")
@login_required
def delete_me():
    """Privacy: a farmer can delete their own account. The password is asked again so nobody else can do it
    from an open phone. Scans, plans, tasks and reminders are deleted with the user (ON DELETE CASCADE),
    and the leaf photos are removed from the disk."""
    data = request.get_json(silent=True) or {}
    if not check_password_hash(g.user["password_hash"], data.get("password") or ""):
        return error("Password is wrong.", 400, field="password")
    if g.user["role"] == "officer":
        return error("Officer accounts are removed by the system administrator.", 403)
    db = get_db()
    files = db.execute("SELECT image_file, thumb_file FROM scans WHERE user_id = ?", (g.user["id"],)).fetchall()
    db.execute("DELETE FROM users WHERE id = ?", (g.user["id"],))
    db.commit()
    up = current_app.config["UPLOAD_DIR"]
    for f in files:
        for name in (f["image_file"], f["thumb_file"]):
            try:
                if name:
                    os.remove(os.path.join(up, name))
            except OSError:
                pass
    return jsonify({"ok": True})


@bp.get("/districts")
def districts():
    return jsonify({"districts": DISTRICTS})
