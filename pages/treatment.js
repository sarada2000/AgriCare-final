/* AgriCare – treatment plans, voice read-out and alarm reminders
   Load after translations.js and diseases.js on every page.
   Plans are saved in this browser (localStorage). */

/* ---------- Extra interface text (merged into translations) ---------- */
Object.assign(translations.en, {
    nav_monitor: "Monitor",
    nav_shops: "Shops",
    voice_listen: "🔊 Listen",
    voice_stop: "⏹ Stop",
    voice_missing_si: "This device has no Sinhala voice installed. On Android: Settings › Text-to-speech › Google › install Sinhala.",
    voice_missing_ta: "This device has no Tamil voice installed. On Android: Settings › Text-to-speech › Google › install Tamil.",
    voice_unsupported: "This browser cannot read text aloud. Try Chrome on Android.",
    plan_title: "Treatment plan",
    plan_day: "Day",
    plan_start: "Start treatment & reminders",
    plan_field: "Field name",
    plan_field_ph: "e.g. Lower field, 1 acre",
    plan_date: "Start date",
    plan_time: "Alarm time",
    plan_create: "Create plan",
    plan_created: "Plan saved. You will get an alarm when each step is due.",
    plan_open_monitor: "Open monitor",
    mon_title: "Treatment Monitor",
    mon_lead: "Follow each treatment step, record how the crop is doing, and get an alarm when a task is due.",
    mon_empty_t: "No treatment plans yet",
    mon_empty_d: "Scan a leaf and press “Start treatment & reminders”, or load a sample plan to see how it works.",
    mon_sample: "Load sample plan",
    mon_scan: "Scan a leaf",
    mon_next: "Next step",
    mon_all_done: "All steps finished",
    mon_progress: "steps done",
    mon_mark_done: "Mark done",
    mon_undo: "Undo",
    mon_started: "Started",
    mon_rescan: "Re-scan a leaf",
    mon_calendar: "📅 Add alarms to phone calendar",
    mon_calendar_note: "Calendar alarms ring even when this website is closed.",
    mon_delete: "Delete plan",
    mon_delete_q: "Delete this plan and its reminders?",
    mon_delete_yes: "Yes, delete",
    mon_cancel: "Cancel",
    mon_history: "Crop condition log",
    st_done: "Done",
    st_today: "Due today",
    st_overdue: "Overdue",
    st_upcoming: "Upcoming",
    cond_q: "How does the crop look now?",
    cond_better: "Better",
    cond_same: "Same",
    cond_worse: "Worse",
    worse_alert: "The problem is getting worse. Repeat the main treatment step today, stop all urea, and scan a leaf again in 3 days to confirm the diagnosis.",
    alarm_title: "⏰ Treatment reminder",
    alarm_snooze: "Snooze 10 min",
    alarm_close: "Close",
    alarm_enable: "🔔 Turn on alarms",
    alarm_on: "Alarms are on. They ring while AgriCare is open in your browser.",
    alarm_off: "Turn on alarms so AgriCare can ring and show a notification when a step is due.",
    alarm_test: "Test alarm (10 s)",
    alarm_test_set: "Test alarm set. It will ring in 10 seconds.",
    alarm_test_task: "This is a test alarm. Your treatment reminders will look like this."
});

Object.assign(translations.si, {
    nav_monitor: "නිරීක්ෂණය",
    nav_shops: "සාප්පු",
    voice_listen: "🔊 අහන්න",
    voice_stop: "⏹ නවත්වන්න",
    voice_missing_si: "මෙම උපාංගයේ සිංහල හඬක් ස්ථාපනය කර නැත. Android: Settings › Text-to-speech › Google › සිංහල ස්ථාපනය කරන්න.",
    voice_missing_ta: "මෙම උපාංගයේ දෙමළ හඬක් ස්ථාපනය කර නැත. Android: Settings › Text-to-speech › Google › දෙමළ ස්ථාපනය කරන්න.",
    voice_unsupported: "මෙම බ්‍රව්සරයට පෙළ ශබ්ද නඟා කියවිය නොහැක. Android හි Chrome භාවිත කරන්න.",
    plan_title: "ප්‍රතිකාර සැලැස්ම",
    plan_day: "දිනය",
    plan_start: "ප්‍රතිකාර සහ මතක් කිරීම් අරඹන්න",
    plan_field: "කුඹුරේ නම",
    plan_field_ph: "උදා: පහළ කුඹුර, අක්කර 1",
    plan_date: "ආරම්භක දිනය",
    plan_time: "අනතුරු ඇඟවීමේ වේලාව",
    plan_create: "සැලැස්ම සාදන්න",
    plan_created: "සැලැස්ම සුරැකිණි. සෑම පියවරකටම නියමිත වේලාවට ඔබට අනතුරු ඇඟවීමක් ලැබේ.",
    plan_open_monitor: "නිරීක්ෂණය විවෘත කරන්න",
    mon_title: "ප්‍රතිකාර නිරීක්ෂණය",
    mon_lead: "සෑම ප්‍රතිකාර පියවරක්ම අනුගමනය කරන්න, බෝගයේ තත්ත්වය සටහන් කරන්න, කාර්යයක් නියමිත විට අනතුරු ඇඟවීමක් ලබාගන්න.",
    mon_empty_t: "තවම ප්‍රතිකාර සැලසුම් නැත",
    mon_empty_d: "කොළයක් ස්කෑන් කර “ප්‍රතිකාර සහ මතක් කිරීම් අරඹන්න” ඔබන්න, නැතහොත් නියැදි සැලැස්මක් පූරණය කරන්න.",
    mon_sample: "නියැදි සැලැස්ම පූරණය කරන්න",
    mon_scan: "කොළයක් ස්කෑන් කරන්න",
    mon_next: "ඊළඟ පියවර",
    mon_all_done: "සියලු පියවර අවසන්",
    mon_progress: "පියවර අවසන්",
    mon_mark_done: "අවසන් ලෙස සලකුණු කරන්න",
    mon_undo: "අවලංගු කරන්න",
    mon_started: "ආරම්භය",
    mon_rescan: "නැවත ස්කෑන් කරන්න",
    mon_calendar: "📅 දුරකථන දින දර්ශනයට එක් කරන්න",
    mon_calendar_note: "මෙම වෙබ් අඩවිය වසා ඇති විටද දින දර්ශන අනතුරු ඇඟවීම් නාද වේ.",
    mon_delete: "සැලැස්ම මකන්න",
    mon_delete_q: "මෙම සැලැස්ම සහ මතක් කිරීම් මකන්නද?",
    mon_delete_yes: "ඔව්, මකන්න",
    mon_cancel: "අවලංගු කරන්න",
    mon_history: "බෝග තත්ත්ව සටහන",
    st_done: "අවසන්",
    st_today: "අද කළ යුතුයි",
    st_overdue: "කල් ඉකුත්",
    st_upcoming: "ඉදිරියට",
    cond_q: "බෝගය දැන් කොහොමද?",
    cond_better: "හොඳයි",
    cond_same: "එලෙසමයි",
    cond_worse: "නරකයි",
    worse_alert: "ගැටලුව උග්‍ර වෙමින් පවතී. අදම ප්‍රධාන ප්‍රතිකාර පියවර නැවත කරන්න, සියලු යූරියා නවත්වන්න, රෝගය තහවුරු කිරීමට දින 3කින් නැවත කොළයක් ස්කෑන් කරන්න.",
    alarm_title: "⏰ ප්‍රතිකාර මතක් කිරීම",
    alarm_snooze: "මිනිත්තු 10කින් නැවත",
    alarm_close: "වසන්න",
    alarm_enable: "🔔 අනතුරු ඇඟවීම් සක්‍රිය කරන්න",
    alarm_on: "අනතුරු ඇඟවීම් සක්‍රියයි. AgriCare බ්‍රව්සරයේ විවෘතව ඇති විට ඒවා නාද වේ.",
    alarm_off: "පියවරක් නියමිත විට නාද වීමට හා දැනුම්දීමක් පෙන්වීමට අනතුරු ඇඟවීම් සක්‍රිය කරන්න.",
    alarm_test: "පරීක්ෂණ අනතුරු ඇඟවීම (තත්. 10)",
    alarm_test_set: "පරීක්ෂණ අනතුරු ඇඟවීම සකසා ඇත. තත්පර 10කින් නාද වේ.",
    alarm_test_task: "මෙය පරීක්ෂණ අනතුරු ඇඟවීමකි. ඔබේ ප්‍රතිකාර මතක් කිරීම් මේ ආකාරයට දිස්වේ."
});

Object.assign(translations.ta, {
    nav_monitor: "கண்காணிப்பு",
    nav_shops: "கடைகள்",
    voice_listen: "🔊 கேளுங்கள்",
    voice_stop: "⏹ நிறுத்து",
    voice_missing_si: "இந்தச் சாதனத்தில் சிங்களக் குரல் நிறுவப்படவில்லை. Android: Settings › Text-to-speech › Google › சிங்களத்தை நிறுவுங்கள்.",
    voice_missing_ta: "இந்தச் சாதனத்தில் தமிழ்க் குரல் நிறுவப்படவில்லை. Android: Settings › Text-to-speech › Google › தமிழை நிறுவுங்கள்.",
    voice_unsupported: "இந்த உலாவியால் உரையை வாசிக்க முடியாது. Android இல் Chrome ஐப் பயன்படுத்துங்கள்.",
    plan_title: "சிகிச்சைத் திட்டம்",
    plan_day: "நாள்",
    plan_start: "சிகிச்சை & நினைவூட்டல்களைத் தொடங்கு",
    plan_field: "வயலின் பெயர்",
    plan_field_ph: "உ.ம்: கீழ் வயல், 1 ஏக்கர்",
    plan_date: "தொடக்க தேதி",
    plan_time: "அலாரம் நேரம்",
    plan_create: "திட்டத்தை உருவாக்கு",
    plan_created: "திட்டம் சேமிக்கப்பட்டது. ஒவ்வொரு படியும் வரும்போது அலாரம் ஒலிக்கும்.",
    plan_open_monitor: "கண்காணிப்பைத் திற",
    mon_title: "சிகிச்சைக் கண்காணிப்பு",
    mon_lead: "ஒவ்வொரு சிகிச்சைப் படியையும் பின்பற்றி, பயிரின் நிலையைப் பதிவுசெய்து, பணி வரும்போது அலாரம் பெறுங்கள்.",
    mon_empty_t: "இன்னும் சிகிச்சைத் திட்டங்கள் இல்லை",
    mon_empty_d: "இலையை ஸ்கேன் செய்து “சிகிச்சை & நினைவூட்டல்களைத் தொடங்கு” என்பதை அழுத்துங்கள், அல்லது மாதிரித் திட்டத்தை ஏற்றுங்கள்.",
    mon_sample: "மாதிரித் திட்டத்தை ஏற்று",
    mon_scan: "இலையை ஸ்கேன் செய்",
    mon_next: "அடுத்த படி",
    mon_all_done: "அனைத்துப் படிகளும் முடிந்தன",
    mon_progress: "படிகள் முடிந்தன",
    mon_mark_done: "முடிந்ததாகக் குறி",
    mon_undo: "மீளமை",
    mon_started: "தொடக்கம்",
    mon_rescan: "மீண்டும் ஸ்கேன் செய்",
    mon_calendar: "📅 கைபேசி நாட்காட்டியில் சேர்",
    mon_calendar_note: "இந்த இணையதளம் மூடியிருந்தாலும் நாட்காட்டி அலாரங்கள் ஒலிக்கும்.",
    mon_delete: "திட்டத்தை நீக்கு",
    mon_delete_q: "இந்தத் திட்டத்தையும் நினைவூட்டல்களையும் நீக்கவா?",
    mon_delete_yes: "ஆம், நீக்கு",
    mon_cancel: "ரத்துசெய்",
    mon_history: "பயிர் நிலைப் பதிவு",
    st_done: "முடிந்தது",
    st_today: "இன்று செய்ய வேண்டும்",
    st_overdue: "தாமதம்",
    st_upcoming: "வரவிருக்கும்",
    cond_q: "பயிர் இப்போது எப்படி உள்ளது?",
    cond_better: "மேம்பட்டுள்ளது",
    cond_same: "அப்படியே",
    cond_worse: "மோசமாகியுள்ளது",
    worse_alert: "பிரச்சினை மோசமாகிறது. இன்றே முக்கிய சிகிச்சைப் படியை மீண்டும் செய்யுங்கள், யூரியாவை முற்றாக நிறுத்துங்கள், நோயை உறுதிப்படுத்த 3 நாட்களில் மீண்டும் ஒரு இலையை ஸ்கேன் செய்யுங்கள்.",
    alarm_title: "⏰ சிகிச்சை நினைவூட்டல்",
    alarm_snooze: "10 நிமிடத்தில் மீண்டும்",
    alarm_close: "மூடு",
    alarm_enable: "🔔 அலாரங்களை இயக்கு",
    alarm_on: "அலாரங்கள் இயக்கத்தில் உள்ளன. AgriCare உலாவியில் திறந்திருக்கும்போது ஒலிக்கும்.",
    alarm_off: "படி வரும்போது ஒலிக்கவும் அறிவிப்பைக் காட்டவும் அலாரங்களை இயக்குங்கள்.",
    alarm_test: "சோதனை அலாரம் (10 வி)",
    alarm_test_set: "சோதனை அலாரம் அமைக்கப்பட்டது. 10 விநாடிகளில் ஒலிக்கும்.",
    alarm_test_task: "இது ஒரு சோதனை அலாரம். உங்கள் சிகிச்சை நினைவூட்டல்கள் இப்படித் தோன்றும்."
});

/* ---------- Treatment plans per disease ----------
   day = days after the start date (0 = start day). check = farmer reports crop condition. */
