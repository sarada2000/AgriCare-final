"""Add DEMO farmers, scans and treatment plans so the officer dashboard has something to show.
Every demo farmer is named "Demo Farmer ..." and marked is_demo, so they are easy to tell apart and remove.

    python seed_demo.py           add demo data
    python seed_demo.py --remove  delete all demo data
"""
import json
import random
import sys
from datetime import datetime, timedelta, timezone

from werkzeug.security import generate_password_hash

from app import create_app
from db import connect
from plans_data import due_at_utc, steps_for

DISTRICTS = ["Polonnaruwa", "Anuradhapura", "Ampara", "Kurunegala", "Hambantota", "Batticaloa", "Trincomalee"]
LABELS = ["blast"] * 5 + ["brown_spot"] * 4 + ["bacterial_leaf_blight"] * 3 + ["sheath_blight"] * 2 + ["tungro", "healthy", "healthy", "healthy"]


def main():
    app = create_app(start_background=False)
    cfg = app.config
    db = connect(cfg["DATABASE"])
    if "--remove" in sys.argv:
        n = db.execute("DELETE FROM users WHERE is_demo = 1").rowcount
        db.commit()
        print(f"Removed {n} demo farmers and their data.")
        return

    rnd = random.Random(7)
    now = datetime.now(timezone.utc)
    for i in range(1, 13):
        phone = f"07799900{i:02d}"
        if db.execute("SELECT 1 FROM users WHERE phone = ?", (phone,)).fetchone():
            continue
        district = DISTRICTS[i % len(DISTRICTS)]
        uid = db.execute(
            "INSERT INTO users (name, phone, password_hash, district, language, is_demo, created_at) VALUES (?,?,?,?,?,1,?)",
            (f"Demo Farmer {i}", phone, generate_password_hash("demo1234"), district, rnd.choice(["si", "si", "ta", "en"]),
             (now - timedelta(days=rnd.randint(5, 40))).strftime("%Y-%m-%dT%H:%M:%SZ"))).lastrowid
        for _ in range(rnd.randint(1, 4)):
            label = rnd.choice(LABELS)
            when = now - timedelta(days=rnd.randint(0, 25), hours=rnd.randint(0, 20))
            conf = round(rnd.uniform(0.72, 0.98), 2)
            sid = db.execute(
                "INSERT INTO scans (user_id, label, confidence, is_demo, top_json, district, created_at) VALUES (?,?,?,1,?,?,?)",
                (uid, label, conf, json.dumps([{"label": label, "confidence": conf}]), district,
                 when.strftime("%Y-%m-%dT%H:%M:%SZ"))).lastrowid
            if label == "healthy" or rnd.random() < 0.3:
                continue
            start = (when + timedelta(hours=5, minutes=30)).strftime("%Y-%m-%d")
            pid = db.execute(
                "INSERT INTO plans (user_id, scan_id, disease, field_name, start_date, alarm_time, confidence, created_at) VALUES (?,?,?,?,?,?,?,?)",
                (uid, sid, label, f"Field {rnd.randint(1, 3)}", start, "07:00", conf, when.strftime("%Y-%m-%dT%H:%M:%SZ"))).lastrowid
            for idx, st in enumerate(steps_for(label)):
                due = due_at_utc(start, "07:00", st["day"], cfg["TIMEZONE"])
                past = due < now.strftime("%Y-%m-%dT%H:%M:%SZ")
                done = past and rnd.random() < 0.75
                cond = rnd.choice(["better", "better", "same", "worse"]) if (done and st["check"]) else None
                db.execute(
                    "INSERT INTO tasks (plan_id, idx, day, is_check, due_at, done, done_at, condition, reminded_at) VALUES (?,?,?,?,?,?,?,?,?)",
                    (pid, idx, st["day"], int(st["check"]), due, int(done), due if done else None, cond, due if past else None))
            left = db.execute("SELECT COUNT(*) FROM tasks WHERE plan_id = ? AND done = 0", (pid,)).fetchone()[0]
            db.execute("UPDATE plans SET status = ? WHERE id = ?", ("completed" if left == 0 else "active", pid))
    db.commit()
    print("Demo data added. Demo farmers log in with 0779990001 ... 0779990012, password demo1234.")


if __name__ == "__main__":
    main()
