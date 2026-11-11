/* AgriCare – translations + shared helpers
   Loaded by every page. Add a key here, then put data-i18n="key" on any element.
   Missing Sinhala/Tamil keys fall back to English automatically. */

const translations = {
    en: {
        // shared
        logo_sub: "Intelligent Solutions",
        nav_home: "Home",
        nav_about: "About",
        nav_diseases: "Diseases",
        nav_pests: "Pests",
        nav_scan: "Scan", nav_weather: "Weather", nav_varieties: "Varieties", nav_crop: "My Crop", menu: "Menu",
        home_tiles: "What do you need today?",
        tile_scan: "Photo of a sick leaf – get the disease and treatment",
        tile_weather: "Rain, heat and wind – with advice for spraying and water",
        tile_varieties: "Best paddy varieties for your district",
        tile_crop: "Your crop's stage and this week's work",
        tile_diseases: "Signs and treatment of paddy diseases",
        tile_pests: "Insects, rats, birds, elephants – how to stop them",
        tile_monitor: "Your treatment steps and alarms",
        tile_shops: "Medicine shops near you",
        nav_solutions: "Solutions",
        nav_team: "Team",
        nav_logout: "Log Out",
        footer_text: "AgriCare · Final Year Project",
        footer_hotline: "Your digital agriculture officer",

        // home
        hero_title_1: "Protect Your",
        hero_title_2: "Harvest with AI",
        hero_desc: "Take a photo of a sick paddy leaf, find the disease, and get a complete treatment plan in your own language. Built by students, designed for farmers.",
        btn_scan: "📸 Scan Now",
        btn_learn: "📚 Learn More",
        feat_1_title: "🗣️ 3 languages",
        feat_1_desc: "English, සිංහල and தமிழ், with voice.",
        feat_2_title: "🩺 Full treatment",
        feat_2_desc: "Step-by-step plans with alarms.",
        feat_3_title: "🌱 Free to use",
        feat_3_desc: "No cost for farmers.",
        mobile_edition: "Mobile Edition",
        btn_scan_leaf: "Scan Leaf",
        how_eyebrow: "How it works",
        how_title: "From a leaf photo to a treatment plan",
        how_1_t: "Take a photo",
        how_1_d: "Photograph one affected paddy leaf in daylight, close up and in focus.",
        how_2_t: "AI checks the leaf",
        how_2_d: "Our model, trained on labelled paddy leaf photos, checks the leaf.",
        how_3_t: "Get the treatment",
        how_3_d: "See the likely disease, how sure the model is, and what to do next.",
        diseases_eyebrow: "Disease library",
        diseases_title: "10 common paddy diseases and pests in Sri Lanka",
        diseases_cta: "Open the library",

        // chatbot
        chat_header: "AgriCare Assistant",
        chat_welcome: "Ayubowan! 🙏 How can I help you with your paddy crop today?",
        chat_placeholder: "Ask about fertilizer, blast...",
        chat_default: "Tell me what you see in your field – for example blast, leaf blight, brown spot, rats, birds, fertilizer, water or harvest – or scan a leaf on the Scan page and I will give you the full treatment.",
        chat_fert: "Apply urea in split doses as the Department of Agriculture recommends for your area and variety. Too much nitrogen makes blast and blight worse.",
        chat_blast: "Blast shows as grey, spindle-shaped spots with brown edges. Stop urea now, and spray tricyclazole 75% WP at the label dose, covering the leaves well. Repeat after 10–14 days if new spots appear.",
        chat_tricy: "Tricyclazole is a fungicide used against rice blast. Use only the dose on the label, wear gloves and a mask, and respect the waiting period before harvest.",
        chat_water: "Keep 2–5 cm of water after transplanting. Alternate wetting and drying saves water once plants are established. Drain the field 10–14 days before harvest.",
        chat_harvest: "Harvest when about 80–85% of the grains on the panicle are golden. Dry the paddy to 14% moisture before storing.",
        chat_blight: "Bacterial leaf blight turns leaf edges yellow then white from the tip. There is no spray that cures it: drain the field, avoid extra nitrogen and remove weeds on the bunds.",
        chat_pest: "For rats, elephants, wild boar, birds and insects like brown planthopper, open the Pests page: it shows how each one attacks and what to do.",
        chat_hotline: "I am your AgriCare agriculture officer. Tell me the problem – for example blast, rats or fertilizer – or scan a leaf, and I will give you step-by-step treatment.",

        // login
        login_title: "Welcome back",
        login_sub: "Log in to scan leaves and save your results.",
        login_name: "Name",
        login_pass: "Password",
        login_btn: "Log In",
        login_err: "Please enter your name and password.",
        login_note: "Log in with your mobile number and password.",

        // about
        about_title: "About AgriCare",
        about_lead: "A mobile-friendly tool that helps Sri Lankan paddy farmers recognise leaf diseases early and act before yields fall.",
        about_problem_t: "The problem",
        about_solution_t: "Our solution",
        about_how_t: "How the system works",
        about_obj_t: "Project objectives",

        // disease library
        lib_title: "Paddy Disease Library",
        lib_lead: "Symptoms, causes and control measures for the common paddy diseases and insect damage in Sri Lanka.",
        lib_search_ph: "Search diseases or symptoms...",
        filter_all: "All",
        filter_fungal: "Fungal",
        filter_bacterial: "Bacterial",
        filter_viral: "Viral",
        lbl_symptoms: "Symptoms",
        lbl_conditions: "Favoured by",
        lbl_manage: "What to do",
        lbl_prevent: "Prevention",
        lib_empty: "No diseases match your search.",

        // learning hub
        hub_title: "Solutions & Learning Hub",
        hub_lead: "Good field practice prevents most disease. These guides cover the basics every season.",

        // team
        team_title: "Meet the Team",
        team_lead: "The students behind AgriCare.",
        team_supervisor: "Project supervisor",

        // upload
        up_title: "Scan a Paddy Leaf",
        up_lead: "Upload a clear photo of one leaf. AgriCare will suggest the most likely disease and what to do.",
        up_drop: "Drag a leaf photo here",
        up_or: "or",
        up_choose: "Choose photo",
        up_analyze: "Analyse leaf",
        up_again: "Scan another",
        up_analyzing: "Analysing...",
        up_result: "Diagnosis",
        up_confidence: "Confidence",
        up_view_details: "View full details",
        up_disease_found: "Disease detected",
        up_healthy_found: "Looks healthy",
        up_waiting: "Your result will appear here after you upload a photo.",
        up_tips_t: "Tips for a good photo",
        up_tip_1: "Use daylight. Avoid flash and deep shade.",
        up_tip_2: "Fill the frame with one leaf, showing the spots clearly.",
        up_tip_3: "Hold steady so the photo is sharp.",
        up_demo_note: "Demo mode: no trained model is connected yet, so this is a SAMPLE result – not a real diagnosis of your photo.",
        up_camera: "📷 Open camera",
        up_take: "Take photo",
        up_switch: "🔄 Switch camera",
        up_gallery: "🖼️ Gallery",
        up_cam_hint: "Hold one leaf inside the frame",
        up_cam_denied: "The camera could not be opened. Allow camera access in your browser, or choose a photo instead.",
        up_cam_blocked: "Camera access is blocked. Click the camera or 🔒 icon in the address bar, choose Allow, then press Open camera again.",
        up_cam_none: "No camera was found on this device. Choose a photo instead.",
        up_cam_busy: "The camera is being used by another app (for example Zoom or Teams). Close that app and press Open camera again.",
        up_cam_frame: "This preview window cannot use the camera. Open the AgriCare website itself (index.html or python app.py) to use the camera, or choose a photo.",
        up_cam_insecure: "The camera works only when the website is opened as https:// or http://localhost. Choose a photo instead.",
        up_bad_file: "Please choose an image file (JPG or PNG).",

        healthy_name: "Healthy leaf"
    },

    si: {
        logo_sub: "බුද්ධිමත් විසඳුම්",
        nav_home: "මුල් පිටුව",
        nav_about: "අප ගැන",
        nav_diseases: "රෝග",
        nav_pests: "පළිබෝධ",
        nav_scan: "ස්කෑන්", nav_weather: "කාලගුණය", nav_varieties: "වී වර්ග", nav_crop: "මගේ වගාව", menu: "මෙනුව",
        home_tiles: "අද ඔබට අවශ්‍ය මොකක්ද?",
        tile_scan: "රෝගී කොළයක ඡායාරූපයක් – රෝගය සහ ප්‍රතිකාරය ලබාගන්න",
        tile_weather: "වැසි, උෂ්ණත්වය සහ සුළඟ – ඉසීමට සහ ජලයට උපදෙස් සමඟ",
        tile_varieties: "ඔබේ දිස්ත්‍රික්කයට හොඳම වී වර්ග",
        tile_crop: "ඔබේ බෝගයේ අවධිය සහ මේ සතියේ වැඩ",
        tile_diseases: "වී රෝගවල ලක්ෂණ සහ ප්‍රතිකාර",
        tile_pests: "කෘමීන්, මීයන්, කුරුල්ලන්, අලින් – ඔවුන් නවත්වන ආකාරය",
        tile_monitor: "ඔබේ ප්‍රතිකාර පියවර සහ අනතුරු ඇඟවීම්",
        tile_shops: "ඔබ අසල ඖෂධ සාප්පු",
        nav_solutions: "විසඳුම්",
        nav_team: "කණ්ඩායම",
        nav_logout: "ඉවත් වන්න",
        footer_text: "AgriCare · අවසන් වසරේ ව්‍යාපෘතිය",
        footer_hotline: "ඔබේ ඩිජිටල් කෘෂිකර්ම නිලධාරියා",

        hero_title_1: "ඔබේ අස්වැන්න",
        hero_title_2: "AI මගින් රකින්න",
        hero_desc: "රෝගී වී කොළයක ඡායාරූපයක් ගෙන, රෝගය හඳුනාගෙන, ඔබේම භාෂාවෙන් සම්පූර්ණ ප්‍රතිකාර සැලැස්මක් ලබාගන්න. සිසුන් විසින් නිර්මාණය කළ, ගොවීන් සඳහාම වූ මෙවලමකි.",
        btn_scan: "📸 දැන් ස්කෑන් කරන්න",
        btn_learn: "📚 තවත් දැනගන්න",
        feat_1_title: "🗣️ භාෂා 3ක්",
        feat_1_desc: "English, සිංහල සහ தமிழ், හඬ සමඟ.",
        feat_2_title: "🩺 සම්පූර්ණ ප්‍රතිකාර",
        feat_2_desc: "එලාම් සමඟ පියවරෙන් පියවර සැලසුම්.",
        feat_3_title: "🌱 නොමිලේ",
        feat_3_desc: "ගොවීන්ට කිසිදු ගාස්තුවක් නැත.",
        mobile_edition: "ජංගම සංස්කරණය",
        btn_scan_leaf: "කොළය ස්කෑන් කරන්න",
        how_eyebrow: "ක්‍රියා කරන ආකාරය",
        how_title: "කොළයක ඡායාරූපයේ සිට ප්‍රතිකාරය දක්වා",
        how_1_t: "ඡායාරූපයක් ගන්න",
        how_1_d: "රෝගී වී කොළයක් දිවා ආලෝකයේ, ළඟින් හා පැහැදිලිව ඡායාරූප ගත කරන්න.",
        how_2_t: "AI කොළය පරීක්ෂා කරයි",
        how_2_d: "ලේබල් කළ වී කොළ ඡායාරූප මගින් පුහුණු කළ අපගේ ආකෘතිය කොළය පරීක්ෂා කරයි.",
        how_3_t: "ප්‍රතිකාරය ලබාගන්න",
        how_3_d: "රෝගය, ආකෘතියේ විශ්වාසය සහ ඊළඟට කළ යුතු දේ බලන්න.",
        diseases_eyebrow: "රෝග පුස්තකාලය",
        diseases_title: "ශ්‍රී ලංකාවේ බහුලව දක්නට ලැබෙන වී රෝග සහ පළිබෝධ 10",
        diseases_cta: "පුස්තකාලය විවෘත කරන්න",

        chat_header: "AgriCare සහායක",
        chat_welcome: "ආයුබෝවන්! 🙏 අද ඔබේ වී වගාවට මා උදව් කළ හැක්කේ කෙසේද?",
        chat_placeholder: "පොහොර, පාළුව ගැන අහන්න...",
        chat_default: "ඔබේ කුඹුරේ ඔබ දකින දේ මට කියන්න – උදා: පාළුව, කොළ අංගමාරය, දුඹුරු පුල්ලි, මීයන්, කුරුල්ලන්, පොහොර, වතුර හෝ අස්වනු – නැතහොත් ස්කෑන් පිටුවේ කොළයක් ස්කෑන් කරන්න, මම සම්පූර්ණ ප්‍රතිකාරය දෙන්නම්.",
        chat_fert: "ඔබේ ප්‍රදේශයට හා ප්‍රභේදයට කෘෂිකර්ම දෙපාර්තමේන්තුව නිර්දේශ කරන පරිදි යූරියා කොටස් වශයෙන් යොදන්න. නයිට්‍රජන් වැඩි වුවහොත් පාළුව හා අංගමාරය වැඩි වේ.",
        chat_blast: "පාළුව රෝගයේදී දුඹුරු දාර සහිත අළු පැහැති දිගටි පුල්ලි ඇති වේ. දැන්ම යූරියා නවත්වා, ලේබලයේ මාත්‍රාවෙන් ට්‍රයිසයික්ලසෝල් (tricyclazole) 75% WP කොළ හොඳින් තෙමෙන සේ ඉසින්න. අලුත් පුල්ලි ඇති වුවහොත් දින 10–14කින් නැවත ඉසින්න.",
        chat_tricy: "ට්‍රයිසයික්ලසෝල් යනු පාළුව රෝගයට භාවිත කරන දිලීර නාශකයකි. ලේබලයේ මාත්‍රාව පමණක් යොදන්න, අත්වැසුම් හා මුහුණු ආවරණ පළඳින්න, අස්වනු නෙළීමට පෙර පොරොත්තු කාලය රකින්න.",
        chat_water: "පැළ සිටවූ පසු සෙ.මී. 2–5 ජලය තබාගන්න. පැළ ස්ථාපිත වූ පසු මාරුවෙන් මාරුවට තෙත් කර වියළීමෙන් ජලය ඉතිරි වේ. අස්වනු නෙළීමට දින 10–14කට පෙර කුඹුරේ ජලය බැස යවන්න.",
        chat_harvest: "කරලේ ඇට 80–85%ක් පමණ රන්වන් පැහැ වූ විට අස්වනු නෙළන්න. ගබඩා කිරීමට පෙර වී 14% තෙතමනයට වියළන්න.",
        chat_blight: "බැක්ටීරියා කොළ අංගමාරයේදී කොළ අග සිට දාර කහ වී පසුව සුදු වේ. එය සුව කරන ඉසීමක් නැත: කුඹුරේ ජලය බැස යවන්න, අමතර නයිට්‍රජන් නොයොදන්න, නියරවල වල් පැළ ඉවත් කරන්න.",
        chat_pest: "මීයන්, අලි, වල් ඌරන්, කුරුල්ලන් සහ දුඹුරු පැල කීඩෑවා වැනි කෘමීන් ගැන පළිබෝධ පිටුව බලන්න: එක් එක් සතා පහර දෙන ආකාරය සහ කළ යුතු දේ එහි ඇත.",
        chat_hotline: "මම ඔබේ AgriCare කෘෂිකර්ම නිලධාරියා. ගැටලුව කියන්න – උදා: පාළුව, මීයන් හෝ පොහොර – නැතහොත් කොළයක් ස්කෑන් කරන්න, මම පියවරෙන් පියවර ප්‍රතිකාරය දෙන්නම්.",

        login_title: "නැවත සාදරයෙන් පිළිගනිමු",
        login_sub: "කොළ ස්කෑන් කර ප්‍රතිඵල සුරැකීමට පිවිසෙන්න.",
        login_name: "නම",
        login_pass: "මුරපදය",
        login_btn: "පිවිසෙන්න",
        login_err: "කරුණාකර ඔබේ නම සහ මුරපදය ඇතුළත් කරන්න.",
        login_note: "ඔබේ ජංගම දුරකථන අංකය සහ මුරපදය සමඟ පිවිසෙන්න.",

        about_title: "AgriCare ගැන",
        about_lead: "ශ්‍රී ලාංකික වී ගොවීන්ට කොළ රෝග කලින් හඳුනාගෙන අස්වැන්න අඩුවීමට පෙර ක්‍රියා කිරීමට උදව් වන ජංගම-හිතකාමී මෙවලමකි.",
        about_problem_t: "ගැටලුව",
        about_solution_t: "අපගේ විසඳුම",
        about_how_t: "පද්ධතිය ක්‍රියා කරන ආකාරය",
        about_obj_t: "ව්‍යාපෘති අරමුණු",

        lib_title: "වී රෝග පුස්තකාලය",
        lib_lead: "ශ්‍රී ලංකාවේ බහුලව දක්නට ලැබෙන වී රෝග සහ කෘමි හානිවල ලක්ෂණ, හේතු සහ පාලන ක්‍රම.",
        lib_search_ph: "රෝග හෝ ලක්ෂණ සොයන්න...",
        filter_all: "සියල්ල",
        filter_fungal: "දිලීර",
        filter_bacterial: "බැක්ටීරියා",
        filter_viral: "වෛරස",
        lbl_symptoms: "ලක්ෂණ",
        lbl_conditions: "වැඩිවීමට හේතු",
        lbl_manage: "කළ යුතු දේ",
        lbl_prevent: "වැළැක්වීම",
        lib_empty: "ඔබේ සෙවුමට ගැළපෙන රෝග නැත.",

        hub_title: "විසඳුම් සහ ඉගෙනුම් මධ්‍යස්ථානය",
        hub_lead: "හොඳ කෙත් පිළිවෙත් මගින් බොහෝ රෝග වළක්වාගත හැක. සෑම කන්නයකටම අවශ්‍ය මූලික කරුණු මෙහි ඇත.",

        team_title: "අපගේ කණ්ඩායම",
        team_lead: "AgriCare පිටුපස සිටින සිසුන්.",
        team_supervisor: "ව්‍යාපෘති අධීක්ෂක",

        up_title: "වී කොළයක් ස්කෑන් කරන්න",
        up_lead: "එක් කොළයක පැහැදිලි ඡායාරූපයක් උඩුගත කරන්න. AgriCare වඩාත් ඉඩ ඇති රෝගය සහ කළ යුතු දේ යෝජනා කරයි.",
        up_drop: "කොළයේ ඡායාරූපය මෙතැනට ඇද දමන්න",
        up_or: "හෝ",
        up_choose: "ඡායාරූපය තෝරන්න",
        up_analyze: "කොළය විශ්ලේෂණය කරන්න",
        up_again: "වෙනත් එකක් ස්කෑන් කරන්න",
        up_analyzing: "විශ්ලේෂණය කරමින්...",
        up_result: "විනිශ්චය",
        up_confidence: "විශ්වාසය",
        up_view_details: "සම්පූර්ණ විස්තර බලන්න",
        up_disease_found: "රෝගයක් හඳුනාගෙන ඇත",
        up_healthy_found: "නිරෝගී ලෙස පෙනේ",
        up_waiting: "ඡායාරූපයක් උඩුගත කළ පසු ප්‍රතිඵලය මෙහි දිස්වේ.",
        up_tips_t: "හොඳ ඡායාරූපයකට උපදෙස්",
        up_tip_1: "දිවා ආලෝකය භාවිත කරන්න. ෆ්ලෑෂ් හා ගැඹුරු සෙවණ මඟහරින්න.",
        up_tip_2: "පුල්ලි පැහැදිලිව පෙනෙන සේ එක් කොළයක් පමණක් රාමුවට ගන්න.",
        up_tip_3: "ඡායාරූපය පැහැදිලි වීමට දුරකථනය නොසෙල්වා තබාගන්න.",
        up_demo_note: "ප්‍රදර්ශන ප්‍රකාරය: පුහුණු කළ ආකෘතියක් තවම සම්බන්ධ කර නැති බැවින් මෙය නියැදි ප්‍රතිඵලයකි – ඔබේ ඡායාරූපයේ සැබෑ රෝග විනිශ්චයක් නොවේ.",
        up_camera: "📷 කැමරාව විවෘත කරන්න",
        up_take: "ඡායාරූපය ගන්න",
        up_switch: "🔄 කැමරාව මාරු කරන්න",
        up_gallery: "🖼️ ගැලරිය",
        up_cam_hint: "එක් කොළයක් රාමුව තුළ තබන්න",
        up_cam_denied: "කැමරාව විවෘත කළ නොහැකි විය. බ්‍රව්සරයේ කැමරා අවසරය දෙන්න, නැතහොත් ඡායාරූපයක් තෝරන්න.",
        up_cam_blocked: "කැමරා අවසරය අවහිර කර ඇත. ලිපින තීරුවේ කැමරා හෝ 🔒 සලකුණ ඔබා Allow තෝරා, නැවත කැමරාව විවෘත කරන්න ඔබන්න.",
        up_cam_none: "මෙම උපාංගයේ කැමරාවක් හමු නොවීය. ඡායාරූපයක් තෝරන්න.",
        up_cam_busy: "කැමරාව වෙනත් යෙදුමක් (උදා: Zoom හෝ Teams) භාවිත කරයි. එය වසා නැවත කැමරාව විවෘත කරන්න ඔබන්න.",
        up_cam_frame: "මෙම පෙරදසුන් කවුළුවට කැමරාව භාවිත කළ නොහැක. කැමරාව සඳහා AgriCare වෙබ් අඩවියම (index.html හෝ python app.py) විවෘත කරන්න, නැතහොත් ඡායාරූපයක් තෝරන්න.",
        up_cam_insecure: "වෙබ් අඩවිය https:// හෝ http://localhost ලෙස විවෘත කළ විට පමණක් කැමරාව ක්‍රියා කරයි. ඡායාරූපයක් තෝරන්න.",
        up_bad_file: "කරුණාකර රූප ගොනුවක් (JPG හෝ PNG) තෝරන්න.",

        healthy_name: "නිරෝගී කොළය"
    },

    ta: {
        logo_sub: "நுண்ணறிவுத் தீர்வுகள்",
        nav_home: "முகப்பு",
        nav_about: "எம்மைப் பற்றி",
        nav_diseases: "நோய்கள்",
        nav_pests: "பூச்சிகள்",
        nav_scan: "ஸ்கேன்", nav_weather: "வானிலை", nav_varieties: "நெல் இனங்கள்", nav_crop: "என் பயிர்", menu: "பட்டியல்",
        home_tiles: "இன்று உங்களுக்கு என்ன தேவை?",
        tile_scan: "நோயுற்ற இலையின் படம் – நோயையும் சிகிச்சையையும் பெறுங்கள்",
        tile_weather: "மழை, வெப்பம், காற்று – தெளிப்பு, நீருக்கான ஆலோசனையுடன்",
        tile_varieties: "உங்கள் மாவட்டத்துக்குச் சிறந்த நெல் இனங்கள்",
        tile_crop: "உங்கள் பயிரின் பருவமும் இந்த வார வேலையும்",
        tile_diseases: "நெல் நோய்களின் அறிகுறிகளும் சிகிச்சையும்",
        tile_pests: "பூச்சிகள், எலிகள், பறவைகள், யானைகள் – அவற்றைத் தடுப்பது எப்படி",
        tile_monitor: "உங்கள் சிகிச்சைப் படிகளும் அலாரங்களும்",
        tile_shops: "அருகிலுள்ள மருந்துக் கடைகள்",
        nav_solutions: "தீர்வுகள்",
        nav_team: "குழு",
        nav_logout: "வெளியேறு",
        footer_text: "AgriCare · இறுதியாண்டுத் திட்டம்",
        footer_hotline: "உங்கள் டிஜிட்டல் விவசாய அலுவலர்",

        hero_title_1: "உங்கள் அறுவடையை",
        hero_title_2: "AI மூலம் பாதுகாக்கவும்",
        hero_desc: "நோயுற்ற நெல் இலையின் படத்தை எடுத்து, நோயைக் கண்டறிந்து, உங்கள் சொந்த மொழியில் முழுச் சிகிச்சைத் திட்டத்தைப் பெறுங்கள். மாணவர்களால் உருவாக்கப்பட்டது, விவசாயிகளுக்காக வடிவமைக்கப்பட்டது.",
        btn_scan: "📸 இப்போது ஸ்கேன் செய்",
        btn_learn: "📚 மேலும் அறிக",
        feat_1_title: "🗣️ 3 மொழிகள்",
        feat_1_desc: "English, සිංහල, தமிழ், குரலுடன்.",
        feat_2_title: "🩺 முழுச் சிகிச்சை",
        feat_2_desc: "அலாரங்களுடன் படிப்படியான திட்டங்கள்.",
        feat_3_title: "🌱 இலவச அணுகல்",
        feat_3_desc: "விவசாயிகளுக்குக் கட்டணம் இல்லை.",
        mobile_edition: "கைபேசி பதிப்பு",
        btn_scan_leaf: "இலையை ஸ்கேன் செய்",
        how_eyebrow: "இது எப்படி வேலை செய்கிறது",
        how_title: "இலைப் புகைப்படத்திலிருந்து சிகிச்சைத் திட்டம் வரை",
        how_1_t: "புகைப்படம் எடுக்கவும்",
        how_1_d: "பாதிக்கப்பட்ட ஒரு நெல் இலையைப் பகல் வெளிச்சத்தில், அருகில், தெளிவாகப் படம் எடுக்கவும்.",
        how_2_t: "AI இலையைச் சோதிக்கிறது",
        how_2_d: "பெயரிடப்பட்ட நெல் இலைப் படங்களால் பயிற்றுவிக்கப்பட்ட எங்கள் மாதிரி இலையைச் சோதிக்கிறது.",
        how_3_t: "சிகிச்சையைப் பெறுங்கள்",
        how_3_d: "நோய், மாதிரியின் நம்பகத்தன்மை, அடுத்து செய்ய வேண்டியவை ஆகியவற்றைப் பாருங்கள்.",
        diseases_eyebrow: "நோய் நூலகம்",
        diseases_title: "இலங்கையில் பொதுவான 10 நெல் நோய்களும் பூச்சிகளும்",
        diseases_cta: "நூலகத்தைத் திறக்கவும்",

        chat_header: "AgriCare உதவியாளர்",
        chat_welcome: "வணக்கம்! 🙏 இன்று உங்கள் நெல் பயிருக்கு நான் எப்படி உதவலாம்?",
        chat_placeholder: "உரம், குலை நோய் பற்றிக் கேளுங்கள்...",
        chat_default: "உங்கள் வயலில் நீங்கள் காண்பதைச் சொல்லுங்கள் – உ.ம்: குலை நோய், இலைக் கருகல், பழுப்புப் புள்ளி, எலிகள், பறவைகள், உரம், தண்ணீர் அல்லது அறுவடை – அல்லது ஸ்கேன் பக்கத்தில் ஒரு இலையை ஸ்கேன் செய்யுங்கள், முழுச் சிகிச்சையையும் தருகிறேன்.",
        chat_fert: "உங்கள் பகுதிக்கும் இனத்துக்கும் விவசாயத் திணைக்களம் பரிந்துரைக்கும் அளவில் யூரியாவைப் பிரித்து இடுங்கள். அதிக நைதரசன் குலை நோயையும் கருகலையும் அதிகரிக்கும்.",
        chat_blast: "குலை நோயில் பழுப்பு விளிம்புடன் சாம்பல் நிற நீள்வட்டப் புள்ளிகள் தோன்றும். இப்போதே யூரியாவை நிறுத்தி, லேபிள் அளவில் ட்ரைசைக்ளசோல் (tricyclazole) 75% WP ஐ இலைகள் நன்கு நனையும்படி தெளியுங்கள். புதிய புள்ளிகள் தோன்றினால் 10–14 நாட்களில் மீண்டும் தெளியுங்கள்.",
        chat_tricy: "ட்ரைசைக்ளசோல் குலை நோய்க்குப் பயன்படும் பூஞ்சைக்கொல்லி. லேபிளில் உள்ள அளவை மட்டும் பயன்படுத்துங்கள், கையுறை மற்றும் முகக்கவசம் அணியுங்கள், அறுவடைக்கு முன் காத்திருப்புக் காலத்தைப் பின்பற்றுங்கள்.",
        chat_water: "நாற்று நட்ட பின் 2–5 செ.மீ. நீரைப் பேணுங்கள். பயிர் நிலைத்த பின் மாறி மாறி நனைத்து உலர்த்துவது நீரைச் சேமிக்கும். அறுவடைக்கு 10–14 நாட்களுக்கு முன் வயலிலிருந்து நீரை வடியுங்கள்.",
        chat_harvest: "கதிரில் சுமார் 80–85% மணிகள் பொன்னிறமானதும் அறுவடை செய்யுங்கள். சேமிப்பதற்கு முன் நெல்லை 14% ஈரப்பதத்துக்கு உலர்த்துங்கள்.",
        chat_blight: "பாக்டீரியா இலைக் கருகலில் இலை நுனியிலிருந்து விளிம்புகள் மஞ்சளாகிப் பின் வெண்மையாகும். இதைக் குணப்படுத்தும் தெளிப்பு இல்லை: வயல் நீரை வடியுங்கள், கூடுதல் நைதரசன் இட வேண்டாம், வரம்புகளிலுள்ள களைகளை அகற்றுங்கள்.",
        chat_pest: "எலிகள், யானைகள், காட்டுப் பன்றிகள், பறவைகள், பழுப்புத் தத்துப்பூச்சி போன்ற பூச்சிகள் பற்றி பூச்சிகள் பக்கத்தைப் பாருங்கள்: ஒவ்வொன்றும் தாக்கும் விதமும் செய்ய வேண்டியதும் அங்கே உள்ளன.",
        chat_hotline: "நான் உங்கள் AgriCare விவசாய அலுவலர். பிரச்சினையைச் சொல்லுங்கள் – உ.ம்: குலை நோய், எலிகள் அல்லது உரம் – அல்லது ஒரு இலையை ஸ்கேன் செய்யுங்கள், படிப்படியான சிகிச்சையைத் தருகிறேன்.",

        login_title: "மீண்டும் வருக",
        login_sub: "இலைகளை ஸ்கேன் செய்து முடிவுகளைச் சேமிக்க உள்நுழையுங்கள்.",
        login_name: "பெயர்",
        login_pass: "கடவுச்சொல்",
        login_btn: "உள்நுழை",
        login_err: "உங்கள் பெயரையும் கடவுச்சொல்லையும் உள்ளிடவும்.",
        login_note: "உங்கள் கைபேசி இலக்கம் மற்றும் கடவுச்சொல்லுடன் உள்நுழையுங்கள்.",

        about_title: "AgriCare பற்றி",
        about_lead: "இலங்கை நெல் விவசாயிகள் இலை நோய்களை முன்கூட்டியே கண்டறிந்து விளைச்சல் குறைவதற்கு முன் செயல்பட உதவும் கைபேசிக்கு ஏற்ற கருவி.",
        about_problem_t: "பிரச்சினை",
        about_solution_t: "எமது தீர்வு",
        about_how_t: "அமைப்பு எப்படி வேலை செய்கிறது",
        about_obj_t: "திட்ட நோக்கங்கள்",

        lib_title: "நெல் நோய் நூலகம்",
        lib_lead: "இலங்கையில் பொதுவாகக் காணப்படும் நெல் நோய்கள் மற்றும் பூச்சிச் சேதங்களின் அறிகுறிகள், காரணங்கள், கட்டுப்பாட்டு முறைகள்.",
        lib_search_ph: "நோய்கள் அல்லது அறிகுறிகளைத் தேடுங்கள்...",
        filter_all: "அனைத்தும்",
        filter_fungal: "பூஞ்சை",
        filter_bacterial: "பாக்டீரியா",
        filter_viral: "வைரஸ்",
        lbl_symptoms: "அறிகுறிகள்",
        lbl_conditions: "அதிகரிக்கும் சூழல்",
        lbl_manage: "செய்ய வேண்டியவை",
        lbl_prevent: "தடுப்பு",
        lib_empty: "உங்கள் தேடலுக்குப் பொருந்தும் நோய்கள் இல்லை.",

        hub_title: "தீர்வுகள் மற்றும் கற்றல் மையம்",
        hub_lead: "நல்ல வயல் நடைமுறைகள் பெரும்பாலான நோய்களைத் தடுக்கின்றன. ஒவ்வொரு போகத்துக்கும் தேவையான அடிப்படைகள் இங்கே.",

        team_title: "எமது குழு",
        team_lead: "AgriCare-இன் பின்னணியில் உள்ள மாணவர்கள்.",
        team_supervisor: "திட்ட மேற்பார்வையாளர்",

        up_title: "நெல் இலையை ஸ்கேன் செய்யுங்கள்",
        up_lead: "ஒரு இலையின் தெளிவான புகைப்படத்தைப் பதிவேற்றுங்கள். AgriCare பெரும்பாலும் உள்ள நோயையும் செய்ய வேண்டியதையும் பரிந்துரைக்கும்.",
        up_drop: "இலைப் புகைப்படத்தை இங்கே இழுத்து விடுங்கள்",
        up_or: "அல்லது",
        up_choose: "புகைப்படத்தைத் தேர்வுசெய்",
        up_analyze: "இலையைப் பகுப்பாய்வு செய்",
        up_again: "இன்னொன்றை ஸ்கேன் செய்",
        up_analyzing: "பகுப்பாய்வு செய்கிறது...",
        up_result: "நோய் கண்டறிதல்",
        up_confidence: "நம்பகத்தன்மை",
        up_view_details: "முழு விவரங்களைப் பார்",
        up_disease_found: "நோய் கண்டறியப்பட்டது",
        up_healthy_found: "ஆரோக்கியமாகத் தெரிகிறது",
        up_waiting: "புகைப்படத்தைப் பதிவேற்றிய பின் முடிவு இங்கே தோன்றும்.",
        up_tips_t: "நல்ல புகைப்படத்துக்கான குறிப்புகள்",
        up_tip_1: "பகல் வெளிச்சத்தைப் பயன்படுத்துங்கள். ஃபிளாஷ் மற்றும் அடர்ந்த நிழலைத் தவிருங்கள்.",
        up_tip_2: "புள்ளிகள் தெளிவாகத் தெரியும்படி ஒரு இலையை மட்டும் சட்டகத்தில் எடுங்கள்.",
        up_tip_3: "படம் தெளிவாக இருக்கக் கைபேசியை அசையாமல் பிடியுங்கள்.",
        up_demo_note: "காட்சி முறை: பயிற்றுவிக்கப்பட்ட மாதிரி இன்னும் இணைக்கப்படவில்லை, எனவே இது ஒரு மாதிரி முடிவு – உங்கள் படத்தின் உண்மையான நோய் கண்டறிதல் அல்ல.",
        up_camera: "📷 கேமராவைத் திற",
        up_take: "படம் எடு",
        up_switch: "🔄 கேமராவை மாற்று",
        up_gallery: "🖼️ கேலரி",
        up_cam_hint: "ஒரு இலையைச் சட்டத்துக்குள் வையுங்கள்",
        up_cam_denied: "கேமராவைத் திறக்க முடியவில்லை. உலாவியில் கேமரா அனுமதியை வழங்குங்கள், அல்லது ஒரு படத்தைத் தேர்ந்தெடுங்கள்.",
        up_cam_blocked: "கேமரா அனுமதி தடுக்கப்பட்டுள்ளது. முகவரிப் பட்டியில் உள்ள கேமரா அல்லது 🔒 குறியை அழுத்தி Allow தேர்ந்தெடுத்து, மீண்டும் கேமராவைத் திற என்பதை அழுத்துங்கள்.",
        up_cam_none: "இந்தச் சாதனத்தில் கேமரா இல்லை. ஒரு படத்தைத் தேர்ந்தெடுங்கள்.",
        up_cam_busy: "கேமராவை வேறொரு செயலி (எ.கா. Zoom அல்லது Teams) பயன்படுத்துகிறது. அதை மூடிவிட்டு மீண்டும் கேமராவைத் திற என்பதை அழுத்துங்கள்.",
        up_cam_frame: "இந்த முன்னோட்ட சாளரத்தில் கேமராவைப் பயன்படுத்த முடியாது. கேமராவுக்கு AgriCare இணையதளத்தையே (index.html அல்லது python app.py) திறங்கள், அல்லது ஒரு படத்தைத் தேர்ந்தெடுங்கள்.",
        up_cam_insecure: "இணையதளம் https:// அல்லது http://localhost ஆகத் திறக்கப்பட்டால் மட்டுமே கேமரா இயங்கும். ஒரு படத்தைத் தேர்ந்தெடுங்கள்.",
        up_bad_file: "படக் கோப்பை (JPG அல்லது PNG) தேர்வுசெய்யவும்.",

        healthy_name: "ஆரோக்கியமான இலை"
    }
};

