"""Server-side treatment reminders.

A background thread checks every minute for treatment steps whose time has come and sends the farmer
an SMS in their language. Unlike the website alarm, this works even when the farmer's phone is locked
or the website is closed.

SMS_PROVIDER=log   (default) only writes the message to the log and the reminders table - good for demos.
SMS_PROVIDER=http  posts to any SMS gateway's HTTP API (e.g. Dialog, Mobitel, Notify.lk, Text.lk, Twilio):
                   set SMS_API_URL, SMS_API_KEY and SMS_SENDER_ID in backend/.env and, if your gateway
                   needs a different request format, edit send_http() below.
"""
import logging
import threading
import time
from datetime import datetime, timedelta, timezone

import requests

from db import connect
from plans_data import disease_name, step_text

log = logging.getLogger("agricare.reminders")

TITLE = {"en": "AgriCare reminder", "si": "AgriCare මතක් කිරීම", "ta": "AgriCare நினைவூட்டல்"}
DAY = {"en": "Day", "si": "දිනය", "ta": "நாள்"}


def build_message(lang, disease, field, day, idx):
    lang = lang if lang in TITLE else "en"
    where = f" ({field})" if field else ""
    return f"{TITLE[lang]}: {disease_name(disease, lang)}{where}, {DAY[lang]} {day + 1}. {step_text(disease, idx, lang)}"


def send_http(cfg, phone, message):
    """Generic JSON SMS request. Adjust the field names to match your SMS gateway's documentation."""
    intl = "94" + phone[1:] if phone.startswith("0") else phone
    r = requests.post(
        cfg["SMS_API_URL"],
        json={"to": intl, "message": message, "sender_id": cfg["SMS_SENDER_ID"]},
        headers={"Authorization": f"Bearer {cfg['SMS_API_KEY']}"},
        timeout=15,
    )
    if r.status_code >= 300:
        raise RuntimeError(f"SMS gateway answered {r.status_code}: {r.text[:200]}")


def send(cfg, phone, message):
    """Returns (channel, status, error)."""
    if cfg["SMS_PROVIDER"] == "http" and cfg["SMS_API_URL"]:
        try:
            send_http(cfg, phone, message)
            return "sms", "sent", None
        except Exception as e:
            log.warning("SMS to %s failed: %s", phone, e)
            return "sms", "failed", str(e)[:300]
    log.info("[SMS to %s] %s", phone, message)
    return "log", "logged", None


def run_once(cfg, now=None):
    """Send reminders for every step that is due and not yet reminded. Returns how many were handled."""
    now = now or datetime.now(timezone.utc)
    now_s = now.strftime("%Y-%m-%dT%H:%M:%SZ")
    oldest = (now - timedelta(days=2)).strftime("%Y-%m-%dT%H:%M:%SZ")   # don't flood with very old steps
    db = connect(cfg["DATABASE"])
    try:
        due = db.execute(
            """SELECT t.id, t.idx, t.day, p.disease, p.field_name, u.id AS user_id, u.phone, u.language, u.sms_reminders
               FROM tasks t JOIN plans p ON p.id = t.plan_id JOIN users u ON u.id = p.user_id
               WHERE t.done = 0 AND t.reminded_at IS NULL AND p.status = 'active'
                 AND t.due_at <= ? AND t.due_at >= ?
                 AND (t.snooze_until IS NULL OR t.snooze_until <= ?)
               ORDER BY t.due_at LIMIT 200""", (now_s, oldest, now_s)).fetchall()
        for t in due:
            if t["sms_reminders"]:
                msg = build_message(t["language"], t["disease"], t["field_name"], t["day"], t["idx"])
                channel, status, err = send(cfg, t["phone"], msg)
                db.execute("INSERT INTO reminders (task_id, user_id, channel, phone, message, status, error) VALUES (?,?,?,?,?,?,?)",
                           (t["id"], t["user_id"], channel, t["phone"], msg, status, err))
                if status == "failed":
                    continue        # try again next round
            db.execute("UPDATE tasks SET reminded_at = ? WHERE id = ?", (now_s, t["id"]))
        db.commit()
        return len(due)
    finally:
        db.close()


def start(app):
    cfg = app.config
    if not cfg["REMINDERS_ENABLED"]:
        return

    def loop():
        while True:
            try:
                n = run_once(cfg)
                if n:
                    log.info("Handled %d treatment reminder(s)", n)
            except Exception:
                log.exception("reminder check failed")
            time.sleep(cfg["REMINDER_CHECK_SECONDS"])

    threading.Thread(target=loop, name="agricare-reminders", daemon=True).start()
    log.info("Treatment reminders on (SMS provider: %s)", cfg["SMS_PROVIDER"])
