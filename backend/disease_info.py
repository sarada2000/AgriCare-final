"""AgriCare - adds full information and day-by-day treatment plans for the 5 newer diseases:
bacterial leaf streak, bacterial panicle blight, downy mildew, rice hispa and panicle (neck) blast.

Put this file in the website's backend folder and run it once (server stopped):
    python add_disease_info.py

It updates, in one go:
  1. the database (diseases table): symptoms and treatment in English, Sinhala and Tamil
     - only rows that are still empty, so changes an officer already made are kept
  2. backend/data/diseases_seed.json  (the same text, for a fresh database)
  3. backend/data/plans.json          (treatment plans the server, reminders and the mobile app use)
  4. pages/treatment.js               (the website's disease details and treatment plans)
Running it twice does no harm.

Chemical doses are NOT filled in: the advice says "label dose". Add exact doses from the
Department of Agriculture in the Officer dashboard -> Disease information.
Please have the Sinhala and Tamil text checked by a native speaker.
"""
import json
import os
import sqlite3

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
MARK = "/* AgriCare: 5 more diseases (added by backend/add_disease_info.py) */"

D = {
    # ------------------------------------------------------------------ bacterial leaf streak
    "bacterial_leaf_streak": {
        "type": "bacterial", "swatch": "sw-blb", "sci": "Xanthomonas oryzae pv. oryzicola",
        "summary": {
            "en": "A bacterial disease that makes narrow, water-soaked streaks between the leaf veins. The streaks turn yellow-brown and join, and the leaves dry. It spreads with rain, wind and flood water.",
            "si": "පත්‍ර නාරටි අතර සිහින්, ජලයෙන් පෙඟුණු ඉරි ඇති කරන බැක්ටීරියා රෝගයකි. ඉරි කහ-දුඹුරු පැහැයට හැරී එකට එකතු වී කොළ වියළේ. වැසි, සුළඟ සහ ගංවතුර ජලය සමඟ පැතිරේ.",
            "ta": "இலை நரம்புகளுக்கு இடையே மெல்லிய, நீர் தோய்ந்த கோடுகளை உண்டாக்கும் பாக்டீரியா நோய். கோடுகள் மஞ்சள்-பழுப்பாக மாறி இணைந்து இலைகள் காய்கின்றன. மழை, காற்று, வெள்ள நீருடன் பரவும்.",
        },
        "symptoms": {
            "en": ["Narrow dark-green, water-soaked streaks between the leaf veins",
                   "Streaks turn yellow to orange-brown and join into larger dry patches",
                   "Small yellow-amber drops of bacterial ooze on the streaks in the morning"],
            "si": ["පත්‍ර නාරටි අතර සිහින් තද කොළ පැහැති, ජලයෙන් පෙඟුණු ඉරි",
                   "ඉරි කහ හෝ තැඹිලි-දුඹුරු පැහැයට හැරී විශාල වියළි පැල්ලම් ලෙස එකතු වේ",
                   "උදෑසන ඉරි මත කුඩා කහ-ඇම්බර් පැහැති බැක්ටීරියා බිඳිති"],
            "ta": ["இலை நரம்புகளுக்கு இடையே மெல்லிய அடர் பச்சை, நீர் தோய்ந்த கோடுகள்",
                   "கோடுகள் மஞ்சள் அல்லது ஆரஞ்சு-பழுப்பாக மாறி பெரிய காய்ந்த திட்டுகளாக இணையும்",
                   "காலையில் கோடுகளின் மேல் சிறிய மஞ்சள்-அம்பர் நிற பாக்டீரியா துளிகள்"],
        },
        "conditions": {
            "en": ["Warm, humid weather with rain and wind", "Too much nitrogen fertilizer", "Leaves wounded by storms or handling"],
            "si": ["වැසි සහ සුළඟ සහිත උණුසුම්, තෙත් කාලගුණය", "නයිට්‍රජන් පොහොර වැඩිපුර යෙදීම", "කුණාටු හෝ හැසිරවීම නිසා තුවාල වූ කොළ"],
            "ta": ["மழையும் காற்றும் உள்ள வெப்பமான, ஈரப்பதமான வானிலை", "அதிக நைதரசன் உரம்", "புயல் அல்லது கையாளுதலால் காயமடைந்த இலைகள்"],
        },
        "manage": {
            "en": ["Stop extra urea until the disease is under control",
                   "Drain the field for 3-4 days to slow the spread, then keep a shallow water level",
                   "Do not walk through the field when the leaves are wet",
                   "Remove and destroy badly affected plants and the weeds around the field",
                   "Sprays give little control; ask your agriculture instructor before spraying anything"],
            "si": ["රෝගය පාලනය වන තුරු අමතර යූරියා නොයොදන්න",
                   "පැතිරීම අඩු කිරීමට දින 3-4ක් කුඹුරේ ජලය බැස යවා, පසුව නොගැඹුරු ජල මට්ටමක් තබන්න",
                   "කොළ තෙත්ව ඇති විට කුඹුර හරහා ඇවිදින්න එපා",
                   "දරුණු ලෙස රෝගී වූ පැළ සහ කුඹුර වටා ඇති වල් පැළ ඉවත් කර විනාශ කරන්න",
                   "ඉසීම්වලින් ලැබෙන පාලනය අඩුයි; කිසිවක් ඉසීමට පෙර ඔබේ කෘෂිකර්ම උපදේශකගෙන් විමසන්න"],
            "ta": ["நோய் கட்டுப்படும் வரை கூடுதல் யூரியா இட வேண்டாம்",
                   "பரவலைக் குறைக்க 3-4 நாட்கள் வயல் நீரை வடித்து, பின்னர் குறைந்த நீர் மட்டத்தை வையுங்கள்",
                   "இலைகள் ஈரமாக இருக்கும்போது வயலுக்குள் நடக்க வேண்டாம்",
                   "கடுமையாகப் பாதிக்கப்பட்ட பயிர்களையும் வயலைச் சுற்றியுள்ள களைகளையும் அகற்றி அழியுங்கள்",
                   "தெளிப்புகள் குறைந்த பலனே தரும்; எதையும் தெளிக்கும் முன் உங்கள் விவசாயப் போதனாசிரியரிடம் கேளுங்கள்"],
        },
        "prevent": {
            "en": ["Use clean, certified seed of a resistant variety", "Apply nitrogen in split doses",
                   "Destroy stubble and volunteer rice after harvest", "Do not let water flow from an infected field into other fields"],
            "si": ["ප්‍රතිරෝධී ප්‍රභේදයක පිරිසිදු, සහතික කළ බීජ භාවිත කරන්න", "නයිට්‍රජන් කොටස් වශයෙන් යොදන්න",
                   "අස්වැන්නෙන් පසු ඉපනැලි සහ ස්වයං ලියලන වී විනාශ කරන්න", "රෝගී කුඹුරක ජලය වෙනත් කුඹුරුවලට ගලා යාමට ඉඩ නොදෙන්න"],
            "ta": ["எதிர்ப்புத் திறன் கொண்ட இனத்தின் சுத்தமான, சான்றளிக்கப்பட்ட விதையைப் பயன்படுத்துங்கள்", "நைதரசனைப் பிரித்து இடுங்கள்",
                   "அறுவடைக்குப் பின் அடிக்கட்டைகளையும் தானாக முளைக்கும் நெல்லையும் அழியுங்கள்", "பாதிக்கப்பட்ட வயலின் நீர் மற்ற வயல்களுக்குப் பாய விடாதீர்கள்"],
        },
        "plan": [
            (0, False, "Stop all urea. Drain the field and keep it drained for 3-4 days.",
             "සියලු යූරියා නවත්වන්න. කුඹුරේ ජලය බැස යවා දින 3-4ක් එසේ තබන්න.",
             "யூரியா இடுவதை முற்றாக நிறுத்துங்கள். வயல் நீரை வடித்து 3-4 நாட்கள் அப்படியே வையுங்கள்."),
            (1, False, "Remove badly affected plants and the weeds on the bunds. Do not walk in the field when the leaves are wet.",
             "දරුණු ලෙස රෝගී වූ පැළ සහ නියරවල වල් පැළ ඉවත් කරන්න. කොළ තෙත්ව ඇති විට කුඹුරේ ඇවිදින්න එපා.",
             "கடுமையாகப் பாதிக்கப்பட்ட பயிர்களையும் வரப்புகளிலுள்ள களைகளையும் அகற்றுங்கள். இலைகள் ஈரமாக இருக்கும்போது வயலில் நடக்க வேண்டாம்."),
            (4, True, "Bring back a shallow water level (2-3 cm). Are new streaks appearing? Scan a leaf again.",
             "නොගැඹුරු ජල මට්ටමක් (සෙ.මී. 2-3) නැවත ලබාදෙන්න. අලුත් ඉරි ඇති වෙනවාද? නැවත කොළයක් ස්කෑන් කරන්න.",
             "குறைந்த நீர் மட்டத்தை (2-3 செ.மீ.) மீண்டும் கொடுங்கள். புதிய கோடுகள் தோன்றுகின்றனவா? மீண்டும் ஒரு இலையை ஸ்கேன் செய்யுங்கள்."),
            (7, False, "If the disease keeps spreading, ask your agriculture instructor before using any spray.",
             "රෝගය දිගටම පැතිරේ නම්, කිසිදු ඉසීමක් භාවිත කිරීමට පෙර ඔබේ කෘෂිකර්ම උපදේශකගෙන් විමසන්න.",
             "நோய் தொடர்ந்து பரவினால், எந்தத் தெளிப்பையும் பயன்படுத்தும் முன் உங்கள் விவசாயப் போதனாசிரியரிடம் கேளுங்கள்."),
            (14, True, "Weekly field check, especially after rain and wind.",
             "සතිපතා කුඹුරු පරීක්ෂාව, විශේෂයෙන් වැසි සහ සුළඟින් පසු.",
             "வாராந்திர வயல் சோதனை, குறிப்பாக மழை மற்றும் காற்றுக்குப் பின்."),
        ],
    },
    # ------------------------------------------------------------------ bacterial panicle blight
    "bacterial_panicle_blight": {
        "type": "bacterial", "swatch": "sw-tungro", "sci": "Burkholderia glumae",
        "summary": {
            "en": "A seed-borne bacterial disease that attacks the grains at flowering. Grains turn straw to brown and stay empty, so the panicle stays upright. It is worst in hot, humid weather at flowering.",
            "si": "මල් පිපෙන කාලයේ ඇටවලට පහර දෙන, බීජ මගින් පැතිරෙන බැක්ටීරියා රෝගයකි. ඇට පිදුරු පැහැයේ සිට දුඹුරු පැහැයට හැරී හිස්ව පවතින බැවින් කරල කෙළින් සිටී. මල් පිපෙන විට උණුසුම්, තෙත් කාලගුණයේදී දරුණු වේ.",
            "ta": "பூக்கும் காலத்தில் மணிகளைத் தாக்கும், விதை மூலம் பரவும் பாக்டீரியா நோய். மணிகள் வைக்கோல் நிறத்திலிருந்து பழுப்பாக மாறி பதராக இருப்பதால் கதிர் நிமிர்ந்து நிற்கும். பூக்கும்போது வெப்பமான, ஈரப்பதமான வானிலையில் மோசமாகும்.",
        },
        "symptoms": {
            "en": ["Grains turn pale straw, grey or pink-brown, often the lower part of the grain first, with a dark brown line between the healthy and diseased part",
                   "Grains stay empty or partly filled, so the panicle stands upright",
                   "Diseased panicles appear in patches in the field"],
            "si": ["ඇට ලා පිදුරු, අළු හෝ රෝස-දුඹුරු පැහැයට හැරේ; බොහෝ විට ඇටයේ පහළ කොටස මුලින්ම, නිරෝගී සහ රෝගී කොටස් අතර තද දුඹුරු ඉරක් සමඟ",
                   "ඇට හිස් හෝ අර්ධ වශයෙන් පිරුණු නිසා කරල කෙළින් සිටී",
                   "රෝගී කරල් කුඹුරේ පැල්ලම් ලෙස දක්නට ලැබේ"],
            "ta": ["மணிகள் வெளிர் வைக்கோல், சாம்பல் அல்லது இளஞ்சிவப்பு-பழுப்பாக மாறும்; பெரும்பாலும் மணியின் கீழ்ப்பகுதி முதலில், நலமான பகுதிக்கும் நோயுற்ற பகுதிக்கும் இடையே அடர் பழுப்புக் கோட்டுடன்",
                   "மணிகள் பதராக அல்லது பாதி நிரம்பியதால் கதிர் நிமிர்ந்து நிற்கும்",
                   "நோயுற்ற கதிர்கள் வயலில் திட்டுகளாகத் தோன்றும்"],
        },
        "conditions": {
            "en": ["Very hot nights and humid weather at flowering", "Infected seed", "Too much nitrogen and dense planting"],
            "si": ["මල් පිපෙන විට ඉතා උණුසුම් රාත්‍රී සහ තෙත් කාලගුණය", "රෝගී බීජ", "නයිට්‍රජන් වැඩිපුර සහ ඝන වගාව"],
            "ta": ["பூக்கும்போது மிக வெப்பமான இரவுகளும் ஈரப்பதமான வானிலையும்", "நோயுற்ற விதை", "அதிக நைதரசனும் அடர்த்தியான நடவும்"],
        },
        "manage": {
            "en": ["No spray cures the grains once they are infected",
                   "Stop extra urea",
                   "Keep a steady water level; do not let the field dry out at flowering",
                   "Harvest the affected patches separately and do not keep their grain as seed"],
            "si": ["ඇට රෝගී වූ පසු ඒවා සුව කරන ඉසීමක් නැත",
                   "අමතර යූරියා නවත්වන්න",
                   "ස්ථාවර ජල මට්ටමක් තබන්න; මල් පිපෙන විට කුඹුර වියළීමට ඉඩ නොදෙන්න",
                   "රෝගී පැල්ලම් වෙනම අස්වනු නෙළා, ඒවායේ ඇට බීජ ලෙස තබා නොගන්න"],
            "ta": ["மணிகள் நோயுற்ற பின் அவற்றைக் குணப்படுத்தும் தெளிப்பு இல்லை",
                   "கூடுதல் யூரியாவை நிறுத்துங்கள்",
                   "நிலையான நீர் மட்டத்தை வையுங்கள்; பூக்கும்போது வயல் காய விடாதீர்கள்",
                   "பாதிக்கப்பட்ட திட்டுகளைத் தனியாக அறுவடை செய்து, அவற்றின் நெல்லை விதையாக வைக்காதீர்கள்"],
        },
        "prevent": {
            "en": ["Use clean, certified seed; never use seed from an infected field",
                   "Plant on time so that flowering does not fall in the hottest weeks",
                   "Apply nitrogen in split doses and use the recommended spacing",
                   "Destroy infected straw and stubble after harvest"],
            "si": ["පිරිසිදු, සහතික කළ බීජ භාවිත කරන්න; රෝගී කුඹුරක බීජ කිසිවිටෙක භාවිත නොකරන්න",
                   "මල් පිපීම වඩාත් උණුසුම් සති වලට නොවැටෙන ලෙස නියමිත වේලාවට වගා කරන්න",
                   "නයිට්‍රජන් කොටස් වශයෙන් යොදා නිර්දේශිත පරතරය භාවිත කරන්න",
                   "අස්වැන්නෙන් පසු රෝගී පිදුරු සහ ඉපනැලි විනාශ කරන්න"],
            "ta": ["சுத்தமான, சான்றளிக்கப்பட்ட விதையைப் பயன்படுத்துங்கள்; பாதிக்கப்பட்ட வயலின் விதையை ஒருபோதும் பயன்படுத்தாதீர்கள்",
                   "பூக்கும் காலம் மிக வெப்பமான வாரங்களில் வராதபடி சரியான நேரத்தில் நடுங்கள்",
                   "நைதரசனைப் பிரித்து இட்டு, பரிந்துரைக்கப்பட்ட இடைவெளியைப் பயன்படுத்துங்கள்",
                   "அறுவடைக்குப் பின் நோயுற்ற வைக்கோலையும் அடிக்கட்டைகளையும் அழியுங்கள்"],
        },
        "plan": [
            (0, False, "Stop all urea. Walk the field and mark the patches where panicles are pale or brown.",
             "සියලු යූරියා නවත්වන්න. කුඹුර පුරා ඇවිද කරල් ලා හෝ දුඹුරු පැහැ වූ පැල්ලම් සලකුණු කරන්න.",
             "யூரியா இடுவதை முற்றாக நிறுத்துங்கள். வயலில் நடந்து கதிர்கள் வெளிறிய அல்லது பழுப்பான திட்டுகளைக் குறியிடுங்கள்."),
            (1, False, "Keep a steady 2-5 cm water level. Do not let the field dry out while the crop is flowering.",
             "සෙ.මී. 2-5 ස්ථාවර ජල මට්ටමක් තබන්න. බෝගය මල් පිපෙන අතරතුර කුඹුර වියළීමට ඉඩ නොදෙන්න.",
             "2-5 செ.மீ. நிலையான நீர் மட்டத்தை வையுங்கள். பயிர் பூக்கும்போது வயல் காய விடாதீர்கள்."),
            (4, True, "Are more panicles turning pale or brown? Check the marked patches and scan again.",
             "තවත් කරල් ලා හෝ දුඹුරු පැහැයට හැරෙනවාද? සලකුණු කළ පැල්ලම් පරීක්ෂා කර නැවත ස්කෑන් කරන්න.",
             "மேலும் கதிர்கள் வெளிறி அல்லது பழுப்பாக மாறுகின்றனவா? குறியிட்ட திட்டுகளைச் சோதித்து மீண்டும் ஸ்கேன் செய்யுங்கள்."),
            (10, False, "Plan the harvest: cut the affected patches separately and do not keep this grain as seed.",
             "අස්වැන්න සැලසුම් කරන්න: රෝගී පැල්ලම් වෙනම කපා, මෙම ඇට බීජ ලෙස තබා නොගන්න.",
             "அறுவடையைத் திட்டமிடுங்கள்: பாதிக்கப்பட்ட திட்டுகளைத் தனியாக அறுத்து, இந்த நெல்லை விதையாக வைக்காதீர்கள்."),
            (14, True, "Weekly check until harvest. After harvest, destroy the infected straw.",
             "අස්වැන්න තෙක් සතිපතා පරීක්ෂාව. අස්වැන්නෙන් පසු රෝගී පිදුරු විනාශ කරන්න.",
             "அறுவடை வரை வாராந்திர சோதனை. அறுவடைக்குப் பின் நோயுற்ற வைக்கோலை அழியுங்கள்."),
        ],
    },
    # ------------------------------------------------------------------ downy mildew
    "downy_mildew": {
        "type": "fungal", "swatch": "sw-tungro", "sci": "Sclerophthora macrospora",
        "summary": {
            "en": "A fungus-like disease that follows flooding. Plants become stunted with thick, twisted leaves and yellow-white streaks, and the panicles are deformed or do not come out.",
            "si": "ගංවතුරෙන් පසු ඇති වන දිලීර වැනි රෝගයකි. පැළ කුරු වී, ඝන ඇඹරුණු කොළ සහ කහ-සුදු ඉරි ඇති වන අතර කරල් විකෘති වේ හෝ පිට නොවේ.",
            "ta": "வெள்ளத்தைத் தொடர்ந்து வரும் பூஞ்சை போன்ற நோய். பயிர்கள் குட்டையாகி, தடித்த முறுக்கிய இலைகளும் மஞ்சள்-வெள்ளைக் கோடுகளும் தோன்றும்; கதிர்கள் உருமாறும் அல்லது வெளிவராது.",
        },
        "symptoms": {
            "en": ["Stunted plants with too many thin tillers",
                   "Thick, twisted leaves with pale yellow-white streaks",
                   "Deformed panicles that stay inside the leaf sheath"],
            "si": ["සිහින් පැළ කඳන් බොහෝමයක් සහිත කුරු පැළ",
                   "ලා කහ-සුදු ඉරි සහිත ඝන, ඇඹරුණු කොළ",
                   "පත්‍ර කොපුව තුළම රැඳී සිටින විකෘති කරල්"],
            "ta": ["அதிக மெல்லிய தூர்களுடன் குட்டையான பயிர்கள்",
                   "வெளிர் மஞ்சள்-வெள்ளைக் கோடுகளுடன் தடித்த, முறுக்கிய இலைகள்",
                   "இலை உறைக்குள்ளேயே தங்கும் உருமாறிய கதிர்கள்"],
        },
        "conditions": {
            "en": ["Fields flooded or under deep water for days, especially at the seedling stage", "Grass weeds that carry the disease around the field"],
            "si": ["විශේෂයෙන් පැළ අවධියේදී දින ගණනක් ගංවතුරට හෝ ගැඹුරු ජලයට යට වූ කුඹුරු", "කුඹුර වටා රෝගය රැගෙන යන තෘණ වල් පැළ"],
            "ta": ["குறிப்பாக நாற்றுப் பருவத்தில் பல நாட்கள் வெள்ளத்தில் அல்லது ஆழமான நீரில் மூழ்கிய வயல்கள்", "வயலைச் சுற்றி நோயைக் கொண்டு செல்லும் புல் களைகள்"],
        },
        "manage": {
            "en": ["Drain the flood water as soon as possible",
                   "Pull out and destroy badly affected plants; do not leave them in the water",
                   "Remove grass weeds on the bunds and in the channels",
                   "Ask your agriculture instructor before using any fungicide"],
            "si": ["හැකි ඉක්මනින් ගංවතුර ජලය බැස යවන්න",
                   "දරුණු ලෙස රෝගී පැළ ගලවා විනාශ කරන්න; ඒවා ජලයේ තබන්න එපා",
                   "නියරවල සහ ඇළ මාර්ගවල තෘණ වල් පැළ ඉවත් කරන්න",
                   "කිසිදු දිලීර නාශකයක් භාවිත කිරීමට පෙර ඔබේ කෘෂිකර්ම උපදේශකගෙන් විමසන්න"],
            "ta": ["வெள்ள நீரை விரைவில் வடியுங்கள்",
                   "கடுமையாகப் பாதிக்கப்பட்ட பயிர்களைப் பிடுங்கி அழியுங்கள்; அவற்றை நீரில் விடாதீர்கள்",
                   "வரப்புகளிலும் வாய்க்கால்களிலும் உள்ள புல் களைகளை அகற்றுங்கள்",
                   "எந்தப் பூஞ்சைக்கொல்லியையும் பயன்படுத்தும் முன் உங்கள் விவசாயப் போதனாசிரியரிடம் கேளுங்கள்"],
        },
        "prevent": {
            "en": ["Level the land and keep the drains clear so seedlings are not under water",
                   "Avoid deep water in the first weeks after planting",
                   "Control grass weeds around the field",
                   "Use clean, certified seed"],
            "si": ["පැළ ජලයට යට නොවන ලෙස බිම සමතලා කර කාණු පිරිසිදුව තබන්න",
                   "සිටුවීමෙන් පසු මුල් සති වල ගැඹුරු ජලය වළක්වන්න",
                   "කුඹුර වටා තෘණ වල් පැළ පාලනය කරන්න",
                   "පිරිසිදු, සහතික කළ බීජ භාවිත කරන්න"],
            "ta": ["நாற்றுகள் நீரில் மூழ்காதபடி நிலத்தைச் சமன்செய்து வடிகால்களைச் சுத்தமாக வையுங்கள்",
                   "நட்ட பின் முதல் வாரங்களில் ஆழமான நீரைத் தவிருங்கள்",
                   "வயலைச் சுற்றியுள்ள புல் களைகளைக் கட்டுப்படுத்துங்கள்",
                   "சுத்தமான, சான்றளிக்கப்பட்ட விதையைப் பயன்படுத்துங்கள்"],
        },
        "plan": [
            (0, False, "Drain the standing water from the field. Mark the plants with twisted, streaked leaves.",
             "කුඹුරේ රැඳී ඇති ජලය බැස යවන්න. ඇඹරුණු, ඉරි සහිත කොළ ඇති පැළ සලකුණු කරන්න.",
             "வயலில் தேங்கியுள்ள நீரை வடியுங்கள். முறுக்கிய, கோடுகள் உள்ள இலைகளுடைய பயிர்களைக் குறியிடுங்கள்."),
            (1, False, "Pull out and destroy the badly affected plants. Clear grass weeds on the bunds and channels.",
             "දරුණු ලෙස රෝගී පැළ ගලවා විනාශ කරන්න. නියර සහ ඇළ මාර්ගවල තෘණ වල් පැළ ඉවත් කරන්න.",
             "கடுமையாகப் பாதிக்கப்பட்ட பயிர்களைப் பிடுங்கி அழியுங்கள். வரப்புகளிலும் வாய்க்கால்களிலும் உள்ள புல் களைகளை அகற்றுங்கள்."),
            (4, True, "Are new plants showing twisted leaves? Check the field and scan a leaf again.",
             "අලුත් පැළවල ඇඹරුණු කොළ පෙනෙනවාද? කුඹුර පරීක්ෂා කර නැවත කොළයක් ස්කෑන් කරන්න.",
             "புதிய பயிர்களில் முறுக்கிய இலைகள் தெரிகின்றனவா? வயலைச் சோதித்து மீண்டும் ஒரு இலையை ஸ்கேன் செய்யுங்கள்."),
            (7, False, "Bring back a shallow water level (2-3 cm) and keep the drains clear.",
             "නොගැඹුරු ජල මට්ටමක් (සෙ.මී. 2-3) නැවත ලබා දී කාණු පිරිසිදුව තබන්න.",
             "குறைந்த நீர் மட்டத்தை (2-3 செ.மீ.) மீண்டும் கொடுத்து வடிகால்களைச் சுத்தமாக வையுங்கள்."),
            (14, True, "Weekly check, especially after heavy rain or flooding.",
             "සතිපතා පරීක්ෂාව, විශේෂයෙන් තද වැසි හෝ ගංවතුරෙන් පසු.",
             "வாராந்திர சோதனை, குறிப்பாக கனமழை அல்லது வெள்ளத்திற்குப் பின்."),
        ],
    },
    # ------------------------------------------------------------------ rice hispa
    "hispa": {
        "type": "insect", "swatch": "sw-brown", "sci": "Dicladispa armigera",
        "summary": {
            "en": "A small dark blue-black spiny beetle. Adults scrape the leaf surface and leave white parallel streaks; the grubs tunnel inside the leaves, which turn white and dry.",
            "si": "කුඩා තද නිල්-කළු කටු සහිත කුරුමිණියෙකි. වැඩිහිටි කෘමීන් කොළ මතුපිට සූරා සුදු සමාන්තර ඉරි ඉතිරි කරයි; කීටයන් කොළ ඇතුළත උමං හාරන නිසා කොළ සුදු වී වියළේ.",
            "ta": "சிறிய அடர் நீல-கருப்பு முள் வண்டு. முதிர்ந்த வண்டுகள் இலையின் மேற்பரப்பைச் சுரண்டி வெள்ளை இணைக் கோடுகளை விட்டுச் செல்லும்; புழுக்கள் இலைகளுக்குள் சுரங்கம் தோண்டுவதால் இலைகள் வெள்ளையாகிக் காயும்.",
        },
        "symptoms": {
            "en": ["White parallel streaks on the leaves where adults have scraped",
                   "Irregular white blotches where grubs tunnel inside the leaf",
                   "Small dark spiny beetles on the leaves; badly attacked fields look white"],
            "si": ["වැඩිහිටි කෘමීන් සූරා ඇති තැන්වල කොළ මත සුදු සමාන්තර ඉරි",
                   "කීටයන් කොළය ඇතුළත උමං හාරන තැන්වල අක්‍රමවත් සුදු පැල්ලම්",
                   "කොළ මත කුඩා තද පැහැති කටු කුරුමිණියන්; දරුණු ලෙස පහර කෑ කුඹුරු සුදු පැහැයෙන් පෙනේ"],
            "ta": ["முதிர்ந்த வண்டுகள் சுரண்டிய இடங்களில் இலைகளில் வெள்ளை இணைக் கோடுகள்",
                   "புழுக்கள் இலைக்குள் சுரங்கம் தோண்டிய இடங்களில் ஒழுங்கற்ற வெள்ளைத் திட்டுகள்",
                   "இலைகளில் சிறிய கருமையான முள் வண்டுகள்; கடுமையாகத் தாக்கப்பட்ட வயல்கள் வெள்ளையாகத் தெரியும்"],
        },
        "conditions": {
            "en": ["Too much nitrogen and lush growth", "Grass weeds around the field", "Rainy periods followed by dry weather"],
            "si": ["නයිට්‍රජන් වැඩිපුර සහ අධික වර්ධනය", "කුඹුර වටා තෘණ වල් පැළ", "වැසි කාලයකින් පසු වියළි කාලගුණය"],
            "ta": ["அதிக நைதரசனும் செழிப்பான வளர்ச்சியும்", "வயலைச் சுற்றியுள்ள புல் களைகள்", "மழைக் காலத்தைத் தொடர்ந்து வறண்ட வானிலை"],
        },
        "manage": {
            "en": ["Stop extra urea",
                   "Cut and destroy the tips of attacked leaves, which hold the eggs and grubs",
                   "Catch adult beetles with a sweep net in the morning",
                   "If many leaves are damaged, spray an insecticide recommended for hispa at the label dose; ask your agriculture instructor which one"],
            "si": ["අමතර යූරියා නවත්වන්න",
                   "බිත්තර සහ කීටයන් ඇති, පහර කෑ කොළවල අග කපා විනාශ කරන්න",
                   "උදෑසන දැලක් (sweep net) මගින් වැඩිහිටි කුරුමිණියන් අල්ලන්න",
                   "කොළ බොහොමයක් හානි වී ඇත්නම්, හිස්පා සඳහා නිර්දේශිත කෘමිනාශකයක් ලේබලයේ මාත්‍රාවෙන් ඉසින්න; කුමක්දැයි ඔබේ කෘෂිකර්ම උපදේශකගෙන් විමසන්න"],
            "ta": ["கூடுதல் யூரியாவை நிறுத்துங்கள்",
                   "முட்டைகளும் புழுக்களும் உள்ள தாக்கப்பட்ட இலைகளின் நுனிகளை வெட்டி அழியுங்கள்",
                   "காலையில் வலை (sweep net) மூலம் முதிர்ந்த வண்டுகளைப் பிடியுங்கள்",
                   "பல இலைகள் சேதமடைந்தால், ஹிஸ்பாவுக்குப் பரிந்துரைக்கப்பட்ட பூச்சிக்கொல்லியை லேபிள் அளவில் தெளியுங்கள்; எது என்று உங்கள் விவசாயப் போதனாசிரியரிடம் கேளுங்கள்"],
        },
        "prevent": {
            "en": ["Before transplanting, cut the tips of the seedling leaves to remove eggs",
                   "Apply nitrogen in split doses",
                   "Remove grass weeds around the field",
                   "Check the leaves every week from early tillering"],
            "si": ["පැළ සිටුවීමට පෙර, බිත්තර ඉවත් කිරීමට පැළ කොළවල අග කපන්න",
                   "නයිට්‍රජන් කොටස් වශයෙන් යොදන්න",
                   "කුඹුර වටා තෘණ වල් පැළ ඉවත් කරන්න",
                   "මුල් පැළ දැමීමේ අවධියේ සිට සෑම සතියකම කොළ පරීක්ෂා කරන්න"],
            "ta": ["நடவுக்கு முன், முட்டைகளை அகற்ற நாற்று இலைகளின் நுனிகளை வெட்டுங்கள்",
                   "நைதரசனைப் பிரித்து இடுங்கள்",
                   "வயலைச் சுற்றியுள்ள புல் களைகளை அகற்றுங்கள்",
                   "தூர் கட்டும் ஆரம்பத்திலிருந்து ஒவ்வொரு வாரமும் இலைகளைச் சோதியுங்கள்"],
        },
        "plan": [
            (0, False, "Stop extra urea. Look for small dark spiny beetles and white streaks on the leaves.",
             "අමතර යූරියා නවත්වන්න. කොළ මත කුඩා තද පැහැති කටු කුරුමිණියන් සහ සුදු ඉරි සොයන්න.",
             "கூடுதல் யூரியாவை நிறுத்துங்கள். இலைகளில் சிறிய கருமையான முள் வண்டுகளையும் வெள்ளைக் கோடுகளையும் தேடுங்கள்."),
            (1, False, "Cut and destroy the tips of attacked leaves. In the morning, catch adult beetles with a sweep net.",
             "පහර කෑ කොළවල අග කපා විනාශ කරන්න. උදෑසන දැලක් මගින් වැඩිහිටි කුරුමිණියන් අල්ලන්න.",
             "தாக்கப்பட்ட இலைகளின் நுனிகளை வெட்டி அழியுங்கள். காலையில் வலை மூலம் முதிர்ந்த வண்டுகளைப் பிடியுங்கள்."),
            (3, True, "Count damaged leaves in 10 places in the field. Are there still many beetles?",
             "කුඹුරේ ස්ථාන 10ක හානි වූ කොළ ගණන් කරන්න. තවමත් කුරුමිණියන් බොහෝ සිටිනවාද?",
             "வயலில் 10 இடங்களில் சேதமடைந்த இலைகளை எண்ணுங்கள். இன்னும் பல வண்டுகள் உள்ளனவா?"),
            (4, False, "If many leaves are still being damaged, spray an insecticide recommended for hispa at the label dose. Wear gloves and a mask.",
             "තවමත් කොළ බොහොමයක් හානි වේ නම්, හිස්පා සඳහා නිර්දේශිත කෘමිනාශකයක් ලේබලයේ මාත්‍රාවෙන් ඉසින්න. අත්වැසුම් සහ මුහුණු ආවරණ පළඳින්න.",
             "இன்னும் பல இலைகள் சேதமடைந்தால், ஹிஸ்பாவுக்குப் பரிந்துரைக்கப்பட்ட பூச்சிக்கொல்லியை லேபிள் அளவில் தெளியுங்கள். கையுறை, முகக்கவசம் அணியுங்கள்."),
            (10, True, "Check again and scan a leaf. Remove grass weeds on the bunds.",
             "නැවත පරීක්ෂා කර කොළයක් ස්කෑන් කරන්න. නියරවල තෘණ වල් පැළ ඉවත් කරන්න.",
             "மீண்டும் சோதித்து ஒரு இலையை ஸ்கேன் செய்யுங்கள். வரப்புகளிலுள்ள புல் களைகளை அகற்றுங்கள்."),
        ],
    },
    # ------------------------------------------------------------------ panicle (neck) blast
    "rice_panicle_blast": {
        "type": "fungal", "swatch": "sw-blast", "sci": "Magnaporthe oryzae (Pyricularia oryzae)",
        "summary": {
            "en": "The blast fungus attacks the neck of the panicle. The neck turns grey-brown to black and the panicle breaks or hangs down with white, empty grains.",
            "si": "පාළු දිලීරය කරලේ බෙල්ලට පහර දෙයි. බෙල්ල අළු-දුඹුරු සිට කළු පැහැයට හැරී, කරල කැඩී යයි හෝ සුදු, හිස් ඇට සමඟ පහළට එල්ලා වැටේ.",
            "ta": "குலை நோய்ப் பூஞ்சை கதிரின் கழுத்தைத் தாக்கும். கழுத்து சாம்பல்-பழுப்பிலிருந்து கருப்பாக மாறி, கதிர் உடைந்து அல்லது வெள்ளைப் பதர் மணிகளுடன் தொங்கும்.",
        },
        "symptoms": {
            "en": ["Grey-brown to black rot on the neck just below the panicle",
                   "The panicle breaks at the neck or hangs down",
                   "Grains are white and empty (whiteheads); spots also appear on the panicle branches"],
            "si": ["කරලට පහළින් බෙල්ලේ අළු-දුඹුරු සිට කළු පැහැති කුණු වීම",
                   "කරල බෙල්ලෙන් කැඩී යයි හෝ පහළට එල්ලා වැටේ",
                   "ඇට සුදු සහ හිස්ය (සුදු කරල්); කරලේ අතුවලද පුල්ලි ඇති වේ"],
            "ta": ["கதிருக்குச் சற்றுக் கீழே கழுத்தில் சாம்பல்-பழுப்பிலிருந்து கருப்பு அழுகல்",
                   "கதிர் கழுத்தில் உடைகிறது அல்லது தொங்குகிறது",
                   "மணிகள் வெள்ளையாகவும் பதராகவும் இருக்கும் (வெண்கதிர்); கதிர்க் கிளைகளிலும் புள்ளிகள் தோன்றும்"],
        },
        "conditions": {
            "en": ["Cool nights, dew and high humidity at heading", "Too much nitrogen", "Leaf blast earlier in the season", "Susceptible varieties"],
            "si": ["කරල් පිටවන විට සීතල රාත්‍රී, පිනි සහ ඉහළ ආර්ද්‍රතාව", "නයිට්‍රජන් වැඩිපුර", "කන්නයේ කලින් ඇති වූ කොළ පාළුව", "රෝගයට ලක්විය හැකි ප්‍රභේද"],
            "ta": ["கதிர் வரும்போது குளிர்ந்த இரவுகள், பனி, அதிக ஈரப்பதம்", "அதிக நைதரசன்", "பருவத்தின் முன்பகுதியில் இலைக் குலை நோய்", "நோய்க்கு எளிதில் இலக்காகும் இனங்கள்"],
        },
        "manage": {
            "en": ["Stop extra urea",
                   "When the panicles are coming out, spray the recommended fungicide such as tricyclazole at the label dose",
                   "A second spray about 10 days later protects late panicles",
                   "Wear gloves and a mask when spraying"],
            "si": ["අමතර යූරියා නවත්වන්න",
                   "කරල් පිටවන විට, ට්‍රයිසයික්ලසෝල් වැනි නිර්දේශිත දිලීර නාශකය ලේබලයේ මාත්‍රාවෙන් ඉසින්න",
                   "දින 10කට පමණ පසු දෙවන ඉසීමකින් පමා වී එන කරල් ආරක්ෂා වේ",
                   "ඉසින විට අත්වැසුම් සහ මුහුණු ආවරණ පළඳින්න"],
            "ta": ["கூடுதல் யூரியாவை நிறுத்துங்கள்",
                   "கதிர்கள் வெளிவரும்போது, ட்ரைசைக்ளசோல் போன்ற பரிந்துரைக்கப்பட்ட பூஞ்சைக்கொல்லியை லேபிள் அளவில் தெளியுங்கள்",
                   "சுமார் 10 நாட்களுக்குப் பின் இரண்டாவது தெளிப்பு தாமதமாக வரும் கதிர்களைப் பாதுகாக்கும்",
                   "தெளிக்கும்போது கையுறை, முகக்கவசம் அணியுங்கள்"],
        },
        "prevent": {
            "en": ["Grow a blast-resistant variety recommended for your area",
                   "Apply nitrogen in split doses; no extra urea at panicle start",
                   "Control leaf blast early in the season",
                   "Destroy infected straw after harvest"],
            "si": ["ඔබේ ප්‍රදේශයට නිර්දේශිත පාළු ප්‍රතිරෝධී ප්‍රභේදයක් වගා කරන්න",
                   "නයිට්‍රජන් කොටස් වශයෙන් යොදන්න; කරල් හටගන්නා විට අමතර යූරියා නොයොදන්න",
                   "කන්නයේ මුලදීම කොළ පාළුව පාලනය කරන්න",
                   "අස්වැන්නෙන් පසු රෝගී පිදුරු විනාශ කරන්න"],
            "ta": ["உங்கள் பகுதிக்குப் பரிந்துரைக்கப்பட்ட குலை நோய் எதிர்ப்பு இனத்தைப் பயிரிடுங்கள்",
                   "நைதரசனைப் பிரித்து இடுங்கள்; கதிர் உருவாகும்போது கூடுதல் யூரியா வேண்டாம்",
                   "பருவத்தின் ஆரம்பத்திலேயே இலைக் குலை நோயைக் கட்டுப்படுத்துங்கள்",
                   "அறுவடைக்குப் பின் நோயுற்ற வைக்கோலை அழியுங்கள்"],
        },
        "plan": [
            (0, False, "Stop all urea. Check the necks of the panicles for grey or black rot.",
             "සියලු යූරියා නවත්වන්න. කරල්වල බෙල්ලේ අළු හෝ කළු කුණු වීම් ඇත්දැයි පරීක්ෂා කරන්න.",
             "யூரியா இடுவதை முற்றாக நிறுத்துங்கள். கதிர்களின் கழுத்தில் சாம்பல் அல்லது கருப்பு அழுகல் உள்ளதா எனச் சோதியுங்கள்."),
            (1, False, "Spray the recommended fungicide, such as tricyclazole, in the morning at the label dose. Wear gloves and a mask.",
             "උදෑසන ට්‍රයිසයික්ලසෝල් වැනි නිර්දේශිත දිලීර නාශකය ලේබලයේ මාත්‍රාවෙන් ඉසින්න. අත්වැසුම් සහ මුහුණු ආවරණ පළඳින්න.",
             "காலையில் ட்ரைசைக்ளசோல் போன்ற பரிந்துரைக்கப்பட்ட பூஞ்சைக்கொல்லியை லேபிள் அளவில் தெளியுங்கள். கையுறை, முகக்கவசம் அணியுங்கள்."),
            (4, True, "Check the new panicles for black necks and scan again.",
             "අලුත් කරල්වල කළු බෙල්ල ඇත්දැයි පරීක්ෂා කර නැවත ස්කෑන් කරන්න.",
             "புதிய கதிர்களில் கருப்புக் கழுத்து உள்ளதா எனச் சோதித்து மீண்டும் ஸ்கேன் செய்யுங்கள்."),
            (10, False, "If the disease is still spreading, spray a second time at the label dose to protect the late panicles.",
             "රෝගය තවමත් පැතිරේ නම්, පමා වී එන කරල් ආරක්ෂා කිරීමට ලේබලයේ මාත්‍රාවෙන් දෙවන වරට ඉසින්න.",
             "நோய் இன்னும் பரவினால், தாமதமாக வரும் கதிர்களைப் பாதுகாக்க லேபிள் அளவில் இரண்டாவது முறை தெளியுங்கள்."),
            (14, True, "Weekly check until harvest. After harvest, destroy the infected straw.",
             "අස්වැන්න තෙක් සතිපතා පරීක්ෂාව. අස්වැන්නෙන් පසු රෝගී පිදුරු විනාශ කරන්න.",
             "அறுவடை வரை வாராந்திர சோதனை. அறுவடைக்குப் பின் நோயுற்ற வைக்கோலை அழியுங்கள்."),
        ],
    },
}

