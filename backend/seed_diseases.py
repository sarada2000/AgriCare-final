"""Load the disease information into the diseases table (run once: python seed_diseases.py)."""
import json
import sqlite3

db = sqlite3.connect("instance/agricare.db")
with open("data/diseases_seed.json", encoding="utf-8") as f:
    diseases = json.load(f)

columns = ["id", "name_en", "name_si", "name_ta",
           "symptoms_en", "symptoms_si", "symptoms_ta",
           "treatment_en", "treatment_si", "treatment_ta",
           "chemical", "dose_per_10l", "max_dose_per_10l"]

for d in diseases:
    values = [d[c] for c in columns]
    db.execute(
        f"INSERT OR IGNORE INTO diseases ({', '.join(columns)}) "
        f"VALUES ({', '.join('?' for _ in columns)})",
        values)

db.commit()
count = db.execute("SELECT COUNT(*) FROM diseases").fetchone()[0]
print(f"Done. The diseases table now has {count} diseases.")