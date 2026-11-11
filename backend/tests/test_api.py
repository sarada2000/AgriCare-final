"""AgriCare API tests.   Run from the backend folder:   python -m unittest discover tests -v"""
import io
import os
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from PIL import Image  # noqa: E402

import reminders  # noqa: E402
from app import create_app  # noqa: E402


def jpeg(color=(60, 140, 40)):
    buf = io.BytesIO()
    Image.new("RGB", (400, 300), color).save(buf, "JPEG")
    buf.seek(0)
    return buf


class ApiTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.app = create_app({
            "DATABASE": os.path.join(self.tmp.name, "t.db"), "UPLOAD_DIR": os.path.join(self.tmp.name, "up"),
            "ADMIN_PHONE": "0700000001", "ADMIN_PASSWORD": "officerpass", "MODEL_PATH": "", "ALLOW_DEMO": True,
        }, start_background=False)
        self.c = self.app.test_client()

    def tearDown(self):
        self.tmp.cleanup()

    # helpers
    def register(self, phone="0771234567", **kw):
        body = {"name": "Nimal Perera", "phone": phone, "password": "secret12", "district": "Polonnaruwa", "language": "si"}
        body.update(kw)
        return self.c.post("/api/auth/register", json=body)

    def auth(self, token):
        return {"Authorization": "Bearer " + token}

    def farmer(self, phone="0771234567"):
        return self.register(phone).get_json()["token"]

    def officer(self):
        return self.c.post("/api/auth/login", json={"phone": "0700000001", "password": "officerpass"}).get_json()["token"]

    # ---------- accounts ----------
    def test_register_login_me(self):
        r = self.register(phone="+94 77 123 4567")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.get_json()["user"]["phone"], "0771234567")
        self.assertEqual(self.register().status_code, 409)                       # duplicate
        bad = self.c.post("/api/auth/login", json={"phone": "0771234567", "password": "wrong"})
        self.assertEqual(bad.status_code, 401)
        ok = self.c.post("/api/auth/login", json={"phone": "077 123 4567", "password": "secret12"})
        self.assertEqual(ok.status_code, 200)
        me = self.c.get("/api/auth/me", headers=self.auth(ok.get_json()["token"]))
        self.assertEqual(me.get_json()["user"]["language"], "si")
        self.assertEqual(self.c.get("/api/auth/me").status_code, 401)
        self.assertEqual(self.c.get("/api/auth/me", headers=self.auth("nonsense")).status_code, 401)

    def test_register_validation(self):
        self.assertEqual(self.register(phone="12345").get_json()["field"], "phone")
        self.assertEqual(self.register(password="123").get_json()["field"], "password")
        self.assertEqual(self.register(district="Mars").get_json()["field"], "district")

    def test_password_guessing_blocked(self):
        self.register()
        for _ in range(8):
            self.c.post("/api/auth/login", json={"phone": "0771234567", "password": "x"})
        r = self.c.post("/api/auth/login", json={"phone": "0771234567", "password": "secret12"})
        self.assertEqual(r.status_code, 429)

    def test_update_profile(self):
        t = self.farmer()
        r = self.c.patch("/api/auth/me", json={"language": "ta", "smsReminders": False}, headers=self.auth(t))
        self.assertEqual(r.get_json()["user"]["language"], "ta")
        self.assertFalse(r.get_json()["user"]["smsReminders"])

    # ---------- prediction & scans ----------
    def test_predict_demo_and_history(self):
        t = self.farmer()
        r = self.c.post("/api/predict", data={"file": (jpeg(), "leaf.jpg"), "lat": "7.94", "lng": "81.0"},
                        headers=self.auth(t), content_type="multipart/form-data")
        self.assertEqual(r.status_code, 201, r.get_data(as_text=True))
        j = r.get_json()
        self.assertTrue(j["demo"])
        self.assertIn(j["label"], ["bacterial_leaf_blight", "blast", "brown_spot", "healthy", "sheath_blight", "tungro"])
        self.assertEqual(len(j["top"]), 3)
        thumb = self.c.get(j["scan"]["thumb"])
        self.assertEqual(thumb.status_code, 200)
        self.assertEqual(thumb.mimetype, "image/jpeg")
        scans = self.c.get("/api/scans", headers=self.auth(t)).get_json()["scans"]
        self.assertEqual(len(scans), 1)
        self.assertEqual(scans[0]["district"], "Polonnaruwa")

    def test_farmer_can_delete_own_account_and_data(self):
        t = self.farmer()
        r = self.c.post("/api/predict", data={"file": (jpeg(), "leaf.jpg")},
                        headers=self.auth(t), content_type="multipart/form-data")
        self.assertEqual(r.status_code, 201)
        wrong = self.c.delete("/api/auth/me", json={"password": "nope"}, headers=self.auth(t))
        self.assertEqual(wrong.status_code, 400)
        ok = self.c.delete("/api/auth/me", json={"password": "secret12"}, headers=self.auth(t))
        self.assertEqual(ok.status_code, 200, ok.get_json())
        self.assertEqual(self.c.get("/api/auth/me", headers=self.auth(t)).status_code, 401)

    def test_no_diagnosis_without_model_when_demo_is_off(self):
        t = self.farmer()
        self.app.config["ALLOW_DEMO"] = False
        r = self.c.post("/api/predict", data={"file": (jpeg(), "leaf.jpg")},
                        headers=self.auth(t), content_type="multipart/form-data")
        self.app.config["ALLOW_DEMO"] = True
        self.assertEqual(r.status_code, 503)
        self.assertEqual(r.get_json().get("field"), "no_model")

    def test_predict_rejects_photo_that_is_not_a_leaf(self):
        t = self.farmer()
        r = self.c.post("/api/predict", data={"file": (jpeg((205, 160, 140)), "face.jpg")},
                        headers=self.auth(t), content_type="multipart/form-data")
        self.assertEqual(r.status_code, 422, r.get_json())
        self.assertEqual(r.get_json().get("field"), "not_leaf")

    def test_predict_rejects_non_image(self):
        t = self.farmer()
        r = self.c.post("/api/predict", data={"file": (io.BytesIO(b"not an image"), "x.jpg")},
                        headers=self.auth(t), content_type="multipart/form-data")
        self.assertEqual(r.status_code, 400)
        self.assertEqual(self.c.post("/api/predict").status_code, 401)

    def test_scans_are_private(self):
        a, b = self.farmer("0771111111"), self.farmer("0772222222")
        self.c.post("/api/predict", data={"file": (jpeg(), "a.jpg")}, headers=self.auth(a), content_type="multipart/form-data")
        self.assertEqual(self.c.get("/api/scans", headers=self.auth(b)).get_json()["scans"], [])

    # ---------- plans ----------
    def test_plan_lifecycle_and_sync(self):
        t = self.farmer()
        r = self.c.post("/api/plans", json={"disease": "blast", "field": "Lower field", "startDate": "2026-10-02",
                                            "alarmTime": "07:00"}, headers=self.auth(t))
        self.assertEqual(r.status_code, 201)
        plan = r.get_json()["plan"]
        self.assertEqual(len(plan["tasks"]), 5)
        self.assertEqual(plan["tasks"][0]["dueAt"], "2026-10-02T01:30:00Z")      # 07:00 Sri Lanka = 01:30 UTC
        self.assertEqual(plan["tasks"][2]["dueAt"], "2026-10-06T01:30:00Z")      # day 4

        u = self.c.put(f"/api/plans/{plan['id']}/tasks", json={"tasks": [
            {"id": "t0", "done": True}, {"id": "t2", "done": True, "condition": "worse"}]}, headers=self.auth(t))
        tasks = u.get_json()["plan"]["tasks"]
        self.assertTrue(tasks[0]["done"] and tasks[0]["doneAt"])
        self.assertEqual(tasks[2]["condition"], "worse")

        offline = {"id": "p1700000000", "disease": "tungro", "startDate": "2026-10-01", "alarmTime": "06:30",
                   "tasks": [{"id": "t0", "done": True, "doneAt": "2026-10-01T02:00:00Z"}]}
        s1 = self.c.post("/api/plans/sync", json={"plans": [offline]}, headers=self.auth(t)).get_json()
        s2 = self.c.post("/api/plans/sync", json={"plans": [offline]}, headers=self.auth(t)).get_json()
        self.assertEqual(s1["created"], 1)
        self.assertEqual(len(s2["plans"]), 2)                                     # no duplicate
        synced = [p for p in s2["plans"] if p["disease"] == "tungro"][0]
        self.assertTrue(synced["tasks"][0]["done"])

        other = self.farmer("0779999999")
        self.assertEqual(self.c.get(f"/api/plans/{plan['id']}", headers=self.auth(other)).status_code, 404)
        self.assertEqual(self.c.delete(f"/api/plans/{plan['id']}", headers=self.auth(t)).status_code, 200)

    def test_plan_validation(self):
        t = self.farmer()
        self.assertEqual(self.c.post("/api/plans", json={"disease": "flu", "startDate": "2026-10-02"}, headers=self.auth(t)).status_code, 400)
        self.assertEqual(self.c.post("/api/plans", json={"disease": "blast", "startDate": "2/10/26"}, headers=self.auth(t)).status_code, 400)

    # ---------- reminders ----------
    def test_reminders_sent_once_in_farmer_language(self):
        t = self.farmer()       # language si
        start = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")
        self.c.post("/api/plans", json={"disease": "blast", "startDate": start, "alarmTime": "00:00"}, headers=self.auth(t))
        n1 = reminders.run_once(self.app.config)
        n2 = reminders.run_once(self.app.config)
        self.assertEqual((n1, n2), (2, 0))                                        # day 0 and day 1 due, sent once
        o = self.officer()
        rs = self.c.get("/api/admin/reminders", headers=self.auth(o)).get_json()["reminders"]
        self.assertEqual(len(rs), 2)
        self.assertIn("AgriCare මතක් කිරීම", rs[0]["message"])
        self.assertEqual(rs[0]["status"], "logged")

    # ---------- shops ----------
    def test_shops(self):
        o, f = self.officer(), self.farmer()
        shop = {"name": "Test Agro Centre", "lat": 7.94, "lng": 81.0, "phone": "027 222 2222", "district": "Polonnaruwa"}
        self.assertEqual(self.c.post("/api/shops", json=shop, headers=self.auth(f)).status_code, 403)
        self.assertEqual(self.c.post("/api/shops", json=dict(shop, lat=51.5), headers=self.auth(o)).status_code, 400)
        sid = self.c.post("/api/shops", json=shop, headers=self.auth(o)).get_json()["shop"]["id"]
        self.c.post("/api/shops", json=dict(shop, name="Far Shop", lat=6.05, lng=80.22), headers=self.auth(o))
        near = self.c.get("/api/shops?lat=7.95&lng=81.01&radius=10").get_json()["shops"]
        self.assertEqual([s["name"] for s in near], ["Test Agro Centre"])
        self.assertLess(near[0]["km"], 2)
        self.c.put(f"/api/shops/{sid}", json={"hours": "8am-6pm"}, headers=self.auth(o))
        self.assertEqual(self.c.get("/api/shops").get_json()["shops"][0]["hours"], "8am-6pm")

    # ---------- officer dashboard ----------
    def test_admin(self):
        f, o = self.farmer(), self.officer()
        self.c.post("/api/predict", data={"file": (jpeg(), "a.jpg")}, headers=self.auth(f), content_type="multipart/form-data")
        old = (datetime.now(timezone.utc) - timedelta(days=3)).strftime("%Y-%m-%d")
        self.c.post("/api/plans", json={"disease": "brown_spot", "startDate": old}, headers=self.auth(f))
        self.assertEqual(self.c.get("/api/admin/stats", headers=self.auth(f)).status_code, 403)
        s = self.c.get("/api/admin/stats", headers=self.auth(o)).get_json()
        self.assertEqual(s["summary"]["farmers"], 1)
        self.assertEqual(s["summary"]["scans"], 1)
        self.assertGreaterEqual(s["summary"]["overdueSteps"], 1)
        farmers = self.c.get("/api/admin/farmers?q=Nimal", headers=self.auth(o)).get_json()["farmers"]
        self.assertEqual(farmers[0]["scans"], 1)
        detail = self.c.get(f"/api/admin/farmers/{farmers[0]['id']}", headers=self.auth(o)).get_json()
        self.assertEqual(len(detail["plans"]), 1)
        od = self.c.get("/api/admin/overdue", headers=self.auth(o)).get_json()
        self.assertTrue(od["overdue"][0]["step"])

    # ---------- website served ----------
    def test_contacts_and_call_requests(self):
        self.assertEqual(self.c.get("/api/contacts").get_json(), {"contacts": {}})
        off, farmer = self.auth(self.officer()), self.auth(self.farmer())
        body = {"contacts": {"_main": {"name": "AgriCare", "phone": "011 234 5678"},
                             "Polonnaruwa": {"name": "Polonnaruwa office", "phone": "0771234500", "whatsapp": "+94 77 123 4500"}}}
        self.assertEqual(self.c.put("/api/admin/contacts", json=body, headers=farmer).status_code, 403)
        r = self.c.put("/api/admin/contacts", json=body, headers=off)
        self.assertEqual(r.status_code, 200)
        got = self.c.get("/api/contacts").get_json()["contacts"]
        self.assertEqual(got["Polonnaruwa"]["whatsapp"], "+94 77 123 4500")
        self.assertEqual(got["_main"]["phone"], "011 234 5678")
        bad = self.c.put("/api/admin/contacts", json={"contacts": {"Polonnaruwa": {"phone": "12"}}}, headers=off)
        self.assertEqual(bad.status_code, 400)
        self.assertEqual(self.c.put("/api/admin/contacts", json={"contacts": {"Atlantis": {"phone": "0771234567"}}}, headers=off).status_code, 400)
        self.c.put("/api/admin/contacts", json={"contacts": {"Polonnaruwa": {"phone": ""}}}, headers=off)   # empty = remove
        self.assertNotIn("Polonnaruwa", self.c.get("/api/contacts").get_json()["contacts"])

        # call-back requests
        self.assertEqual(self.c.post("/api/contact-requests", json={"name": "Nimal", "phone": "123"}).status_code, 400)
        r = self.c.post("/api/contact-requests", json={"name": "Nimal", "phone": "+94 77 555 1234", "district": "Polonnaruwa",
                                                       "message": "කොළ කහ වෙලා", "language": "si"}, headers=farmer)
        self.assertEqual(r.status_code, 201)
        rid = r.get_json()["id"]
        self.assertEqual(self.c.get("/api/admin/contact-requests", headers=farmer).status_code, 403)
        reqs = self.c.get("/api/admin/contact-requests", headers=off).get_json()["requests"]
        self.assertEqual((reqs[0]["phone"], reqs[0]["message"], reqs[0]["district"]), ("0775551234", "කොළ කහ වෙලා", "Polonnaruwa"))
        self.assertEqual(self.c.patch(f"/api/admin/contact-requests/{rid}", json={"status": "done"}, headers=off).status_code, 200)
        self.assertEqual(self.c.get("/api/admin/contact-requests", headers=off).get_json()["requests"], [])
        for _ in range(5):
            last = self.c.post("/api/contact-requests", json={"name": "Nimal", "phone": "0775551234"})
        self.assertEqual(last.status_code, 429)

    def test_site_served_and_backend_hidden(self):
        self.assertEqual(self.c.get("/").status_code, 200)
        self.assertEqual(self.c.get("/pages/login.html").status_code, 200)
        self.assertEqual(self.c.get("/backend/config.py").status_code, 404)
        self.assertEqual(self.c.get("/api/health").get_json()["model"], "demo")
        self.assertEqual(self.c.get("/api/nothing").status_code, 404)