LANGS = ("en", "si", "ta")


def plan_steps(d):
    return [{"day": day, "check": check, "text": {"en": en, "si": si, "ta": ta}} for day, check, en, si, ta in d["plan"]]


def db_text(d, lang):
    return {
        "symptoms": "\n".join(d["symptoms"][lang]),
        "treatment": "\n".join(d["manage"][lang] + d["prevent"][lang]),
    }


def is_empty(row):
    sym = (row.get("symptoms_en") or "").strip()
    tre = (row.get("treatment_en") or "").strip()
    return not sym or tre.startswith("Not yet in the AgriCare library")


def read_env():
    env = {}
    path = os.path.join(HERE, ".env")
    if os.path.exists(path):
        for line in open(path, encoding="utf-8"):
            if "=" in line and not line.strip().startswith("#"):
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip()
    return env


def update_database():
    path = read_env().get("DATABASE") or os.path.join(HERE, "instance", "agricare.db")
    if not os.path.isabs(path):
        path = os.path.join(HERE, path)
    if not os.path.exists(path):
        print("  database not found at", path, "- skipped (start the server once, then run this again)")
        return
    con = sqlite3.connect(path)
    con.row_factory = sqlite3.Row
    done = []
    for did, d in D.items():
        r = con.execute("SELECT * FROM diseases WHERE id = ?", (did,)).fetchone()
        if r is None:
            print("  not in the database:", did, "(run seed_diseases.py first)")
            continue
        if not is_empty(dict(r)):
            print("  kept the officer's text for", did)
            continue
        vals = {}
        for lang in LANGS:
            t = db_text(d, lang)
            vals["symptoms_" + lang] = t["symptoms"]
            vals["treatment_" + lang] = t["treatment"]
        sets = ", ".join(k + " = ?" for k in vals)
        con.execute(f"UPDATE diseases SET {sets}, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?",
                    (*vals.values(), did))
        done.append(did)
    con.commit()
    con.close()
    print("  database updated:", ", ".join(done) or "nothing to change")