/* ---------- Safe storage (works even when the browser blocks storage) ---------- */
const AgriStore = {
    get(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
    set(key, val) { try { window.localStorage.setItem(key, val); } catch (e) { /* ignore */ } },
    remove(key) { try { window.localStorage.removeItem(key); } catch (e) { /* ignore */ } },
    available() {
        try { const k = "__agri_test"; localStorage.setItem(k, "1"); localStorage.removeItem(k); return true; }
        catch (e) { return false; }
    }
};

/* ---------- Language ---------- */
function getLanguage() {
    // window.__agriLang keeps the choice for this page even if storage is blocked
    const lang = window.__agriLang || AgriStore.get("agricare_lang");
    return translations[lang] ? lang : "en";
}

function t(key) {
    const lang = getLanguage();
    return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
}

function applyTranslations() {
    const lang = getLanguage();
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = t(el.getAttribute("data-i18n"));
    });
    // longer built-in texts that contain <strong> (only our own text from content-i18n.js)
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
        el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
        el.title = t(el.getAttribute("data-i18n-title"));
        el.setAttribute("aria-label", el.title);
    });
    const sw = document.getElementById("language-switcher");
    if (sw) sw.value = lang;
    document.dispatchEvent(new CustomEvent("agricare:lang", { detail: lang }));
}