const TREATMENT_PLANS = {
    blast: [
        { day: 0, text: {
            en: "Stop all urea top-dressing. Walk the field and note how many plants have spots.",
            si: "යූරියා යෙදීම නවත්වන්න. කුඹුර පුරා ඇවිද පුල්ලි ඇති පැළ ප්‍රමාණය සටහන් කරන්න.",
            ta: "யூரியா இடுவதை நிறுத்துங்கள். வயலில் நடந்து புள்ளிகள் உள்ள பயிர்களின் அளவைக் குறித்துக்கொள்ளுங்கள்." } },
        { day: 1, text: {
            en: "Spray the recommended fungicide, such as tricyclazole, in the morning. Use the label dose and wear gloves and a mask.",
            si: "උදෑසන ට්‍රයිසයික්ලසෝල් වැනි නිර්දේශිත දිලීර නාශකය ඉසින්න. ලේබලයේ මාත්‍රාව යොදා අත්වැසුම් හා මුහුණු ආවරණ පළඳින්න.",
            ta: "காலையில் ட்ரைசைக்ளசோல் போன்ற பரிந்துரைக்கப்பட்ட பூஞ்சைக்கொல்லியைத் தெளியுங்கள். லேபிள் அளவைப் பயன்படுத்தி, கையுறை, முகக்கவசம் அணியுங்கள்." } },
        { day: 4, check: true, text: {
            en: "Check the field for new spots and scan a leaf again.",
            si: "අලුත් පුල්ලි ඇත්දැයි කුඹුර පරීක්ෂා කර නැවත කොළයක් ස්කෑන් කරන්න.",
            ta: "புதிய புள்ளிகள் உள்ளனவா என வயலைச் சோதித்து மீண்டும் ஒரு இலையை ஸ்கேன் செய்யுங்கள்." } },
        { day: 11, text: {
            en: "If new spots are still appearing, spray tricyclazole a second time at the label dose.",
            si: "තවමත් අලුත් පුල්ලි ඇති වේ නම්, ලේබලයේ මාත්‍රාවෙන් ට්‍රයිසයික්ලසෝල් (tricyclazole) දෙවන වරට ඉසින්න.",
            ta: "இன்னும் புதிய புள்ளிகள் தோன்றினால், லேபிள் அளவில் ட்ரைசைக்ளசோல் (tricyclazole) ஐ இரண்டாவது முறை தெளியுங்கள்." } },
        { day: 14, check: true, text: {
            en: "Final check. If the disease is still spreading, spray once more with a different fungicide, isoprothiolane, and keep urea stopped.",
            si: "අවසාන පරීක්ෂාව. රෝගය තවමත් පැතිරේ නම්, වෙනත් දිලීර නාශකයක් වන අයිසොප්‍රොතයොලේන් (isoprothiolane) එක් වරක් ඉස, යූරියා නවත්වා තබන්න.",
            ta: "இறுதிச் சோதனை. நோய் இன்னும் பரவினால், வேறொரு பூஞ்சைக்கொல்லியான ஐசோப்ரோதியோலேன் (isoprothiolane) ஐ ஒருமுறை தெளித்து, யூரியாவை நிறுத்தியே வையுங்கள்." } }
    ],
    bacterial_leaf_blight: [
        { day: 0, text: {
            en: "Drain the field and keep it drained for 3 to 4 days. Do not apply urea.",
            si: "කුඹුරේ ජලය බැස යවා දින 3–4ක් එසේ තබන්න. යූරියා නොයොදන්න.",
            ta: "வயலிலிருந்து நீரை வடித்து 3 முதல் 4 நாட்கள் அப்படியே வையுங்கள். யூரியா இட வேண்டாம்." } },
        { day: 1, text: {
            en: "Remove weeds from the bunds and stop water from this field flowing into other fields.",
            si: "නියරවල වල් පැළ ඉවත් කර මෙම කුඹුරේ ජලය වෙනත් කුඹුරුවලට ගලා යාම නවත්වන්න.",
            ta: "வரம்புகளிலுள்ள களைகளை அகற்றி, இந்த வயலின் நீர் மற்ற வயல்களுக்குப் பாய்வதைத் தடுங்கள்." } },
        { day: 4, check: true, text: {
            en: "Bring back a shallow water level. Check if the yellow streaks are spreading and scan a leaf again.",
            si: "නොගැඹුරු ජල මට්ටමක් නැවත ලබාදෙන්න. කහ ඉරි පැතිරේදැයි බලා නැවත ස්කෑන් කරන්න.",
            ta: "குறைந்த நீர் மட்டத்தை மீண்டும் கொடுங்கள். மஞ்சள் கோடுகள் பரவுகின்றனவா எனப் பார்த்து மீண்டும் ஸ்கேன் செய்யுங்கள்." } },
        { day: 7, text: {
            en: "Look at the new leaves. Keep holding back extra nitrogen.",
            si: "අලුත් කොළ පරීක්ෂා කරන්න. අමතර නයිට්‍රජන් නොයොදා සිටින්න.",
            ta: "புதிய இலைகளைப் பாருங்கள். கூடுதல் நைதரசன் இடாமல் இருங்கள்." } },
        { day: 14, check: true, text: {
            en: "Final check. If many plants are still affected, drain the field for 3 more days and remove the worst plants. Next season, use clean seed of a resistant variety.",
            si: "අවසාන පරීක්ෂාව. තවමත් පැළ රැසකට බලපා ඇත්නම්, තවත් දින 3ක් කුඹුරේ ජලය බැස යවා දරුණුම පැළ ඉවත් කරන්න. ඊළඟ කන්නයේ ප්‍රතිරෝධී ප්‍රභේදයක පිරිසිදු බීජ භාවිත කරන්න.",
            ta: "இறுதிச் சோதனை. இன்னும் பல பயிர்கள் பாதிக்கப்பட்டிருந்தால், மேலும் 3 நாட்கள் வயல் நீரை வடித்து, மோசமான பயிர்களை அகற்றுங்கள். அடுத்த போகத்தில் எதிர்ப்புத் திறன் கொண்ட இனத்தின் சுத்தமான விதையைப் பயன்படுத்துங்கள்." } }
    ],
    brown_spot: [
        { day: 0, text: {
            en: "Apply potassium fertilizer (MOP) as the Department of Agriculture recommends for your soil.",
            si: "ඔබේ පසට කෘෂිකර්ම දෙපාර්තමේන්තුව නිර්දේශ කරන පරිදි පොටෑසියම් පොහොර (MOP) යොදන්න.",
            ta: "உங்கள் மண்ணுக்கு விவசாயத் திணைக்களம் பரிந்துரைக்கும்படி பொட்டாசியம் உரத்தை (MOP) இடுங்கள்." } },
        { day: 1, text: {
            en: "Make sure the field has water. Do not let the crop suffer drought.",
            si: "කුඹුරේ ජලය ඇති බව තහවුරු කරන්න. බෝගයට නියඟයක් ඇති නොවිය යුතුය.",
            ta: "வயலில் நீர் இருப்பதை உறுதிசெய்யுங்கள். பயிர் வறட்சியால் பாதிக்கக்கூடாது." } },
        { day: 7, check: true, text: {
            en: "Check the new leaves for spots and scan a leaf again.",
            si: "අලුත් කොළවල පුල්ලි ඇත්දැයි බලා නැවත ස්කෑන් කරන්න.",
            ta: "புதிய இலைகளில் புள்ளிகள் உள்ளனவா எனப் பார்த்து மீண்டும் ஸ்கேன் செய்யுங்கள்." } },
        { day: 10, text: {
            en: "If spots are still spreading on the new leaves, spray propiconazole at the label dose.",
            si: "අලුත් කොළවලද පුල්ලි පැතිරේ නම්, ලේබලයේ මාත්‍රාවෙන් ප්‍රොපිකොනසෝල් (propiconazole) ඉසින්න.",
            ta: "புதிய இலைகளிலும் புள்ளிகள் பரவினால், லேபிள் அளவில் ப்ரோபிகொனசோல் (propiconazole) ஐத் தெளியுங்கள்." } },
        { day: 21, check: true, text: {
            en: "Final check. Plan to use certified, treated seed next season.",
            si: "අවසාන පරීක්ෂාව. ඊළඟ කන්නයට සහතික කළ, පිරියම් කළ බීජ භාවිතයට සැලසුම් කරන්න.",
            ta: "இறுதிச் சோதனை. அடுத்த போகத்தில் சான்றளிக்கப்பட்ட, பதப்படுத்திய விதையைப் பயன்படுத்தத் திட்டமிடுங்கள்." } }
    ],
    sheath_blight: [
        { day: 0, text: {
            en: "Stop extra nitrogen. Check the lower part of the plants near the water for grey patches.",
            si: "අමතර නයිට්‍රජන් නවත්වන්න. ජලය අසල පැළයේ පහළ කොටසේ අළු පැල්ලම් ඇත්දැයි බලන්න.",
            ta: "கூடுதல் நைதரசனை நிறுத்துங்கள். நீருக்கு அருகில் பயிரின் கீழ்ப்பகுதியில் சாம்பல் திட்டுகள் உள்ளனவா எனப் பாருங்கள்." } },
        { day: 1, text: {
            en: "Spray the recommended fungicide, such as hexaconazole, aimed at the base of the plants.",
            si: "හෙක්සකොනසෝල් වැනි නිර්දේශිත දිලීර නාශකය පැළයේ පාමුලට යොමු කර ඉසින්න.",
            ta: "ஹெக்சகொனசோல் போன்ற பரிந்துரைக்கப்பட்ட பூஞ்சைக்கொல்லியைப் பயிரின் அடிப்பகுதியை நோக்கித் தெளியுங்கள்." } },
        { day: 5, check: true, text: {
            en: "Check whether the patches are climbing higher and scan a leaf again.",
            si: "පැල්ලම් ඉහළට පැතිරේදැයි බලා නැවත ස්කෑන් කරන්න.",
            ta: "திட்டுகள் மேலே பரவுகின்றனவா எனப் பார்த்து மீண்டும் ஸ்கேன் செய்யுங்கள்." } },
        { day: 12, text: {
            en: "If patches are still spreading, spray hexaconazole a second time at the label dose.",
            si: "පැල්ලම් තවමත් පැතිරේ නම්, ලේබලයේ මාත්‍රාවෙන් හෙක්සකොනසෝල් දෙවන වරට ඉසින්න.",
            ta: "திட்டுகள் இன்னும் பரவினால், லேபிள் அளவில் ஹெக்சகொனசோலை இரண்டாவது முறை தெளியுங்கள்." } },
        { day: 18, check: true, text: {
            en: "Final check. Note the spacing to use next season.",
            si: "අවසාන පරීක්ෂාව. ඊළඟ කන්නයට භාවිත කළ යුතු පරතරය සටහන් කරන්න.",
            ta: "இறுதிச் சோதனை. அடுத்த போகத்துக்கான இடைவெளியைக் குறித்துக்கொள்ளுங்கள்." } }
    ],
    tungro: [
        { day: 0, text: {
            en: "Pull out the yellow, stunted plants and destroy them away from the field.",
            si: "කහ වූ, කුරු පැළ ගලවා කුඹුරෙන් ඈතට ගෙන ගොස් විනාශ කරන්න.",
            ta: "மஞ்சளான, குட்டையான பயிர்களைப் பிடுங்கி வயலுக்கு அப்பால் அழித்துவிடுங்கள்." } },
        { day: 1, text: {
            en: "Look for green leafhoppers. If many jump from the plants, spray imidacloprid or thiamethoxam at the label dose.",
            si: "කොළ පැල කීඩෑවන් සොයා බලන්න. පැළවලින් බොහෝ දෙනෙක් පනිනවා නම්, ලේබලයේ මාත්‍රාවෙන් ඉමිඩාක්ලෝප්‍රිඩ් (imidacloprid) හෝ තයමිතොක්සම් (thiamethoxam) ඉසින්න.",
            ta: "பச்சைத் தத்துப்பூச்சிகளைத் தேடுங்கள். பயிர்களிலிருந்து பல தாவினால், லேபிள் அளவில் இமிடாகுளோப்ரிட் (imidacloprid) அல்லது தயமீதாக்சம் (thiamethoxam) ஐத் தெளியுங்கள்." } },
        { day: 3, text: {
            en: "Tell your neighbouring farmers, so everyone removes infected plants and controls leafhoppers in the same week.",
            si: "සියලු දෙනා එකම සතියේ රෝගී පැළ ඉවත් කර කීඩෑවන් පාලනය කරන සේ අසල්වැසි ගොවීන්ට දන්වන්න.",
            ta: "அனைவரும் ஒரே வாரத்தில் நோயுற்ற பயிர்களை அகற்றித் தத்துப்பூச்சிகளைக் கட்டுப்படுத்த அயல் விவசாயிகளுக்குத் தெரிவியுங்கள்." } },
        { day: 7, check: true, text: {
            en: "Check the remaining plants and remove any new infected ones.",
            si: "ඉතිරි පැළ පරීක්ෂා කර අලුතින් රෝගී වූ පැළ ඉවත් කරන්න.",
            ta: "மீதமுள்ள பயிர்களைச் சோதித்துப் புதிதாகப் பாதிக்கப்பட்டவற்றை அகற்றுங்கள்." } },
        { day: 14, check: true, text: {
            en: "Final check. Plan to plant at the same time as your neighbours next season.",
            si: "අවසාන පරීක්ෂාව. ඊළඟ කන්නයේ අසල්වැසි ගොවීන් සමඟ එකවර වගා කිරීමට සැලසුම් කරන්න.",
            ta: "இறுதிச் சோதனை. அடுத்த போகத்தில் அயலவர்களுடன் ஒரே நேரத்தில் பயிரிடத் திட்டமிடுங்கள்." } }
    ],
    red_stripe: [
        { day: 0, text: {
            en: "Stop extra urea. Drain the field for 2–3 days, then keep only a shallow water level.",
            si: "අමතර යූරියා නවත්වන්න. දින 2–3ක් කුඹුරේ ජලය බැස යවා, පසුව නොගැඹුරු ජල මට්ටමක් පමණක් තබාගන්න.",
            ta: "மேலதிக யூரியாவை நிறுத்துங்கள். 2–3 நாட்கள் வயல் நீரை வடித்துப் பின் ஆழமற்ற நீர் மட்டத்தை மட்டும் பேணுங்கள்." } },
        { day: 1, text: {
            en: "Spray thiophanate-methyl at the label dose in the early morning or evening, covering the upper leaves well.",
            si: "උදෑසන හෝ සවස ලේබලයේ මාත්‍රාවෙන් තයෝෆැනේට්-මෙතිල් (thiophanate-methyl) ඉහළ කොළ හොඳින් තෙමෙන සේ ඉසින්න.",
            ta: "அதிகாலை அல்லது மாலையில் லேபிள் அளவில் தயோஃபனேட்-மெதில் (thiophanate-methyl) ஐ மேல் இலைகள் நன்கு நனையும்படி தெளியுங்கள்." } },
        { day: 7, check: true, text: {
            en: "Check the top leaves. Are new red stripes appearing?",
            si: "ඉහළ කොළ පරීක්ෂා කරන්න. අලුත් රතු ඉරි ඇති වෙනවාද?",
            ta: "மேல் இலைகளைச் சோதியுங்கள். புதிய சிவப்புக் கோடுகள் தோன்றுகின்றனவா?" } },
        { day: 12, text: {
            en: "If new stripes are still appearing, spray thiophanate-methyl a second time at the label dose.",
            si: "අලුත් ඉරි තවමත් ඇති වේ නම්, ලේබලයේ මාත්‍රාවෙන් තයෝෆැනේට්-මෙතිල් දෙවන වරට ඉසින්න.",
            ta: "புதிய கோடுகள் இன்னும் தோன்றினால், லேபிள் அளவில் தயோஃபனேட்-மெதிலை இரண்டாவது முறை தெளியுங்கள்." } },
        { day: 18, check: true, text: {
            en: "Final check. Next season give urea in split doses and do not over-fertilize.",
            si: "අවසාන පරීක්ෂාව. ඊළඟ කන්නයේ යූරියා කොටස් වශයෙන් දී වැඩිපුර පොහොර නොදමන්න.",
            ta: "இறுதிச் சோதனை. அடுத்த போகத்தில் யூரியாவைப் பிரித்து இடுங்கள், அதிகமாக உரம் இட வேண்டாம்." } }
    ],
    healthy: [
        { day: 7, check: true, text: {
            en: "Weekly field check. Look at the leaves and scan one if you see spots.",
            si: "සතිපතා කුඹුරු පරීක්ෂාව. කොළ බලා පුල්ලි දුටුවහොත් එකක් ස්කෑන් කරන්න.",
            ta: "வாராந்திர வயல் சோதனை. இலைகளைப் பார்த்து, புள்ளிகள் தெரிந்தால் ஒன்றை ஸ்கேன் செய்யுங்கள்." } },
        { day: 14, check: true, text: {
            en: "Weekly field check, especially after rain.",
            si: "සතිපතා කුඹුරු පරීක්ෂාව, විශේෂයෙන් වැසි වලින් පසු.",
            ta: "வாராந்திர வயல் சோதனை, குறிப்பாக மழைக்குப் பின்." } }
    ]
};