def update_seed():
    path = os.path.join(HERE, "data", "diseases_seed.json")
    if not os.path.exists(path):
        print("  diseases_seed.json not found - skipped")
        return
    seed = json.load(open(path, encoding="utf-8"))
    for row in seed:
        d = D.get(row.get("id"))
        if d and is_empty(row):
            for lang in LANGS:
                t = db_text(d, lang)
                row["symptoms_" + lang] = t["symptoms"]
                row["treatment_" + lang] = t["treatment"]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(seed, f, ensure_ascii=False, indent=1)
    print("  diseases_seed.json updated")


def update_plans_json():
    path = os.path.join(HERE, "data", "plans.json")
    plans = json.load(open(path, encoding="utf-8"))
    seed_path = os.path.join(HERE, "data", "diseases_seed.json")
    names = {}
    if os.path.exists(seed_path):
        for row in json.load(open(seed_path, encoding="utf-8")):
            names[row["id"]] = {"en": row["name_en"], "si": row["name_si"], "ta": row["name_ta"]}
    for did, d in D.items():
        plans[did] = {"name": names.get(did, {"en": did.replace("_", " ").title()}), "type": d["type"], "steps": plan_steps(d)}
    with open(path, "w", encoding="utf-8") as f:
        json.dump(plans, f, ensure_ascii=False, indent=1)
    print("  plans.json updated: now", len(plans), "plans")