class WeatherTest(unittest.TestCase):
    def test_weather_proxy_cache_and_fallback(self):
        from unittest import mock
        import routes.weather as w
        tmp = tempfile.TemporaryDirectory()
        app = create_app({"DATABASE": os.path.join(tmp.name, "t.db"), "UPLOAD_DIR": os.path.join(tmp.name, "up"),
                          "ADMIN_PASSWORD": "x12345"}, start_background=False)
        c = app.test_client()
        w._cache.clear()
        fake = mock.Mock(status_code=200)
        fake.json.return_value = {"daily": {"time": ["2026-10-02"]}}
        fake.raise_for_status.return_value = None
        with mock.patch("routes.weather.requests.get", return_value=fake) as g:
            self.assertEqual(c.get("/api/weather?lat=7.94&lng=81.01").get_json()["daily"]["time"], ["2026-10-02"])
            c.get("/api/weather?lat=7.92&lng=81.03")          # same ~10 km area -> cached
            self.assertEqual(g.call_count, 1)
        self.assertEqual(c.get("/api/weather?lat=51.5&lng=0.1").status_code, 400)
        w._cache.clear()
        with mock.patch("routes.weather.requests.get", side_effect=Exception("down")):
            self.assertEqual(c.get("/api/weather?lat=7.0&lng=80.0").status_code, 503)
        tmp.cleanup()