function diseaseInfo(id) {
    if (id === "healthy") return HEALTHY;
    const d = DISEASES.find(x => x.id === id);
    if (d) return d;
    const p = (typeof PESTS !== "undefined") && PESTS.find(x => x.id === id);
    if (p) return { id: p.id, type: "pest", pest: true, swatch: "leaf-bg", name: p.name, summary: p.summary, sci: p.sci };
    // a class from the model that is not in the disease library yet
    const name = String(id || "unknown").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    return {
        id, type: "unknown", swatch: "leaf-bg", unknown: true, name: NAMES[id] || { en: name, si: name, ta: name },
        summary: {
            en: "This disease is not in the AgriCare library yet. Take a clear photo of one leaf in daylight and scan again. Meanwhile, remove badly affected plants and stop extra urea.",
            si: "මෙම රෝගය තවම AgriCare පුස්තකාලයේ නැත. දිවා ආලෝකයේ එක් කොළයක පැහැදිලි ඡායාරූපයක් ගෙන නැවත ස්කෑන් කරන්න. ඒ අතරතුර දරුණු ලෙස රෝගී වූ පැළ ඉවත් කර අමතර යූරියා නවත්වන්න.",
            ta: "இந்த நோய் இன்னும் AgriCare நூலகத்தில் இல்லை. பகல் வெளிச்சத்தில் ஒரு இலையைத் தெளிவாகப் படம் எடுத்து மீண்டும் ஸ்கேன் செய்யுங்கள். இதற்கிடையில், கடுமையாகப் பாதிக்கப்பட்ட பயிர்களை அகற்றி, கூடுதல் யூரியாவை நிறுத்துங்கள்."
        },
        symptoms: [], conditions: [], manage: [], prevent: []
    };
}

/* ---------- Voice (text-to-speech) ----------
   Order of voices tried:
   1. A voice installed on the device for the chosen language
      (Android: Google Speech Services; Windows/Mac: Microsoft Edge has free Sinhala & Tamil "Online (Natural)" voices).
   2. If the device has no Sinhala/Tamil voice: an online voice (Google Translate speech audio).
      Needs internet. It is an unofficial Google service, so it can stop working at any time.
   3. If both fail, the farmer sees how to install a voice. */

Object.assign(translations.en, {
    voice_online: "Using online voice (needs internet).",
    voice_failed_si: "Sinhala voice is not available on this device. Use Microsoft Edge on a computer, or on Android install Sinhala in Settings › Text-to-speech › Speech Services by Google.",
    voice_failed_ta: "Tamil voice is not available on this device. Use Microsoft Edge on a computer, or on Android install Tamil in Settings › Text-to-speech › Speech Services by Google.",
    chk_online: "online voice (needs internet)"
});
Object.assign(translations.si, {
    voice_online: "අන්තර්ජාල හඬ භාවිත කරයි (අන්තර්ජාලය අවශ්‍යයි).",
    voice_failed_si: "මෙම උපාංගයේ සිංහල හඬ නැත. පරිගණකයේ Microsoft Edge භාවිත කරන්න, නැතහොත් Android හි Settings › Text-to-speech › Speech Services by Google තුළ සිංහල ස්ථාපනය කරන්න.",
    voice_failed_ta: "මෙම උපාංගයේ දෙමළ හඬ නැත. පරිගණකයේ Microsoft Edge භාවිත කරන්න, නැතහොත් Android හි Settings › Text-to-speech › Speech Services by Google තුළ දෙමළ ස්ථාපනය කරන්න.",
    chk_online: "අන්තර්ජාල හඬ (අන්තර්ජාලය අවශ්‍යයි)"
});
Object.assign(translations.ta, {
    voice_online: "இணையக் குரல் பயன்படுத்தப்படுகிறது (இணையம் தேவை).",
    voice_failed_si: "இந்தச் சாதனத்தில் சிங்களக் குரல் இல்லை. கணினியில் Microsoft Edge ஐப் பயன்படுத்துங்கள், அல்லது Android இல் Settings › Text-to-speech › Speech Services by Google இல் சிங்களத்தை நிறுவுங்கள்.",
    voice_failed_ta: "இந்தச் சாதனத்தில் தமிழ்க் குரல் இல்லை. கணினியில் Microsoft Edge ஐப் பயன்படுத்துங்கள், அல்லது Android இல் Settings › Text-to-speech › Speech Services by Google இல் தமிழை நிறுவுங்கள்.",
    chk_online: "இணையக் குரல் (இணையம் தேவை)"
});

/* ---------- Recorded voice clips ----------
   Sinhala/Tamil MP3 clips in /voice/si and /voice/ta, made once with tools/make_voices.py.
   They play on every device, even offline. voice/manifest.js lists each clip with a hash of
   its text, so a clip is only used while the text it was made from has not changed. */
const AgriClips = {
    root: (location.pathname.includes("/pages/") ? "../" : "") + "voice/",
    hash(s) {   // djb2 over UTF-16 code units (same in tools/make_voices.py)
        let h = 5381;
        for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
        return h.toString(36);
    },
    count(lang) { const m = window.AGRI_VOICE_CLIPS; return m && m[lang] ? Object.keys(m[lang]).length : 0; },
    has(lang, id, text) {
        const m = window.AGRI_VOICE_CLIPS, h = m && m[lang] && m[lang][id];
        return !!h && (h === this.hash(text) || h === this.hash(text) + "~f");   // "~f" = basic offline voice
    },
    url(lang, id) { return this.root + lang + "/" + id + ".mp3"; }
};
(function loadClipManifest() {
    if (typeof document === "undefined" || !document.createElement) return;
    const s = document.createElement("script");
    s.src = AgriClips.root + "manifest.js";
    s.onload = () => document.dispatchEvent(new CustomEvent("agricare:alarmstate"));
    (document.head || document.documentElement).appendChild(s);
})();

/* Speech is built from parts: { id, text }. Parts with an id can be played from a clip. */
const VP = {
    part: (id, text) => ({ id, text }),
    title: () => VP.part("alarm_title", t("alarm_title").replace("⏰", "").trim()),
    name: d => VP.part("name_" + d, localText(diseaseInfo(d).name)),
    summary: d => VP.part("sum_" + d, localText(diseaseInfo(d).summary)),
    planTitle: () => VP.part("plan_title", t("plan_title")),
    day: n => VP.part("day_" + n, t("plan_day") + " " + n),
    step: (d, i) => VP.part("step_" + d + "_" + i, localText((TREATMENT_PLANS[d] || TREATMENT_PLANS.healthy)[i].text)),
    conf: pct => VP.part(pct >= 50 ? "conf_" + pct : null, t("up_confidence") + " " + pct + "%"),
    test: () => VP.part("alarm_test", t("alarm_test_task"))
};

/* Every phrase that can be recorded, for one language (used by tools/export-phrases.js) */
function agriVoicePhrases(lang) {
    const keep = window.__agriLang;
    window.__agriLang = lang;
    const out = {};
    const add = p => { if (p.id) out[p.id] = p.text; };
    const ids = DISEASES.map(d => d.id).concat("healthy", (typeof PESTS !== "undefined") ? PESTS.map(p => p.id) : []);
    const days = new Set();
    ids.forEach(d => {
        add(VP.name(d)); add(VP.summary(d));
        (TREATMENT_PLANS[d] || []).forEach((s, i) => { add(VP.step(d, i)); days.add(s.day + 1); });
    });
    [...days].sort((a, b) => a - b).forEach(n => add(VP.day(n)));
    for (let p = 50; p <= 100; p++) add(VP.conf(p));
    add(VP.planTitle()); add(VP.title()); add(VP.test());
    window.__agriLang = keep;
    return out;
}

const AgriVoice = {
    // Sri Lankan variants first
    langCodes: { en: ["en-GB", "en-US", "en-IN", "en"], si: ["si-LK", "si"], ta: ["ta-LK", "ta-IN", "ta"] },
    voices: [],
    audio: null,        // <audio> used by the online voice
    queue: [],
    session: 0,         // increases on every speak/stop so old callbacks are ignored

    load() {
        if ("speechSynthesis" in window) this.voices = speechSynthesis.getVoices();
    },
    norm(code) { return (code || "").toLowerCase().replace(/_/g, "-"); },

    /* Best installed voice for a language, or null */
    findVoice(lang) {
        // always ask again: Edge adds its online Sinhala/Tamil voices a moment after the page loads
        let vs = ("speechSynthesis" in window) ? speechSynthesis.getVoices() : [];
        if (!vs.length) vs = this.voices;
        // a voice the farmer picked on the Voice Test page wins
        const chosen = AgriStore.get("agricare_voice_" + lang);
        if (chosen) { const v = vs.find(x => x.name === chosen); if (v) return v; }
        const codes = this.langCodes[lang] || this.langCodes.en;
        for (const c of codes) {
            const matches = vs.filter(v => this.norm(v.lang).startsWith(this.norm(c)));
            if (matches.length) {
                // prefer natural/online/Google voices, they sound much better
                return matches.find(v => /natural|online|google/i.test(v.name)) || matches[0];
            }
        }
        return null;
    },

    /* Split text into pieces short enough for each engine */
    chunks(text, max) {
        const out = [];
        text.split(/(?<=[.!?।])\s+/).filter(Boolean).forEach(sentence => {
            if (sentence.length <= max) { out.push(sentence); return; }
            let cur = "";
            sentence.split(/\s+/).forEach(w => {
                if ((cur + " " + w).trim().length > max) { if (cur) out.push(cur); cur = w; }
                else cur = (cur + " " + w).trim();
            });
            if (cur) out.push(cur);
        });
        return out;
    },

    /* Speak in the current language. `input` is a string or an array of { id, text } parts.
       onEnd: called when finished. onMsg(text): shows a short note to the farmer ("" clears it). */
    speak(input, onEnd, onMsg) {
        this.stop();
        const my = ++this.session;
        const lang = getLanguage();
        const say = m => { if (onMsg && my === this.session) onMsg(m); };
        const done = () => { if (my === this.session && onEnd) onEnd(); };
        const parts = (typeof input === "string" ? [{ text: input }] : input).filter(p => p && p.text);
        const text = parts.map(p => /[.!?।]$/.test(p.text.trim()) ? p.text.trim() : p.text.trim() + ".").join(" ");

        const fallback = () => this.speakSynth(text, lang, my, done, say);

        // 1. recorded clips (parts without an id, like a field name, are skipped)
        {
            const withId = parts.filter(p => p.id);
            if (withId.length && withId.every(p => AgriClips.has(lang, p.id, p.text))) {
                say("");
                this.playUrls(withId.map(p => AgriClips.url(lang, p.id)), my, done, fallback);
                return "";
            }
        }
        return fallback();
    },

    /* All installed voices for a language, best first: the one that worked last time,
       the one picked on the Voice Test page, voices on the device, then online voices. */
    candidates(lang) {
        const vs = ("speechSynthesis" in window) ? speechSynthesis.getVoices() : [];
        const codes = this.langCodes[lang] || this.langCodes.en;
        const match = vs.filter(v => codes.some(c => this.norm(v.lang).startsWith(this.norm(c))));
        const rank = v => {
            if (v.name === AgriStore.get("agricare_voice_ok_" + lang)) return 0;
            if (v.name === AgriStore.get("agricare_voice_" + lang)) return 1;
            const i = codes.findIndex(c => this.norm(v.lang).startsWith(this.norm(c)));
            return 2 + (v.localService ? 0 : 10) + i;
        };
        return match.sort((x, y) => rank(x) - rank(y));
    },

    /* 2. device voices, one after another until one really speaks, 3. online voice */
    speakSynth(text, lang, my, done, say) {
        const online = () => {
            const urls = this.chunks(text, 180).map(p => this.onlineUrl(p, lang));
            say(t("voice_online"));
            this.playUrls(urls, my, done, () => {
                say(lang === "en" ? t("voice_unsupported") : t("voice_failed_" + lang));
                done();
            });
        };
        const cands = ("speechSynthesis" in window) ? this.candidates(lang).slice(0, 6) : [];
        say("");
        const tryVoice = i => {
            if (my !== this.session) return;
            if (i >= cands.length) { online(); return; }
            const v = cands[i];
            this.speakDevice(text, lang, v, my, done,
                () => { speechSynthesis.cancel(); tryVoice(i + 1); },              // silent: next voice
                () => AgriStore.set("agricare_voice_ok_" + lang, v.name));         // spoke: remember it
        };
        tryVoice(0);
        return "";
    },

    speakDevice(text, lang, voice, my, done, silent, started_cb) {
        // Chrome stops long speech after ~15 s, so speak in short pieces
        const parts = this.chunks(text, 200);
        let started = false;
        // online voices need a moment to start, local ones are instant
        const watchdog = setTimeout(() => { if (!started && my === this.session) silent(); }, voice.localService ? 2500 : 4500);
        // Chromium can drop speech queued in the same moment as cancel(), so wait a tick
        setTimeout(() => {
            if (my !== this.session) { clearTimeout(watchdog); return; }
            parts.forEach((p, i) => {
                const u = new SpeechSynthesisUtterance(p);
                u.lang = voice.lang;
                try { u.voice = voice; } catch (e) { /* keep the language only */ }
                u.rate = 0.95;
                u.onstart = () => { if (!started && started_cb) started_cb(); started = true; clearTimeout(watchdog); };
                if (i === parts.length - 1) u.onend = () => { if (my === this.session) done(); };
                u.onerror = e => {
                    if (e.error === "interrupted" || e.error === "canceled") return;
                    if (!started && my === this.session) { clearTimeout(watchdog); silent(); }
                };
                (this._keep = this._keep || []).push(u);   // stop the browser from losing the utterance
                speechSynthesis.speak(u);
            });
            if (speechSynthesis.paused) speechSynthesis.resume();
        }, 60);
    },

    onlineUrl(piece, lang) {
        return "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=" + lang +
               "&q=" + encodeURIComponent(piece);
    },

    /* Play audio files one after another. fail() is called if the first one cannot play. */
    playUrls(urls, my, done, fail) {
        this.queue = urls.slice();
        let played = 0;
        const next = () => {
            if (my !== this.session) return;
            const url = this.queue.shift();
            if (!url) { done(); return; }
            const a = new Audio();
            this.audio = a;
            a.onended = () => { played++; next(); };
            a.onerror = () => { if (my !== this.session) return; if (played === 0) fail(); else next(); };
            a.src = url;
            const p = a.play();
            if (p && p.catch) p.catch(() => { if (my === this.session && played === 0) fail(); });
        };
        next();
    },

    /* Can this language be spoken here? "device" | "online" | "none" */
    support(lang) {
        if (AgriClips.count(lang)) return "clips";
        if (("speechSynthesis" in window) && this.findVoice(lang)) return "device";
        return "online";
    },

    stop() {
        this.session++;
        this._keep = [];
        if ("speechSynthesis" in window) speechSynthesis.cancel();
        this.queue = [];
        if (this.audio) { try { this.audio.pause(); this.audio.src = ""; } catch (e) {} this.audio = null; }
    },
    speaking() {
        return (("speechSynthesis" in window) && speechSynthesis.speaking) || !!(this.audio && !this.audio.paused);
    }
};
if ("speechSynthesis" in window) {
    AgriVoice.load();
    speechSynthesis.onvoiceschanged = () => {
        AgriVoice.load();
        document.dispatchEvent(new CustomEvent("agricare:alarmstate"));
    };
}

