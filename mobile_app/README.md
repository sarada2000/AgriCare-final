# AgriCare mobile app (Flutter)

Uses the same backend as the website (Flask API, ResNet50 model, SQLite).

## First time
1. Install Flutter and Android Studio, then `flutter doctor` must show no errors for Android.
2. In this folder run:
   flutter create . --platforms=android --project-name agricare_app
   python patch_android.py
   flutter pub get
3. Start the website backend on the laptop: `python app.py` (it shows e.g. http://172.20.10.8:8000).
4. Connect the phone with USB (USB debugging on), then:
   flutter run
5. In the app, enter the server address shown by app.py (NOT localhost - the phone needs the laptop's address).

## Build an APK to install on any phone
   flutter build apk --release
The file is build/app/outputs/flutter-apk/app-release.apk

## Backend update (once)
Copy backend_changes/plans.py into the website's backend/routes/ folder and restart python app.py.

## Files
- lib/main.dart            app start, theme, language menu
- lib/api.dart             all calls to the backend API (login, predict, diseases, scans, plans)
- lib/i18n.dart            English / Sinhala / Tamil text
- lib/screens/setup_screen.dart     server address
- lib/screens/login_screen.dart     log in / create account
- lib/screens/home_screen.dart      4 tabs
- lib/screens/scan_screen.dart      camera/gallery -> /api/predict -> result + start treatment plan
- lib/screens/diseases_screen.dart  disease library from /api/diseases
- lib/screens/history_screen.dart   scan history from /api/scans
- lib/screens/plans_screen.dart     treatment plans from /api/plans, tick steps, voice per step
- lib/screens/dashboard_screen.dart Home: scan button, numbers, today's reminders, recent scans
- lib/screens/weather_screen.dart   weather by district from /api/weather + spraying advice
- lib/screens/more_screens.dart     Ask AgriCare chat, contact an officer, agro shops, account & privacy
- lib/voice.dart                    plays the Sinhala/Tamil/English voice clips from the server
- lib/widgets.dart                  colours (same as the website) and shared building blocks
- lib/content.dart                  the website's farm content bundled in the app (assets/data/*.json)
- lib/agri_brain.dart               offline chat brain (Dart copy of the website's chat-kb.js)
- lib/plan_sheet.dart               "Start treatment plan" sheet used by the Pests page
- lib/screens/pests_screen.dart     pests & animals: pictures, how it attacks, what to do, plan + reminders
- lib/screens/weeds_screen.dart     weed control: spray timeline, dose calculator, weed finder, safety rules
- lib/screens/varieties_screen.dart paddy varieties for your district, filters, resistance
- lib/screens/crop_screen.dart      My Crop: stage today, this week's jobs, calendar to harvest
- lib/screens/learning_screen.dart  Solutions & Learning Hub guides
- lib/screens/pages.dart            opens app pages by name; home-screen tools grid
- tools/extract.js                  re-creates assets/data from the website's pages/*.js (node tools/extract.js <website>/pages assets/data)

## Version 4 (10 Nov)
- All website sections now work inside the app (no browser): Pests, Weeds, Varieties, My Crop, Learning Hub.
- Ask AgriCare answers offline in English, Sinhala and Tamil like the website's chat; uses the AI on the server when it has a key.
- Faster start: tabs are built only when first opened.
