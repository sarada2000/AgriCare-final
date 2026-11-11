# AgriCare – Paddy Disease Detection (Final Year Project)

## Run the full system (website + backend)
- Windows: double-click `backend/run_windows.bat`
- Mac/Linux: `cd backend && pip install -r requirements.txt && python app.py`

Then open http://localhost:5000. The officer login is printed in the console the first time.
Model setup, SMS, API list and hosting: **backend/README.md**.

Without the backend (opening `index.html` directly, or the preview link) the site uses a **demo server inside
the browser** (`pages/local-server.js`): sign-up, password checking, plans and the officer dashboard all work,
but data is saved only in that browser. Demo officer login in that mode: 0700000000 / admin123.


## Structure
- `index.html` – home page (feature tiles, disease & pest chips)
- `pages/chat.js`, `pages/chat-kb.js` – chat officer on every page (offline farm notes + optional AI), contact panel
- `pages/contacts.js` – call / SMS numbers (main line + district offices) and rice research centres
- `pages/weeds.html`, `pages/weedicides.js` – weed control: spray timeline, dose calculator, weed finder, product cards
- `css/style.css` – all styles
- `pages/weather.html` – 7-day forecast (Open-Meteo, free) with daily farm advice + district climate & seasons
- `pages/varieties.html` – DOA rice varieties (age, grain, yield, resistance) with best picks per district
- `pages/my-crop.html` – crop stage, this week's work and dated crop calendar from sowing date + variety
- `pages/farm-data.js` – districts (zone, rainfall, saline / iron-toxic soils), varieties, crop stage model
- `backend/routes/weather.py` – /api/weather: forecast proxy with 30-minute cache
- `pages/content-i18n.js` – Sinhala & Tamil text for disease details, pests, Solutions and About pages
- `pages/translations.js` – English / Sinhala / Tamil text + language switch + login helpers
- `pages/pests.html`, `pages/pests.js` – pests & animals (insects, rats, birds, peafowl, wild boar, elephants) with illustrations; real photos can be added in img/pests/
- `pages/diseases.js` – disease information (used by the library and the scan page)
- `pages/treatment.js` – day-by-day treatment plans (3 languages), voice read-out, alarms, calendar export
- `pages/monitor.html` – treatment tracker (stats, scan history, condition trend) + treatment monitor with alarms
- `pages/shops.html`, `pages/shops.js` – medicine shop finder (GPS or district, OpenStreetMap data, Google Maps fallback)
- `pages/login.html, about.html, disease-library.html, learning-hub.html, upload-image.html, admin.html, voice-test.html`

## Things to edit
1. **About** – the "How the system works" steps and Technology list (keys `about_pipe_*`, `about_tech_*` in `pages/content-i18n.js`) should match your real model.
2. **Connect your model** – see backend/README.md › Add your trained model. Until then results are marked demo.
3. **Treatment plans** – edit the steps per disease in `pages/treatment.js` (`TREATMENT_PLANS`). Have them checked by an Agriculture Instructor.
4. **Translations** – have a native Sinhala and Tamil speaker check `pages/translations.js`.

## Free hosting
Upload the whole folder to GitHub and turn on GitHub Pages, or drag the folder onto app.netlify.com/drop.

## Voice (Sinhala / Tamil)  -  DO THIS ONCE
Most phones and computers have no Sinhala or Tamil voice, so AgriCare plays recorded clips instead.
English, Sinhala and Tamil all play from these clips. Basic English clips (offline robot voice) are already included; the script replaces them with a natural voice. Make them once on your computer (needs Python 3 and internet, about 2 minutes):

  Windows: double-click  tools\make_voices_windows.bat
  Mac/Linux:  pip install edge-tts   then   python3 tools/make_voices.py