def update_treatment_js():
    path = os.path.join(SITE, "pages", "treatment.js")
    js = open(path, encoding="utf-8").read()
    if MARK in js:
        js = js[:js.index(MARK)].rstrip() + "\n"          # replace the old block
    more = {}
    for did, d in D.items():
        more[did] = {
            "sci": d["sci"], "type": d["type"], "swatch": d["swatch"], "summary": d["summary"],
            "en": {k: d[k]["en"] for k in ("symptoms", "conditions", "manage", "prevent")},
            "si": {k: d[k]["si"] for k in ("symptoms", "conditions", "manage", "prevent")},
            "ta": {k: d[k]["ta"] for k in ("symptoms", "conditions", "manage", "prevent")},
            "plan": [dict(s, check=s["check"]) for s in plan_steps(d)],
        }
    block = MARK + """
(function () {
    const MORE = """ + json.dumps(more, ensure_ascii=False) + """;
    Object.keys(MORE).forEach(id => {
        const m = MORE[id];
        if (typeof DISEASES !== "undefined" && !DISEASES.find(d => d.id === id)) {
            const name = id.replace(/_/g, " ").replace(/\\b\\w/g, c => c.toUpperCase());
            DISEASES.push({ id, sci: m.sci, type: m.type, swatch: m.swatch, name: { en: name, si: name, ta: name },
                summary: m.summary, symptoms: m.en.symptoms, conditions: m.en.conditions, manage: m.en.manage, prevent: m.en.prevent });
        }
        if (typeof CONTENT_I18N !== "undefined") {
            ["si", "ta"].forEach(l => { if (CONTENT_I18N[l]) CONTENT_I18N[l][id] = Object.assign({}, m[l], CONTENT_I18N[l][id] || {}); });
        }
        TREATMENT_PLANS[id] = m.plan;
    });
})();
"""
    with open(path, "w", encoding="utf-8") as f:
        f.write(js + "\n" + block)
    print("  pages/treatment.js updated")


def update_disease_names_in_js():
    """Use the database names (e.g. 'Panicle (Neck) Blast') in the website as well."""
    path = os.path.join(SITE, "pages", "treatment.js")
    seed_path = os.path.join(HERE, "data", "diseases_seed.json")
    if not os.path.exists(seed_path):
        return
    names = {r["id"]: {"en": r["name_en"], "si": r["name_si"], "ta": r["name_ta"]}
             for r in json.load(open(seed_path, encoding="utf-8")) if r["id"] in D}
    js = open(path, encoding="utf-8").read()
    js = js.replace(MARK + "\n(function () {",
                    MARK + "\n(function () {\n    const NAMES = " + json.dumps(names, ensure_ascii=False) + ";", 1)
    js = js.replace("name: { en: name, si: name, ta: name },", "name: NAMES[id] || { en: name, si: name, ta: name },", 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(js)


if __name__ == "__main__":
    print("AgriCare: adding information and treatment plans for", len(D), "diseases")
    update_database()
    update_seed()
    update_plans_json()
    update_treatment_js()
    update_disease_names_in_js()
    print("Done. Start the server again (python app.py) and press Ctrl+F5 in the browser.")
