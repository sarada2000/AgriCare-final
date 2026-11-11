# AgriCare backend

Python **Flask** + **SQLite**. One server gives both the website and the API.

## Start it

Windows: double-click `backend/run_windows.bat`

Mac/Linux:
```
cd backend
pip install -r requirements.txt
python app.py
```
Open **http://localhost:5000**. On first start the console prints the officer (admin) login
(also saved in `backend/instance/officer-login.txt`). To choose it yourself, copy `.env.example`
to `.env` and set `ADMIN_PHONE` / `ADMIN_PASSWORD` before the first start.

- Demo data for the officer dashboard: `python seed_demo.py` (remove with `python seed_demo.py --remove`).
  Demo farmers are all named "Demo Farmer …".
- Tests: `python -m unittest discover tests -v`

## What it does

| Part | Files | What |
|---|---|---|
| Accounts | `auth.py` | Register / log in with mobile number + password (hashed), JWT tokens, farmer and officer roles, blocks password guessing |
| Prediction | `model_service.py`, `routes/scans.py` | Runs your trained model on the uploaded leaf photo, saves photo + thumbnail + result |
| Treatment plans | `routes/plans.py`, `plans_data.py` | Plans and steps per farmer, due times in Sri Lanka time, offline plans synced without duplicates |
| Reminders | `reminders.py` | Every minute: finds due steps and sends an SMS in the farmer's language (works with the phone locked) |
| Shops | `routes/shops.py` | Officer-verified shops, nearest first |
| Officer dashboard | `routes/admin.py` | Totals, diseases by district, late steps, "getting worse" reports, farmer details, SMS log |

Database tables are in `schema.sql`: users, scans, plans, tasks, reminders, shops.
Treatment steps come from the website (`pages/treatment.js`) through `data/plans.json`.
After editing the steps, run `node tools/export-plans.js` so the server uses the same steps.

## Add your trained model

1. Copy the model file into `backend/model/` (`.keras`, `.h5`, `.tflite` or `.onnx`).
2. In `backend/.env`: `MODEL_PATH=model/your_model.keras`
3. Put the class names **in the same order as the model's outputs** in `backend/model/labels.json`.
   Names like `Bacterialblight`, `Brownspot`, `Blast`, `Tungro`, `Healthy` are understood automatically.
4. Set `MODEL_NORMALIZE` to match training: `0-1` (pixels / 255), `-1-1`, or `none` if the model has a Rescaling layer.
5. Install the runtime: `pip install tensorflow` (or `tflite-runtime` / `onnxruntime`) and restart.

`http://localhost:5000/api/model` shows what is loaded. Without a model every result is marked **demo**.
Results below `MIN_CONFIDENCE` are marked "uncertain" and the farmer is told to take a clearer photo.

## Real SMS

`SMS_PROVIDER=log` (default) only writes reminders to the console and the officer dashboard.
For real SMS, open an account with a Sri Lankan SMS gateway, then in `.env` set `SMS_PROVIDER=http`,
`SMS_API_URL`, `SMS_API_KEY`, `SMS_SENDER_ID`, and change `send_http()` in `reminders.py` to the
gateway's request format.

## API

All responses are JSON. After logging in, send `Authorization: Bearer <token>`.

| Method | Path | Who |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | anyone |
| GET / PATCH | /api/auth/me | logged in |
| POST | /api/predict (form field `file`) | logged in |
| GET | /api/scans · DELETE /api/scans/{id} | own scans |
| GET / POST | /api/plans · POST /api/plans/sync | own plans |
| GET / DELETE | /api/plans/{id} · PUT /api/plans/{id}/tasks | own plans |
| GET | /api/shops?lat=&lng=&radius= | anyone |
| POST / PUT / DELETE | /api/shops[/{id}] | officer |
| GET | /api/admin/stats, /farmers, /farmers/{id}, /scans, /overdue, /reminders | officer |
| GET | /api/health, /api/model | anyone |

## Putting it online

Any host that runs Python works. SQLite needs a **permanent disk** (for example PythonAnywhere, or a VPS);
hosts with temporary disks lose the database on every restart.
Production command: `gunicorn -w 1 -b 0.0.0.0:$PORT "app:create_app()"`. Keep **one** worker so each
reminder is sent once. Use HTTPS so phone location and notifications work.

Leaf photos are stored under random file names in `backend/instance/uploads` and can be opened by
anyone who has the link. That is fine for a prototype; add a login check in `register_uploads()` for a real launch.