This creates voice/en/*.mp3, voice/si/*.mp3, voice/ta/*.mp3 and voice/manifest.js (Microsoft's free natural voices:
Thilini for Sinhala, Saranya for Tamil - change to Sameera / Kumar in tools/make_voices.py for male voices).
Upload the whole voice/ folder with the site. Then voice works on every device, even offline.
The Monitor page shows "Voice ready" when the clips are found.

If you edit any Sinhala/Tamil text (diseases.js, treatment.js):
  node tools/export-phrases.js     (updates voice/phrases.json)
  python tools/make_voices.py      (only re-makes changed clips)
A clip is never played for text that has changed - the site falls back instead.

Fallback order when there is no clip: device voice (Microsoft Edge has Sinhala and Tamil voices; Android
needs Speech Services by Google voice data) -> online Google voice (unofficial, needs internet) -> help message.
The farmer's field name is not spoken when clips are used (it is typed by the farmer, so there is no clip).

## Alarms
How they work (pages/treatment.js, "Alarm engine"):
- Checked every 15 seconds, and immediately when the farmer returns to the tab.
- A due step shows a full-screen reminder that beeps, vibrates, reads the step aloud, and shows a notification.
- Browsers block sound until the page is tapped. If a reminder appears before that, it shows a big
  "Tap to hear the alarm" button. Tapping anywhere on the site once also unlocks sound.
- Snooze = 10 minutes. No answer for 2 minutes = automatic 10-minute snooze.
- The Monitor page shows the next alarm and whether Sound / Notifications / Voice are ready.
- sw.js (service worker, in the root folder) is required for notifications on Android. It only works on
  https:// or http://localhost - not when opening the file directly.

Limits (say this in your report):
- Browser alarms ring only while AgriCare is open in a tab. When the phone is locked or the browser is closed,
  the website cannot run.
- For alarms that always ring, use the "Google Calendar" button on each step, or
  "Add alarms to phone calendar" (.ics for all steps). These use the phone's own reminder system.
- Fully automatic alarms with the site closed need a server sending push notifications or SMS
  (e.g. Firebase Cloud Messaging or an SMS gateway) - good future work.

To test quickly: Monitor page > Turn on alarms > Test alarm (10 s).

## Shop finder
- Uses the farmer's GPS location (needs HTTPS, e.g. GitHub Pages/Netlify) or a chosen district.
- Shops come live from OpenStreetMap (shop=agrarian, farm/garden supplies, and names containing agro/agri/fertilizer/agrarian). Coverage in rural Sri Lanka can be thin.
- Add shops you have checked yourself to `VERIFIED_SHOPS` in `pages/shops.js`; they show with a "Verified" badge.
- The "Search agro shops on Google Maps" button always works as a backup.
- You can also improve the data for everyone by adding shops at openstreetmap.org (tag: shop=agrarian).

## Weather
Forecasts come from Open-Meteo (free, no key). On the hosted site or http://localhost:5000 they load live;
if the browser can't reach Open-Meteo, the backend's /api/weather is used. The last forecast is kept on the
phone for offline use. The weather does not load inside the preview link (it blocks outside connections).

## Paddy varieties
Facts for 17 varieties come from the Rice Research & Development Institute pages on doa.gov.lk
(age, pericarp colour, grain shape, yield, blast / leaf blight / gall midge / BPH reaction). District picks are
based on the agro-climatic zone, saline and iron-toxic soils, and national use (DOA varietal survey 2015).
New varieties: add them to VARIETIES in pages/farm-data.js.

## Chat officer (💬 on every page)
The chat answers farming questions in English, Sinhala and Tamil (it replies in the language the farmer types in).
Farmers can also press 🎤 and speak, and press 🔊 to hear an answer.

Where the answers come from:
1. **AgriCare's farm notes** (`pages/chat-kb.js`) – instant and offline. It knows every disease, pest, variety and
   district in the site plus fertilizer, water, weeds, seed, land preparation, harvest, storage, organic matter,
   yellow leaves, salty and iron-toxic fields, spraying, drought, floods, yield, seasons and "what to do this week"
   (from My Crop).
2. **AI for any other question** – on your own server, put an API key in `backend/.env`:
   `ANTHROPIC_API_KEY=sk-ant-...` (from https://console.anthropic.com). The AI is told to act as the
   agriculture officer, answer in the farmer's language, and follow the site's own advice.
   Inside the Claude preview link the chat asks Claude directly (Claude asks you once to allow it).
3. With no AI available, the best match from the farm notes is shown – the chat always answers.

To add more answers, add a `topic(...)` in `pages/chat-kb.js` with the words and the answer in all 3 languages.

## Contact numbers (call / SMS / WhatsApp)
Farmers press 📞 in the chat (or "Contact us" in the footer), pick their district and tap **Call**, **SMS** or
**WhatsApp**. If a district has no number, the main line is shown. Farmers can also leave their number with
**Ask us to call you** – these requests appear at the top of the Officer Dashboard ("Farmers asking for a call").

Put the numbers in ONE of these places:
- **Officer Dashboard → Contact numbers** (easiest; saved in the database), or
- `pages/contacts.js` – type each district's number between the quotes.
