"""AgriCare backend settings.

Every setting can be changed with an environment variable, or in a file called `.env`
inside the backend folder (one NAME=value per line). See .env.example.
"""
import os
import secrets

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SITE_DIR = os.path.dirname(BASE_DIR)          # the website (index.html, pages/, css/ ...)


def _load_dotenv():
    path = os.path.join(BASE_DIR, ".env")
    if not os.path.exists(path):
        return
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_dotenv()


def _secret_key():
    """Use SECRET_KEY if set, otherwise create one and keep it in instance/secret.key."""
    if os.environ.get("SECRET_KEY"):
        return os.environ["SECRET_KEY"]
    path = os.path.join(BASE_DIR, "instance", "secret.key")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if not os.path.exists(path):
        with open(path, "w") as f:
            f.write(secrets.token_hex(32))
    with open(path) as f:
        return f.read().strip()


class Config:
    SECRET_KEY = _secret_key()
    DATABASE = os.environ.get("DATABASE", os.path.join(BASE_DIR, "instance", "agricare.db"))
    UPLOAD_DIR = os.environ.get("UPLOAD_DIR", os.path.join(BASE_DIR, "instance", "uploads"))
    MAX_CONTENT_LENGTH = int(os.environ.get("MAX_UPLOAD_MB", "8")) * 1024 * 1024
    TOKEN_HOURS = int(os.environ.get("TOKEN_HOURS", str(24 * 30)))   # stay logged in for 30 days

    # Websites on other addresses allowed to call the API (comma separated). Empty = same site only.
    CORS_ORIGINS = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()]

    # Trained model. Put the file in backend/model/ and set its name here.
    # Supported: .keras / .h5 (TensorFlow), .tflite, .onnx
    MODEL_PATH = os.environ.get("MODEL_PATH", "")
    MODEL_LABELS = os.environ.get("MODEL_LABELS", os.path.join(BASE_DIR, "model", "labels.json"))
    # How the model expects pixels: "0-1" (divide by 255), "-1-1", or "none" (model rescales itself)
    MODEL_NORMALIZE = os.environ.get("MODEL_NORMALIZE", "0-1")
    MODEL_INPUT_SIZE = int(os.environ.get("MODEL_INPUT_SIZE", "224"))
    # Below this confidence the result is marked "uncertain"
    MIN_CONFIDENCE = float(os.environ.get("MIN_CONFIDENCE", "0.6"))
    # 1 = without a model file the server gives clearly marked SAMPLE results (for development only).
    # 0 = refuse to diagnose until the trained model is loaded (use this for the demo / real use).
    ALLOW_DEMO = os.environ.get("ALLOW_DEMO", "1") == "1"

    # Chat assistant AI (optional). Without a key the chat uses the website's built-in farm notes.
    ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
    CHAT_MODEL = os.environ.get("CHAT_MODEL", "claude-haiku-4-5-20251001")

    # Treatment reminders
    TIMEZONE = os.environ.get("TIMEZONE", "Asia/Colombo")
    REMINDERS_ENABLED = os.environ.get("REMINDERS_ENABLED", "1") == "1"
    REMINDER_CHECK_SECONDS = int(os.environ.get("REMINDER_CHECK_SECONDS", "60"))
    # SMS: "log" (just writes to the log) or "http" (any SMS gateway with an HTTP API)
    SMS_PROVIDER = os.environ.get("SMS_PROVIDER", "log")
    SMS_API_URL = os.environ.get("SMS_API_URL", "")
    SMS_API_KEY = os.environ.get("SMS_API_KEY", "")
    SMS_SENDER_ID = os.environ.get("SMS_SENDER_ID", "AgriCare")

    # First officer account, created on first start if no officer exists
    ADMIN_PHONE = os.environ.get("ADMIN_PHONE", "0700000000")
    ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
