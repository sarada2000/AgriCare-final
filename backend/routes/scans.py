"""Leaf scans: upload a photo, get a prediction, keep a history."""
import json
import os
import uuid

from flask import Blueprint, current_app, g, jsonify, request, send_from_directory

from auth import error, login_required
from db import get_db, row, rows
from model_service import LEAF_MIN_SHARE, NOT_PADDY, make_thumbnail, plant_share

bp = Blueprint("scans", __name__, url_prefix="/api")

ALLOWED = {"JPEG", "PNG", "WEBP", "BMP", "MPO"}


def scan_json(s):
    return {
        "id": s["id"], "label": s["label"], "confidence": s["confidence"], "demo": bool(s["is_demo"]),
        "uncertain": bool(s["uncertain"]), "top": json.loads(s["top_json"] or "[]"),
        "image": f"/uploads/{s['image_file']}" if s["image_file"] else None,
        "thumb": f"/uploads/{s['thumb_file']}" if s["thumb_file"] else None,
        "latitude": s["latitude"], "longitude": s["longitude"], "district": s["district"],
        "at": s["created_at"],
    }


@bp.post("/predict")
@login_required
def predict():
    f = request.files.get("file")
    if not f:
        return error("Choose a leaf photo to upload.")
    data = f.read()
    if not data:
        return error("The photo is empty. Choose another one.")

    predictor = current_app.extensions["predictor"]
    if predictor.demo and not current_app.config.get("ALLOW_DEMO", True):
        return error("The trained model is not loaded on the server, so no diagnosis can be given.", 503,
                     field="no_model")
    try:
        img = predictor.open_image(data)
        fmt = (img.format or "").upper()
    except Exception:
        return error("This file is not a photo. Choose a JPG or PNG image.")
    if fmt and fmt not in ALLOWED:
        return error("This photo type is not supported. Use JPG or PNG.")
    if plant_share(img) < LEAF_MIN_SHARE:
        return error("This does not look like a paddy leaf. Take a close-up photo of the affected paddy leaf "
                     "in daylight and scan again.", 422, field="not_leaf")

    try:
        result = predictor.predict(data)
    except Exception as e:
        current_app.logger.exception("prediction failed")
        return error(f"Could not analyse the photo: {e}", 500)
    if str(result["label"]).lower() in NOT_PADDY:
        return error("This does not look like a paddy leaf. Take a close-up photo of the affected paddy leaf "
                     "in daylight and scan again.", 422, field="not_leaf")

    # keep the photo and a small thumbnail (random names, so they cannot be guessed)
    up = current_app.config["UPLOAD_DIR"]
    os.makedirs(up, exist_ok=True)
    name = uuid.uuid4().hex
    image_file, thumb_file = name + ".jpg", name + "_t.jpg"
    big = img.copy()
    big.thumbnail((1280, 1280))
    big.save(os.path.join(up, image_file), "JPEG", quality=85)
    with open(os.path.join(up, thumb_file), "wb") as out:
        out.write(make_thumbnail(img))

    def num(key):
        try:
            v = request.form.get(key)
            return float(v) if v not in (None, "") else None
        except ValueError:
            return None

    db = get_db()
    cur = db.execute(
        """INSERT INTO scans (user_id, label, confidence, is_demo, uncertain, top_json, image_file, thumb_file,
                              latitude, longitude, district) VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
        (g.user["id"], result["label"], result["confidence"], int(result["demo"]), int(result["uncertain"]),
         json.dumps(result["top"]), image_file, thumb_file, num("lat"), num("lng"),
         request.form.get("district") or g.user["district"]),
    )
    db.commit()
    s = row(db.execute("SELECT * FROM scans WHERE id = ?", (cur.lastrowid,)).fetchone())
    return jsonify({"scan": scan_json(s), **{k: result[k] for k in ("label", "confidence", "top", "demo", "uncertain")}}), 201


@bp.get("/scans")
@login_required
def my_scans():
    limit = min(int(request.args.get("limit", 40)), 200)
    rs = get_db().execute("SELECT * FROM scans WHERE user_id = ? ORDER BY created_at DESC, id DESC LIMIT ?",
                          (g.user["id"], limit)).fetchall()
    return jsonify({"scans": [scan_json(s) for s in rs]})


@bp.delete("/scans/<int:scan_id>")
@login_required
def delete_scan(scan_id):
    db = get_db()
    s = row(db.execute("SELECT * FROM scans WHERE id = ? AND user_id = ?", (scan_id, g.user["id"])).fetchone())
    if not s:
        return error("Scan not found.", 404)
    for fn in (s["image_file"], s["thumb_file"]):
        if fn:
            try:
                os.remove(os.path.join(current_app.config["UPLOAD_DIR"], fn))
            except OSError:
                pass
    db.execute("DELETE FROM scans WHERE id = ?", (scan_id,))
    db.commit()
    return jsonify({"ok": True})


@bp.get("/model")
def model_info():
    return jsonify(current_app.extensions["predictor"].info())


def register_uploads(app):
    @app.get("/uploads/<path:name>")
    def uploads(name):
        return send_from_directory(app.config["UPLOAD_DIR"], name, max_age=86400)
