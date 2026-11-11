import sqlite3

db = sqlite3.connect("instance/agricare.db")
tables = db.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
).fetchall()

for (name,) in tables:
    rows = db.execute(f"SELECT COUNT(*) FROM {name}").fetchone()[0]
    columns = [c[1] for c in db.execute(f"PRAGMA table_info({name})")]
    print(f"\n{name}  ({rows} rows)")
    print("   columns:", ", ".join(columns))