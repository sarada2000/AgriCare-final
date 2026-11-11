"""Treatment plans and their steps (tasks). The website keeps a copy for offline use and syncs here."""
import re

from flask import Blueprint, current_app, g, jsonify, request

from auth import error, login_required
from db import get_db, row, rows
from plans_data import PLANS, due_at_utc, steps_for, utc_now

bp = Blueprint("plans", __name__, url_prefix="/api/plans")

ISO = re.compile(r"^\d{4}-\d{2}-\d{2}T[\d:.]+Z?$")


def _iso_or_none(v):
    return v if isinstance(v, str) and ISO.match(v) else None


def plan_json(p, tasks):
    """Same shape the website uses (pages/treatment.js -> AgriPlans).
    Each task also carries its step text in 3 languages, for the mobile app."""
    steps = steps_for(p["disease"])
    return {
        "id": "s" + str(p["id"]), "serverId": p["id"], "clientId": p["client_id"], "disease": p["disease"],
        "field": p["field_name"] or "", "startDate": p["start_date"], "alarmTime": p["alarm_time"],
        "confidence": p["confidence"], "scanId": p["scan_id"], "status": p["status"], "createdAt": p["created_at"],
        "tasks": [{
            "id": "t" + str(t["idx"]), "day": t["day"], "check": bool(t["is_check"]), "dueAt": t["due_at"],
            "done": bool(t["done"]), "doneAt": t["done_at"], "condition": t["condition"],
            "snoozeUntil": t["snooze_until"], "alarmedAt": t["alarmed_at"], "remindedAt": t["reminded_at"],
            "text": steps[t["idx"]]["text"] if t["idx"] < len(steps) else {},
        } for t in tasks],
    }


def load_plan(plan_id, user_id):
    db = get_db()
    p = row(db.execute("SELECT * FROM plans WHERE id = ? AND user_id = ?", (plan_id, user_id)).fetchone())
    if not p:
        return None
    ts = rows(db.execute("SELECT * FROM tasks WHERE plan_id = ? ORDER BY idx", (plan_id,)).fetchall())
    return plan_json(p, ts)


def _parse_id(pid):
    s = str(pid)
    return int(s[1:]) if s.startswith("s") and s[1:].isdigit() else (int(s) if s.isdigit() else None)


def _create(db, user_id, data):
    disease = data.get("disease")
    if disease not in PLANS:
        raise ValueError("Unknown disease.")
    start = data.get("startDate") or ""
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", start):
        raise ValueError("Start date must look like 2026-10-02.")
    alarm = data.get("alarmTime") or "07:00"
    if not re.fullmatch(r"([01]\d|2[0-3]):[0-5]\d", alarm):
        raise ValueError("Alarm time must look like 07:00.")
    client_id = (str(data.get("clientId") or data.get("id") or "") or None)
    if client_id and client_id.startswith("s"):
        client_id = None
    if client_id:
        existing = db.execute("SELECT id FROM plans WHERE user_id = ? AND client_id = ?", (user_id, client_id)).fetchone()
        if existing:
            return existing["id"]           # already synced: don't duplicate

    scan_id = data.get("scanId")
    if scan_id and not db.execute("SELECT 1 FROM scans WHERE id = ? AND user_id = ?", (scan_id, user_id)).fetchone():
        scan_id = None
    cur = db.execute(
        "INSERT INTO plans (user_id, scan_id, client_id, disease, field_name, start_date, alarm_time, confidence) VALUES (?,?,?,?,?,?,?,?)",
        (user_id, scan_id, client_id, disease, (data.get("field") or "")[:60], start, alarm, data.get("confidence")),
    )
    plan_id = cur.lastrowid
    tz = current_app.config["TIMEZONE"]
    given = {t.get("id"): t for t in (data.get("tasks") or []) if isinstance(t, dict)}
    for idx, step in enumerate(steps_for(disease)):
        t = given.get("t" + str(idx), {})
        db.execute(
            """INSERT INTO tasks (plan_id, idx, day, is_check, due_at, done, done_at, condition, snooze_until, alarmed_at)
               VALUES (?,?,?,?,?,?,?,?,?,?)""",
            (plan_id, idx, step["day"], int(step["check"]), due_at_utc(start, alarm, step["day"], tz),
             int(bool(t.get("done"))), _iso_or_none(t.get("doneAt")),
             t.get("condition") if t.get("condition") in ("better", "same", "worse") else None,
             _iso_or_none(t.get("snoozeUntil")), _iso_or_none(t.get("alarmedAt"))),
        )
    _refresh_status(db, plan_id)
    return plan_id