/* Wire a button to read text aloud, toggling to Stop while speaking. */
function makeListenButton(getText, msgEl) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost btn-sm";
    btn.textContent = t("voice_listen");
    const reset = () => { btn.dataset.on = "0"; btn.textContent = t("voice_listen"); };
    btn.addEventListener("click", () => {
        if (btn.dataset.on === "1") { AgriVoice.stop(); reset(); return; }
        btn.dataset.on = "1";
        btn.textContent = t("voice_stop");
        AgriVoice.speak(getText(), reset, m => { if (msgEl) msgEl.textContent = m; });
    });
    return btn;
}

/* Spoken summary of a diagnosis + its plan, in the current language */
function diagnosisSpeech(label, confidencePct) {
    const info = diseaseInfo(label);
    const parts = [VP.name(info.id)];
    if (confidencePct != null) parts.push(VP.conf(confidencePct));
    parts.push(VP.summary(info.id));
    const plan = TREATMENT_PLANS[info.id] || [];
    if (plan.length) {
        parts.push(VP.planTitle());
        plan.forEach((step, i) => parts.push(VP.day(step.day + 1), VP.step(info.id, i)));
    }
    return parts;
}

/* ---------- Plan storage ---------- */
const AgriPlans = {
    KEY: "agricare_plans",
    memory: null, // used when storage is blocked
    all() {
        if (this.memory) return this.memory;
        try { return JSON.parse(AgriStore.get(this.KEY) || "[]"); } catch (e) { return []; }
    },
    save(plans) {
        if (AgriStore.available()) AgriStore.set(this.KEY, JSON.stringify(plans));
        else this.memory = plans;
        document.dispatchEvent(new CustomEvent("agricare:plans"));
    },
    create({ disease, field, startDate, alarmTime, confidence }) {
        const steps = TREATMENT_PLANS[disease] || TREATMENT_PLANS.healthy;
        const plan = {
            id: "p" + Date.now(),
            disease, field: field || "", startDate, alarmTime: alarmTime || "07:00",
            confidence: confidence == null ? null : confidence,
            createdAt: new Date().toISOString(),
            tasks: steps.map((s, i) => ({ id: "t" + i, day: s.day, check: !!s.check, done: false, doneAt: null, condition: null, alarmedAt: null, snoozeUntil: null }))
        };
        const plans = this.all();
        plans.unshift(plan);
        this.save(plans);
        return plan;
    },
    update(planId, fn) {
        const plans = this.all();
        const p = plans.find(x => x.id === planId);
        if (p) { fn(p); this.save(plans); }
    },
    remove(planId) { this.save(this.all().filter(p => p.id !== planId)); }
};

function taskStep(plan, task) {
    const steps = TREATMENT_PLANS[plan.disease] || TREATMENT_PLANS.healthy;
    return steps[Number(task.id.slice(1))] || steps[0];
}

function taskDue(plan, task) {
    const [y, m, d] = plan.startDate.split("-").map(Number);
    const [hh, mm] = (plan.alarmTime || "07:00").split(":").map(Number);
    return new Date(y, m - 1, d + task.day, hh, mm, 0);
}

function taskState(plan, task, now = new Date()) {
    if (task.done) return "done";
    const due = taskDue(plan, task);
    const sameDay = due.toDateString() === now.toDateString();
    if (sameDay) return "today";
    return due < now ? "overdue" : "upcoming";
}

function formatDate(d) {
    const lang = getLanguage();
    const loc = lang === "si" ? "si-LK" : lang === "ta" ? "ta-LK" : "en-GB";
    try {
        return d.toLocaleDateString(loc, { weekday: "short", day: "numeric", month: "short" }) + " · " +
               d.toLocaleTimeString(loc, { hour: "numeric", minute: "2-digit" });
    } catch (e) { return d.toDateString(); }
}

function todayISO() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

/* ---------- Calendar export (.ics) so phones ring even when the site is closed ---------- */
function planToICS(plan) {
    const pad = n => String(n).padStart(2, "0");
    const stamp = d => d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00";
    const esc = s => String(s).replace(/\\/g, "\\\\").replace(/[,;]/g, m => "\\" + m).replace(/\n/g, "\\n");
    const name = localText(diseaseInfo(plan.disease).name);
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AgriCare//Treatment//EN", "CALSCALE:GREGORIAN"];
    plan.tasks.forEach(task => {
        const due = taskDue(plan, task);
        const end = new Date(due.getTime() + 30 * 60000);
        lines.push(
            "BEGIN:VEVENT",
            "UID:" + plan.id + "-" + task.id + "@agricare",
            "DTSTAMP:" + stamp(new Date()),
            "DTSTART:" + stamp(due),
            "DTEND:" + stamp(end),
            "SUMMARY:" + esc("AgriCare – " + name + (plan.field ? " (" + plan.field + ")" : "")),
            "DESCRIPTION:" + esc(localText(taskStep(plan, task).text)),
            "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + esc(localText(taskStep(plan, task).text)), "TRIGGER:PT0M", "END:VALARM",
            "END:VEVENT"
        );
    });
    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
}

