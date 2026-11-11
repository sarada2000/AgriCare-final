"""Weather forecast for a field (Open-Meteo, free, no key). Cached 30 minutes per ~10 km area,
so many farmers in one area share one request."""
import time

import requests
from flask import Blueprint, jsonify, request

from auth import error

bp = Blueprint("weather", __name__, url_prefix="/api")
_cache = {}
TTL = 30 * 60
URL = ("https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}"
       "&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m"
       "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,"
       "precipitation_probability_max,wind_speed_10m_max,relative_humidity_2m_mean"
       "&timezone=Asia%2FColombo&forecast_days=7")


@bp.get("/weather")
def weather():
    try:
        lat, lng = float(request.args["lat"]), float(request.args["lng"])
    except (KeyError, ValueError):
        return error("Give lat and lng.")
    if not (5.5 <= lat <= 10.1 and 79.3 <= lng <= 82.2):
        return error("That location is not in Sri Lanka.")
    key = (round(lat, 1), round(lng, 1))
    hit = _cache.get(key)
    if hit and time.time() - hit[0] < TTL:
        return jsonify(hit[1])
    try:
        r = requests.get(URL.format(lat=key[0], lng=key[1]), timeout=12)
        r.raise_for_status()
        data = r.json()
    except Exception:
        if hit:                      # serve the last forecast if the weather service is down
            return jsonify(hit[1])
        return error("The weather service is not reachable right now. Try again later.", 503)
    _cache[key] = (time.time(), data)
    return jsonify(data)
