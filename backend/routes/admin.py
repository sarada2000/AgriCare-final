"""Officer dashboard: overview of farmers, scans, diseases by district and overdue treatment steps."""
from flask import Blueprint, current_app, jsonify, request

from auth import officer_required
from db import get_db, rows
from plans_data import disease_name, step_text, utc_now
from routes.scans import scan_json

bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@bp.get("/stats")
@officer_required
def stats():
    db = get_db()
    days = max(1, min(int(request.args.get("days", 30)), 365))
    since = f"-{days} days"
    one = lambda q, *a: db.execute(q, a).fetchone()[0]
    now = utc_now()

    summary = {
        "farmers": one("SELECT COUNT(*) FROM users WHERE role = 'farmer'"),
        "newFarmers": one("SELECT COUNT(*) FROM users WHERE role = 'farmer' AND created_at >= strftime('%Y-%m-%dT%H:%M:%SZ','now', ?)", since),
        "scans": one("SELECT COUNT(*) FROM scans WHERE created_at >= strftime('%Y-%m-%dT%H:%M:%SZ','now', ?)", since),
        "diseasedScans": one("SELECT COUNT(*) FROM scans WHERE label <> 'healthy' AND created_at >= strftime('%Y-%m-%dT%H:%M:%SZ','now', ?)", since),
        "activePlans": one("SELECT COUNT(*) FROM plans WHERE status = 'active'"),
        "overdueSteps": one("SELECT COUNT(*) FROM tasks t JOIN plans p ON p.id = t.plan_id WHERE p.status = 'active' AND t.done = 0 AND t.due_at < ?", now),
        "worseReports": one("SELECT COUNT(*) FROM tasks WHERE condition = 'worse'"),
        "demoScans": one("SELECT COUNT(*) FROM scans WHERE is_demo = 1 AND created_at >= strftime('%Y-%m-%dT%H:%M:%SZ','now', ?)", since),
        "days": days,
    }
    by_disease = rows(db.execute(
        """SELECT label, COUNT(*) AS n FROM scans WHERE created_at >= strftime('%Y-%m-%dT%H:%M:%SZ','now', ?)
           GROUP BY label ORDER BY n DESC""", (since,)).fetchall())
    by_district = rows(db.execute(
        """SELECT COALESCE(s.district, u.district, 'Unknown') AS district, s.label, COUNT(*) AS n
           FROM scans s JOIN users u ON u.id = s.user_id
           WHERE s.created_at >= strftime('%Y-%m-%dT%H:%M:%SZ','now', ?) AND s.label <> 'healthy'
           GROUP BY 1, 2 ORDER BY 1""", (since,)).fetchall())
    per_day = rows(db.execute(
        """SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS n, SUM(label <> 'healthy') AS diseased
           FROM scans WHERE created_at >= strftime('%Y-%m-%dT%H:%M:%SZ','now', ?) GROUP BY 1 ORDER BY 1""", (since,)).fetchall())

    districts = {}
    for r in by_district:
        d = districts.setdefault(r["district"], {"district": r["district"], "total": 0, "diseases": {}})
        d["total"] += r["n"]
        d["diseases"][r["label"]] = r["n"]
    return jsonify({
        "summary": summary,
        "byDisease": [{"label": r["label"], "name": disease_name(r["label"]), "count": r["n"]} for r in by_disease],
        "byDistrict": sorted(districts.values(), key=lambda d: -d["total"]),
        "perDay": per_day,
        "model": current_app.extensions["predictor"].info(),
    })


@bp.get("/farmers")
@officer_required
def farmers():
    db = get_db()
    q = (request.args.get("q") or "").strip()
    sql = """SELECT u.id, u.name, u.phone, u.district, u.language, u.created_at, u.last_login_at, u.is_demo,
                    (SELECT COUNT(*) FROM scans s WHERE s.user_id = u.id) AS scans,
                    (SELECT COUNT(*) FROM plans p WHERE p.user_id = u.id AND p.status = 'active') AS active_plans,
                    (SELECT COUNT(*) FROM tasks t JOIN plans p ON p.id = t.plan_id
                       WHERE p.user_id = u.id AND p.status = 'active' AND t.done = 0 AND t.due_at < ?) AS overdue,
                    (SELECT label FROM scans s WHERE s.user_id = u.id ORDER BY created_at DESC LIMIT 1) AS last_label
             FROM users u WHERE u.role = 'farmer'"""
    args = [utc_now()]
    if q:
        sql += " AND (u.name LIKE ? OR u.phone LIKE ? OR u.district LIKE ?)"
        args += [f"%{q}%"] * 3
    sql += " ORDER BY u.created_at DESC LIMIT 200"
    return jsonify({"farmers": rows(db.execute(sql, args).fetchall())})


@bp.get("/farmers/<int:user_id>")
@officer_required
def farmer_detail(user_id):
    from routes.plans import all_plans
    db = get_db()
    u = db.execute("SELECT id, name, phone, district, language, created_at, last_login_at FROM users WHERE id = ? AND role = 'farmer'",
                   (user_id,)).fetchone()
    if not u:
        return jsonify({"error": "Farmer not found."}), 404
    scans = db.execute("SELECT * FROM scans WHERE user_id = ? ORDER BY created_at DESC LIMIT 50", (user_id,)).fetchall()
    return jsonify({"farmer": dict(u), "scans": [scan_json(s) for s in scans], "plans": all_plans(user_id)})


@bp.get("/scans")
@officer_required
def recent_scans():
    db = get_db()
    limit = min(int(request.args.get("limit", 50)), 200)
    rs = db.execute("""SELECT s.*, u.name AS farmer, u.phone AS farmer_phone FROM scans s JOIN users u ON u.id = s.user_id
                       ORDER BY s.created_at DESC LIMIT ?""", (limit,)).fetchall()
    out = []
    for s in rs:
        j = scan_json(s)
        j.update({"farmer": s["farmer"], "farmerPhone": s["farmer_phone"], "name": disease_name(s["label"])})
        out.append(j)
    return jsonify({"scans": out})


@bp.get("/overdue")
@officer_required
def overdue():
    """Treatment steps that are late, and crops reported as getting worse: farmers who may need a visit."""
    db = get_db()
    late = rows(db.execute(
        """SELECT t.id, t.idx, t.day, t.due_at, p.id AS plan_id, p.disease, p.field_name, u.id AS user_id, u.name, u.phone, u.district
           FROM tasks t JOIN plans p ON p.id = t.plan_id JOIN users u ON u.id = p.user_id
           WHERE p.status = 'active' AND t.done = 0 AND t.due_at < ? ORDER BY t.due_at LIMIT 200""", (utc_now(),)).fetchall())
    worse = rows(db.execute(
        """SELECT t.id, t.idx, t.day, t.done_at, p.id AS plan_id, p.disease, p.field_name, u.id AS user_id, u.name, u.phone, u.district
           FROM tasks t JOIN plans p ON p.id = t.plan_id JOIN users u ON u.id = p.user_id
           WHERE t.condition = 'worse' ORDER BY t.done_at DESC LIMIT 100""").fetchall())
    for r in late + worse:
        r["diseaseName"] = disease_name(r["disease"])
        r["step"] = step_text(r["disease"], r["idx"])
    return jsonify({"overdue": late, "worse": worse})


@bp.get("/reminders")
@officer_required
def reminders():
    rs = rows(get_db().execute(
        """SELECT r.*, u.name FROM reminders r LEFT JOIN users u ON u.id = r.user_id
           ORDER BY r.created_at DESC LIMIT 100""").fetchall())
    return jsonify({"reminders": rs})
