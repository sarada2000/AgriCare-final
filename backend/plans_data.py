"""Treatment plan steps, shared with the website (data/plans.json is exported from pages/treatment.js)."""
import json
import os
from datetime import date, datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo

_PATH = os.path.join(os.path.dirname(__file__), "data", "plans.json")
with open(_PATH, encoding="utf-8") as f:
    PLANS = json.load(f)


def disease_ids():
    return list(PLANS.keys())


def steps_for(disease):
    return PLANS.get(disease, PLANS["healthy"])["steps"]


def disease_name(disease, lang="en"):
    names = PLANS.get(disease, {}).get("name", {})
    return names.get(lang) or names.get("en") or disease


def step_text(disease, idx, lang="en"):
    steps = steps_for(disease)
    if 0 <= idx < len(steps):
        t = steps[idx]["text"]
        return t.get(lang) or t.get("en")
    return ""


def due_at_utc(start_date, alarm_time, day, tz_name):
    """Start date + day at the alarm time in Sri Lanka, returned as UTC ISO text."""
    y, m, d = (int(x) for x in start_date.split("-"))
    hh, mm = (int(x) for x in alarm_time.split(":"))
    local = datetime.combine(date(y, m, d) + timedelta(days=day), time(hh, mm), ZoneInfo(tz_name))
    return local.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def utc_now():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
