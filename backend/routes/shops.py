"""Verified agro-chemical shops and Agrarian Service Centres, searched by distance.
Officers add and edit shops; everyone can search."""
import math

from flask import Blueprint, g, jsonify, request

from auth import DISTRICTS, error, officer_required
from db import get_db, row, rows

bp = Blueprint("shops", __name__, url_prefix="/api/shops")


def km_between(lat1, lng1, lat2, lng2):
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = math.radians(lat2 - lat1), math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def shop_json(s, km=None):
    out = {"id": s["id"], "name": s["name"], "type": s["type"], "lat": s["latitude"], "lng": s["longitude"],
           "phone": s["phone"] or "", "address": s["address"] or "", "district": s["district"],
           "hours": s["hours"] or "", "verified": bool(s["verified"])}
    if km is not None:
        out["km"] = round(km, 2)
    return out


def _validate(data, partial=False):
    clean = {}
    if not partial or "name" in data:
        name = (data.get("name") or "").strip()
        if len(name) < 2:
            raise ValueError("Enter the shop name.")
        clean["name"] = name[:120]
    if not partial or "lat" in data or "lng" in data:
        try:
            lat, lng = float(data.get("lat")), float(data.get("lng"))
        except (TypeError, ValueError):
            raise ValueError("Enter the shop location (latitude and longitude).")
        if not (5.7 <= lat <= 10.0 and 79.4 <= lng <= 82.1):
            raise ValueError("That location is not in Sri Lanka.")
        clean["latitude"], clean["longitude"] = lat, lng
    if "type" in data:
        if data["type"] not in ("agro", "asc", "garden"):
            raise ValueError("Type must be agro, asc or garden.")
        clean["type"] = data["type"]
    for key, col, n in (("phone", "phone", 30), ("address", "address", 200), ("hours", "hours", 80)):
        if key in data:
            clean[col] = (data.get(key) or "").strip()[:n] or None
    if "district" in data:
        if data["district"] and data["district"] not in DISTRICTS:
            raise ValueError("Choose a district from the list.")
        clean["district"] = data["district"] or None
    return clean


@bp.get("")
def search():
    """?lat=&lng=&radius=km  -> nearest first.   No lat/lng -> all shops (optionally ?district=)."""
    db = get_db()
    district = request.args.get("district")
    q, args = "SELECT * FROM shops", []
    if district:
        q += " WHERE district = ?"; args.append(district)
    all_shops = rows(db.execute(q, args).fetchall())
    try:
        lat, lng = float(request.args["lat"]), float(request.args["lng"])
    except (KeyError, ValueError):
        return jsonify({"shops": [shop_json(s) for s in all_shops]})
    radius = min(float(request.args.get("radius", 25)), 200)
    found = []
    for s in all_shops:
        km = km_between(lat, lng, s["latitude"], s["longitude"])
        if km <= radius:
            found.append((km, s))
    found.sort(key=lambda x: x[0])
    return jsonify({"shops": [shop_json(s, km) for km, s in found[:50]]})


@bp.post("")
@officer_required
def add():
    try:
        data = _validate(request.get_json(silent=True) or {})
    except ValueError as e:
        return error(str(e))
    data.setdefault("type", "agro")
    data["added_by"] = g.user["id"]
    cols = ", ".join(data.keys())
    db = get_db()
    cur = db.execute(f"INSERT INTO shops ({cols}) VALUES ({', '.join('?' * len(data))})", tuple(data.values()))
    db.commit()
    return jsonify({"shop": shop_json(row(db.execute("SELECT * FROM shops WHERE id = ?", (cur.lastrowid,)).fetchone()))}), 201


@bp.put("/<int:shop_id>")
@officer_required
def edit(shop_id):
    try:
        data = _validate(request.get_json(silent=True) or {}, partial=True)
    except ValueError as e:
        return error(str(e))
    db = get_db()
    if not db.execute("SELECT 1 FROM shops WHERE id = ?", (shop_id,)).fetchone():
        return error("Shop not found.", 404)
    if data:
        db.execute(f"UPDATE shops SET {', '.join(k + ' = ?' for k in data)} WHERE id = ?", (*data.values(), shop_id))
        db.commit()
    return jsonify({"shop": shop_json(row(db.execute("SELECT * FROM shops WHERE id = ?", (shop_id,)).fetchone()))})


@bp.delete("/<int:shop_id>")
@officer_required
def remove(shop_id):
    db = get_db()
    cur = db.execute("DELETE FROM shops WHERE id = ?", (shop_id,))
    db.commit()
    return jsonify({"ok": True}) if cur.rowcount else error("Shop not found.", 404)