class ChatTest(unittest.TestCase):
    def make(self, **cfg):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        base = {"DATABASE": os.path.join(self.tmp.name, "t.db"), "UPLOAD_DIR": os.path.join(self.tmp.name, "up"),
                "ADMIN_PHONE": "0700000001", "ADMIN_PASSWORD": "officerpass", "MODEL_PATH": ""}
        base.update(cfg)
        return create_app(base, start_background=False).test_client()

    def test_without_key_page_uses_its_notes(self):
        c = self.make(ANTHROPIC_API_KEY="")
        self.assertEqual(c.post("/api/chat", json={"message": ""}).status_code, 400)
        r = c.post("/api/chat", json={"message": "how to treat blast", "lang": "si"})
        self.assertEqual(r.get_json(), {"answer": None, "ai": False})
        self.assertFalse(c.get("/api/health").get_json()["chat_ai"])

    def test_with_key_asks_ai_in_farmer_language(self):
        from unittest import mock
        from routes import chat as chat_mod
        chat_mod._hits.clear()
        c = self.make(ANTHROPIC_API_KEY="test-key")
        sent = {}

        class Resp:
            def raise_for_status(self): pass
            def json(self): return {"content": [{"type": "text", "text": "• පාළුවට tricyclazole ඉසින්න"}]}

        def fake_post(url, **kw):
            sent.update(kw["json"], key=kw["headers"]["x-api-key"])
            return Resp()
        with mock.patch.object(chat_mod.requests, "post", fake_post):
            r = c.post("/api/chat", json={"message": "පාළුවට බෙහෙත්", "lang": "si", "context": "AgriCare data",
                                         "history": [{"role": "assistant", "content": "hi"}, {"role": "user", "content": "q1"},
                                                     {"role": "assistant", "content": "a1"}]})
        j = r.get_json()
        self.assertEqual(j["answer"], "• පාළුවට tricyclazole ඉසින්න")
        self.assertEqual(sent["key"], "test-key")
        self.assertIn("Sinhala", sent["system"])
        self.assertIn("NEVER tell the farmer to contact", sent["system"])
        self.assertEqual([m["role"] for m in sent["messages"]], ["user", "assistant", "user"])   # leading reply dropped
        self.assertEqual(sent["messages"][-1]["content"], "පාළුවට බෙහෙත්")

        # AI down -> the page falls back to its notes
        with mock.patch.object(chat_mod.requests, "post", side_effect=OSError("down")):
            self.assertEqual(c.post("/api/chat", json={"message": "x"}).get_json(), {"answer": None, "ai": True})
        # too many questions from one address
        with mock.patch.object(chat_mod.requests, "post", fake_post):
            codes = [c.post("/api/chat", json={"message": "q"}).status_code for _ in range(25)]
        self.assertIn(429, codes)
        chat_mod._hits.clear()


class ModelTest(unittest.TestCase):
    def test_label_aliases_and_softmax(self):
        from model_service import to_agricare_id
        for name, want in [("paddy-blast", "blast"), ("rice-bug", "paddy_bug"), ("red-stripe", "red_stripe"), ("gall-midge", "gall_midge"),
                           ("leaf-folder", "leaf_folder"), ("stem-borer", "stem_borer"), ("bacterial-leaf-blight", "bacterial_leaf_blight"),
                           ("brown-spot", "brown_spot"), ("sheath-blight", "sheath_blight"), ("tungro", "tungro")]:
            self.assertEqual(to_agricare_id(name), want, name)
        from model_service import Predictor, to_agricare_id
        self.assertEqual(to_agricare_id("Bacterialblight"), "bacterial_leaf_blight")
        self.assertEqual(to_agricare_id("Brown Spot"), "brown_spot")
        self.assertEqual(to_agricare_id("Leaf-Blast"), "blast")
        p = Predictor._softmax_if_needed([2.0, 1.0, -1.0])
        self.assertAlmostEqual(float(p.sum()), 1.0, places=6)
        self.assertEqual(int(p.argmax()), 0)


if __name__ == "__main__":
    unittest.main()