function setLanguage(lang) {
    if (!translations[lang]) lang = "en";
    AgriStore.set("agricare_lang", lang);
    window.__agriLang = lang;
    applyTranslations();
}

/* ---------- Login helpers ---------- */
function isLoggedIn() {
    // If the browser blocks storage, don't lock the visitor out.
    if (!AgriStore.available()) return true;
    return AgriStore.get("isLoggedIn") === "true";
}

function requireLogin(loginPath) {
    if (!isLoggedIn()) window.location.href = loginPath;
}

function handleLogout(loginPath) {
    AgriStore.remove("isLoggedIn");
    AgriStore.remove("agricare_user");
    window.location.href = loginPath || "login.html";
}

/* Phone menu */
function toggleMenu() {
    const h = document.querySelector("header");
    const open = h.classList.toggle("menu-open");
    const b = h.querySelector(".menu-btn");
    if (b) b.setAttribute("aria-expanded", String(open));
}

document.addEventListener("DOMContentLoaded", applyTranslations);

/* small shared labels */
Object.assign(translations.en, { nav_voice: "🔊 Voice test", shop_district_ph: "Select district" });
Object.assign(translations.si, { nav_voice: "🔊 හඬ පරීක්ෂාව", shop_district_ph: "දිස්ත්‍රික්කය තෝරන්න" });
Object.assign(translations.ta, { nav_voice: "🔊 குரல் சோதனை", shop_district_ph: "மாவட்டத்தைத் தேர்வுசெய்" });
