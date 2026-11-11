// App text in English, Sinhala and Tamil. Please have the Sinhala and Tamil checked by a native speaker.
import 'package:flutter/foundation.dart';

final ValueNotifier<String> appLanguage = ValueNotifier<String>('en');

const Map<String, Map<String, String>> _text = {
  'app_sub': {'en': 'Paddy disease detection', 'si': 'වී රෝග හඳුනාගැනීම', 'ta': 'நெல் நோய் கண்டறிதல்'},
  'server': {'en': 'Server address', 'si': 'සේවාදායක ලිපිනය', 'ta': 'சேவையக முகவரி'},
  'server_hint': {
    'en': 'The address shown when you run python app.py, e.g. http://192.168.1.5:8000. Phone and laptop must be on the same Wi-Fi.',
    'si': 'python app.py ධාවනය කළ විට පෙන්වන ලිපිනය, උදා: http://192.168.1.5:8000. දුරකථනය සහ ලැප්ටොප් එකම Wi-Fi එකේ තිබිය යුතුය.',
    'ta': 'python app.py இயக்கும்போது காட்டப்படும் முகவரி, எ.கா. http://192.168.1.5:8000. தொலைபேசியும் மடிக்கணினியும் ஒரே Wi-Fi-இல் இருக்க வேண்டும்.'
  },
  'connect': {'en': 'Connect', 'si': 'සම්බන්ධ වන්න', 'ta': 'இணை'},
  'login': {'en': 'Log in', 'si': 'පිවිසෙන්න', 'ta': 'உள்நுழை'},
  'register': {'en': 'Create account', 'si': 'ගිණුමක් සාදන්න', 'ta': 'கணக்கை உருவாக்கு'},
  'name': {'en': 'Your name', 'si': 'ඔබේ නම', 'ta': 'உங்கள் பெயர்'},
  'phone': {'en': 'Mobile number', 'si': 'ජංගම දුරකථන අංකය', 'ta': 'கைபேசி எண்'},
  'password': {'en': 'Password', 'si': 'මුරපදය', 'ta': 'கடவுச்சொல்'},
  'no_account': {'en': 'No account? Create one', 'si': 'ගිණුමක් නැද්ද? සාදන්න', 'ta': 'கணக்கு இல்லையா? உருவாக்குங்கள்'},
  'have_account': {'en': 'Already have an account? Log in', 'si': 'ගිණුමක් තිබේද? පිවිසෙන්න', 'ta': 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழை'},
  'change_server': {'en': 'Change server', 'si': 'සේවාදායකය වෙනස් කරන්න', 'ta': 'சேவையகத்தை மாற்று'},
  'logout': {'en': 'Log out', 'si': 'ඉවත් වන්න', 'ta': 'வெளியேறு'},
  'tab_scan': {'en': 'Scan', 'si': 'ස්කෑන්', 'ta': 'ஸ்கேன்'},
  'tab_diseases': {'en': 'Diseases', 'si': 'රෝග', 'ta': 'நோய்கள்'},
  'tab_history': {'en': 'History', 'si': 'ඉතිහාසය', 'ta': 'வரலாறு'},
  'tab_plans': {'en': 'Treatment', 'si': 'ප්‍රතිකාර', 'ta': 'சிகிச்சை'},
  'scan_title': {'en': 'Scan a paddy leaf', 'si': 'වී කොළයක් ස්කෑන් කරන්න', 'ta': 'நெல் இலையை ஸ்கேன் செய்யுங்கள்'},
  'scan_tip': {
    'en': 'Take a close-up of ONE affected leaf in daylight. Fill the photo with the leaf.',
    'si': 'දිවා ආලෝකයේ රෝගී කොළයක් පමණක් ළඟින් ඡායාරූප ගන්න. කොළය ඡායාරූපය පුරා පිරෙන්න.',
    'ta': 'பகல் வெளிச்சத்தில் பாதிக்கப்பட்ட ஒரு இலையை அருகில் படம் எடுங்கள். படம் முழுவதும் இலை இருக்கட்டும்.'
  },
  'camera': {'en': 'Camera', 'si': 'කැමරාව', 'ta': 'கேமரா'},
  'gallery': {'en': 'Gallery', 'si': 'ගැලරිය', 'ta': 'கேலரி'},
  'analyse': {'en': 'Analyse leaf', 'si': 'කොළය විශ්ලේෂණය කරන්න', 'ta': 'இலையை ஆய்வு செய்'},
  'analysing': {'en': 'Analysing...', 'si': 'විශ්ලේෂණය කරමින්...', 'ta': 'ஆய்வு செய்கிறது...'},
  'result': {'en': 'Diagnosis', 'si': 'විනිශ්චය', 'ta': 'கண்டறிதல்'},
  'confidence': {'en': 'Confidence', 'si': 'විශ්වාසය', 'ta': 'நம்பகத்தன்மை'},
  'uncertain': {
    'en': 'Not sure. Take a clearer close-up photo of one leaf in daylight and scan again.',
    'si': 'නිශ්චිත නැත. දිවා ආලෝකයේ එක් කොළයක පැහැදිලි ඡායාරූපයක් ගෙන නැවත ස්කෑන් කරන්න.',
    'ta': 'உறுதியாக இல்லை. பகல் வெளிச்சத்தில் ஒரு இலையின் தெளிவான படத்தை எடுத்து மீண்டும் ஸ்கேன் செய்யுங்கள்.'
  },
  'other_options': {'en': 'Other possibilities', 'si': 'වෙනත් හැකියාවන්', 'ta': 'பிற சாத்தியங்கள்'},
  'symptoms': {'en': 'Symptoms', 'si': 'ලක්ෂණ', 'ta': 'அறிகுறிகள்'},
  'treatment': {'en': 'What to do', 'si': 'කළ යුතු දේ', 'ta': 'செய்ய வேண்டியவை'},
  'recommended': {'en': 'Recommended', 'si': 'නිර්දේශිත', 'ta': 'பரிந்துரை'},
  'max': {'en': 'max', 'si': 'උපරිම', 'ta': 'அதிகபட்சம்'},
  'start_plan': {'en': 'Start treatment plan', 'si': 'ප්‍රතිකාර සැලැස්ම අරඹන්න', 'ta': 'சிகிச்சைத் திட்டத்தைத் தொடங்கு'},
  'field_name': {'en': 'Field name', 'si': 'කුඹුරේ නම', 'ta': 'வயலின் பெயர்'},
  'start_date': {'en': 'Start date', 'si': 'ආරම්භක දිනය', 'ta': 'தொடக்க தேதி'},
  'alarm_time': {'en': 'Reminder time', 'si': 'මතක් කිරීමේ වේලාව', 'ta': 'நினைவூட்டல் நேரம்'},
  'save': {'en': 'Save', 'si': 'සුරකින්න', 'ta': 'சேமி'},
  'cancel': {'en': 'Cancel', 'si': 'අවලංගු කරන්න', 'ta': 'ரத்து'},
  'plan_started': {'en': 'Treatment plan started.', 'si': 'ප්‍රතිකාර සැලැස්ම ආරම්භ විය.', 'ta': 'சிகிச்சைத் திட்டம் தொடங்கியது.'},
  'search': {'en': 'Search diseases...', 'si': 'රෝග සොයන්න...', 'ta': 'நோய்களைத் தேடு...'},
  'no_scans': {'en': 'No scans yet.', 'si': 'තවම ස්කෑන් නැත.', 'ta': 'இன்னும் ஸ்கேன்கள் இல்லை.'},
  'no_plans': {'en': 'No treatment plans yet. Start one from a scan result.', 'si': 'තවම ප්‍රතිකාර සැලසුම් නැත. ස්කෑන් ප්‍රතිඵලයකින් අරඹන්න.', 'ta': 'இன்னும் சிகிச்சைத் திட்டங்கள் இல்லை. ஸ்கேன் முடிவிலிருந்து தொடங்குங்கள்.'},
  'day': {'en': 'Day', 'si': 'දිනය', 'ta': 'நாள்'},
  'check_step': {'en': 'Check', 'si': 'පරීක්ෂාව', 'ta': 'சோதனை'},
  'done_of': {'en': 'done', 'si': 'අවසන්', 'ta': 'முடிந்தது'},
  'completed': {'en': 'Completed', 'si': 'අවසන්', 'ta': 'நிறைவு'},
  'active': {'en': 'Active', 'si': 'සක්‍රීය', 'ta': 'செயலில்'},
  'retry': {'en': 'Try again', 'si': 'නැවත උත්සාහ කරන්න', 'ta': 'மீண்டும் முயற்சி'},
  'disclaimer_title': {'en': 'Important', 'si': 'වැදගත්', 'ta': 'முக்கியம்'},
  'disclaimer': {
    'en': 'AgriCare gives advice only. It can be wrong. Always read the product label and follow your agriculture officer. Never use more than the label dose.',
    'si': 'AgriCare දෙන්නේ උපදෙස් පමණි. එය වැරදි විය හැකිය. සැමවිටම නිෂ්පාදන ලේබලය කියවා ඔබේ කෘෂිකර්ම නිලධාරියාගේ උපදෙස් පිළිපදින්න. ලේබලයේ මාත්‍රාවට වඩා කිසිවිටෙක භාවිත නොකරන්න.',
    'ta': 'AgriCare ஆலோசனை மட்டுமே தருகிறது. அது தவறாக இருக்கலாம். எப்போதும் தயாரிப்பு லேபிளைப் படித்து உங்கள் விவசாய அலுவலரைப் பின்பற்றுங்கள். லேபிள் அளவுக்கு மேல் ஒருபோதும் பயன்படுத்த வேண்டாம்.'
  },
  'i_understand': {'en': 'I understand', 'si': 'මට තේරුණා', 'ta': 'புரிந்தது'},
  'tab_home': {'en': 'Home', 'si': 'මුල් පිටුව', 'ta': 'முகப்பு'},
  'tab_weather': {'en': 'Weather', 'si': 'කාලගුණය', 'ta': 'வானிலை'},
  'hello': {'en': 'Ayubowan', 'si': 'ආයුබෝවන්', 'ta': 'வணக்கம்'},
  'home_sub': {'en': 'Check your paddy field today.', 'si': 'අද ඔබේ කුඹුර පරීක්ෂා කරන්න.', 'ta': 'இன்று உங்கள் வயலைச் சோதியுங்கள்.'},
  'hero_title': {'en': 'Is your paddy leaf sick?', 'si': 'ඔබේ වී කොළය රෝගීද?', 'ta': 'உங்கள் நெல் இலை நோயுற்றதா?'},
  'hero_text': {
    'en': 'Take a photo of one leaf. AgriCare finds the disease and tells you what to do.',
    'si': 'කොළයක ඡායාරූපයක් ගන්න. AgriCare රෝගය හඳුනාගෙන කළ යුතු දේ කියයි.',
    'ta': 'ஒரு இலையைப் படம் எடுங்கள். AgriCare நோயைக் கண்டறிந்து செய்ய வேண்டியதைச் சொல்லும்.'
  },
  'scan_now': {'en': 'Scan a leaf', 'si': 'කොළයක් ස්කෑන් කරන්න', 'ta': 'இலையை ஸ்கேன் செய்'},
  'stat_scans': {'en': 'Scans', 'si': 'ස්කෑන්', 'ta': 'ஸ்கேன்கள்'},
  'stat_plans': {'en': 'Active plans', 'si': 'සක්‍රීය සැලසුම්', 'ta': 'செயலில் திட்டங்கள்'},
  'stat_due': {'en': 'Steps today', 'si': 'අද පියවර', 'ta': 'இன்றைய படிகள்'},
  'today_tasks': {'en': 'Reminders', 'si': 'මතක් කිරීම්', 'ta': 'நினைவூட்டல்கள்'},
  'no_tasks': {'en': 'Nothing to do today.', 'si': 'අද කළ යුතු දෙයක් නැත.', 'ta': 'இன்று செய்ய எதுவும் இல்லை.'},
  'overdue': {'en': 'Late', 'si': 'ප්‍රමාදයි', 'ta': 'தாமதம்'},
  'today': {'en': 'Today', 'si': 'අද', 'ta': 'இன்று'},
  'upcoming': {'en': 'Coming', 'si': 'ඉදිරියට', 'ta': 'வரவிருக்கும்'},
  'recent_scans': {'en': 'Recent scans', 'si': 'මෑත ස්කෑන්', 'ta': 'சமீபத்திய ஸ்கேன்கள்'},
  'see_all': {'en': 'See all', 'si': 'සියල්ල', 'ta': 'அனைத்தும்'},
  'healthy': {'en': 'Healthy', 'si': 'නිරෝගී', 'ta': 'ஆரோக்கியம்'},
  'disease_found': {'en': 'Disease found', 'si': 'රෝගයක් හඳුනාගෙන ඇත', 'ta': 'நோய் கண்டறியப்பட்டது'},
  'not_sure': {'en': 'Not sure', 'si': 'නිශ්චිත නැත', 'ta': 'உறுதியில்லை'},
  'add_photo': {'en': 'Add a leaf photo with Camera or Gallery', 'si': 'කැමරාව හෝ ගැලරිය මගින් කොළ ඡායාරූපයක් එක් කරන්න', 'ta': 'கேமரா அல்லது கேலரி மூலம் இலைப் படத்தைச் சேர்க்கவும்'},
  'listen': {'en': 'Listen', 'si': 'අහන්න', 'ta': 'கேளுங்கள்'},
  'stop': {'en': 'Stop', 'si': 'නවත්වන්න', 'ta': 'நிறுத்து'},
  'no_voice': {'en': 'No voice recording for this yet.', 'si': 'මේ සඳහා තවම හඬ පටිගත කිරීමක් නැත.', 'ta': 'இதற்கு இன்னும் குரல் பதிவு இல்லை.'},
  'progress': {'en': 'Progress', 'si': 'ප්‍රගතිය', 'ta': 'முன்னேற்றம்'},
  'district': {'en': 'District', 'si': 'දිස්ත්‍රික්කය', 'ta': 'மாவட்டம்'},
  'now': {'en': 'Now', 'si': 'දැන්', 'ta': 'இப்போது'},
  'humidity': {'en': 'Humidity', 'si': 'ආර්ද්‍රතාව', 'ta': 'ஈரப்பதம்'},
  'wind': {'en': 'Wind', 'si': 'සුළඟ', 'ta': 'காற்று'},
  'rain': {'en': 'Rain', 'si': 'වැසි', 'ta': 'மழை'},
  'next_7_days': {'en': 'Next 7 days', 'si': 'ඉදිරි දින 7', 'ta': 'அடுத்த 7 நாட்கள்'},
  'spray_ok': {'en': 'Good day to spray: low rain chance and light wind.', 'si': 'ඉසීමට හොඳ දිනයකි: වැසි අවදානම අඩුයි, සුළඟ සැහැල්ලුයි.', 'ta': 'தெளிக்க நல்ல நாள்: மழை வாய்ப்பு குறைவு, காற்று லேசானது.'},
  'spray_rain': {'en': 'Do not spray today: rain is likely and will wash the chemical off.', 'si': 'අද ඉසින්න එපා: වැසි ඇතිවිය හැකි අතර රසායනය සේදී යයි.', 'ta': 'இன்று தெளிக்க வேண்டாம்: மழை பெய்து மருந்து கழுவப்படும்.'},
  'spray_wind': {'en': 'Do not spray today: strong wind will blow the spray away.', 'si': 'අද ඉසින්න එපා: තද සුළඟින් ඉසීම ගසාගෙන යයි.', 'ta': 'இன்று தெளிக்க வேண்டாம்: பலத்த காற்று தெளிப்பை அடித்துச் செல்லும்.'},
  'blast_risk': {'en': 'High humidity: watch for blast and sheath blight.', 'si': 'ඉහළ ආර්ද්‍රතාව: කොළ පාළුව සහ කොපු අංගමාරය ගැන සැලකිලිමත් වන්න.', 'ta': 'அதிக ஈரப்பதம்: குலை நோய் மற்றும் இலை உறை கருகல் குறித்து கவனமாக இருங்கள்.'},
  'all_scans': {'en': 'All scans', 'si': 'සියලු ස්කෑන්', 'ta': 'அனைத்து ஸ்கேன்களும்'},
  'ask_title': {'en': 'Ask AgriCare', 'si': 'AgriCare ගෙන් අහන්න', 'ta': 'AgriCare-இடம் கேளுங்கள்'},
  'ask_hint': {'en': 'Ask about a paddy disease, e.g. "brown spots on leaves".', 'si': 'වී රෝගයක් ගැන අහන්න, උදා: "කොළවල දුඹුරු පුල්ලි".', 'ta': 'நெல் நோய் பற்றிக் கேளுங்கள், எ.கா. "இலைகளில் பழுப்புப் புள்ளிகள்".'},
  'ask_placeholder': {'en': 'Type your question...', 'si': 'ඔබේ ප්‍රශ්නය ලියන්න...', 'ta': 'உங்கள் கேள்வியை எழுதுங்கள்...'},
  'ask_unknown': {'en': 'I could not find this in the AgriCare library. Please scan a leaf or contact your agriculture officer.', 'si': 'මෙය AgriCare පුස්තකාලයේ සොයාගත නොහැකි විය. කොළයක් ස්කෑන් කරන්න හෝ ඔබේ කෘෂිකර්ම නිලධාරියා අමතන්න.', 'ta': 'இதை AgriCare நூலகத்தில் கண்டுபிடிக்க முடியவில்லை. இலையை ஸ்கேன் செய்யுங்கள் அல்லது விவசாய அலுவலரைத் தொடர்பு கொள்ளுங்கள்.'},
  'ask_scan_tip': {'en': 'To be sure, scan a photo of the leaf.', 'si': 'නිශ්චිත වීමට, කොළයේ ඡායාරූපයක් ස්කෑන් කරන්න.', 'ta': 'உறுதிப்படுத்த, இலையின் படத்தை ஸ்கேன் செய்யுங்கள்.'},
  'contact_title': {'en': 'Contact an officer', 'si': 'නිලධාරියෙකු අමතන්න', 'ta': 'அலுவலரைத் தொடர்பு கொள்ளுங்கள்'},
  'contact_none': {'en': 'No number for this district yet.', 'si': 'මෙම දිස්ත්‍රික්කය සඳහා තවම අංකයක් නැත.', 'ta': 'இந்த மாவட்டத்திற்கு இன்னும் எண் இல்லை.'},
  'contact_request': {'en': 'Ask an officer to call you', 'si': 'ඔබට කතා කරන ලෙස නිලධාරියෙකුගෙන් ඉල්ලන්න', 'ta': 'உங்களை அழைக்க அலுவலரிடம் கேளுங்கள்'},
  'contact_message': {'en': 'Describe the problem (optional)', 'si': 'ගැටලුව විස්තර කරන්න (අවශ්‍ය නම්)', 'ta': 'பிரச்சினையை விவரிக்கவும் (விருப்பம்)'},
  'contact_call_me': {'en': 'Please call me', 'si': 'කරුණාකර මට කතා කරන්න', 'ta': 'தயவுசெய்து என்னை அழையுங்கள்'},
  'contact_sent': {'en': 'Request sent. An officer will call you.', 'si': 'ඉල්ලීම යවා ඇත. නිලධාරියෙකු ඔබට කතා කරයි.', 'ta': 'கோரிக்கை அனுப்பப்பட்டது. அலுவலர் உங்களை அழைப்பார்.'},
  'shops_title': {'en': 'Agro shops', 'si': 'කෘෂි වෙළඳසැල්', 'ta': 'விவசாயக் கடைகள்'},
  'shops_none': {'en': 'No shops listed for this district yet.', 'si': 'මෙම දිස්ත්‍රික්කයේ තවම වෙළඳසැල් නැත.', 'ta': 'இந்த மாவட்டத்தில் இன்னும் கடைகள் இல்லை.'},
  'verified': {'en': 'Verified', 'si': 'තහවුරු කළ', 'ta': 'சரிபார்க்கப்பட்டது'},
  'map': {'en': 'Map', 'si': 'සිතියම', 'ta': 'வரைபடம்'},
  'open_website': {'en': 'Open the full website', 'si': 'සම්පූර්ණ වෙබ් අඩවිය විවෘත කරන්න', 'ta': 'முழு இணையதளத்தைத் திற'},
  'more_on_website': {'en': 'MORE ON THE WEBSITE', 'si': 'වෙබ් අඩවියේ තවත්', 'ta': 'இணையதளத்தில் மேலும்'},
  'web_pests': {'en': 'Pests', 'si': 'පළිබෝධ', 'ta': 'பூச்சிகள்'},
  'web_weeds': {'en': 'Weeds & weedicide calculator', 'si': 'වල් පැළෑටි සහ වල්නාශක ගණකය', 'ta': 'களைகள் மற்றும் களைக்கொல்லி கணிப்பான்'},
  'web_varieties': {'en': 'Paddy varieties', 'si': 'වී ප්‍රභේද', 'ta': 'நெல் வகைகள்'},
  'web_solutions': {'en': 'Farming guides', 'si': 'ගොවිතැන් මාර්ගෝපදේශ', 'ta': 'விவசாய வழிகாட்டிகள்'},
  'account_title': {'en': 'Account & privacy', 'si': 'ගිණුම සහ පෞද්ගලිකත්වය', 'ta': 'கணக்கு மற்றும் தனியுரிமை'},
  'privacy_title': {'en': 'Your data', 'si': 'ඔබේ දත්ත', 'ta': 'உங்கள் தரவு'},
  'privacy_text': {
    'en': 'AgriCare keeps your name, mobile number, district, leaf photos, scan results and treatment plans to give you advice and reminders. Your password is stored only as a secure hash. Your data is not sold or shared.',
    'si': 'උපදෙස් සහ මතක් කිරීම් ලබා දීමට AgriCare ඔබේ නම, ජංගම අංකය, දිස්ත්‍රික්කය, කොළ ඡායාරූප, ස්කෑන් ප්‍රතිඵල සහ ප්‍රතිකාර සැලසුම් තබා ගනී. ඔබේ මුරපදය ආරක්ෂිත hash එකක් ලෙස පමණක් ගබඩා කෙරේ. ඔබේ දත්ත විකුණනු හෝ බෙදා නොදෙනු ලැබේ.',
    'ta': 'ஆலோசனைகள் மற்றும் நினைவூட்டல்களை வழங்க AgriCare உங்கள் பெயர், கைபேசி எண், மாவட்டம், இலைப் படங்கள், ஸ்கேன் முடிவுகள் மற்றும் சிகிச்சைத் திட்டங்களை வைத்திருக்கிறது. உங்கள் கடவுச்சொல் பாதுகாப்பான hash ஆக மட்டுமே சேமிக்கப்படுகிறது. உங்கள் தரவு விற்கப்படுவதோ பகிரப்படுவதோ இல்லை.'
  },
  'delete_account': {'en': 'Delete my account', 'si': 'මගේ ගිණුම මකන්න', 'ta': 'என் கணக்கை நீக்கு'},
  'delete_text': {'en': 'This deletes your account, scans, photos and treatment plans. It cannot be undone. Enter your password to confirm.', 'si': 'මෙය ඔබේ ගිණුම, ස්කෑන්, ඡායාරූප සහ ප්‍රතිකාර සැලසුම් මකා දමයි. එය ආපසු හැරවිය නොහැක. තහවුරු කිරීමට මුරපදය ඇතුළත් කරන්න.', 'ta': 'இது உங்கள் கணக்கு, ஸ்கேன்கள், படங்கள் மற்றும் சிகிச்சைத் திட்டங்களை நீக்கும். இதைத் திரும்பப் பெற முடியாது. உறுதிப்படுத்த கடவுச்சொல்லை உள்ளிடவும்.'},
  'delete_confirm': {'en': 'Are you sure? All your data will be deleted.', 'si': 'ඔබට විශ්වාසද? ඔබේ සියලු දත්ත මැකෙනු ඇත.', 'ta': 'உறுதியாக உள்ளீர்களா? உங்கள் எல்லா தரவும் நீக்கப்படும்.'},
  'demo_result': {'en': 'SAMPLE result (no trained model on the server)', 'si': 'නියැදි ප්‍රතිඵලය (සේවාදායකයේ මාදිලිය නැත)', 'ta': 'மாதிரி முடிவு (சேவையகத்தில் மாதிரி இல்லை)'},
};

String tr(String key) {
  final t = _text[key];
  if (t == null) return key;
  return t[appLanguage.value] ?? t['en'] ?? key;
}

/// Picks the field for the current language from a database row, e.g. name_si, falling back to English.
String localField(Map<String, dynamic> row, String field) {
  final v = row['${field}_${appLanguage.value}'];
  if (v is String && v.trim().isNotEmpty) return v;
  return (row['${field}_en'] ?? '').toString();
}

/// Picks the current language from a {"en": ..., "si": ..., "ta": ...} map.
String localMap(dynamic m) {
  if (m is! Map) return '';
  return (m[appLanguage.value] ?? m['en'] ?? '').toString();
}
