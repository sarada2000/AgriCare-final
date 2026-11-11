-- AgriCare database (SQLite)

CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    phone         TEXT NOT NULL UNIQUE,          -- used to log in and for SMS
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'officer')),
    district      TEXT,
    language      TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'si', 'ta')),
    sms_reminders INTEGER NOT NULL DEFAULT 1,
    is_demo       INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS scans (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label       TEXT NOT NULL,                   -- disease id, e.g. blast, healthy
    confidence  REAL NOT NULL,
    is_demo     INTEGER NOT NULL DEFAULT 0,      -- 1 = no trained model, sample result
    uncertain   INTEGER NOT NULL DEFAULT 0,
    top_json    TEXT,                            -- top 3 predictions
    image_file  TEXT,                            -- file name in instance/uploads
    thumb_file  TEXT,
    latitude    REAL,
    longitude   REAL,
    district    TEXT,
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_scans_user ON scans(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_scans_label ON scans(label);

CREATE TABLE IF NOT EXISTS plans (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scan_id     INTEGER REFERENCES scans(id) ON DELETE SET NULL,
    client_id   TEXT,                            -- id the website used before syncing
    disease     TEXT NOT NULL,
    field_name  TEXT,
    start_date  TEXT NOT NULL,                   -- YYYY-MM-DD, Sri Lanka time
    alarm_time  TEXT NOT NULL DEFAULT '07:00',   -- HH:MM, Sri Lanka time
    confidence  REAL,
    status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    UNIQUE (user_id, client_id)
);

CREATE TABLE IF NOT EXISTS tasks (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id      INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    idx          INTEGER NOT NULL,               -- step number in the plan (0, 1, 2 ...)
    day          INTEGER NOT NULL,               -- days after start date
    is_check     INTEGER NOT NULL DEFAULT 0,     -- farmer reports crop condition on this step
    due_at       TEXT NOT NULL,                  -- UTC
    done         INTEGER NOT NULL DEFAULT 0,
    done_at      TEXT,
    condition    TEXT CHECK (condition IN ('better', 'same', 'worse') OR condition IS NULL),
    snooze_until TEXT,
    alarmed_at   TEXT,
    reminded_at  TEXT,                           -- when the server sent the SMS reminder
    UNIQUE (plan_id, idx)
);
CREATE INDEX IF NOT EXISTS idx_tasks_due ON tasks(done, reminded_at, due_at);

CREATE TABLE IF NOT EXISTS reminders (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id    INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    channel    TEXT NOT NULL,                    -- sms / log
    phone      TEXT,
    message    TEXT NOT NULL,
    status     TEXT NOT NULL,                    -- sent / failed / logged
    error      TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS shops (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    type       TEXT NOT NULL DEFAULT 'agro' CHECK (type IN ('agro', 'asc', 'garden')),
    latitude   REAL NOT NULL,
    longitude  REAL NOT NULL,
    phone      TEXT,
    address    TEXT,
    district   TEXT,
    hours      TEXT,
    verified   INTEGER NOT NULL DEFAULT 1,
    added_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- Phone numbers farmers can call or SMS, one row per district ("_main" = the main AgriCare number)
CREATE TABLE IF NOT EXISTS contacts (
    district    TEXT PRIMARY KEY,
    name        TEXT,
    phone       TEXT NOT NULL,
    whatsapp    TEXT,
    hours       TEXT,
    updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- "Please call me" requests from farmers
CREATE TABLE IF NOT EXISTS contact_requests (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
    name        TEXT NOT NULL,
    phone       TEXT NOT NULL,
    district    TEXT,
    message     TEXT,
    language    TEXT NOT NULL DEFAULT 'en',
    status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'done')),
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    done_at     TEXT
);
CREATE INDEX IF NOT EXISTS idx_requests_status ON contact_requests(status, created_at);

CREATE TABLE IF NOT EXISTS diseases (
    id                TEXT PRIMARY KEY,
    name_en           TEXT NOT NULL,
    name_si           TEXT NOT NULL,
    name_ta           TEXT NOT NULL,
    symptoms_en       TEXT,
    symptoms_si       TEXT,
    symptoms_ta       TEXT,
    treatment_en      TEXT,
    treatment_si      TEXT,
    treatment_ta      TEXT,
    chemical          TEXT,
    dose_per_10l      REAL,
    max_dose_per_10l  REAL,
    updated_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_by        INTEGER REFERENCES users(id) ON DELETE SET NULL,
    CHECK (dose_per_10l IS NULL OR max_dose_per_10l IS NULL OR dose_per_10l <= max_dose_per_10l)
);