def _refresh_status(db, plan_id):
    left = db.execute("SELECT COUNT(*) FROM tasks WHERE plan_id = ? AND done = 0", (plan_id,)).fetchone()[0]
    db.execute("UPDATE plans SET status = ? WHERE id = ?", ("completed" if left == 0 else "active", plan_id))


def all_plans(user_id):
    db = get_db()
    ps = rows(db.execute("SELECT * FROM plans WHERE user_id = ? ORDER BY created_at DESC, id DESC", (user_id,)).fetchall())
    out = []
    for p in ps:
        ts = rows(db.execute("SELECT * FROM tasks WHERE plan_id = ? ORDER BY idx", (p["id"],)).fetchall())
        out.append(plan_json(p, ts))
    return out


@bp.get("/diseases")
def plan_diseases():
    """Which diseases have a treatment plan (the mobile app shows "Start plan" only for these)."""
    return jsonify({"diseases": list(PLANS.keys())})


@bp.get("")
@login_required
def list_plans():
    return jsonify({"plans": all_plans(g.user["id"])})


@bp.post("")
@login_required
def create_plan():
    db = get_db()
    try:
        plan_id = _create(db, g.user["id"], request.get_json(silent=True) or {})
    except ValueError as e:
        return error(str(e))
    db.commit()
    return jsonify({"plan": load_plan(plan_id, g.user["id"])}), 201


@bp.post("/sync")
@login_required
def sync():
    """Upload plans made while offline (idempotent), then return every plan on the server."""
    db = get_db()
    created = 0
    for p in (request.get_json(silent=True) or {}).get("plans", [])[:50]:
        if not isinstance(p, dict) or str(p.get("id", "")).startswith("s"):
            continue
        try:
            _create(db, g.user["id"], p)
            created += 1
        except ValueError:
            continue
    db.commit()
    return jsonify({"plans": all_plans(g.user["id"]), "created": created})


@bp.get("/<pid>")
@login_required
def get_plan(pid):
    p = load_plan(_parse_id(pid), g.user["id"])
    return jsonify({"plan": p}) if p else error("Plan not found.", 404)


@bp.put("/<pid>/tasks")
@login_required
def update_tasks(pid):
    """Save the state of several steps at once: [{id:'t0', done, doneAt, condition, snoozeUntil, alarmedAt}]"""
    plan_id = _parse_id(pid)
    db = get_db()
    if not plan_id or not db.execute("SELECT 1 FROM plans WHERE id = ? AND user_id = ?", (plan_id, g.user["id"])).fetchone():
        return error("Plan not found.", 404)
    for t in (request.get_json(silent=True) or {}).get("tasks", []):
        tid = str(t.get("id", ""))
        if not re.fullmatch(r"t\d+", tid):
            continue
        cond = t.get("condition") if t.get("condition") in ("better", "same", "worse") else None
        done = 1 if t.get("done") else 0
        db.execute(
            """UPDATE tasks SET done = ?, done_at = ?, condition = ?, snooze_until = ?, alarmed_at = ?
               WHERE plan_id = ? AND idx = ?""",
            (done, (_iso_or_none(t.get("doneAt")) or utc_now()) if done else None, cond,
             _iso_or_none(t.get("snoozeUntil")), _iso_or_none(t.get("alarmedAt")), plan_id, int(tid[1:])),
        )
    _refresh_status(db, plan_id)
    db.commit()
    return jsonify({"plan": load_plan(plan_id, g.user["id"])})


@bp.delete("/<pid>")
@login_required
def delete_plan(pid):
    plan_id = _parse_id(pid)
    db = get_db()
    cur = db.execute("DELETE FROM plans WHERE id = ? AND user_id = ?", (plan_id, g.user["id"]))
    db.commit()
    return jsonify({"ok": True}) if cur.rowcount else error("Plan not found.", 404)
