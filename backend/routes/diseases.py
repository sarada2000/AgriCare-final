"""Disease library API. Everyone can read the diseases; only officers can change them."""
import sqlite3

from flask import Blueprint, g, jsonify, request

from auth import error, officer_required
from db import get_db, row, rows

bp = Blueprint("diseases", __name__, url_prefix="/api/diseases")

TEXT_FIELDS = ["name_en", "name_si", "name_ta",
               "symptoms_en", "symptoms_si", "symptoms_ta",
               "treatment_en", "treatment_si", "treatment_ta",
               "chemical"]
DOSE_FIELDS = ["dose_per_10l", "max_dose_per_10l"]


@bp.get("")
def list_diseases():
    diseases = rows(get_db().execute("SELECT * FROM diseases ORDER BY name_en"))
    return jsonify({"diseases": diseases})


@bp.get("/<disease_id>")
def get_disease(disease_id):
    disease = row(get_db().execute("SELECT * FROM diseases WHERE id = ?", (disease_id,)).fetchone())
    if not disease:
        return error("Disease not found.", 404)
    return jsonify({"disease": disease})


@bp.put("/<disease_id>")
@officer_required
def update_disease(disease_id):
    db = get_db()
    old = row(db.execute("SELECT * FROM diseases WHERE id = ?", (disease_id,)).fetchone())
    if not old:
        return error("Disease not found.", 404)

    data = request.get_json(silent=True) or {}
    changes = {}
    for field in TEXT_FIELDS:
        if field in data:
            value = (data[field] or "").strip()
            if field.startswith("name_") and not value:
                return error("The disease name cannot be empty.", field=field)
            changes[field] = value[:4000] or None
    for field in DOSE_FIELDS:
        if field in data:
            if data[field] in (None, ""):
                changes[field] = None
                continue
            try:
                number = float(data[field])
            except (TypeError, ValueError):
                return error("The dose must be a number.", field=field)
            if number < 0 or number > 1000:
                return error("The dose must be between 0 and 1000 ml per 10 L.", field=field)
            changes[field] = number

    dose = changes.get("dose_per_10l", old["dose_per_10l"])
    max_dose = changes.get("max_dose_per_10l", old["max_dose_per_10l"])
    if dose is not None and max_dose is not None and dose > max_dose:
        return error("The dose cannot be higher than the maximum dose.", field="dose_per_10l")
    if not changes:
        return error("Nothing to change.")

    changes["updated_by"] = g.user["id"]
    sets = ", ".join(f"{field} = ?" for field in changes)
    try:
        db.execute(f"UPDATE diseases SET {sets}, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?",
                   (*changes.values(), disease_id))
        db.commit()
    except sqlite3.IntegrityError:
        return error("The dose cannot be higher than the maximum dose.", field="dose_per_10l")

    disease = row(db.execute("SELECT * FROM diseases WHERE id = ?", (disease_id,)).fetchone())
    return jsonify({"disease": disease})