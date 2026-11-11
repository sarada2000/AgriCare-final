# AgriCare – changes made on 16 October 2026 (after viva feedback)

These changes were made with AI assistance (Claude) and must be declared as such.

| Examiner point | Change | Files |
|---|---|---|
| 4, 13 – safety & liability | Disclaimer the farmer must tick before scan results / chemical advice | `pages/api.js` (AgriDisclaimer), `pages/upload-image.html`, `pages/weeds.html` |
| 13 – dose safeguards | Weed calculator: field size must be > 0 and ≤ 50 ha; always the label dose (no free dose input); warning when the crop day is outside the product's application window | `pages/weeds.html` |
| 4 – data privacy | New Privacy page (what is stored, why, who sees it, protection); farmer can delete own account and all data (password required) | `pages/privacy.html`, `backend/auth.py` (DELETE /api/auth/me), `pages/local-server.js` |
| 7 – no hidden demo | `ALLOW_DEMO=0` in `backend/.env` makes the server refuse to diagnose without the trained model | `backend/config.py`, `backend/routes/scans.py`, `.env.example` |
| Tests | 2 new backend tests (account deletion, no-model refusal) – 21 tests pass | `backend/tests/test_api.py` |

NOT done here (the student's own individual contribution): Disease Library → SQLite table + Flask `/api/diseases` + `fetch()` + officer edit form.