function downloadICS(plan) {
    const blob = new Blob([planToICS(plan)], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "agricare-" + plan.disease + ".ics";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

/* ---------- Alarm engine ----------
   How it works:
   • Every 15 s (and whenever the page becomes visible again) it looks for steps whose time has passed.
   • A due step shows a full-screen reminder that beeps, vibrates and reads the task aloud.
   • Browsers block sound until the person taps the page, so if sound is still locked the reminder
     shows a big "Tap to hear" button; one tap starts the sound and voice.
   • A notification is also shown (through the service worker, which Android requires).
   • If nobody responds for 2 minutes it stops and snoozes itself for 10 minutes.
   • These alarms need AgriCare open in a browser tab. For alarms with the site closed,
     use the Google Calendar / phone calendar buttons, which use the phone's own alarm system. */

Object.assign(translations.en, {
    alarm_tap: "🔔 Tap to hear the alarm",
    alarm_auto_snoozed: "No response, so the reminder was snoozed for 10 minutes.",
    alarm_next: "Next alarm",
    alarm_none: "No alarms scheduled",
    chk_sound: "Sound",
    chk_notify: "Notifications",
    chk_voice: "Voice",
    chk_ok: "ready",
    chk_tap: "tap the page once",
    chk_blocked: "blocked in browser settings",
    chk_off: "not turned on",
    chk_unsupported: "not supported here",
    chk_novoice: "no voice for this language",
    gcal_add: "📅 Google Calendar",
    alarm_keep_open: "Keep AgriCare open in a tab for these alarms. To be reminded even when the site is closed, add the steps to your calendar."
});
Object.assign(translations.si, {
    alarm_tap: "🔔 අනතුරු ඇඟවීම ඇසීමට තට්ටු කරන්න",
    alarm_auto_snoozed: "ප්‍රතිචාරයක් නොලැබුණු නිසා මිනිත්තු 10කින් නැවත මතක් කෙරේ.",
    alarm_next: "ඊළඟ අනතුරු ඇඟවීම",
    alarm_none: "අනතුරු ඇඟවීම් සකසා නැත",
    chk_sound: "ශබ්දය",
    chk_notify: "දැනුම්දීම්",
    chk_voice: "හඬ",
    chk_ok: "සූදානම්",
    chk_tap: "පිටුව එක් වරක් තට්ටු කරන්න",
    chk_blocked: "බ්‍රව්සර සැකසුම්වල අවහිර කර ඇත",
    chk_off: "සක්‍රිය කර නැත",
    chk_unsupported: "මෙහි සහාය නොදක්වයි",
    chk_novoice: "මෙම භාෂාවට හඬක් නැත",
    gcal_add: "📅 Google Calendar",
    alarm_keep_open: "මෙම අනතුරු ඇඟවීම් සඳහා AgriCare ටැබයක විවෘතව තබන්න. වෙබ් අඩවිය වසා ඇති විටද මතක් කිරීමට, පියවර දින දර්ශනයට එක් කරන්න."
});
Object.assign(translations.ta, {
    alarm_tap: "🔔 அலாரத்தைக் கேட்கத் தட்டுங்கள்",
    alarm_auto_snoozed: "பதில் இல்லாததால் 10 நிமிடங்களுக்குப் பின் மீண்டும் நினைவூட்டப்படும்.",
    alarm_next: "அடுத்த அலாரம்",
    alarm_none: "அலாரங்கள் எதுவும் அமைக்கப்படவில்லை",
    chk_sound: "ஒலி",
    chk_notify: "அறிவிப்புகள்",
    chk_voice: "குரல்",
    chk_ok: "தயார்",
    chk_tap: "பக்கத்தை ஒருமுறை தட்டுங்கள்",
    chk_blocked: "உலாவி அமைப்புகளில் தடுக்கப்பட்டுள்ளது",
    chk_off: "இயக்கப்படவில்லை",
    chk_unsupported: "இங்கு ஆதரிக்கப்படவில்லை",
    chk_novoice: "இந்த மொழிக்குக் குரல் இல்லை",
    gcal_add: "📅 Google Calendar",
    alarm_keep_open: "இந்த அலாரங்களுக்கு AgriCare ஐ ஒரு தாவலில் திறந்து வையுங்கள். இணையதளம் மூடியிருக்கும்போதும் நினைவூட்ட, படிகளை நாட்காட்டியில் சேருங்கள்."
});

/* Service worker: needed for notifications on Android, and to open AgriCare when a notification is tapped */
const AGRI_ROOT = location.pathname.includes("/pages/") ? "../" : "";
let agriSW = null;
if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register(AGRI_ROOT + "sw.js")
        .then(reg => { agriSW = reg; })
        .catch(() => { /* not available (e.g. preview); page notifications are used instead */ });
}

/* One-tap Google Calendar event for a step (uses the phone's own reminders) */
function googleCalendarUrl(plan, task) {
    const pad = n => String(n).padStart(2, "0");
    const fmt = d => d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + "00";
    const due = taskDue(plan, task);
    const end = new Date(due.getTime() + 30 * 60000);
    const name = localText(diseaseInfo(plan.disease).name);
    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: "AgriCare – " + name + (plan.field ? " (" + plan.field + ")" : "") + " – " + t("plan_day") + " " + (task.day + 1),
        dates: fmt(due) + "/" + fmt(end),
        ctz: "Asia/Colombo",
        details: localText(taskStep(plan, task).text)
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
}

const AgriAlarm = {
    ctx: null,
    beepTimer: null,
    giveUpTimer: null,
    current: null,   // { planId, taskId } or { test: true }
    testAt: null,
    _onMemory: false,

    /* ----- status ----- */
    isOn() { return AgriStore.get("agricare_alarms") === "on" || this._onMemory; },
    soundReady() { return !!(this.ctx && this.ctx.state === "running"); },
    notifyState() {
        if (!("Notification" in window)) return "unsupported";
        return Notification.permission; // "granted" | "denied" | "default"
    },
    voiceState() {
        const s = AgriVoice.support(getLanguage());
        return (s === "device" || s === "clips") ? "ok" : s === "online" ? "online" : "unsupported";
    },

    async enable() {
        this.unlockAudio();
        AgriStore.set("agricare_alarms", "on");
        this._onMemory = true;
        if ("Notification" in window && Notification.permission === "default") {
            try { await Notification.requestPermission(); } catch (e) { /* ignore */ }
        }
        document.dispatchEvent(new CustomEvent("agricare:alarmstate"));
    },

    /* Browsers only allow sound after a tap; call this from any tap. */
    unlockAudio() {
        try {
            if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (this.ctx.state === "suspended") this.ctx.resume().then(() => document.dispatchEvent(new CustomEvent("agricare:alarmstate")));
            // play a silent blip so iOS fully unlocks audio
            const o = this.ctx.createOscillator(), g = this.ctx.createGain();
            g.gain.value = 0.0001; o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime + 0.01);
        } catch (e) { /* no audio */ }
    },

    /* ----- sound ----- */
    beepOnce() {
        if (!this.soundReady()) return;
        const now = this.ctx.currentTime;
        [0, 0.25, 0.5].forEach(off => {
            const o = this.ctx.createOscillator(), g = this.ctx.createGain();
            o.type = "square"; o.frequency.value = 880;
            g.gain.setValueAtTime(0.0001, now + off);
            g.gain.exponentialRampToValueAtTime(0.3, now + off + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, now + off + 0.18);
            o.connect(g); g.connect(this.ctx.destination);
            o.start(now + off); o.stop(now + off + 0.2);
        });
    },
    vibrate() {
        if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) {
            try { navigator.vibrate([500, 250, 500, 250, 500]); } catch (e) { /* ignore */ }
        }
    },
    startRinging() {
        this.stopRinging();
        this.beepOnce();
        this.vibrate();
        let n = 0;
        this.beepTimer = setInterval(() => { this.beepOnce(); if (++n % 3 === 0) this.vibrate(); }, 2000);
    },
    stopRinging() { clearInterval(this.beepTimer); this.beepTimer = null; },

    /* ----- notification ----- */
    async notify(title, body) {
        if (this.notifyState() !== "granted") return;
        const opts = { body, tag: "agricare-alarm", renotify: true, requireInteraction: true,
                       vibrate: [500, 250, 500], data: { url: "pages/monitor.html" } };  // relative to the site root (service worker scope)
        try {
            // wait (max 4 s) for the service worker if the page has only just opened
            const reg = agriSW || ("serviceWorker" in navigator && location.protocol !== "file:" &&
                await Promise.race([navigator.serviceWorker.ready, new Promise(r => setTimeout(() => r(null), 4000))]));
            if (reg) { await reg.showNotification(title, opts); return; }
        } catch (e) { /* fall through */ }
        try { new Notification(title, opts); } catch (e) { /* Android needs the service worker */ }
    },

    /* ----- scheduling ----- */
    testIn(seconds) {
        this.unlockAudio();
        this.testAt = Date.now() + seconds * 1000;
    },

    nextAlarm() {
        let best = null;
        const now = new Date();
        AgriPlans.all().forEach(plan => plan.tasks.forEach(task => {
            if (task.done) return;
            let at = taskDue(plan, task);
            if (task.snoozeUntil && new Date(task.snoozeUntil) > now) at = new Date(task.snoozeUntil);
            else if (at <= now) return; // already rang or overdue
            if (!best || at < best.at) best = { at, plan, task };
        }));
        return best;
    },

    check() {
        if (this.current) return; // a reminder is already showing
        const now = new Date();
        if (this.testAt && Date.now() >= this.testAt) {
            this.testAt = null;
            this.show({ test: true });
            return;
        }
        for (const plan of AgriPlans.all()) {
            for (const task of plan.tasks) {
                if (task.done) continue;
                const due = taskDue(plan, task);
                if (due > now) continue;
                if (now - due > 2 * 86400000) continue;              // older than 2 days: shown as overdue only
                const snooze = task.snoozeUntil ? new Date(task.snoozeUntil) : null;
                if (snooze && snooze > now) continue;                 // snoozed
                if (task.alarmedAt && !snooze) continue;              // already rang and was closed
                this.show({ planId: plan.id, taskId: task.id });
                return;
            }
        }
    },

    show(ref) {
        let sub = "", text;
        if (ref.test) {
            text = t("alarm_test_task");
        } else {
            const plan = AgriPlans.all().find(p => p.id === ref.planId);
            const task = plan && plan.tasks.find(x => x.id === ref.taskId);
            if (!task) return;
            text = localText(taskStep(plan, task).text);
            sub = localText(diseaseInfo(plan.disease).name) + (plan.field ? " · " + plan.field : "") + " · " + t("plan_day") + " " + (task.day + 1);
            AgriPlans.update(plan.id, p => {
                const tk = p.tasks.find(x => x.id === task.id);
                tk.alarmedAt = new Date().toISOString(); tk.snoozeUntil = null;
            });
        }
        let parts;
        if (ref.test) parts = [VP.title(), VP.test()];
        else {
            const plan = AgriPlans.all().find(p => p.id === ref.planId);
            const task = plan.tasks.find(x => x.id === ref.taskId);
            parts = [VP.title(), VP.name(plan.disease)];
            if (plan.field) parts.push({ text: plan.field });
            parts.push(VP.day(task.day + 1), VP.step(plan.disease, Number(task.id.slice(1))));
        }
        this.current = Object.assign({ text, sub, parts }, ref);

        const modal = ensureAlarmModal();
        modal.querySelector(".alarm-title").textContent = t("alarm_title");
        modal.querySelector(".alarm-sub").textContent = sub;
        modal.querySelector(".alarm-text").textContent = text;
        modal.querySelector(".alarm-note").textContent = "";
        modal.querySelector("[data-act=done]").hidden = !!ref.test;
        modal.querySelector("[data-act=snooze]").hidden = !!ref.test;
        modal.hidden = false;

        this.notify(t("alarm_title"), (sub ? sub + "\n" : "") + text);

        if (this.soundReady()) {
            modal.querySelector(".alarm-tap").hidden = true;
            this.startRinging();
            this.speakCurrent();
        } else {
            // sound is locked until the person taps: show the big tap button
            modal.querySelector(".alarm-tap").hidden = false;
            this.vibrate();
        }

        // stop after 2 minutes with no answer and snooze for 10 minutes
        clearTimeout(this.giveUpTimer);
        this.giveUpTimer = setTimeout(() => {
            if (this.current === null) return;
            const isTest = this.current.test;
            this.close(isTest ? "close" : "snooze");
            if (!isTest) document.dispatchEvent(new CustomEvent("agricare:autosnooze"));
        }, 120000);
    },

    speakCurrent() {
        const c = this.current;
        if (!c) return;
        setTimeout(() => {
            if (this.current === c) AgriVoice.speak(c.parts);
        }, 1300);
    },

    /* the "Tap to hear" button */
    tapToHear() {
        this.unlockAudio();
        const modal = document.getElementById("agri-alarm");
        modal.querySelector(".alarm-tap").hidden = true;
        // AudioContext.resume() is async; give it a moment
        setTimeout(() => { this.startRinging(); this.speakCurrent(); }, 150);
    },

    close(action) {
        const ref = this.current;
        this.stopRinging();
        clearTimeout(this.giveUpTimer);
        AgriVoice.stop();
        if (ref && !ref.test) {
            if (action === "done") {
                AgriPlans.update(ref.planId, p => {
                    const tk = p.tasks.find(x => x.id === ref.taskId);
                    if (tk) { tk.done = true; tk.doneAt = new Date().toISOString(); }
                });
            } else if (action === "snooze") {
                AgriPlans.update(ref.planId, p => {
                    const tk = p.tasks.find(x => x.id === ref.taskId);
                    if (tk) tk.snoozeUntil = new Date(Date.now() + 10 * 60000).toISOString();
                });
            }
        }
        if (agriSW && agriSW.getNotifications) {
            agriSW.getNotifications({ tag: "agricare-alarm" }).then(ns => ns.forEach(n => n.close())).catch(() => {});
        }
        document.getElementById("agri-alarm").hidden = true;
        this.current = null;
        document.dispatchEvent(new CustomEvent("agricare:alarmstate"));
        // another step may also be due
        setTimeout(() => this.check(), 1500);
    }
};

function ensureAlarmModal() {
    let m = document.getElementById("agri-alarm");
    if (m) return m;
    m = document.createElement("div");
    m.id = "agri-alarm";
    m.className = "alarm-overlay";
    m.hidden = true;
    m.setAttribute("role", "alertdialog");
    m.setAttribute("aria-live", "assertive");
    m.innerHTML =
        '<div class="alarm-box">' +
            '<div class="alarm-bell" aria-hidden="true"></div>' +
            '<h2 class="alarm-title"></h2>' +
            '<p class="alarm-sub"></p>' +
            '<p class="alarm-text"></p>' +
            '<button type="button" class="btn btn-primary alarm-tap" hidden></button>' +
            '<div class="alarm-actions">' +
                '<button type="button" class="btn btn-primary" data-act="done"></button>' +
                '<button type="button" class="btn btn-ghost" data-act="snooze"></button>' +
                '<button type="button" class="btn btn-ghost" data-act="close"></button>' +
            '</div>' +
            '<p class="alarm-note"></p>' +
        '</div>';
    document.body.appendChild(m);
    const label = () => {
        m.querySelector(".alarm-tap").textContent = t("alarm_tap");
        m.querySelector("[data-act=done]").textContent = "✓ " + t("mon_mark_done");
        m.querySelector("[data-act=snooze]").textContent = t("alarm_snooze");
        m.querySelector("[data-act=close]").textContent = t("alarm_close");
    };
    label();
    document.addEventListener("agricare:lang", label);
    m.querySelector(".alarm-tap").addEventListener("click", () => AgriAlarm.tapToHear());
    m.querySelectorAll("[data-act]").forEach(b => b.addEventListener("click", () => AgriAlarm.close(b.dataset.act)));
    return m;
}

document.addEventListener("DOMContentLoaded", () => {
    ensureAlarmModal();

    // Any tap unlocks sound for later alarms. If a silent reminder is showing, the tap starts it ringing.
    const unlockOnTap = () => {
        const wasReady = AgriAlarm.soundReady();
        AgriAlarm.unlockAudio();
        if (!wasReady && AgriAlarm.current && !AgriAlarm.beepTimer) {
            document.getElementById("agri-alarm").querySelector(".alarm-tap").hidden = true;
            setTimeout(() => { AgriAlarm.startRinging(); AgriAlarm.speakCurrent(); }, 150);
        }
        document.dispatchEvent(new CustomEvent("agricare:alarmstate"));
    };
    document.addEventListener("pointerdown", unlockOnTap, true);
    document.addEventListener("keydown", unlockOnTap, true);

    AgriAlarm.check();
    setInterval(() => AgriAlarm.check(), 15000);

    // Browsers slow timers in background tabs, so check again the moment the page is visible
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") AgriAlarm.check(); });
    window.addEventListener("focus", () => AgriAlarm.check());
    window.addEventListener("pageshow", () => AgriAlarm.check());

    // check straight away when a plan is created or changed (here or in another tab)
    document.addEventListener("agricare:plans", () => setTimeout(() => AgriAlarm.check(), 300));
    window.addEventListener("storage", e => { if (e.key === AgriPlans.KEY) { AgriAlarm.check(); document.dispatchEvent(new CustomEvent("agricare:plans")); } });
});
// Faster checks while a test alarm is waiting
setInterval(() => { if (AgriAlarm.testAt) AgriAlarm.check(); }, 1000);

/* ---------- Scan history (for the treatment tracker) ---------- */
Object.assign(translations.en, {
    trk_title: "Treatment Tracker",
    trk_active: "Active plans",
    trk_steps: "Steps done",
    trk_overdue: "Overdue steps",
    trk_scans: "Leaf scans",
    trk_history: "Scan history",
    trk_no_scans: "No scans yet. Every leaf you scan is saved here so you can see how your field changes.",
    trk_trend: "Crop condition",
    trk_no_trend: "No condition checks yet",
    up_find_shop: "🏪 Find a medicine shop"
});
Object.assign(translations.si, {
    trk_title: "ප්‍රතිකාර ලුහුබැඳීම",
    trk_active: "සක්‍රිය සැලසුම්",
    trk_steps: "අවසන් පියවර",
    trk_overdue: "කල් ඉකුත් පියවර",
    trk_scans: "කොළ ස්කෑන්",
    trk_history: "ස්කෑන් ඉතිහාසය",
    trk_no_scans: "තවම ස්කෑන් නැත. ඔබ ස්කෑන් කරන සෑම කොළයක්ම මෙහි සුරැකේ, එවිට කුඹුරේ වෙනස්කම් දැකගත හැක.",
    trk_trend: "බෝග තත්ත්වය",
    trk_no_trend: "තවම තත්ත්ව පරීක්ෂා නැත",
    up_find_shop: "🏪 ඖෂධ සාප්පුවක් සොයන්න"
});
Object.assign(translations.ta, {
    trk_title: "சிகிச்சைக் கண்காணிப்பு",
    trk_active: "செயலிலுள்ள திட்டங்கள்",
    trk_steps: "முடிந்த படிகள்",
    trk_overdue: "தாமதமான படிகள்",
    trk_scans: "இலை ஸ்கேன்கள்",
    trk_history: "ஸ்கேன் வரலாறு",
    trk_no_scans: "இன்னும் ஸ்கேன்கள் இல்லை. நீங்கள் ஸ்கேன் செய்யும் ஒவ்வொரு இலையும் இங்கே சேமிக்கப்படும்.",
    trk_trend: "பயிர் நிலை",
    trk_no_trend: "இன்னும் நிலைச் சோதனைகள் இல்லை",
    up_find_shop: "🏪 மருந்துக் கடையைக் கண்டறி"
});

const AgriScans = {
    KEY: "agricare_scans",
    memory: [],
    all() {
        try { return JSON.parse(AgriStore.get(this.KEY) || "null") || this.memory; } catch (e) { return this.memory; }
    },
    add(scan) {
        const list = [scan].concat(this.all()).slice(0, 40);   // keep the latest 40
        this.memory = list;
        AgriStore.set(this.KEY, JSON.stringify(list));
        AgriStore.set("agricare_last_scan", JSON.stringify({ label: scan.label, at: scan.at }));
    }
};

/* Small JPEG thumbnail of the uploaded leaf, so history stays light */
function makeThumb(img, size = 160) {
    try {
        const c = document.createElement("canvas");
        const ratio = img.naturalWidth / img.naturalHeight || 1;
        c.width = size; c.height = Math.round(size / ratio);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        return c.toDataURL("image/jpeg", 0.6);
    } catch (e) { return ""; }
}

