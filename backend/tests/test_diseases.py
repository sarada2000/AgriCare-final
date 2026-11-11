"""Tests for the disease library API.   Run from the backend folder:   python -m unittest discover tests -v"""
import os
import sqlite3
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app  # noqa: E402


class DiseaseApiTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        db_path = os.path.join(self.tmp.name, "t.db")
        self.app = create_app({
            "DATABASE": db_path, "UPLOAD_DIR": os.path.join(self.tmp.name, "up"),
            "ADMIN_PHONE": "0700000001", "ADMIN_PASSWORD": "officerpass", "MODEL_PATH": "",
        }, start_background=False)
        self.c = self.app.test_client()
        db = sqlite3.connect(db_path)
        db.execute("INSERT INTO diseases (id, name_en, name_si, name_ta, treatment_en) "
                   "VALUES ('blast', 'Rice Blast', 'කොළ පාළුව', 'குலை நோய்', 'Spray at the label dose')")
        db.commit()
        db.close()

    def tearDown(self):
        self.tmp.cleanup()

    def officer(self):
        token = self.c.post("/api/auth/login", json={"phone": "0700000001", "password": "officerpass"}).get_json()["token"]
        return {"Authorization": "Bearer " + token}

    def farmer(self):
        token = self.c.post("/api/auth/register", json={"name": "Nimal Perera", "phone": "0771234567",
                                                        "password": "secret12", "district": "Polonnaruwa"}).get_json()["token"]
        return {"Authorization": "Bearer " + token}

    def test_anyone_can_read_diseases(self):
        r = self.c.get("/api/diseases")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.get_json()["diseases"][0]["name_si"], "කොළ පාළුව")
        self.assertEqual(self.c.get("/api/diseases/blast").status_code, 200)
        self.assertEqual(self.c.get("/api/diseases/unknown").status_code, 404)

    def test_only_officers_can_edit(self):
        self.assertEqual(self.c.put("/api/diseases/blast", json={"chemical": "x"}).status_code, 401)
        self.assertEqual(self.c.put("/api/diseases/blast", json={"chemical": "x"}, headers=self.farmer()).status_code, 403)
        r = self.c.put("/api/diseases/blast", json={"chemical": "Tricyclazole 75% WP", "dose_per_10l": 6,
                                                    "max_dose_per_10l": 8}, headers=self.officer())
        self.assertEqual(r.status_code, 200)
        disease = r.get_json()["disease"]
        self.assertEqual(disease["chemical"], "Tricyclazole 75% WP")
        self.assertEqual(disease["updated_by"], 1)          # the officer who changed it is recorded

    def test_unsafe_dose_is_refused(self):
        h = self.officer()
        r = self.c.put("/api/diseases/blast", json={"dose_per_10l": 10, "max_dose_per_10l": 8}, headers=h)
        self.assertEqual(r.status_code, 400)
        self.assertEqual(r.get_json()["field"], "dose_per_10l")
        self.assertEqual(self.c.put("/api/diseases/blast", json={"dose_per_10l": "abc"}, headers=h).status_code, 400)
        self.assertEqual(self.c.put("/api/diseases/blast", json={"dose_per_10l": -1}, headers=h).status_code, 400)
        self.assertEqual(self.c.put("/api/diseases/blast", json={"name_en": ""}, headers=h).status_code, 400)

    def test_database_check_blocks_unsafe_dose(self):
        db = sqlite3.connect(self.app.config["DATABASE"])
        with self.assertRaises(sqlite3.IntegrityError):
            db.execute("UPDATE diseases SET dose_per_10l = 10, max_dose_per_10l = 8 WHERE id = 'blast'")
        db.close()


if __name__ == "__main__":
    unittest.main()