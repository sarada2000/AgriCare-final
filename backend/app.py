"""AgriCare backend (Flask).

Run:   python app.py        then open  http://localhost:5000
The same server gives the website and the API (/api/...), so no extra setup is needed.
"""
import logging
import os
import secrets
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify, request, send_from_directory  # noqa: E402
from werkzeug.exceptions import HTTPException  # noqa: E402
from werkzeug.security import generate_password_hash  # noqa: E402

import reminders  # noqa: E402
from auth import bp as auth_bp  # noqa: E402
from config import BASE_DIR, SITE_DIR, Config  # noqa: E402
from db import close_db, connect, init_db  # noqa: E402
from model_service import Predictor  # noqa: E402
from routes.admin import bp as admin_bp  # noqa: E402
from routes.chat import bp as chat_bp  # noqa: E402
from routes.contact import bp as contact_bp  # noqa: E402
from routes.diseases import bp as diseases_bp  # noqa: E402
from routes.plans import bp as plans_bp  # noqa: E402
from routes.scans import bp as scans_bp, register_uploads  # noqa: E402
from routes.shops import bp as shops_bp  # noqa: E402
from routes.weather import bp as weather_bp  # noqa: E402

log = logging.getLogger("agricare")


def ensure_officer(cfg):
    """Create the first agriculture officer account if there is none."""
    db = connect(cfg["DATABASE"])
    try:
        if db.execute("SELECT 1 FROM users WHERE role = 'officer'").fetchone():
            return
        password = cfg["ADMIN_PASSWORD"] or secrets.token_urlsafe(8)
        db.execute("INSERT INTO users (name, phone, password_hash, role) VALUES (?,?,?, 'officer')",
                   ("Agriculture Officer", cfg["ADMIN_PHONE"], generate_password_hash(password)))
        db.commit()
        msg = (f"\n  Officer account created\n  Mobile: {cfg['ADMIN_PHONE']}\n  Password: {password}\n"
               "  (change it after logging in, or set ADMIN_PASSWORD in backend/.env before first start)\n")
        print(msg)
        with open(os.path.join(os.path.dirname(cfg["DATABASE"]), "officer-login.txt"), "w") as f:
            f.write(msg)
    finally:
        db.close()


def create_app(overrides=None, start_background=True):
    app = Flask(__name__, static_folder=None)
    app.config.from_object(Config)
    if overrides:
        app.config.update(overrides)
    app.json.ensure_ascii = False          # keep Sinhala and Tamil readable in API responses

    os.makedirs(app.config["UPLOAD_DIR"], exist_ok=True)
    init_db(app.config["DATABASE"])
    ensure_officer(app.config)
    app.extensions["predictor"] = Predictor(app.config, BASE_DIR)
    app.teardown_appcontext(close_db)

    for bp in (auth_bp, scans_bp, plans_bp, shops_bp, admin_bp, weather_bp, chat_bp, contact_bp, diseases_bp):
        app.register_blueprint(bp)
    register_uploads(app)

    # ---- CORS: only for websites listed in CORS_ORIGINS (the built-in site doesn't need it) ----
    @app.after_request
    def cors(resp):
        origin = request.headers.get("Origin")
        allowed = app.config["CORS_ORIGINS"]
        if origin and ("*" in allowed or origin in allowed):
            resp.headers["Access-Control-Allow-Origin"] = origin
            resp.headers["Vary"] = "Origin"
            resp.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
            resp.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        return resp

    @app.route("/api/<path:_any>", methods=["OPTIONS"])
    def preflight(_any):
        return ("", 204)

    @app.get("/api/health")
    def health():
        return jsonify({"ok": True, "model": app.extensions["predictor"].info()["mode"],
                        "chat_ai": bool(app.config.get("ANTHROPIC_API_KEY"))})

    # ---- errors as JSON for the API ----
    @app.errorhandler(HTTPException)
    def http_error(e):
        if request.path.startswith("/api/"):
            msg = "The photo is too large. Use a photo under %d MB." % (app.config["MAX_CONTENT_LENGTH"] // 1048576) \
                if e.code == 413 else e.description
            return jsonify({"error": msg}), e.code
        return e

    @app.errorhandler(Exception)
    def server_error(e):
        log.exception("unhandled error")
        if request.path.startswith("/api/"):
            return jsonify({"error": "Something went wrong on the server. Please try again."}), 500
        return "Server error", 500

    # ---- the website itself ----
    @app.get("/")
    def index():
        return send_from_directory(SITE_DIR, "index.html")

    @app.get("/<path:path>")
    def site(path):
        top = path.split("/")[0]
        if top in ("backend", "tools") or path.startswith("."):
            return ("Not found", 404)
        resp = send_from_directory(SITE_DIR, path)
        if path == "sw.js":
            resp.headers["Service-Worker-Allowed"] = "/"
            resp.headers["Cache-Control"] = "no-cache"
        return resp

    if start_background:
        reminders.start(app)
    return app


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    port = int(os.environ.get("PORT", "5000"))
    application = create_app()
    print(f"\n  AgriCare is running:  http://localhost:{port}\n")
    # use_reloader=False so the reminder thread starts only once
    application.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1", use_reloader=False)