/* AgriCare: 5 more diseases (added by backend/add_disease_info.py) */
(function () {
    const NAMES = {"bacterial_leaf_streak": {"en": "Bacterial Leaf Streak", "si": "බැක්ටීරියා කොළ ඉරි රෝගය", "ta": "பாக்டீரியா இலைக் கோடு நோய்"}, "bacterial_panicle_blight": {"en": "Bacterial Panicle Blight", "si": "බැක්ටීරියා කරල් අංගමාරය", "ta": "பாக்டீரியா கதிர் கருகல் நோய்"}, "downy_mildew": {"en": "Downy Mildew", "si": "මෘදු පුස් රෝගය", "ta": "அடிச்சாம்பல் நோய்"}, "hispa": {"en": "Rice Hispa", "si": "හිස්පා (කොළ කූරුමිණියා)", "ta": "நெல் ஹிஸ்பா வண்டு"}, "rice_panicle_blast": {"en": "Panicle (Neck) Blast", "si": "කරල් පාළුව", "ta": "கதிர்க் கழுத்து குலை நோய்"}};
    const MORE = {"bacterial_leaf_streak": {"sci": "Xanthomonas oryzae pv. oryzicola", "type": "bacterial", "swatch": "sw-blb", "summary": {"en": "A bacterial disease that makes narrow, water-soaked streaks between the leaf veins. The streaks turn yellow-brown and join, and the leaves dry. It spreads with rain, wind and flood water.", "si": "පත්‍ර නාරටි අතර සිහින්, ජලයෙන් පෙඟුණු ඉරි ඇති කරන බැක්ටීරියා රෝගයකි. ඉරි කහ-දුඹුරු පැහැයට හැරී එකට එකතු වී කොළ වියළේ. වැසි, සුළඟ සහ ගංවතුර ජලය සමඟ පැතිරේ.", "ta": "இலை நரம்புகளுக்கு இடையே மெல்லிய, நீர் தோய்ந்த கோடுகளை உண்டாக்கும் பாக்டீரியா நோய். கோடுகள் மஞ்சள்-பழுப்பாக மாறி இணைந்து இலைகள் காய்கின்றன. மழை, காற்று, வெள்ள நீருடன் பரவும்."}, "en": {"symptoms": ["Narrow dark-green, water-soaked streaks between the leaf veins", "Streaks turn yellow to orange-brown and join into larger dry patches", "Small yellow-amber drops of bacterial ooze on the streaks in the morning"], "conditions": ["Warm, humid weather with rain and wind", "Too much nitrogen fertilizer", "Leaves wounded by storms or handling"], "manage": ["Stop extra urea until the disease is under control", "Drain the field for 3-4 days to slow the spread, then keep a shallow water level", "Do not walk through the field when the leaves are wet", "Remove and destroy badly affected plants and the weeds around the field", "Sprays give little control; ask your agriculture instructor before spraying anything"], "prevent": ["Use clean, certified seed of a resistant variety", "Apply nitrogen in split doses", "Destroy stubble and volunteer rice after harvest", "Do not let water flow from an infected field into other fields"]}, "si": {"symptoms": ["පත්‍ර නාරටි අතර සිහින් තද කොළ පැහැති, ජලයෙන් පෙඟුණු ඉරි", "ඉරි කහ හෝ තැඹිලි-දුඹුරු පැහැයට හැරී විශාල වියළි පැල්ලම් ලෙස එකතු වේ", "උදෑසන ඉරි මත කුඩා කහ-ඇම්බර් පැහැති බැක්ටීරියා බිඳිති"], "conditions": ["වැසි සහ සුළඟ සහිත උණුසුම්, තෙත් කාලගුණය", "නයිට්‍රජන් පොහොර වැඩිපුර යෙදීම", "කුණාටු හෝ හැසිරවීම නිසා තුවාල වූ කොළ"], "manage": ["රෝගය පාලනය වන තුරු අමතර යූරියා නොයොදන්න", "පැතිරීම අඩු කිරීමට දින 3-4ක් කුඹුරේ ජලය බැස යවා, පසුව නොගැඹුරු ජල මට්ටමක් තබන්න", "කොළ තෙත්ව ඇති විට කුඹුර හරහා ඇවිදින්න එපා", "දරුණු ලෙස රෝගී වූ පැළ සහ කුඹුර වටා ඇති වල් පැළ ඉවත් කර විනාශ කරන්න", "ඉසීම්වලින් ලැබෙන පාලනය අඩුයි; කිසිවක් ඉසීමට පෙර ඔබේ කෘෂිකර්ම උපදේශකගෙන් විමසන්න"], "prevent": ["ප්‍රතිරෝධී ප්‍රභේදයක පිරිසිදු, සහතික කළ බීජ භාවිත කරන්න", "නයිට්‍රජන් කොටස් වශයෙන් යොදන්න", "අස්වැන්නෙන් පසු ඉපනැලි සහ ස්වයං ලියලන වී විනාශ කරන්න", "රෝගී කුඹුරක ජලය වෙනත් කුඹුරුවලට ගලා යාමට ඉඩ නොදෙන්න"]}, "ta": {"symptoms": ["இலை நரம்புகளுக்கு இடையே மெல்லிய அடர் பச்சை, நீர் தோய்ந்த கோடுகள்", "கோடுகள் மஞ்சள் அல்லது ஆரஞ்சு-பழுப்பாக மாறி பெரிய காய்ந்த திட்டுகளாக இணையும்", "காலையில் கோடுகளின் மேல் சிறிய மஞ்சள்-அம்பர் நிற பாக்டீரியா துளிகள்"], "conditions": ["மழையும் காற்றும் உள்ள வெப்பமான, ஈரப்பதமான வானிலை", "அதிக நைதரசன் உரம்", "புயல் அல்லது கையாளுதலால் காயமடைந்த இலைகள்"], "manage": ["நோய் கட்டுப்படும் வரை கூடுதல் யூரியா இட வேண்டாம்", "பரவலைக் குறைக்க 3-4 நாட்கள் வயல் நீரை வடித்து, பின்னர் குறைந்த நீர் மட்டத்தை வையுங்கள்", "இலைகள் ஈரமாக இருக்கும்போது வயலுக்குள் நடக்க வேண்டாம்", "கடுமையாகப் பாதிக்கப்பட்ட பயிர்களையும் வயலைச் சுற்றியுள்ள களைகளையும் அகற்றி அழியுங்கள்", "தெளிப்புகள் குறைந்த பலனே தரும்; எதையும் தெளிக்கும் முன் உங்கள் விவசாயப் போதனாசிரியரிடம் கேளுங்கள்"], "prevent": ["எதிர்ப்புத் திறன் கொண்ட இனத்தின் சுத்தமான, சான்றளிக்கப்பட்ட விதையைப் பயன்படுத்துங்கள்", "நைதரசனைப் பிரித்து இடுங்கள்", "அறுவடைக்குப் பின் அடிக்கட்டைகளையும் தானாக முளைக்கும் நெல்லையும் அழியுங்கள்", "பாதிக்கப்பட்ட வயலின் நீர் மற்ற வயல்களுக்குப் பாய விடாதீர்கள்"]}, "plan": [{"day": 0, "check": false, "text": {"en": "Stop all urea. Drain the field and keep it drained for 3-4 days.", "si": "සියලු යූරියා නවත්වන්න. කුඹුරේ ජලය බැස යවා දින 3-4ක් එසේ තබන්න.", "ta": "யூரியா இடுவதை முற்றாக நிறுத்துங்கள். வயல் நீரை வடித்து 3-4 நாட்கள் அப்படியே வையுங்கள்."}}, {"day": 1, "check": false, "text": {"en": "Remove badly affected plants and the weeds on the bunds. Do not walk in the field when the leaves are wet.", "si": "දරුණු ලෙස රෝගී වූ පැළ සහ නියරවල වල් පැළ ඉවත් කරන්න. කොළ තෙත්ව ඇති විට කුඹුරේ ඇවිදින්න එපා.", "ta": "கடுமையாகப் பாதிக்கப்பட்ட பயிர்களையும் வரப்புகளிலுள்ள களைகளையும் அகற்றுங்கள். இலைகள் ஈரமாக இருக்கும்போது வயலில் நடக்க வேண்டாம்."}}, {"day": 4, "check": true, "text": {"en": "Bring back a shallow water level (2-3 cm). Are new streaks appearing? Scan a leaf again.", "si": "නොගැඹුරු ජල මට්ටමක් (සෙ.මී. 2-3) නැවත ලබාදෙන්න. අලුත් ඉරි ඇති වෙනවාද? නැවත කොළයක් ස්කෑන් කරන්න.", "ta": "குறைந்த நீர் மட்டத்தை (2-3 செ.மீ.) மீண்டும் கொடுங்கள். புதிய கோடுகள் தோன்றுகின்றனவா? மீண்டும் ஒரு இலையை ஸ்கேன் செய்யுங்கள்."}}, {"day": 7, "check": false, "text": {"en": "If the disease keeps spreading, ask your agriculture instructor before using any spray.", "si": "රෝගය දිගටම පැතිරේ නම්, කිසිදු ඉසීමක් භාවිත කිරීමට පෙර ඔබේ කෘෂිකර්ම උපදේශකගෙන් විමසන්න.", "ta": "நோய் தொடர்ந்து பரவினால், எந்தத் தெளிப்பையும் பயன்படுத்தும் முன் உங்கள் விவசாயப் போதனாசிரியரிடம் கேளுங்கள்."}}, {"day": 14, "check": true, "text": {"en": "Weekly field check, especially after rain and wind.", "si": "සතිපතා කුඹුරු පරීක්ෂාව, විශේෂයෙන් වැසි සහ සුළඟින් පසු.", "ta": "வாராந்திர வயல் சோதனை, குறிப்பாக மழை மற்றும் காற்றுக்குப் பின்."}}]}, "bacterial_panicle_blight": {"sci": "Burkholderia glumae", "type": "bacterial", "swatch": "sw-tungro", "summary": {"en": "A seed-borne bacterial disease that attacks the grains at flowering. Grains turn straw to brown and stay empty, so the panicle stays upright. It is worst in hot, humid weather at flowering.", "si": "මල් පිපෙන කාලයේ ඇටවලට පහර දෙන, බීජ මගින් පැතිරෙන බැක්ටීරියා රෝගයකි. ඇට පිදුරු පැහැයේ සිට දුඹුරු පැහැයට හැරී හිස්ව පවතින බැවින් කරල කෙළින් සිටී. මල් පිපෙන විට උණුසුම්, තෙත් කාලගුණයේදී දරුණු වේ.", "ta": "பூக்கும் காலத்தில் மணிகளைத் தாக்கும், விதை மூலம் பரவும் பாக்டீரியா நோய். மணிகள் வைக்கோல் நிறத்திலிருந்து பழுப்பாக மாறி பதராக இருப்பதால் கதிர் நிமிர்ந்து நிற்கும். பூக்கும்போது வெப்பமான, ஈரப்பதமான வானிலையில் மோசமாகும்."}, "en": {"symptoms": ["Grains turn pale straw, grey or pink-brown, often the lower part of the grain first, with a dark brown line between the healthy and diseased part", "Grains stay empty or partly filled, so the panicle stands upright", "Diseased panicles appear in patches in the field"], "conditions": ["Very hot nights and humid weather at flowering", "Infected seed", "Too much nitrogen and dense planting"], "manage": ["No spray cures the grains once they are infected", "Stop extra urea", "Keep a steady water level; do not let the field dry out at flowering", "Harvest the affected patches separately and do not keep their grain as seed"], "prevent": ["Use clean, certified seed; never use seed from an infected field", "Plant on time so that flowering does not fall in the hottest weeks", "Apply nitrogen in split doses and use the recommended spacing", "Destroy infected straw and stubble after harvest"]}, "si": {"symptoms": ["ඇට ලා පිදුරු, අළු හෝ රෝස-දුඹුරු පැහැයට හැරේ; බොහෝ විට ඇටයේ පහළ කොටස මුලින්ම, නිරෝගී සහ රෝගී කොටස් අතර තද දුඹුරු ඉරක් සමඟ", "ඇට හිස් හෝ අර්ධ වශයෙන් පිරුණු නිසා කරල කෙළින් සිටී", "රෝගී කරල් කුඹුරේ පැල්ලම් ලෙස දක්නට ලැබේ"], "conditions": ["මල් පිපෙන විට ඉතා උණුසුම් රාත්‍රී සහ තෙත් කාලගුණය", "රෝගී බීජ", "නයිට්‍රජන් වැඩිපුර සහ ඝන වගාව"], "manage": ["ඇට රෝගී වූ පසු ඒවා සුව කරන ඉසීමක් නැත", "අමතර යූරියා නවත්වන්න", "ස්ථාවර ජල මට්ටමක් තබන්න; මල් පිපෙන විට කුඹුර වියළීමට ඉඩ නොදෙන්න", "රෝගී පැල්ලම් වෙනම අස්වනු නෙළා, ඒවායේ ඇට බීජ ලෙස තබා නොගන්න"], "prevent": ["පිරිසිදු, සහතික කළ බීජ භාවිත කරන්න; රෝගී කුඹුරක බීජ කිසිවිටෙක භාවිත නොකරන්න", "මල් පිපීම වඩාත් උණුසුම් සති වලට නොවැටෙන ලෙස නියමිත වේලාවට වගා කරන්න", "නයිට්‍රජන් කොටස් වශයෙන් යොදා නිර්දේශිත පරතරය භාවිත කරන්න", "අස්වැන්නෙන් පසු රෝගී පිදුරු සහ ඉපනැලි විනාශ කරන්න"]}, "ta": {"symptoms": ["மணிகள் வெளிர் வைக்கோல், சாம்பல் அல்லது இளஞ்சிவப்பு-பழுப்பாக மாறும்; பெரும்பாலும் மணியின் கீழ்ப்பகுதி முதலில், நலமான பகுதிக்கும் நோயுற்ற பகுதிக்கும் இடையே அடர் பழுப்புக் கோட்டுடன்", "மணிகள் பதராக அல்லது பாதி நிரம்பியதால் கதிர் நிமிர்ந்து நிற்கும்", "நோயுற்ற கதிர்கள் வயலில் திட்டுகளாகத் தோன்றும்"], "conditions": ["பூக்கும்போது மிக வெப்பமான இரவுகளும் ஈரப்பதமான வானிலையும்", "நோயுற்ற விதை", "அதிக நைதரசனும் அடர்த்தியான நடவும்"], "manage": ["மணிகள் நோயுற்ற பின் அவற்றைக் குணப்படுத்தும் தெளிப்பு இல்லை", "கூடுதல் யூரியாவை நிறுத்துங்கள்", "நிலையான நீர் மட்டத்தை வையுங்கள்; பூக்கும்போது வயல் காய விடாதீர்கள்", "பாதிக்கப்பட்ட திட்டுகளைத் தனியாக அறுவடை செய்து, அவற்றின் நெல்லை விதையாக வைக்காதீர்கள்"], "prevent": ["சுத்தமான, சான்றளிக்கப்பட்ட விதையைப் பயன்படுத்துங்கள்; பாதிக்கப்பட்ட வயலின் விதையை ஒருபோதும் பயன்படுத்தாதீர்கள்", "பூக்கும் காலம் மிக வெப்பமான வாரங்களில் வராதபடி சரியான நேரத்தில் நடுங்கள்", "நைதரசனைப் பிரித்து இட்டு, பரிந்துரைக்கப்பட்ட இடைவெளியைப் பயன்படுத்துங்கள்", "அறுவடைக்குப் பின் நோயுற்ற வைக்கோலையும் அடிக்கட்டைகளையும் அழியுங்கள்"]}, "plan": [{"day": 0, "check": false, "text": {"en": "Stop all urea. Walk the field and mark the patches where panicles are pale or brown.", "si": "සියලු යූරියා නවත්වන්න. කුඹුර පුරා ඇවිද කරල් ලා හෝ දුඹුරු පැහැ වූ පැල්ලම් සලකුණු කරන්න.", "ta": "யூரியா இடுவதை முற்றாக நிறுத்துங்கள். வயலில் நடந்து கதிர்கள் வெளிறிய அல்லது பழுப்பான திட்டுகளைக் குறியிடுங்கள்."}}, {"day": 1, "check": false, "text": {"en": "Keep a steady 2-5 cm water level. Do not let the field dry out while the crop is flowering.", "si": "සෙ.මී. 2-5 ස්ථාවර ජල මට්ටමක් තබන්න. බෝගය මල් පිපෙන අතරතුර කුඹුර වියළීමට ඉඩ නොදෙන්න.", "ta": "2-5 செ.மீ. நிலையான நீர் மட்டத்தை வையுங்கள். பயிர் பூக்கும்போது வயல் காய விடாதீர்கள்."}}, {"day": 4, "check": true, "text": {"en": "Are more panicles turning pale or brown? Check the marked patches and scan again.", "si": "තවත් කරල් ලා හෝ දුඹුරු පැහැයට හැරෙනවාද? සලකුණු කළ පැල්ලම් පරීක්ෂා කර නැවත ස්කෑන් කරන්න.", "ta": "மேலும் கதிர்கள் வெளிறி அல்லது பழுப்பாக மாறுகின்றனவா? குறியிட்ட திட்டுகளைச் சோதித்து மீண்டும் ஸ்கேன் செய்யுங்கள்."}}, {"day": 10, "check": false, "text": {"en": "Plan the harvest: cut the affected patches separately and do not keep this grain as seed.", "si": "අස්වැන්න සැලසුම් කරන්න: රෝගී පැල්ලම් වෙනම කපා, මෙම ඇට බීජ ලෙස තබා නොගන්න.", "ta": "அறுவடையைத் திட்டமிடுங்கள்: பாதிக்கப்பட்ட திட்டுகளைத் தனியாக அறுத்து, இந்த நெல்லை விதையாக வைக்காதீர்கள்."}}, {"day": 14, "check": true, "text": {"en": "Weekly check until harvest. After harvest, destroy the infected straw.", "si": "අස්වැන්න තෙක් සතිපතා පරීක්ෂාව. අස්වැන්නෙන් පසු රෝගී පිදුරු විනාශ කරන්න.", "ta": "அறுவடை வரை வாராந்திர சோதனை. அறுவடைக்குப் பின் நோயுற்ற வைக்கோலை அழியுங்கள்."}}]}, "downy_mildew": {"sci": "Sclerophthora macrospora", "type": "fungal", "swatch": "sw-tungro", "summary": {"en": "A fungus-like disease that follows flooding. Plants become stunted with thick, twisted leaves and yellow-white streaks, and the panicles are deformed or do not come out.", "si": "ගංවතුරෙන් පසු ඇති වන දිලීර වැනි රෝගයකි. පැළ කුරු වී, ඝන ඇඹරුණු කොළ සහ කහ-සුදු ඉරි ඇති වන අතර කරල් විකෘති වේ හෝ පිට නොවේ.", "ta": "வெள்ளத்தைத் தொடர்ந்து வரும் பூஞ்சை போன்ற நோய். பயிர்கள் குட்டையாகி, தடித்த முறுக்கிய இலைகளும் மஞ்சள்-வெள்ளைக் கோடுகளும் தோன்றும்; கதிர்கள் உருமாறும் அல்லது வெளிவராது."}, "en": {"symptoms": ["Stunted plants with too many thin tillers", "Thick, twisted leaves with pale yellow-white streaks", "Deformed panicles that stay inside the leaf sheath"], "conditions": ["Fields flooded or under deep water for days, especially at the seedling stage", "Grass weeds that carry the disease around the field"], "manage": ["Drain the flood water as soon as possible", "Pull out and destroy badly affected plants; do not leave them in the water", "Remove grass weeds on the bunds and in the channels", "Ask your agriculture instructor before using any fungicide"], "prevent": ["Level the land and keep the drains clear so seedlings are not under water", "Avoid deep water in the first weeks after planting", "Control grass weeds around the field", "Use clean, certified seed"]}, "si": {"symptoms": ["සිහින් පැළ කඳන් බොහෝමයක් සහිත කුරු පැළ", "ලා කහ-සුදු ඉරි සහිත ඝන, ඇඹරුණු කොළ", "පත්‍ර කොපුව තුළම රැඳී සිටින විකෘති කරල්"], "conditions": ["විශේෂයෙන් පැළ අවධියේදී දින ගණනක් ගංවතුරට හෝ ගැඹුරු ජලයට යට වූ කුඹුරු", "කුඹුර වටා රෝගය රැගෙන යන තෘණ වල් පැළ"], "manage": ["හැකි ඉක්මනින් ගංවතුර ජලය බැස යවන්න", "දරුණු ලෙස රෝගී පැළ ගලවා විනාශ කරන්න; ඒවා ජලයේ තබන්න එපා", "නියරවල සහ ඇළ මාර්ගවල තෘණ වල් පැළ ඉවත් කරන්න", "කිසිදු දිලීර නාශකයක් භාවිත කිරීමට පෙර ඔබේ කෘෂිකර්ම උපදේශකගෙන් විමසන්න"], "prevent": ["පැළ ජලයට යට නොවන ලෙස බිම සමතලා කර කාණු පිරිසිදුව තබන්න", "සිටුවීමෙන් පසු මුල් සති වල ගැඹුරු ජලය වළක්වන්න", "කුඹුර වටා තෘණ වල් පැළ පාලනය කරන්න", "පිරිසිදු, සහතික කළ බීජ භාවිත කරන්න"]}, "ta": {"symptoms": ["அதிக மெல்லிய தூர்களுடன் குட்டையான பயிர்கள்", "வெளிர் மஞ்சள்-வெள்ளைக் கோடுகளுடன் தடித்த, முறுக்கிய இலைகள்", "இலை உறைக்குள்ளேயே தங்கும் உருமாறிய கதிர்கள்"], "conditions": ["குறிப்பாக நாற்றுப் பருவத்தில் பல நாட்கள் வெள்ளத்தில் அல்லது ஆழமான நீரில் மூழ்கிய வயல்கள்", "வயலைச் சுற்றி நோயைக் கொண்டு செல்லும் புல் களைகள்"], "manage": ["வெள்ள நீரை விரைவில் வடியுங்கள்", "கடுமையாகப் பாதிக்கப்பட்ட பயிர்களைப் பிடுங்கி அழியுங்கள்; அவற்றை நீரில் விடாதீர்கள்", "வரப்புகளிலும் வாய்க்கால்களிலும் உள்ள புல் களைகளை அகற்றுங்கள்", "எந்தப் பூஞ்சைக்கொல்லியையும் பயன்படுத்தும் முன் உங்கள் விவசாயப் போதனாசிரியரிடம் கேளுங்கள்"], "prevent": ["நாற்றுகள் நீரில் மூழ்காதபடி நிலத்தைச் சமன்செய்து வடிகால்களைச் சுத்தமாக வையுங்கள்", "நட்ட பின் முதல் வாரங்களில் ஆழமான நீரைத் தவிருங்கள்", "வயலைச் சுற்றியுள்ள புல் களைகளைக் கட்டுப்படுத்துங்கள்", "சுத்தமான, சான்றளிக்கப்பட்ட விதையைப் பயன்படுத்துங்கள்"]}, "plan": [{"day": 0, "check": false, "text": {"en": "Drain the standing water from the field. Mark the plants with twisted, streaked leaves.", "si": "කුඹුරේ රැඳී ඇති ජලය බැස යවන්න. ඇඹරුණු, ඉරි සහිත කොළ ඇති පැළ සලකුණු කරන්න.", "ta": "வயலில் தேங்கியுள்ள நீரை வடியுங்கள். முறுக்கிய, கோடுகள் உள்ள இலைகளுடைய பயிர்களைக் குறியிடுங்கள்."}}, {"day": 1, "check": false, "text": {"en": "Pull out and destroy the badly affected plants. Clear grass weeds on the bunds and channels.", "si": "දරුණු ලෙස රෝගී පැළ ගලවා විනාශ කරන්න. නියර සහ ඇළ මාර්ගවල තෘණ වල් පැළ ඉවත් කරන්න.", "ta": "கடுமையாகப் பாதிக்கப்பட்ட பயிர்களைப் பிடுங்கி அழியுங்கள். வரப்புகளிலும் வாய்க்கால்களிலும் உள்ள புல் களைகளை அகற்றுங்கள்."}}, {"day": 4, "check": true, "text": {"en": "Are new plants showing twisted leaves? Check the field and scan a leaf again.", "si": "අලුත් පැළවල ඇඹරුණු කොළ පෙනෙනවාද? කුඹුර පරීක්ෂා කර නැවත කොළයක් ස්කෑන් කරන්න.", "ta": "புதிய பயிர்களில் முறுக்கிய இலைகள் தெரிகின்றனவா? வயலைச் சோதித்து மீண்டும் ஒரு இலையை ஸ்கேன் செய்யுங்கள்."}}, {"day": 7, "check": false, "text": {"en": "Bring back a shallow water level (2-3 cm) and keep the drains clear.", "si": "නොගැඹුරු ජල මට්ටමක් (සෙ.මී. 2-3) නැවත ලබා දී කාණු පිරිසිදුව තබන්න.", "ta": "குறைந்த நீர் மட்டத்தை (2-3 செ.மீ.) மீண்டும் கொடுத்து வடிகால்களைச் சுத்தமாக வையுங்கள்."}}, {"day": 14, "check": true, "text": {"en": "Weekly check, especially after heavy rain or flooding.", "si": "සතිපතා පරීක්ෂාව, විශේෂයෙන් තද වැසි හෝ ගංවතුරෙන් පසු.", "ta": "வாராந்திர சோதனை, குறிப்பாக கனமழை அல்லது வெள்ளத்திற்குப் பின்."}}]}, "hispa": {"sci": "Dicladispa armigera", "type": "insect", "swatch": "sw-brown", "summary": {"en": "A small dark blue-black spiny beetle. Adults scrape the leaf surface and leave white parallel streaks; the grubs tunnel inside the leaves, which turn white and dry.", "si": "කුඩා තද නිල්-කළු කටු සහිත කුරුමිණියෙකි. වැඩිහිටි කෘමීන් කොළ මතුපිට සූරා සුදු සමාන්තර ඉරි ඉතිරි කරයි; කීටයන් කොළ ඇතුළත උමං හාරන නිසා කොළ සුදු වී වියළේ.", "ta": "சிறிய அடர் நீல-கருப்பு முள் வண்டு. முதிர்ந்த வண்டுகள் இலையின் மேற்பரப்பைச் சுரண்டி வெள்ளை இணைக் கோடுகளை விட்டுச் செல்லும்; புழுக்கள் இலைகளுக்குள் சுரங்கம் தோண்டுவதால் இலைகள் வெள்ளையாகிக் காயும்."}, "en": {"symptoms": ["White parallel streaks on the leaves where adults have scraped", "Irregular white blotches where grubs tunnel inside the leaf", "Small dark spiny beetles on the leaves; badly attacked fields look white"], "conditions": ["Too much nitrogen and lush growth", "Grass weeds around the field", "Rainy periods followed by dry weather"], "manage": ["Stop extra urea", "Cut and destroy the tips of attacked leaves, which hold the eggs and grubs", "Catch adult beetles with a sweep net in the morning", "If many leaves are damaged, spray an insecticide recommended for hispa at the label dose; ask your agriculture instructor which one"], "prevent": ["Before transplanting, cut the tips of the seedling leaves to remove eggs", "Apply nitrogen in split doses", "Remove grass weeds around the field", "Check the leaves every week from early tillering"]}, "si": {"symptoms": ["වැඩිහිටි කෘමීන් සූරා ඇති තැන්වල කොළ මත සුදු සමාන්තර ඉරි", "කීටයන් කොළය ඇතුළත උමං හාරන තැන්වල අක්‍රමවත් සුදු පැල්ලම්", "කොළ මත කුඩා තද පැහැති කටු කුරුමිණියන්; දරුණු ලෙස පහර කෑ කුඹුරු සුදු පැහැයෙන් පෙනේ"], "conditions": ["නයිට්‍රජන් වැඩිපුර සහ අධික වර්ධනය", "කුඹුර වටා තෘණ වල් පැළ", "වැසි කාලයකින් පසු වියළි කාලගුණය"], "manage": ["අමතර යූරියා නවත්වන්න", "බිත්තර සහ කීටයන් ඇති, පහර කෑ කොළවල අග කපා විනාශ කරන්න", "උදෑසන දැලක් (sweep net) මගින් වැඩිහිටි කුරුමිණියන් අල්ලන්න", "කොළ බොහොමයක් හානි වී ඇත්නම්, හිස්පා සඳහා නිර්දේශිත කෘමිනාශකයක් ලේබලයේ මාත්‍රාවෙන් ඉසින්න; කුමක්දැයි ඔබේ කෘෂිකර්ම උපදේශකගෙන් විමසන්න"], "prevent": ["පැළ සිටුවීමට පෙර, බිත්තර ඉවත් කිරීමට පැළ කොළවල අග කපන්න", "නයිට්‍රජන් කොටස් වශයෙන් යොදන්න", "කුඹුර වටා තෘණ වල් පැළ ඉවත් කරන්න", "මුල් පැළ දැමීමේ අවධියේ සිට සෑම සතියකම කොළ පරීක්ෂා කරන්න"]}, "ta": {"symptoms": ["முதிர்ந்த வண்டுகள் சுரண்டிய இடங்களில் இலைகளில் வெள்ளை இணைக் கோடுகள்", "புழுக்கள் இலைக்குள் சுரங்கம் தோண்டிய இடங்களில் ஒழுங்கற்ற வெள்ளைத் திட்டுகள்", "இலைகளில் சிறிய கருமையான முள் வண்டுகள்; கடுமையாகத் தாக்கப்பட்ட வயல்கள் வெள்ளையாகத் தெரியும்"], "conditions": ["அதிக நைதரசனும் செழிப்பான வளர்ச்சியும்", "வயலைச் சுற்றியுள்ள புல் களைகள்", "மழைக் காலத்தைத் தொடர்ந்து வறண்ட வானிலை"], "manage": ["கூடுதல் யூரியாவை நிறுத்துங்கள்", "முட்டைகளும் புழுக்களும் உள்ள தாக்கப்பட்ட இலைகளின் நுனிகளை வெட்டி அழியுங்கள்", "காலையில் வலை (sweep net) மூலம் முதிர்ந்த வண்டுகளைப் பிடியுங்கள்", "பல இலைகள் சேதமடைந்தால், ஹிஸ்பாவுக்குப் பரிந்துரைக்கப்பட்ட பூச்சிக்கொல்லியை லேபிள் அளவில் தெளியுங்கள்; எது என்று உங்கள் விவசாயப் போதனாசிரியரிடம் கேளுங்கள்"], "prevent": ["நடவுக்கு முன், முட்டைகளை அகற்ற நாற்று இலைகளின் நுனிகளை வெட்டுங்கள்", "நைதரசனைப் பிரித்து இடுங்கள்", "வயலைச் சுற்றியுள்ள புல் களைகளை அகற்றுங்கள்", "தூர் கட்டும் ஆரம்பத்திலிருந்து ஒவ்வொரு வாரமும் இலைகளைச் சோதியுங்கள்"]}, "plan": [{"day": 0, "check": false, "text": {"en": "Stop extra urea. Look for small dark spiny beetles and white streaks on the leaves.", "si": "අමතර යූරියා නවත්වන්න. කොළ මත කුඩා තද පැහැති කටු කුරුමිණියන් සහ සුදු ඉරි සොයන්න.", "ta": "கூடுதல் யூரியாவை நிறுத்துங்கள். இலைகளில் சிறிய கருமையான முள் வண்டுகளையும் வெள்ளைக் கோடுகளையும் தேடுங்கள்."}}, {"day": 1, "check": false, "text": {"en": "Cut and destroy the tips of attacked leaves. In the morning, catch adult beetles with a sweep net.", "si": "පහර කෑ කොළවල අග කපා විනාශ කරන්න. උදෑසන දැලක් මගින් වැඩිහිටි කුරුමිණියන් අල්ලන්න.", "ta": "தாக்கப்பட்ட இலைகளின் நுனிகளை வெட்டி அழியுங்கள். காலையில் வலை மூலம் முதிர்ந்த வண்டுகளைப் பிடியுங்கள்."}}, {"day": 3, "check": true, "text": {"en": "Count damaged leaves in 10 places in the field. Are there still many beetles?", "si": "කුඹුරේ ස්ථාන 10ක හානි වූ කොළ ගණන් කරන්න. තවමත් කුරුමිණියන් බොහෝ සිටිනවාද?", "ta": "வயலில் 10 இடங்களில் சேதமடைந்த இலைகளை எண்ணுங்கள். இன்னும் பல வண்டுகள் உள்ளனவா?"}}, {"day": 4, "check": false, "text": {"en": "If many leaves are still being damaged, spray an insecticide recommended for hispa at the label dose. Wear gloves and a mask.", "si": "තවමත් කොළ බොහොමයක් හානි වේ නම්, හිස්පා සඳහා නිර්දේශිත කෘමිනාශකයක් ලේබලයේ මාත්‍රාවෙන් ඉසින්න. අත්වැසුම් සහ මුහුණු ආවරණ පළඳින්න.", "ta": "இன்னும் பல இலைகள் சேதமடைந்தால், ஹிஸ்பாவுக்குப் பரிந்துரைக்கப்பட்ட பூச்சிக்கொல்லியை லேபிள் அளவில் தெளியுங்கள். கையுறை, முகக்கவசம் அணியுங்கள்."}}, {"day": 10, "check": true, "text": {"en": "Check again and scan a leaf. Remove grass weeds on the bunds.", "si": "නැවත පරීක්ෂා කර කොළයක් ස්කෑන් කරන්න. නියරවල තෘණ වල් පැළ ඉවත් කරන්න.", "ta": "மீண்டும் சோதித்து ஒரு இலையை ஸ்கேன் செய்யுங்கள். வரப்புகளிலுள்ள புல் களைகளை அகற்றுங்கள்."}}]}, "rice_panicle_blast": {"sci": "Magnaporthe oryzae (Pyricularia oryzae)", "type": "fungal", "swatch": "sw-blast", "summary": {"en": "The blast fungus attacks the neck of the panicle. The neck turns grey-brown to black and the panicle breaks or hangs down with white, empty grains.", "si": "පාළු දිලීරය කරලේ බෙල්ලට පහර දෙයි. බෙල්ල අළු-දුඹුරු සිට කළු පැහැයට හැරී, කරල කැඩී යයි හෝ සුදු, හිස් ඇට සමඟ පහළට එල්ලා වැටේ.", "ta": "குலை நோய்ப் பூஞ்சை கதிரின் கழுத்தைத் தாக்கும். கழுத்து சாம்பல்-பழுப்பிலிருந்து கருப்பாக மாறி, கதிர் உடைந்து அல்லது வெள்ளைப் பதர் மணிகளுடன் தொங்கும்."}, "en": {"symptoms": ["Grey-brown to black rot on the neck just below the panicle", "The panicle breaks at the neck or hangs down", "Grains are white and empty (whiteheads); spots also appear on the panicle branches"], "conditions": ["Cool nights, dew and high humidity at heading", "Too much nitrogen", "Leaf blast earlier in the season", "Susceptible varieties"], "manage": ["Stop extra urea", "When the panicles are coming out, spray the recommended fungicide such as tricyclazole at the label dose", "A second spray about 10 days later protects late panicles", "Wear gloves and a mask when spraying"], "prevent": ["Grow a blast-resistant variety recommended for your area", "Apply nitrogen in split doses; no extra urea at panicle start", "Control leaf blast early in the season", "Destroy infected straw after harvest"]}, "si": {"symptoms": ["කරලට පහළින් බෙල්ලේ අළු-දුඹුරු සිට කළු පැහැති කුණු වීම", "කරල බෙල්ලෙන් කැඩී යයි හෝ පහළට එල්ලා වැටේ", "ඇට සුදු සහ හිස්ය (සුදු කරල්); කරලේ අතුවලද පුල්ලි ඇති වේ"], "conditions": ["කරල් පිටවන විට සීතල රාත්‍රී, පිනි සහ ඉහළ ආර්ද්‍රතාව", "නයිට්‍රජන් වැඩිපුර", "කන්නයේ කලින් ඇති වූ කොළ පාළුව", "රෝගයට ලක්විය හැකි ප්‍රභේද"], "manage": ["අමතර යූරියා නවත්වන්න", "කරල් පිටවන විට, ට්‍රයිසයික්ලසෝල් වැනි නිර්දේශිත දිලීර නාශකය ලේබලයේ මාත්‍රාවෙන් ඉසින්න", "දින 10කට පමණ පසු දෙවන ඉසීමකින් පමා වී එන කරල් ආරක්ෂා වේ", "ඉසින විට අත්වැසුම් සහ මුහුණු ආවරණ පළඳින්න"], "prevent": ["ඔබේ ප්‍රදේශයට නිර්දේශිත පාළු ප්‍රතිරෝධී ප්‍රභේදයක් වගා කරන්න", "නයිට්‍රජන් කොටස් වශයෙන් යොදන්න; කරල් හටගන්නා විට අමතර යූරියා නොයොදන්න", "කන්නයේ මුලදීම කොළ පාළුව පාලනය කරන්න", "අස්වැන්නෙන් පසු රෝගී පිදුරු විනාශ කරන්න"]}, "ta": {"symptoms": ["கதிருக்குச் சற்றுக் கீழே கழுத்தில் சாம்பல்-பழுப்பிலிருந்து கருப்பு அழுகல்", "கதிர் கழுத்தில் உடைகிறது அல்லது தொங்குகிறது", "மணிகள் வெள்ளையாகவும் பதராகவும் இருக்கும் (வெண்கதிர்); கதிர்க் கிளைகளிலும் புள்ளிகள் தோன்றும்"], "conditions": ["கதிர் வரும்போது குளிர்ந்த இரவுகள், பனி, அதிக ஈரப்பதம்", "அதிக நைதரசன்", "பருவத்தின் முன்பகுதியில் இலைக் குலை நோய்", "நோய்க்கு எளிதில் இலக்காகும் இனங்கள்"], "manage": ["கூடுதல் யூரியாவை நிறுத்துங்கள்", "கதிர்கள் வெளிவரும்போது, ட்ரைசைக்ளசோல் போன்ற பரிந்துரைக்கப்பட்ட பூஞ்சைக்கொல்லியை லேபிள் அளவில் தெளியுங்கள்", "சுமார் 10 நாட்களுக்குப் பின் இரண்டாவது தெளிப்பு தாமதமாக வரும் கதிர்களைப் பாதுகாக்கும்", "தெளிக்கும்போது கையுறை, முகக்கவசம் அணியுங்கள்"], "prevent": ["உங்கள் பகுதிக்குப் பரிந்துரைக்கப்பட்ட குலை நோய் எதிர்ப்பு இனத்தைப் பயிரிடுங்கள்", "நைதரசனைப் பிரித்து இடுங்கள்; கதிர் உருவாகும்போது கூடுதல் யூரியா வேண்டாம்", "பருவத்தின் ஆரம்பத்திலேயே இலைக் குலை நோயைக் கட்டுப்படுத்துங்கள்", "அறுவடைக்குப் பின் நோயுற்ற வைக்கோலை அழியுங்கள்"]}, "plan": [{"day": 0, "check": false, "text": {"en": "Stop all urea. Check the necks of the panicles for grey or black rot.", "si": "සියලු යූරියා නවත්වන්න. කරල්වල බෙල්ලේ අළු හෝ කළු කුණු වීම් ඇත්දැයි පරීක්ෂා කරන්න.", "ta": "யூரியா இடுவதை முற்றாக நிறுத்துங்கள். கதிர்களின் கழுத்தில் சாம்பல் அல்லது கருப்பு அழுகல் உள்ளதா எனச் சோதியுங்கள்."}}, {"day": 1, "check": false, "text": {"en": "Spray the recommended fungicide, such as tricyclazole, in the morning at the label dose. Wear gloves and a mask.", "si": "උදෑසන ට්‍රයිසයික්ලසෝල් වැනි නිර්දේශිත දිලීර නාශකය ලේබලයේ මාත්‍රාවෙන් ඉසින්න. අත්වැසුම් සහ මුහුණු ආවරණ පළඳින්න.", "ta": "காலையில் ட்ரைசைக்ளசோல் போன்ற பரிந்துரைக்கப்பட்ட பூஞ்சைக்கொல்லியை லேபிள் அளவில் தெளியுங்கள். கையுறை, முகக்கவசம் அணியுங்கள்."}}, {"day": 4, "check": true, "text": {"en": "Check the new panicles for black necks and scan again.", "si": "අලුත් කරල්වල කළු බෙල්ල ඇත්දැයි පරීක්ෂා කර නැවත ස්කෑන් කරන්න.", "ta": "புதிய கதிர்களில் கருப்புக் கழுத்து உள்ளதா எனச் சோதித்து மீண்டும் ஸ்கேன் செய்யுங்கள்."}}, {"day": 10, "check": false, "text": {"en": "If the disease is still spreading, spray a second time at the label dose to protect the late panicles.", "si": "රෝගය තවමත් පැතිරේ නම්, පමා වී එන කරල් ආරක්ෂා කිරීමට ලේබලයේ මාත්‍රාවෙන් දෙවන වරට ඉසින්න.", "ta": "நோய் இன்னும் பரவினால், தாமதமாக வரும் கதிர்களைப் பாதுகாக்க லேபிள் அளவில் இரண்டாவது முறை தெளியுங்கள்."}}, {"day": 14, "check": true, "text": {"en": "Weekly check until harvest. After harvest, destroy the infected straw.", "si": "අස්වැන්න තෙක් සතිපතා පරීක්ෂාව. අස්වැන්නෙන් පසු රෝගී පිදුරු විනාශ කරන්න.", "ta": "அறுவடை வரை வாராந்திர சோதனை. அறுவடைக்குப் பின் நோயுற்ற வைக்கோலை அழியுங்கள்."}}]}};
    Object.keys(MORE).forEach(id => {
        const m = MORE[id];
        if (typeof DISEASES !== "undefined" && !DISEASES.find(d => d.id === id)) {
            const name = id.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
            DISEASES.push({ id, sci: m.sci, type: m.type, swatch: m.swatch, name: { en: name, si: name, ta: name },
                summary: m.summary, symptoms: m.en.symptoms, conditions: m.en.conditions, manage: m.en.manage, prevent: m.en.prevent });
        }
        if (typeof CONTENT_I18N !== "undefined") {
            ["si", "ta"].forEach(l => { if (CONTENT_I18N[l]) CONTENT_I18N[l][id] = Object.assign({}, m[l], CONTENT_I18N[l][id] || {}); });
        }
        TREATMENT_PLANS[id] = m.plan;
    });
})();
