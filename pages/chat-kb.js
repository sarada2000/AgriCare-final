/* AgriCare chat brain – answers farming questions with no internet.
   Reads English, Sinhala and Tamil (and Singlish words), finds the disease, pest, variety,
   district or topic in the question and builds the answer from the site's own data. */

const AgriBrain = (() => {

    /* ---------- helpers ---------- */
    const LANGS = ["en", "si", "ta"];
    const norm = s => String(s || "").toLowerCase().replace(/[‌‍]/g, "").replace(/[?!.,;:()"'“”‘’]/g, " ").replace(/\s+/g, " ").trim();
    const tr = (key, lang) => (translations[lang] && translations[lang][key]) || translations.en[key] || key;
    const loc = (obj, lang) => (obj && (obj[lang] || obj.en)) || "";
    const list = (id, field, english, lang) => {
        if (lang === "en" || typeof CONTENT_I18N === "undefined") return english || [];
        const v = CONTENT_I18N[lang] && CONTENT_I18N[lang][id] && CONTENT_I18N[lang][id][field];
        return v || english || [];
    };
    const bullets = arr => arr.map(x => "• " + x).join("\n");
    const base = () => (location.pathname.indexOf("/pages/") >= 0 ? "" : "pages/");

    /* Which language did the farmer type in? */
    function detectLang(text) {
        if (/[඀-෿]/.test(text)) return "si";
        if (/[஀-௿]/.test(text)) return "ta";
        return (typeof getLanguage === "function") ? getLanguage() : "en";
    }

    /* Keyword test. Latin words match whole words (plural allowed), "word*" matches the start of a word.
       Sinhala/Tamil words match anywhere (they take many endings). */
    function hit(q, kw) {
        kw = norm(kw);
        if (/^[a-z0-9 \-*]+$/.test(kw)) {
            const prefix = kw.endsWith("*");
            const k = kw.replace("*", "").replace(/[-]/g, "\\-");
            return new RegExp("(^|[^a-z0-9])" + k + (prefix ? "" : "(s|es)?(?![a-z0-9])")).test(q);
        }
        return q.indexOf(kw) >= 0;
    }
    const any = (q, kws) => kws.some(k => hit(q, k));
    const count = (q, kws) => kws.reduce((n, k) => n + (hit(q, k) ? 1 : 0), 0);

    /* ---------- what the farmer may call each disease / pest ---------- */
    const DISEASE_WORDS = {
        blast: ["blast", "pyricularia", "neck rot", "neck blast", "පාළුව", "පාලුව", "බ්ලාස්ට්", "කරල් බෙල්ල", "palu*", "paluwa", "குலை நோய்", "குலைநோய்", "பிளாஸ்ட்", "கழுத்து அழுகல்"],
        bacterial_leaf_blight: ["blight", "blb", "bacterial", "leaf blight", "අංගමාරය", "අංගමාර", "කොළ අංගමාර", "angamara*", "இலைக் கருகல்", "இலைக்கருகல்", "கருகல்", "பாக்டீரியா"],
        brown_spot: ["brown spot", "helminthosporium", "bipolaris", "දුඹුරු පුල්ලි", "දුඹුරු ලප", "புள்ளி நோய்", "பழுப்புப் புள்ளி", "பழுப்பு புள்ளி"],
        sheath_blight: ["sheath blight", "sheath", "rhizoctonia", "කොපු අංගමාර", "කොපු", "இலையுறை", "உறைக் கருகல்", "உறை கருகல்"],
        tungro: ["tungro", "ටුන්ග්රෝ", "ටුංග්රෝ", "துங்ரோ"],
        red_stripe: ["red stripe", "red streak", "redstripe", "orange stripe", "රතු ඉරි", "රතු ඉර", "සිවප්පු", "சிவப்புக் கோடு", "சிவப்பு கோடு", "சிவப்புக்கோடு"]
    };
    const PEST_WORDS = {
        brown_planthopper: ["bph", "brown planthopper", "planthopper", "plant hopper", "hopperburn", "hopper burn", "දුඹුරු පැල කීඩෑව", "පැල කීඩෑව", "පැලකීඩෑව", "keedawa", "kidawa", "தத்துப்பூச்சி", "பழுப்புத் தத்து", "பழுப்பு தத்து"],
        gall_midge: ["gall midge", "gall", "midge", "silver shoot", "onion leaf", "onion shoot", "ගොබ මැස්ස", "ගොබමැස්ස", "රිදී දල්ල", "ලූනු කොළ", "ஆனைக்கொம்பன்", "வெள்ளித் தூர்", "வெங்காய இலை"],
        paddy_bug: ["paddy bug", "rice bug", "stink bug", "leptocorisa", "වී මකුණ", "මකුණ", "makuna", "நாவாய்", "கதிர் நாவாய்"],
        leaf_folder: ["leaf folder", "leaffolder", "leaf roller", "folded leaf", "කොළ හකුළන", "හකුළන", "கொளில் சுருட்டு", "இலை சுருட்டு", "இலைச் சுருட்டு", "சுருட்டுப் புழு"],
        stem_borer: ["stem borer", "borer", "dead heart", "deadheart", "white head", "whitehead", "කඳ පණුව", "කඳපණුව", "කහ කඳ", "මැරුණු දල්ල", "සුදු කරල්", "தண்டுத் துளைப்பான்", "துளைப்பான்", "குருத்துப் பூச்சி", "வெண்கதிர்"],
        thrips: ["thrip*", "තිරිප්ස්", "තිරිප්ස", "இலைப்பேன்", "திரிப்ஸ்"],
        green_leafhopper: ["green leafhopper", "leafhopper", "leaf hopper", "glh", "කොළ පැල කීඩෑව", "කොළ කීඩෑව", "பச்சைத் தத்து", "பச்சை தத்து"],
        rats: ["rat", "mouse", "mice", "rodent", "bandicoot", "මීය", "මීයා", "මීයන්", "හීන් මීය", "meeya*", "meeyo", "எலி"],
        birds: ["bird", "munia", "weaver", "sparrow", "කුරුල්ල", "කුරුලු", "වී කුරුල්", "kurull*", "பறவை", "குருவி"],
        peafowl: ["peafowl", "peacock", "peahen", "මොනර", "monara*", "மயில்"],
        wild_boar: ["boar", "pig", "swine", "ඌරා", "ඌරන්", "වල් ඌර", "ura", "uran", "பன்றி"],
        elephant: ["elephant", "jumbo", "අලි", "අලියා", "අලින්", "ali", "aliya", "யானை"]
    };

    /* ---------- topics: words in 3 languages + the answer in 3 languages ---------- */
    const T = {};
    const topic = (id, words, answers, links) => { T[id] = { words, answers, links: links || [] }; };

    topic("fert", ["fertili*", "fertiliz*", "urea", "tsp", "mop", "npk", "manure", "top dress*", "topdress*", "nitrogen", "potash", "potassium", "phosphate", "pohora", "uriya", "පොහොර", "යූරියා", "යුරියා", "ටීඑස්පී", "මතුපිට පොහොර", "උරம்", "உரம்", "யூரியா", "மேலுரம்", "அடியுரம்", "நைட்ரஜன்"], {
        en: "Fertilizer for paddy – the DOA way:\n• Basal: mix TSP and MOP into the mud at the last ploughing, before sowing.\n• Urea in split doses: about 2 weeks, 4 weeks and at panicle start (about 6–7 weeks for a 3½-month variety). Never all at once.\n• Apply urea onto 2–3 cm of water, then close the field inlets and outlets for 3–4 days. Don't apply before heavy rain.\n• Dark green leaves with blast or brown planthopper around? Stop extra urea.\n• Use the amounts in the DOA fertilizer recommendation for your variety's age. Adding compost or ploughing in straw lets you use less.\n• My Crop builds the exact dates for your field.",
        si: "වී සඳහා පොහොර – කෘෂිකර්ම දෙපාර්තමේන්තු ක්‍රමය:\n• මූලික පොහොර: වැපිරීමට පෙර අවසාන සී සෑමේදී TSP සහ MOP මඩට මිශ්‍ර කරන්න.\n• යූරියා කොටස් වශයෙන්: සති 2 දී, සති 4 දී සහ කරල් හටගැනීම ආරම්භයේදී (මාස 3½ වී වර්ගයකට සති 6–7 පමණ). කිසිවිට එකවර නොදමන්න.\n• සෙ.මී. 2–3 ජලයක් ඇති විට යූරියා යොදා දින 3–4ක් ජලය ඇතුළු වීම සහ පිටවීම වසන්න. තද වැස්සකට පෙර නොයොදන්න.\n• කොළ තද කොළ පාටද, පාළුව හෝ දුඹුරු පැල කීඩෑවා ඇත්ද? අමතර යූරියා නවත්වන්න.\n• ඔබේ වී වර්ගයේ වයසට කෘ.දෙ. පොහොර නිර්දේශයේ ප්‍රමාණ යොදන්න. කොම්පෝස්ට් හෝ පිදුරු පසට යෙදීමෙන් අඩුවෙන් පොහොර ප්‍රමාණවත් වේ.\n• \"මගේ වගාව\" පිටුව ඔබේ කුඹුරට නිවැරදි දින සකසා දෙයි.",
        ta: "நெல்லுக்கு உரம் – விவசாயத் திணைக்கள முறை:\n• அடியுரம்: விதைப்புக்கு முன் கடைசி உழவில் TSP, MOP ஐச் சேற்றில் கலவுங்கள்.\n• யூரியாவைப் பிரித்து இடுங்கள்: சுமார் 2 வாரம், 4 வாரம், கதிர் உருவாகத் தொடங்கும்போது (3½ மாத இனத்துக்கு சுமார் 6–7 வாரம்). ஒரே தடவையில் இட வேண்டாம்.\n• 2–3 செ.மீ. நீரில் யூரியா இட்டு 3–4 நாட்கள் நீர் உள்ளே வருவதையும் வெளியேறுவதையும் மூடுங்கள். கனமழைக்கு முன் இட வேண்டாம்.\n• இலைகள் கரும்பச்சையாக, குலை நோய் அல்லது தத்துப்பூச்சி உள்ளதா? மேலதிக யூரியாவை நிறுத்துங்கள்.\n• உங்கள் இன வயதுக்கான திணைக்கள உரப் பரிந்துரையின் அளவுகளைப் பயன்படுத்துங்கள். கூட்டெரு அல்லது வைக்கோலைச் சேர்த்தால் குறைந்த உரம் போதும்.\n• \"எனது பயிர்\" பக்கம் உங்கள் வயலுக்கான சரியான நாட்களைத் தரும்."
    }, [["my-crop.html", "nav_crop"]]);

    topic("water", ["water", "irrigat*", "flood*", "drain*", "dry field", "awd", "wathura", "jalaya", "වතුර", "ජලය", "ජල", "වාරි", "කාණු", "தண்ணீர்", "நீர்", "பாசன", "வடிகால்"], {
        en: "Water for paddy:\n• First 3–4 days: keep the soil just wet, no standing water, so the seedlings root well. Then keep 2–5 cm.\n• Tillering: keep 2–5 cm of water. A 5–7 day drain in mid-tillering makes roots strong and saves water.\n• Panicle start to flowering: never let the field dry – keep about 5 cm. Shortage now gives empty grains.\n• Ripening: keep the soil wet, then drain 10–14 days before harvest.\n• Short of water? Alternate wetting and drying: let the water drop until the soil shows fine cracks, then fill again (not during flowering).",
        si: "වී සඳහා ජලය:\n• පළමු දින 3–4: පැළ හොඳින් මුල් අදින්නට පස තෙත්ව පමණක් තබන්න, ජලය රඳවන්න එපා. ඉන්පසු සෙ.මී. 2–5 තබන්න.\n• පඳුරු දැමීම: සෙ.මී. 2–5 ජලය තබන්න. පඳුරු දැමීමේ මැද දින 5–7ක් ජලය ඉවත් කිරීම මුල් ශක්තිමත් කර ජලය ඉතිරි කරයි.\n• කරල් හටගැනීමේ සිට මල් පිපීම දක්වා: කුඹුර කිසිවිට වියළන්න එපා – සෙ.මී. 5 පමණ තබන්න. මේ කාලයේ ජල හිඟය බොල් ඇට ඇති කරයි.\n• ඉදීම: පස තෙත්ව තබා අස්වැන්නට දින 10–14කට පෙර ජලය බැස යවන්න.\n• ජලය මදිද? තෙත් කිරීම හා වියළීම මාරුවෙන්: පසේ සිහින් ඉරිතැලීම් පෙනෙන තුරු ජලය අඩු වීමට ඉඩ දී නැවත පුරවන්න (මල් පිපෙන කාලයේ නොවේ).",
        ta: "நெல்லுக்கு நீர்:\n• முதல் 3–4 நாட்கள்: நாற்றுகள் நன்கு வேரூன்ற மண்ணை ஈரமாக மட்டும் வையுங்கள், நீர் தேக்க வேண்டாம். பின்னர் 2–5 செ.மீ. வையுங்கள்.\n• தூர் கட்டல்: 2–5 செ.மீ. நீர் வையுங்கள். தூர் கட்டலின் நடுவில் 5–7 நாள் நீர் வடிப்பது வேர்களை வலுப்படுத்தி நீரைச் சேமிக்கும்.\n• கதிர் உருவாதல் முதல் பூத்தல் வரை: வயலை ஒருபோதும் காய விட வேண்டாம் – சுமார் 5 செ.மீ. வையுங்கள். இப்போது நீர்ப் பற்றாக்குறை பதர் மணிகளைத் தரும்.\n• முற்றுதல்: மண்ணை ஈரமாக வைத்து, அறுவடைக்கு 10–14 நாள் முன் நீரை வடியுங்கள்.\n• நீர் குறைவா? மாறி மாறி நனைத்து உலர்த்தல்: மண்ணில் மெல்லிய வெடிப்பு தெரியும் வரை நீர் குறைய விட்டு மீண்டும் நிரப்புங்கள் (பூக்கும் காலத்தில் அல்ல)."
    });

    topic("weed", ["weed*", "herbicide*", "weedicide*", "grass", "sedge", "weedy rice", "red rice weed", "wal", "wal nasaka", "වල්", "වල් නාශක", "වල්නාශක", "තණකොළ", "වල් වී", "களை", "களைக்கொல்லி", "புல்"], {
        en: "Weed control in paddy:\n• Level the field well and keep 2–5 cm of water after the seedlings are up – water stops most weeds.\n• Use clean seed paddy with no weed seeds.\n• Weedicide: EITHER a pre-emergence weedicide 0–4 days after sowing on moist soil, OR a post-emergence weedicide at 6–10 days when the weeds have 1–3 leaves. Pick one labelled for paddy and for your weeds (grasses, sedges or broad-leaf), and use the label dose.\n• Hand weed or use a rotary weeder at about 2 and 4 weeks – the first 30–40 days decide the yield.\n• Weedy rice (shatters early, red grain): plough once, let the weeds sprout for 1–2 weeks with water, then plough again before sowing.\n\nWeedicides by days after sowing:\n• 2 days before sowing – Sofit (for weedy rice)\n• Day 0–4 – Sofit\n• Day 6–10 – Solito 320 EC or Profit 500 EC\n• Day 8–15 – Facet Quinclorac (Maruk)\n• Day 21–28 – MCPA 60 (sedges and broad-leaf weeds)",
        si: "කුඹුරේ වල් පාලනය:\n• කුඹුර හොඳින් මට්ටම් කර පැළ මතු වූ පසු සෙ.මී. 2–5 ජලය තබන්න – ජලයෙන් බොහෝ වල් නවතී.\n• වල් බීජ නැති පිරිසිදු බිත්තර වී යොදන්න.\n• වල්නාශක: වැපිරීමෙන් දින 0–4 අතර තෙත් පසට පූර්ව නිර්ගමන වල්නාශකයක්, නැතහොත් වල් පැළවල කොළ 1–3ක් ඇති විට දින 6–10 අතර පශ්චාත් නිර්ගමන වල්නාශකයක්. වී සඳහා සහ ඔබේ වල් වර්ගයට (තෘණ, පන් වර්ග, පළල් පත්‍ර) ලේබලයේ සඳහන් එකක් තෝරා ලේබල් මාත්‍රාව යොදන්න.\n• සති 2 සහ 4 පමණ අතින් වල් නෙළන්න හෝ රෝද වල් නෙළනය යොදන්න – පළමු දින 30–40 අස්වැන්න තීරණය කරයි.\n• වල් වී (ඉක්මනින් හැලෙන, රතු ඇට): එක් වරක් සී සාන්න, ජලය සමඟ සති 1–2ක් වල් පැළ වීමට ඉඩ දී, වැපිරීමට පෙර නැවත සී සාන්න.\n\nවැපිරීමෙන් පසු දින අනුව වල්නාශක:\n• වැපිරීමට දින 2කට පෙර – සොෆිට් (වල් වී සඳහා)\n• දින 0–4 – සොෆිට්\n• දින 6–10 – සොලිටෝ 320 ඊ.සී. හෝ ප්‍රොෆිට් 500 ඊ.සී.\n• දින 8–15 – ෆැසෙට් ක්වින්ක්ලෝරැක් (මාරුක්)\n• දින 21–28 – එම්.සී.පී.ඒ. 60 (පන් වර්ග සහ පළල් පත්‍ර වල්)",
        ta: "நெல்வயலில் களைக் கட்டுப்பாடு:\n• வயலை நன்கு சமன் செய்து, நாற்றுகள் வந்தபின் 2–5 செ.மீ. நீர் வையுங்கள் – நீர் பெரும்பாலான களைகளைத் தடுக்கும்.\n• களை விதை இல்லாத சுத்தமான விதைநெல்லைப் பயன்படுத்துங்கள்.\n• களைக்கொல்லி: விதைத்து 0–4 நாட்களுக்குள் ஈர மண்ணில் முளைப்புக்கு முந்திய களைக்கொல்லி, அல்லது களைகளுக்கு 1–3 இலைகள் வந்ததும் 6–10ஆம் நாளில் முளைத்தபின் களைக்கொல்லி. நெல்லுக்கும் உங்கள் களை வகைக்கும் (புல், கோரை, அகன்ற இலை) லேபிளில் உள்ளதைத் தேர்ந்து லேபிள் அளவில் இடுங்கள்.\n• சுமார் 2, 4 வாரங்களில் கையால் அல்லது சுழல் களையெடுப்பானால் களையெடுங்கள் – முதல் 30–40 நாட்களே விளைச்சலைத் தீர்மானிக்கும்.\n• களை நெல் (முன்கூட்டியே உதிரும், சிவப்பு மணி): ஒருமுறை உழுது, நீருடன் 1–2 வாரம் களைகள் முளைக்க விட்டு, விதைப்புக்கு முன் மீண்டும் உழுங்கள்.\n\nவிதைத்த பின் நாட்களின்படி களைக்கொல்லிகள்:\n• விதைப்புக்கு 2 நாள் முன் – Sofit (களை நெல்லுக்கு)\n• நாள் 0–4 – Sofit\n• நாள் 6–10 – Solito 320 EC அல்லது Profit 500 EC\n• நாள் 8–15 – Facet Quinclorac (Maruk)\n• நாள் 21–28 – MCPA 60 (கோரை, அகன்ற இலைக் களைகள்)"
    });

    T.weed.links = [["weeds.html", "nav_weeds"]];

    topic("seed", ["seed*", "seed rate", "germinat*", "sowing", "sow", "nursery", "transplant*", "parachute", "bittara", "බිත්තර වී", "බීජ", "වැපිරීම", "වපුර", "පැළ තවාන", "තවාන", "සිටුවීම", "විதை", "விதை", "விதைநெல்", "முளை", "நாற்று", "நடவு"], {
        en: "Seed paddy and sowing:\n• Use certified seed or your own clean, well-dried seed of a recommended variety.\n• Salt-water test: put seed in salt water strong enough to float an egg and remove the seeds that float.\n• Soak 24 hours, then keep covered in a damp sack for about 48 hours until the sprouts are 2–3 mm.\n• Seed rate: about 100 kg per hectare (40 kg per acre) for broadcasting; about half that for transplanting or parachute seedlings.\n• Sow on a well-levelled, puddled field with a thin film of water so seeds don't rot in pools.\n• Sow at the same time as your neighbours – it reduces pests, birds and rats.",
        si: "බිත්තර වී සහ වැපිරීම:\n• සහතික කළ බිත්තර වී හෝ ඔබේම පිරිසිදු, හොඳින් වියළූ නිර්දේශිත වී වර්ගයක බීජ යොදන්න.\n• ලුණු ජල පරීක්ෂාව: බිත්තරයක් පාවෙන තරම් ලුණු වතුරට බීජ දමා පාවෙන බීජ ඉවත් කරන්න.\n• පැය 24ක් පොඟවා, පැළ මුල් මි.මී. 2–3 වන තුරු පැය 48ක් පමණ තෙත් ගෝනියක වසා තබන්න.\n• බීජ ප්‍රමාණය: ඉසීමට හෙක්ටයාරයකට කි.ග්‍රෑ. 100 පමණ (අක්කරයකට කි.ග්‍රෑ. 40); පැළ සිටුවීමට හෝ පැරෂුට් ක්‍රමයට ඉන් අඩක් පමණ.\n• බීජ වළවල කුණු නොවීමට හොඳින් මට්ටම් කළ මඩ කුඹුරක සිහින් ජල පටලයක් සහිතව වපුරන්න.\n• අසල්වැසියන් සමඟ එකම කාලයේ වපුරන්න – පළිබෝධ, කුරුල්ලන් සහ මීයන් අඩු වේ.",
        ta: "விதைநெல்லும் விதைப்பும்:\n• சான்றளிக்கப்பட்ட விதை அல்லது பரிந்துரைக்கப்பட்ட இனத்தின் சுத்தமான, நன்கு உலர்ந்த உங்கள் சொந்த விதையைப் பயன்படுத்துங்கள்.\n• உப்பு நீர்ச் சோதனை: முட்டை மிதக்கும் அளவு உப்பு நீரில் விதையைப் போட்டு மிதக்கும் விதைகளை அகற்றுங்கள்.\n• 24 மணி நேரம் ஊறவைத்து, முளை 2–3 மி.மீ. ஆகும் வரை சுமார் 48 மணி நேரம் ஈரச் சாக்கில் மூடி வையுங்கள்.\n• விதை அளவு: வீசி விதைக்க ஹெக்டேருக்கு சுமார் 100 கி.கி. (ஏக்கருக்கு 40 கி.கி.); நடவு அல்லது பரசூட் முறைக்கு அதில் அரைவாசி.\n• விதைகள் குழிகளில் அழுகாமல் இருக்க நன்கு சமன் செய்த சேற்று வயலில் மெல்லிய நீர்ப் படலத்துடன் விதையுங்கள்.\n• அயலவர்களுடன் ஒரே நேரத்தில் விதையுங்கள் – பூச்சி, பறவை, எலித் தொல்லை குறையும்."
    });

    topic("landprep", ["land prep*", "plough*", "plow*", "tillage", "puddl*", "level*", "bund*", "see sanna", "සී සෑම", "සී සාන", "බිම් සකස්", "බිම සකස්", "මඩ කිරීම", "මඩ කර", "නියර", "උழவு", "உழவு", "உழு", "சேறு", "வரம்பு", "நிலம் தயார்"], {
        en: "Land preparation:\n• Repair the bunds and clean the channels first.\n• First ploughing with water 3–4 weeks before sowing, so stubble and weeds rot.\n• Second ploughing 1–2 weeks later kills the weeds that have sprouted.\n• Final puddling and careful levelling just before sowing – a level field needs less water and has fewer weeds.\n• Mix the basal fertilizer (TSP + MOP) and compost into the mud at the final puddling.",
        si: "බිම් සැකසීම:\n• මුලින්ම නියර අලුත්වැඩියා කර ඇළ මාර්ග පිරිසිදු කරන්න.\n• ඉපනැලි සහ වල් කුණු වීමට වැපිරීමට සති 3–4කට පෙර ජලය සමඟ පළමු සී සෑම.\n• සති 1–2කට පසු දෙවන සී සෑමෙන් පැළ වූ වල් විනාශ වේ.\n• වැපිරීමට මොහොතකට පෙර අවසාන මඩ කිරීම සහ හොඳින් මට්ටම් කිරීම – මට්ටම් කුඹුරකට අඩු ජලයක් ප්‍රමාණවත් වන අතර වල් ද අඩුය.\n• අවසාන මඩ කිරීමේදී මූලික පොහොර (TSP + MOP) සහ කොම්පෝස්ට් මඩට මිශ්‍ර කරන්න.",
        ta: "நிலம் தயாரித்தல்:\n• முதலில் வரம்புகளைத் திருத்தி வாய்க்கால்களைச் சுத்தம் செய்யுங்கள்.\n• அடிக்கட்டையும் களைகளும் அழுக விதைப்புக்கு 3–4 வாரம் முன் நீருடன் முதல் உழவு.\n• 1–2 வாரம் கழித்து இரண்டாம் உழவு முளைத்த களைகளை அழிக்கும்.\n• விதைப்புக்குச் சற்று முன் இறுதிச் சேறாக்கலும் கவனமான சமன் செய்தலும் – சமனான வயலுக்குக் குறைந்த நீர் போதும், களையும் குறைவு.\n• இறுதிச் சேறாக்கலில் அடியுரத்தையும் (TSP + MOP) கூட்டெருவையும் சேற்றில் கலவுங்கள்."
    });

    topic("harvest", ["harvest*", "threshing", "thresh*", "combine", "moisture", "drying grain", "dry the grain", "kapanna", "අස්වනු", "අස්වැන්න", "කපන", "කැපීම", "පාගන", "වී වියළ", "அறுவடை", "அறுக்க", "சூடடி", "நெல் உலர்"], {
        en: "Harvesting:\n• Harvest when 80–85% of the grains on the panicle are golden – about 30 days after flowering.\n• Drain the field 10–14 days before harvest so the soil is firm.\n• Harvesting late makes grains fall and break in the mill.\n• Thresh soon after cutting. Dry the grain on mats or tarpaulin (not on the road) to 14% moisture – a dry grain cracks sharply between your teeth.\n• Don't heap wet paddy overnight; it heats up and spoils.",
        si: "අස්වනු නෙළීම:\n• කරලේ ඇට 80–85% රන්වන් පාට වූ විට – මල් පිපී දින 30කට පමණ පසු – කපන්න.\n• පස තද වීමට අස්වැන්නට දින 10–14කට පෙර ජලය බැස යවන්න.\n• ප්‍රමාද වී කපන විට ඇට හැලී, මෝලේදී කැඩේ.\n• කැපූ පසු ඉක්මනින් පාගන්න. පැදුරු හෝ තාප්පොලින් මත (පාරේ නොවේ) තෙතමනය 14% දක්වා වියළන්න – වියළි ඇටයක් දතින් සපන විට තද හඬකින් කැඩේ.\n• තෙත් වී රාත්‍රියේ ගොඩ ගසා තබන්න එපා; රත් වී නරක් වේ.",
        ta: "அறுவடை:\n• கதிரில் 80–85% மணிகள் பொன்னிறமானதும் – பூத்து சுமார் 30 நாளில் – அறுங்கள்.\n• மண் இறுக அறுவடைக்கு 10–14 நாள் முன் நீரை வடியுங்கள்.\n• தாமதமாக அறுத்தால் மணிகள் உதிர்ந்து ஆலையில் உடையும்.\n• அறுத்தவுடன் சூடடியுங்கள். பாய் அல்லது தார்ப்பாய் மீது (வீதியில் அல்ல) 14% ஈரப்பதம் வரை உலர்த்துங்கள் – உலர்ந்த மணி பல்லில் கடித்தால் சத்தத்துடன் உடையும்.\n• ஈர நெல்லை இரவில் குவித்து வைக்க வேண்டாம்; சூடாகிக் கெடும்."
    });

    topic("storage", ["store", "storage", "stored", "godown", "warehouse", "weevil*", "gabada", "ගබඩා", "ගබඩාව", "කීටයන් ගබඩා", "சேமிப்பு", "சேமி", "களஞ்சியம்"], {
        en: "Storing paddy:\n• Store only grain dried to 14% moisture.\n• Use clean, dry bags on wooden pallets, 30 cm away from the walls.\n• Make the store rat-proof and set traps around it.\n• Keep seed paddy separate, labelled with the variety and season, and test germination before sowing.\n• Check every 2 weeks – warm or smelly bags mean moisture or insects; dry them again in the sun.",
        si: "වී ගබඩා කිරීම:\n• තෙතමනය 14% දක්වා වියළූ වී පමණක් ගබඩා කරන්න.\n• පිරිසිදු වියළි ගෝනි ලී රාක්ක මත, බිත්තිවලින් සෙ.මී. 30ක් ඈතින් තබන්න.\n• ගබඩාවට මීයන් ඇතුළු නොවන සේ සකසා අවට උගුල් තබන්න.\n• බිත්තර වී වෙනම, වර්ගය සහ කන්නය ලියා තබා, වැපිරීමට පෙර පැළවීම පරීක්ෂා කරන්න.\n• සති 2කට වරක් පරීක්ෂා කරන්න – උණුසුම් හෝ ගඳ ගසන ගෝනි නම් තෙතමනය හෝ කෘමීන්; නැවත අව්වේ වියළන්න.",
        ta: "நெல் சேமிப்பு:\n• 14% ஈரப்பதம் வரை உலர்ந்த நெல்லை மட்டும் சேமியுங்கள்.\n• சுத்தமான உலர்ந்த சாக்குகளை மரத் தட்டுகளில், சுவரிலிருந்து 30 செ.மீ. தள்ளி வையுங்கள்.\n• களஞ்சியத்தை எலி நுழையாதவாறு அமைத்து சுற்றிலும் பொறிகள் வையுங்கள்.\n• விதைநெல்லைத் தனியாக, இனம், போகம் எழுதி வைத்து, விதைப்புக்கு முன் முளைப்பைச் சோதியுங்கள்.\n• 2 வாரத்துக்கு ஒருமுறை பாருங்கள் – சூடான அல்லது மணமுள்ள சாக்கு என்றால் ஈரம் அல்லது பூச்சி; மீண்டும் வெயிலில் உலர்த்துங்கள்."
    });

    topic("organic", ["organic", "compost", "straw", "green manure", "gliricidia", "cow dung", "cattle manure", "kombost*", "කොම්පෝස්ට්", "කාබනික", "පිදුරු", "ගොම", "ග්ලිරිසීඩියා", "කොළ පොහොර", "கூட்டெரு", "சேதன", "இயற்கை உரம்", "வைக்கோல்", "சாணம்", "பசுந்தாள்"], {
        en: "Organic matter for paddy:\n• Don't burn straw – plough it back in 3–4 weeks before sowing. It returns potassium and feeds the soil.\n• Add about 5 tonnes per hectare of compost or cattle manure at land preparation.\n• Gliricidia leaves as green manure: spread and plough in 2–3 weeks before sowing.\n• Organic matter lets you cut chemical fertilizer, but for a high yield still give urea in split doses.",
        si: "වී සඳහා කාබනික ද්‍රව්‍ය:\n• පිදුරු පුළුස්සන්න එපා – වැපිරීමට සති 3–4කට පෙර පසට සී සාන්න. එය පොටෑසියම් ලබා දී පස පෝෂණය කරයි.\n• බිම් සැකසීමේදී හෙක්ටයාරයකට ටොන් 5ක් පමණ කොම්පෝස්ට් හෝ ගොම පොහොර යොදන්න.\n• ග්ලිරිසීඩියා කොළ පොහොරක් ලෙස: වැපිරීමට සති 2–3කට පෙර විසිරුවා පසට සී සාන්න.\n• කාබනික ද්‍රව්‍යවලින් රසායනික පොහොර අඩු කළ හැකි නමුත් ඉහළ අස්වැන්නකට යූරියා කොටස් වශයෙන් යොදන්න.",
        ta: "நெல்லுக்குச் சேதனப் பொருள்:\n• வைக்கோலை எரிக்க வேண்டாம் – விதைப்புக்கு 3–4 வாரம் முன் மண்ணில் உழுது சேருங்கள். அது பொட்டாசியத்தைத் திருப்பித் தந்து மண்ணை வளப்படுத்தும்.\n• நிலம் தயாரிக்கும்போது ஹெக்டேருக்கு சுமார் 5 தொன் கூட்டெரு அல்லது சாணம் இடுங்கள்.\n• கிளிரிசிடியா இலைகளைப் பசுந்தாள் உரமாக: விதைப்புக்கு 2–3 வாரம் முன் பரப்பி உழுங்கள்.\n• சேதனப் பொருள் இரசாயன உரத்தைக் குறைக்க உதவும், ஆனால் அதிக விளைச்சலுக்கு யூரியாவைப் பிரித்து இடுங்கள்."
    });

    topic("yellow", ["yellow*", "pale", "orange leaves", "bronz*", "kaha", "kaha wela", "කහ", "කහ පාට", "කහ වෙලා", "සුදුමැලි", "තඹ පාට", "மஞ்சள்", "வெளிறி", "செம்பு நிற"], {
        en: "Yellow leaves – find the cause:\n• Whole plants pale yellow, older leaves first → nitrogen shortage. Give the next urea dose now.\n• Yellow-orange from the leaf tip, short plants in patches → tungro (virus spread by green leafhopper). Pull out sick plants and control the leafhoppers.\n• Bronze/orange-brown leaves, oily orange water, low-lying field → iron toxicity. Drain and dry the field 3–5 days and add MOP.\n• Round patches drying from the base, small brown insects at the base → brown planthopper. Drain the field and stop extra urea.\n• Wavy yellow-white stripes from the leaf edge → bacterial leaf blight.\n• Take a clear photo of one leaf with Scan to check.",
        si: "කහ වූ කොළ – හේතුව සොයන්න:\n• මුළු පැළයම සුදුමැලි කහ, පැරණි කොළ මුලින් → නයිට්‍රජන් හිඟය. ඊළඟ යූරියා මාත්‍රාව දැන්ම යොදන්න.\n• කොළ අගින් කහ-තැඹිලි, පැල කොටස් වශයෙන් කුරු වී → ටුන්ග්‍රෝ (කොළ පැල කීඩෑවා පතුරුවන වෛරසය). රෝගී පැළ උදුරා කොළ පැල කීඩෑවා පාලනය කරන්න.\n• තඹ/තැඹිලි-දුඹුරු කොළ, තෙල් වැනි තැඹිලි ජලය, පහත් කුඹුර → යකඩ විෂ. දින 3–5ක් ජලය බැස යවා වියළා MOP යොදන්න.\n• පාමුලින් වියළෙන රවුම් කොටස්, පාමුල කුඩා දුඹුරු කෘමීන් → දුඹුරු පැල කීඩෑවා. ජලය බැස යවා අමතර යූරියා නවත්වන්න.\n• කොළ දාරයෙන් රැලි සහිත කහ-සුදු ඉරි → බැක්ටීරියා කොළ අංගමාරය.\n• තහවුරු කර ගැනීමට \"ස්කෑන්\" හි එක් කොළයක පැහැදිලි ඡායාරූපයක් ගන්න.",
        ta: "மஞ்சள் இலைகள் – காரணத்தைக் கண்டறியுங்கள்:\n• முழுப் பயிரும் வெளிறிய மஞ்சள், முதிய இலைகள் முதலில் → நைட்ரஜன் குறைபாடு. அடுத்த யூரியா அளவை இப்போதே இடுங்கள்.\n• இலை நுனியிலிருந்து மஞ்சள்-செம்மஞ்சள், திட்டுகளாகக் குட்டையான பயிர் → துங்ரோ (பச்சைத் தத்துப்பூச்சி பரப்பும் வைரஸ்). நோயுற்ற பயிர்களைப் பிடுங்கித் தத்துப்பூச்சியைக் கட்டுப்படுத்துங்கள்.\n• செம்பு/செம்மஞ்சள்-பழுப்பு இலைகள், எண்ணெய் போன்ற செம்மஞ்சள் நீர், தாழ்வான வயல் → இரும்பு நச்சு. 3–5 நாள் நீரை வடித்து உலர்த்தி MOP இடுங்கள்.\n• அடியிலிருந்து காயும் வட்டத் திட்டுகள், அடியில் சிறிய பழுப்புப் பூச்சிகள் → பழுப்புத் தத்துப்பூச்சி. நீரை வடித்து மேலதிக யூரியாவை நிறுத்துங்கள்.\n• இலை ஓரத்திலிருந்து அலை போன்ற மஞ்சள்-வெள்ளைக் கோடுகள் → பாக்டீரியா இலைக் கருகல்.\n• உறுதிப்படுத்த \"ஸ்கேன்\" இல் ஒரு இலையின் தெளிவான படம் எடுங்கள்."
    }, [["upload-image.html", "nav_scan"]]);

    topic("spots", ["spot*", "lesion*", "patch*", "disease*", "sick", "infect*", "fungus", "fungal", "leda", "lapa", "ලප", "පුල්ලි", "රෝග", "ලෙඩ", "දිලීර", "புள்ளி", "நோய்", "பூஞ்சை"], {
        en: "Spots or disease on the leaves:\n• Diamond-shaped spots with a grey centre and brown edge → blast.\n• Small round brown spots like sesame seeds → brown spot (often weak or poor soil).\n• Yellow-white wavy stripes from the leaf edge → bacterial leaf blight.\n• Grey-green oval patches on the stem near the water → sheath blight.\n• Yellow-orange stunted plants in patches → tungro.\n• Orange spots with red stripes running up to the leaf tip → red stripe.\n• Best: take a photo of one sick leaf with Scan – AgriCare will name the disease and give the full treatment plan with alarms.",
        si: "කොළවල ලප හෝ රෝග:\n• අළු පැහැ මැද සහ දුඹුරු දාරය සහිත දියමන්ති හැඩ ලප → පාළුව.\n• තල ඇට වැනි කුඩා රවුම් දුඹුරු ලප → දුඹුරු පුල්ලි රෝගය (බොහෝවිට දුර්වල පස).\n• කොළ දාරයෙන් රැලි සහිත කහ-සුදු ඉරි → බැක්ටීරියා කොළ අංගමාරය.\n• ජලයට ආසන්න කඳේ අළු-කොළ ඕවලාකාර ලප → කොපු අංගමාරය.\n• කොටස් වශයෙන් කහ-තැඹිලි කුරු පැළ → ටුන්ග්‍රෝ.\n• කොළ අග දෙසට ඇදෙන රතු ඉරි සහිත තැඹිලි ලප → රතු ඉරි රෝගය.\n• හොඳම දේ: \"ස්කෑන්\" හි රෝගී කොළයක ඡායාරූපයක් ගන්න – AgriCare රෝගය නම් කර එලාම් සමඟ සම්පූර්ණ ප්‍රතිකාර සැලැස්ම දෙයි.",
        ta: "இலைகளில் புள்ளிகள் அல்லது நோய்:\n• சாம்பல் நடுவும் பழுப்பு ஓரமும் கொண்ட வைர வடிவப் புள்ளிகள் → குலை நோய்.\n• எள்ளு போன்ற சிறிய வட்டப் பழுப்புப் புள்ளிகள் → பழுப்புப் புள்ளி நோய் (பெரும்பாலும் வளமற்ற மண்).\n• இலை ஓரத்திலிருந்து அலை போன்ற மஞ்சள்-வெள்ளைக் கோடுகள் → பாக்டீரியா இலைக் கருகல்.\n• நீருக்கு அருகில் தண்டில் சாம்பல்-பச்சை நீள்வட்டத் திட்டுகள் → இலையுறைக் கருகல்.\n• திட்டுகளாக மஞ்சள்-செம்மஞ்சள் குட்டைப் பயிர் → துங்ரோ.\n• இலை நுனியை நோக்கி ஓடும் சிவப்புக் கோடுகளுடன் செம்மஞ்சள் புள்ளிகள் → சிவப்புக் கோடு நோய்.\n• சிறந்தது: \"ஸ்கேன்\" இல் நோயுற்ற ஒரு இலையின் படம் எடுங்கள் – AgriCare நோயைக் கண்டறிந்து அலாரங்களுடன் முழுச் சிகிச்சைத் திட்டத்தைத் தரும்."
    }, [["upload-image.html", "nav_scan"], ["disease-library.html", "nav_diseases"]]);

    topic("insects", ["insect*", "pest*", "bug*", "worm*", "caterpillar*", "larva*", "keet*", "pana*", "කෘමි", "කෘමීන්", "පළිබෝධ", "පණුව", "පණුවන්", "දළඹු", "කීටයා", "பூச்சி", "புழு", "கம்பளிப்புழு"], {
        en: "Insects in the field – match what you see:\n• Round patches drying from the base, brown insects at the base → brown planthopper.\n• Dead centre shoots or white empty panicles → yellow stem borer.\n• Leaves folded lengthwise with white streaks → leaf folder.\n• Pale hollow onion-like shoots → gall midge.\n• Empty or spotted grains, bad smell → paddy bug.\n• Rolled, silvery leaf tips in young dry fields → thrips.\n• Count before you spray: many sprays kill the spiders that eat these pests. The Pests page has the full plan for each one.",
        si: "කුඹුරේ කෘමීන් – ඔබ දකින දේ ගලපන්න:\n• පාමුලින් වියළෙන රවුම් කොටස්, පාමුල දුඹුරු කෘමීන් → දුඹුරු පැල කීඩෑවා.\n• මැද දල්ල මැරීම හෝ සුදු හිස් කරල් → කහ කඳ පණුවා.\n• සුදු ඉරි සහිතව දිගට හකුළා ගත් කොළ → කොළ හකුළන දළඹුවා.\n• ලූනු කොළ වැනි සුදුමැලි හිස් දළු → ගොබ මැස්සා.\n• හිස් හෝ ලප සහිත ඇට, නරක ගඳ → වී මකුණා.\n• තරුණ වියළි කුඹුරුවල රෝල් වූ රිදී පැහැ කොළ අග → තිරිප්ස්.\n• ඉසීමට පෙර ගණන් කරන්න: බොහෝ ඉසීම් මෙම පළිබෝධයන් කන මකුළුවන් මරයි. \"පළිබෝධ\" පිටුවේ එක් එක් එකට සම්පූර්ණ සැලැස්ම ඇත.",
        ta: "வயலில் பூச்சிகள் – நீங்கள் காண்பதைப் பொருத்துங்கள்:\n• அடியிலிருந்து காயும் வட்டத் திட்டுகள், அடியில் பழுப்புப் பூச்சிகள் → பழுப்புத் தத்துப்பூச்சி.\n• நடுக் குருத்து காய்தல் அல்லது வெள்ளை வெற்றுக் கதிர்கள் → மஞ்சள் தண்டுத் துளைப்பான்.\n• வெள்ளைக் கோடுகளுடன் நீளவாக்கில் சுருண்ட இலைகள் → இலை சுருட்டுப் புழு.\n• வெங்காய இலை போன்ற வெளிறிய குழாய்த் தளிர்கள் → ஆனைக்கொம்பன் ஈ.\n• வெற்று அல்லது புள்ளியுள்ள மணிகள், கெட்ட மணம் → கதிர் நாவாய்ப் பூச்சி.\n• இளம் வறண்ட வயல்களில் சுருண்ட வெள்ளி நிற இலை நுனிகள் → இலைப்பேன்.\n• தெளிக்கும் முன் எண்ணுங்கள்: அடிக்கடி தெளித்தால் இப்பூச்சிகளைத் தின்னும் சிலந்திகள் சாகும். \"பூச்சிகள்\" பக்கத்தில் ஒவ்வொன்றுக்கும் முழுத் திட்டம் உள்ளது."
    }, [["pests.html", "nav_pests"]]);

    topic("salt", ["salt*", "saline", "salinity", "brackish", "sea water", "lunu", "ලුණු", "ලවණ", "කිවුල්", "உவர்", "உப்பு"], {
        en: "Salty (saline) fields:\n• Before sowing, let fresh water in and drain it out 2–3 times to wash the salt away.\n• Grow At 354 – the DOA salt-tolerant variety.\n• Use a little more seed, or transplant older (3–4 week) seedlings, which handle salt better.\n• Give enough MOP (potassium) and add compost or straw; on hard sodic soil apply gypsum.\n• Keep water in the field – letting it dry brings the salt up.",
        si: "ලවණ සහිත කුඹුරු:\n• වැපිරීමට පෙර 2–3 වරක් මිරිදිය ඇතුළු කර බැස යවා ලුණු සෝදා හරින්න.\n• At 354 වගා කරන්න – කෘ.දෙ. ලවණතාවට ඔරොත්තු දෙන වී වර්ගය.\n• බීජ ටිකක් වැඩිපුර යොදන්න, නැතහොත් ලවණයට වඩා ඔරොත්තු දෙන වයස සති 3–4 පැළ සිටුවන්න.\n• ප්‍රමාණවත් MOP (පොටෑසියම්) සහ කොම්පෝස්ට් හෝ පිදුරු යොදන්න; තද සෝඩියම් පසට ජිප්සම් යොදන්න.\n• කුඹුරේ ජලය තබන්න – වියළෙන විට ලුණු ඉහළට එයි.",
        ta: "உவர் வயல்கள்:\n• விதைப்புக்கு முன் நன்னீரை 2–3 முறை பாய்ச்சி வடித்து உப்பைக் கழுவுங்கள்.\n• At 354 பயிரிடுங்கள் – திணைக்களத்தின் உவர் தாங்கும் இனம்.\n• விதையைச் சற்று அதிகமாக இடுங்கள், அல்லது உப்பை நன்கு தாங்கும் 3–4 வார நாற்றுகளை நடுங்கள்.\n• போதுமான MOP (பொட்டாசியம்), கூட்டெரு அல்லது வைக்கோல் இடுங்கள்; கடினமான சோடிய மண்ணுக்கு ஜிப்சம் இடுங்கள்.\n• வயலில் நீரை வையுங்கள் – காய விட்டால் உப்பு மேலே வரும்."
    });

    topic("iron", ["iron", "bog", "orange water", "orange", "bronz*", "oily", "තැඹිලි", "තඹ", "செம்மஞ்சள்", "செம்பு", "rusty", "yakada", "යකඩ", "යකඩ විෂ", "මඩ පස", "இரும்பு", "சதுப்பு"], {
        en: "Iron toxicity (low-lying bog fields):\n• Signs: bronze/orange-brown leaves starting from the tips, an oily orange film on the water, few dark roots, poor tillering.\n• Drain the field for 3–5 days in mid-tillering to let air into the soil, then refill. Don't keep stagnant water.\n• Give enough MOP (potassium) and add compost; potassium helps the roots resist iron.\n• Clean the drains so water moves through the field.\n• Grow Bw 367 or Bw 361, the DOA varieties for these soils.",
        si: "යකඩ විෂ (පහත් මඩ කුඹුරු):\n• ලක්ෂණ: කොළ අගින් ඇරඹෙන තඹ/තැඹිලි-දුඹුරු කොළ, ජලය මත තෙල් වැනි තැඹිලි පටලයක්, තද පාට මුල් කිහිපයක්, දුර්වල පඳුරු.\n• පසට වාතය ලැබීමට පඳුරු දැමීමේ මැද දින 3–5ක් ජලය බැස යවා නැවත පුරවන්න. එකතැන රැඳුණු ජලය තබන්න එපා.\n• ප්‍රමාණවත් MOP (පොටෑසියම්) සහ කොම්පෝස්ට් යොදන්න; පොටෑසියම් මුල්වලට යකඩවලට ඔරොත්තු දීමට උදව් කරයි.\n• කුඹුර හරහා ජලය ගලා යාමට කාණු පිරිසිදු කරන්න.\n• මෙවැනි පසට කෘ.දෙ. වී වර්ග වන Bw 367 හෝ Bw 361 වගා කරන්න.",
        ta: "இரும்பு நச்சு (தாழ்வான சதுப்பு வயல்கள்):\n• அறிகுறி: நுனியிலிருந்து தொடங்கும் செம்பு/செம்மஞ்சள்-பழுப்பு இலைகள், நீரில் எண்ணெய் போன்ற செம்மஞ்சள் படலம், சில கருமையான வேர்கள், குறைந்த தூர்.\n• மண்ணுக்குக் காற்று கிடைக்கத் தூர் கட்டலின் நடுவில் 3–5 நாள் நீரை வடித்து மீண்டும் நிரப்புங்கள். தேங்கிய நீரை வைக்க வேண்டாம்.\n• போதுமான MOP (பொட்டாசியம்), கூட்டெரு இடுங்கள்; பொட்டாசியம் வேர்கள் இரும்பைத் தாங்க உதவும்.\n• வயலினூடாக நீர் ஓட வடிகால்களைச் சுத்தம் செய்யுங்கள்.\n• இம்மண்ணுக்கான திணைக்கள இனங்களான Bw 367 அல்லது Bw 361 பயிரிடுங்கள்."
    }, [["varieties.html", "nav_varieties"]]);

    topic("spray", ["spray*", "pesticide*", "insecticide*", "fungicide*", "chemical*", "poison*", "dose", "dosage", "mask", "gloves", "beheth", "ඉසින", "ඉසීම", "කෘමිනාශක", "දිලීර නාශක", "බෙහෙත්", "රසායනික", "විෂ", "தெளி", "பூச்சிக்கொல்லி", "பூஞ்சைக்கொல்லி", "இரசாயன", "மருந்து", "நஞ்சு"], {
        en: "Spraying safely and well:\n• Spray in the early morning or late evening, with light wind and no rain expected for 4–6 hours (see the Weather page for a good spray day).\n• Measure the dose from the label exactly – more is not better. Don't mix different chemicals in one tank.\n• Wear gloves, a mask, long sleeves and boots. Don't eat, drink or smoke while spraying; wash well afterwards.\n• Aim the spray where the pest is (the base of the plants for planthoppers).\n• Keep children and animals away. Rinse empty bottles 3 times, pierce and bury them – never reuse.\n• Keep the waiting days before harvest written on the label.",
        si: "ආරක්ෂිතව හා නිවැරදිව ඉසීම:\n• උදෑසන හෝ සවස, සුළඟ අඩු, පැය 4–6ක් වැසි නොමැති විට ඉසින්න (හොඳ ඉසින දිනයක් සඳහා \"කාලගුණය\" පිටුව බලන්න).\n• ලේබලයේ මාත්‍රාව හරියටම මනින්න – වැඩිය හොඳ නැත. එක ටැංකියක විවිධ රසායන මිශ්‍ර කරන්න එපා.\n• අත්වැසුම්, මුහුණු ආවරණ, දිගු අත් සහ බූට් පළඳින්න. ඉසින අතරතුර කන්න, බොන්න, දුම් බොන්න එපා; පසුව හොඳින් සෝදන්න.\n• පළිබෝධයා සිටින තැනට ඉසින්න (පැල කීඩෑවාට පැළයේ පාමුලට).\n• ළමයින් සහ සතුන් ඈත් කර තබන්න. හිස් බෝතල් 3 වරක් සෝදා, සිදුරු කර වළලන්න – නැවත භාවිත කරන්න එපා.\n• ලේබලයේ සඳහන් අස්වැන්නට පෙර පොරොත්තු දින පිළිපදින්න.",
        ta: "பாதுகாப்பாகவும் சரியாகவும் தெளித்தல்:\n• அதிகாலை அல்லது மாலையில், காற்று குறைவாக, 4–6 மணி நேரம் மழை இல்லாதபோது தெளியுங்கள் (நல்ல தெளிப்பு நாளுக்கு \"வானிலை\" பக்கத்தைப் பாருங்கள்).\n• லேபிளிலுள்ள அளவைச் சரியாக அளவுங்கள் – அதிகம் நல்லதல்ல. ஒரே தொட்டியில் வெவ்வேறு இரசாயனங்களைக் கலக்க வேண்டாம்.\n• கையுறை, முகமூடி, நீண்ட கை ஆடை, பூட்ஸ் அணியுங்கள். தெளிக்கும்போது உண்ண, குடிக்க, புகைக்க வேண்டாம்; பின் நன்கு கழுவுங்கள்.\n• பூச்சி இருக்கும் இடத்தில் தெளியுங்கள் (தத்துப்பூச்சிக்குப் பயிரின் அடியில்).\n• குழந்தைகளையும் விலங்குகளையும் தூரத்தில் வையுங்கள். வெற்றுப் போத்தல்களை 3 முறை கழுவித் துளையிட்டுப் புதையுங்கள் – மீண்டும் பயன்படுத்த வேண்டாம்.\n• லேபிளில் உள்ள அறுவடைக்கு முந்திய காத்திருப்பு நாட்களைப் பின்பற்றுங்கள்."
    }, [["weather.html", "nav_weather"], ["shops.html", "nav_shops"]]);

    topic("drought", ["drought", "no rain", "dry spell", "no water", "water shortage", "niyanga", "නියඟ", "වැසි නැති", "ජල හිඟ", "වතුර නැති", "வறட்சி", "மழை இல்லை", "நீர் இல்லை", "நீர்ப் பற்றாக்குறை"], {
        en: "Dry season / water shortage:\n• Sow only the area your water can cover till harvest.\n• Choose a short variety: Bg 250 (about 85 days) or Bg 300 (about 3 months).\n• Level the field well and repair the bunds – leaking bunds lose more water than the crop uses.\n• Use alternate wetting and drying in tillering.\n• Save your water for panicle start to flowering – that is when shortage hurts the yield most.",
        si: "නියඟය / ජල හිඟය:\n• අස්වනු නෙළන තුරු ඔබේ ජලයෙන් ආවරණය කළ හැකි ප්‍රමාණය පමණක් වපුරන්න.\n• කෙටි වයසේ වී වර්ගයක් තෝරන්න: Bg 250 (දින 85 පමණ) හෝ Bg 300 (මාස 3 පමණ).\n• කුඹුර හොඳින් මට්ටම් කර නියර අලුත්වැඩියා කරන්න – කාන්දු වන නියරවලින් බෝගය භාවිත කරනවාට වඩා ජලය නාස්ති වේ.\n• පඳුරු දැමීමේදී තෙත් කිරීම හා වියළීම මාරුවෙන් කරන්න.\n• කරල් හටගැනීමේ සිට මල් පිපීම දක්වා කාලයට ජලය ඉතිරි කරන්න – එවිට ජල හිඟය අස්වැන්නට වැඩියෙන්ම හානි කරයි.",
        ta: "வறட்சி / நீர்ப் பற்றாக்குறை:\n• அறுவடை வரை உங்கள் நீர் போதுமான பரப்பில் மட்டும் விதையுங்கள்.\n• குறுகிய இனம் தேருங்கள்: Bg 250 (சுமார் 85 நாள்) அல்லது Bg 300 (சுமார் 3 மாதம்).\n• வயலை நன்கு சமன் செய்து வரம்புகளைத் திருத்துங்கள் – ஒழுகும் வரம்புகள் பயிர் பயன்படுத்துவதைவிட அதிக நீரை இழக்கும்.\n• தூர் கட்டலில் மாறி மாறி நனைத்து உலர்த்துங்கள்.\n• கதிர் உருவாதல் முதல் பூத்தல் வரை நீரைச் சேமியுங்கள் – அப்போதுதான் பற்றாக்குறை விளைச்சலை அதிகம் பாதிக்கும்."
    }, [["weather.html", "nav_weather"]]);

    topic("flood", ["flood*", "heavy rain", "under water", "submerg*", "gangawathura", "ගංවතුර", "තද වැසි", "ජලයෙන් යට", "வெள்ளம்", "கனமழை", "நீரில் மூழ்"], {
        en: "After heavy rain or flooding:\n• Open the drains and get the water out as fast as you can – the tips of the leaves must come above the water.\n• Don't put urea until the water has gone down; then give the next dose.\n• In the week after the flood, check for bacterial leaf blight and blast – they spread after storms.\n• If young plants were under water for more than a week and most died, re-sow with a short variety such as Bg 250.\n• Watch rats – they move into fields after floods.",
        si: "තද වැස්සකින් හෝ ගංවතුරකින් පසු:\n• කාණු විවෘත කර හැකි ඉක්මනින් ජලය ඉවත් කරන්න – කොළ අග ජලයෙන් ඉහළට පැමිණිය යුතුය.\n• ජලය බැස යන තුරු යූරියා යොදන්න එපා; ඉන්පසු ඊළඟ මාත්‍රාව දෙන්න.\n• ගංවතුරෙන් පසු සතියේ බැක්ටීරියා කොළ අංගමාරය සහ පාළුව පරීක්ෂා කරන්න – කුණාටුවලින් පසු ඒවා පැතිරේ.\n• තරුණ පැළ සතියකට වඩා ජලයෙන් යට වී බොහොමයක් මැරුණේ නම් Bg 250 වැනි කෙටි වයසේ වර්ගයකින් නැවත වපුරන්න.\n• මීයන් ගැන විමසිලිමත් වන්න – ගංවතුරෙන් පසු ඔවුන් කුඹුරුවලට පැමිණේ.",
        ta: "கனமழை அல்லது வெள்ளத்துக்குப் பின்:\n• வடிகால்களைத் திறந்து நீரை விரைவாக வெளியேற்றுங்கள் – இலை நுனிகள் நீருக்கு மேல் வர வேண்டும்.\n• நீர் வடியும் வரை யூரியா இட வேண்டாம்; பின்பு அடுத்த அளவை இடுங்கள்.\n• வெள்ளத்துக்குப் பின் வாரத்தில் பாக்டீரியா இலைக் கருகல், குலை நோயைப் பாருங்கள் – புயலுக்குப் பின் இவை பரவும்.\n• இளம் பயிர்கள் ஒரு வாரத்துக்கு மேல் நீரில் மூழ்கிப் பெரும்பாலானவை இறந்தால் Bg 250 போன்ற குறுகிய இனத்தால் மீண்டும் விதையுங்கள்.\n• எலிகளைக் கவனியுங்கள் – வெள்ளத்துக்குப் பின் அவை வயல்களுக்கு வரும்."
    }, [["weather.html", "nav_weather"]]);

    topic("yield", ["yield", "more harvest", "increase", "production", "profit", "income", "bushel*", "aswenna wadi", "අස්වැන්න වැඩි", "වැඩි අස්වැන්න", "ලාභ", "නිෂ්පාදන", "விளைச்சல்", "அதிக விளைச்சல்", "இலாபம்", "உற்பத்தி"], {
        en: "To get a higher yield:\n• Grow a recommended variety for your district and season, from clean seed.\n• Level the field well – it saves water and stops weeds.\n• Control weeds in the first 30–40 days.\n• Give urea in split doses on time, not all at once.\n• Keep water from panicle start to flowering.\n• Check the field every week and act early on pests and diseases – scan a leaf when you see spots.\n• Harvest on time and dry the grain well.",
        si: "වැඩි අස්වැන්නක් සඳහා:\n• ඔබේ දිස්ත්‍රික්කයට සහ කන්නයට නිර්දේශිත වී වර්ගයක් පිරිසිදු බිත්තර වීවලින් වගා කරන්න.\n• කුඹුර හොඳින් මට්ටම් කරන්න – ජලය ඉතිරි වී වල් නවතී.\n• පළමු දින 30–40 තුළ වල් පාලනය කරන්න.\n• යූරියා එකවර නොව කොටස් වශයෙන් නියමිත වේලාවට දෙන්න.\n• කරල් හටගැනීමේ සිට මල් පිපීම දක්වා ජලය තබන්න.\n• සෑම සතියකම කුඹුර පරීක්ෂා කර පළිබෝධ සහ රෝගවලට කලින්ම ක්‍රියා කරන්න – ලප දුටු විට කොළයක් ස්කෑන් කරන්න.\n• නියමිත වේලාවට කපා ඇට හොඳින් වියළන්න.",
        ta: "அதிக விளைச்சலுக்கு:\n• உங்கள் மாவட்டத்துக்கும் போகத்துக்கும் பரிந்துரைக்கப்பட்ட இனத்தைச் சுத்தமான விதையிலிருந்து பயிரிடுங்கள்.\n• வயலை நன்கு சமன் செய்யுங்கள் – நீர் சேமிக்கப்பட்டுக் களை குறையும்.\n• முதல் 30–40 நாட்களில் களையைக் கட்டுப்படுத்துங்கள்.\n• யூரியாவை ஒரே தடவையில் அல்லாமல் பிரித்து உரிய நேரத்தில் இடுங்கள்.\n• கதிர் உருவாதல் முதல் பூத்தல் வரை நீர் வையுங்கள்.\n• ஒவ்வொரு வாரமும் வயலைப் பார்த்துப் பூச்சி, நோய்க்கு முன்கூட்டியே நடவடிக்கை எடுங்கள் – புள்ளிகள் கண்டால் இலையை ஸ்கேன் செய்யுங்கள்.\n• உரிய நேரத்தில் அறுத்து நெல்லை நன்கு உலர்த்துங்கள்."
    }, [["varieties.html", "nav_varieties"], ["my-crop.html", "nav_crop"]]);

    topic("scan", ["scan*", "photo*", "picture", "camera", "image", "upload*", "detect*", "identify", "ස්කෑන්", "ඡායාරූප", "පින්තූර", "කැමරා", "ஸ்கேன்", "படம்", "புகைப்படம்", "கேமரா"], {
        en: "To check a sick leaf:\n• Open Scan and take a close, sharp photo of ONE leaf in daylight, filling the picture.\n• AgriCare names the disease, reads it aloud in your language and gives a full treatment plan.\n• Press Start treatment to get step-by-step alarms in Monitor.",
        si: "රෝගී කොළයක් පරීක්ෂා කිරීමට:\n• \"ස්කෑන්\" විවෘත කර දිවා ආලෝකයේ එක් කොළයක් රාමුව පිරෙන සේ ළඟින් පැහැදිලි ඡායාරූපයක් ගන්න.\n• AgriCare රෝගය නම් කර, ඔබේ භාෂාවෙන් කියවා, සම්පූර්ණ ප්‍රතිකාර සැලැස්මක් දෙයි.\n• \"නිරීක්ෂණය\" හි පියවරෙන් පියවර එලාම් ලබා ගැනීමට \"ප්‍රතිකාරය අරඹන්න\" ඔබන්න.",
        ta: "நோயுற்ற இலையைச் சோதிக்க:\n• \"ஸ்கேன்\" திறந்து பகல் வெளிச்சத்தில் ஒரு இலையைப் படம் நிறையுமாறு அருகில் தெளிவாகப் படம் எடுங்கள்.\n• AgriCare நோயைக் கண்டறிந்து, உங்கள் மொழியில் வாசித்து, முழுச் சிகிச்சைத் திட்டத்தைத் தரும்.\n• \"கண்காணிப்பு\" இல் படிப்படியான அலாரங்களுக்கு \"சிகிச்சையைத் தொடங்கு\" அழுத்துங்கள்."
    }, [["upload-image.html", "nav_scan"]]);

    topic("shop", ["shop*", "buy", "store near", "where to get", "agro", "kade", "kadey", "සාප්පු", "කඩේ", "කඩය", "මිලදී", "ගන්නේ කොහෙන්", "கடை", "வாங்க", "எங்கே கிடைக்கும்"], {
        en: "To find a shop for medicine or fertilizer:\n• Open Shops and press My location – AgriCare shows the nearest agro-chemical and fertilizer shops on a map with directions.\n• Show the shopkeeper the medicine name from your treatment plan, and buy only products registered in Sri Lanka for paddy.",
        si: "බෙහෙත් හෝ පොහොර සාප්පුවක් සොයා ගැනීමට:\n• \"සාප්පු\" විවෘත කර \"මගේ ස්ථානය\" ඔබන්න – AgriCare ළඟම කෘෂි රසායන සහ පොහොර සාප්පු සිතියමක මාර්ගය සමඟ පෙන්වයි.\n• ඔබේ ප්‍රතිකාර සැලැස්මේ ඇති බෙහෙතේ නම සාප්පුකරුට පෙන්වා, ශ්‍රී ලංකාවේ වී සඳහා ලියාපදිංචි නිෂ්පාදන පමණක් මිලදී ගන්න.",
        ta: "மருந்து அல்லது உரக் கடையைக் கண்டுபிடிக்க:\n• \"கடைகள்\" திறந்து \"எனது இருப்பிடம்\" அழுத்துங்கள் – AgriCare அருகிலுள்ள விவசாய இரசாயன, உரக் கடைகளை வரைபடத்தில் வழியுடன் காட்டும்.\n• உங்கள் சிகிச்சைத் திட்டத்திலுள்ள மருந்தின் பெயரைக் கடைக்காரரிடம் காட்டி, இலங்கையில் நெல்லுக்குப் பதிவுசெய்த பொருட்களை மட்டும் வாங்குங்கள்."
    }, [["shops.html", "nav_shops"]]);

    topic("alarm", ["alarm*", "remind*", "monitor*", "track*", "notification*", "එලාම්", "මතක් කිරීම", "නිරීක්ෂණ", "අලාරම්", "அலாரம்", "நினைவூட்டல்", "கண்காணிப்பு"], {
        en: "Treatment alarms:\n• After a scan (or on a pest page) press Start treatment – the steps go into Monitor with dates.\n• In Monitor press Turn on alarms and keep AgriCare open in a tab; it rings and speaks when a step is due.\n• To be reminded even when the phone browser is closed, add each step to Google Calendar from the plan.",
        si: "ප්‍රතිකාර එලාම්:\n• ස්කෑන් කිරීමෙන් පසු (හෝ පළිබෝධ පිටුවක) \"ප්‍රතිකාරය අරඹන්න\" ඔබන්න – පියවර දින සමඟ \"නිරීක්ෂණය\" වෙත යයි.\n• \"නිරීක්ෂණය\" හි \"එලාම් සක්‍රිය කරන්න\" ඔබා AgriCare ටැබයක විවෘතව තබන්න; පියවරක් නියමිත වූ විට එය නාද වී කතා කරයි.\n• දුරකථන බ්‍රවුසරය වසා ඇති විටත් මතක් කිරීමට, සැලැස්මෙන් එක් එක් පියවර Google Calendar වෙත එක් කරන්න.",
        ta: "சிகிச்சை அலாரங்கள்:\n• ஸ்கேன் செய்தபின் (அல்லது பூச்சிப் பக்கத்தில்) \"சிகிச்சையைத் தொடங்கு\" அழுத்துங்கள் – படிகள் நாட்களுடன் \"கண்காணிப்பு\" க்குச் செல்லும்.\n• \"கண்காணிப்பு\" இல் \"அலாரத்தை இயக்கு\" அழுத்தி AgriCare ஐ ஒரு தாவலில் திறந்து வையுங்கள்; படி வரும்போது ஒலித்துப் பேசும்.\n• தொலைபேசி உலாவி மூடியிருக்கும்போதும் நினைவூட்ட, திட்டத்திலிருந்து ஒவ்வொரு படியையும் Google Calendar இல் சேருங்கள்."
    }, [["monitor.html", "nav_monitor"]]);

    topic("weather", ["weather", "rain", "forecast", "climate", "temperature", "humid*", "wind", "kalaguna*", "wahina", "කාලගුණ", "වැසි", "වැස්ස", "දේශගුණ", "උෂ්ණත්ව", "සුළං", "வானிலை", "மழை", "காலநிலை", "வெப்பநிலை", "காற்று"], {
        en: "Weather for your field:\n• Open Weather: it shows the 7-day forecast for your location or district, with farm advice for every day – when not to spray or put urea, heavy rain warnings, blast risk and dry spells.\n• Spray or put urea only on days with low rain chance and light wind.",
        si: "ඔබේ කුඹුරට කාලගුණය:\n• \"කාලගුණය\" විවෘත කරන්න: ඔබේ ස්ථානයට හෝ දිස්ත්‍රික්කයට දින 7ක අනාවැකිය සෑම දිනකටම ගොවිතැන් උපදෙස් සමඟ පෙන්වයි – නොඉසිය යුතු හෝ යූරියා නොදැමිය යුතු දින, තද වැසි අනතුරු ඇඟවීම්, පාළුව අවදානම සහ නියං කාල.\n• වැසි ඉඩ අඩු, සුළං මද දිනවල පමණක් ඉසින්න හෝ යූරියා දමන්න.",
        ta: "உங்கள் வயலுக்கான வானிலை:\n• \"வானிலை\" திறவுங்கள்: உங்கள் இருப்பிடம் அல்லது மாவட்டத்துக்கான 7 நாள் முன்னறிவிப்பை ஒவ்வொரு நாளுக்கும் விவசாய ஆலோசனையுடன் காட்டும் – தெளிக்கவோ யூரியா இடவோ கூடாத நாட்கள், கனமழை எச்சரிக்கை, குலை நோய் அபாயம், வறண்ட காலம்.\n• மழை வாய்ப்புக் குறைவான, காற்று மெதுவான நாட்களில் மட்டும் தெளியுங்கள் அல்லது யூரியா இடுங்கள்."
    }, [["weather.html", "nav_weather"]]);

    topic("thanks", ["thank*", "thx", "ok thanks", "bohoma isthuthi", "isthuthi", "ස්තූතියි", "ස්තුතියි", "බොහොම ස්තූතියි", "நன்றி"], {
        en: "You're welcome! 🙏 Ask me anytime about your paddy – diseases, pests, fertilizer, water, varieties or weather.",
        si: "ඔබව සාදරයෙන් පිළිගනිමු! 🙏 ඔබේ වී වගාව ගැන – රෝග, පළිබෝධ, පොහොර, ජලය, වී වර්ග හෝ කාලගුණය – ඕනෑම වේලාවක මගෙන් අහන්න.",
        ta: "மிக்க மகிழ்ச்சி! 🙏 உங்கள் நெல் பற்றி – நோய், பூச்சி, உரம், நீர், இனங்கள் அல்லது வானிலை – எப்போது வேண்டுமானாலும் கேளுங்கள்."
    });

    topic("hello", ["hi", "hello", "hey", "ayubowan", "ayubowan", "kohomada", "vanakkam", "good morning", "ආයුබෝවන්", "හලෝ", "කොහොමද", "වණක්කම්", "வணக்கம்", "ஹலோ"], {
        en: "Ayubowan! 🙏 I'm your AgriCare officer. Ask me about diseases, pests, fertilizer, water, weeds, varieties for your district, the weather, or what to do this week in your field.",
        si: "ආයුබෝවන්! 🙏 මම ඔබේ AgriCare නිලධාරියා. රෝග, පළිබෝධ, පොහොර, ජලය, වල්, ඔබේ දිස්ත්‍රික්කයට වී වර්ග, කාලගුණය හෝ මේ සතියේ කුඹුරේ කළ යුතු දේ ගැන මගෙන් අහන්න.",
        ta: "வணக்கம்! 🙏 நான் உங்கள் AgriCare அலுவலர். நோய், பூச்சி, உரம், நீர், களை, உங்கள் மாவட்டத்துக்கான இனங்கள், வானிலை அல்லது இந்த வாரம் வயலில் செய்ய வேண்டியவை பற்றிக் கேளுங்கள்."
    });

    /* words that point to a type of question */
    const W = {
        variety: ["variety", "varieties", "seed type", "which rice", "which paddy", "best paddy", "best rice", "wee warga", "වී වර්ග", "වර්ගය", "ප්‍රභේද", "ප්රභේද", "நெல் இனம்", "இனம்", "இனங்கள்", "ரகம்"],
        prevent: ["prevent*", "avoid*", "next time", "next season", "stop it coming", "වළක්ව", "වැළැක්ව", "ඊළඟ කන්න", "ආරක්ෂා", "தடு", "தவிர்", "அடுத்த போக"],
        signs: ["symptom*", "sign*", "identify", "look like", "what is", "what are", "ලක්ෂණ", "කුමක්ද", "මොකක්ද", "හඳුනා", "அறிகுறி", "என்ன", "அடையாள"],
        now: ["what to do now", "this week", "today", "what should i do", "next step", "my crop", "my field", "දැන් කළ යුතු", "මේ සතියේ", "අද කළ", "මගේ වගාව", "මගේ කුඹුර", "இப்போது", "இந்த வாரம்", "இன்று", "எனது பயிர்", "என் வயல்"],
        season: ["season", "maha", "yala", "when to sow", "when to plant", "කන්නය", "මහ කන්න", "යල කන්න", "කවදා වපුර", "போகம்", "பெரும்போக", "சிறுபோக", "எப்போது விதை"],
        farm: ["paddy", "rice", "crop*", "field", "farm*", "plant*", "grow*", "cultivat*", "vegetable*", "chilli*", "chili*", "maize", "corn", "onion*", "banana*", "coconut*", "tea", "cow*", "cattle", "goat*", "chicken*", "poultry", "garden*", "fruit*", "එළවළු", "මිරිස්", "බඩ ඉරිඟු", "ලූනු", "කෙසෙල්", "පොල්", "තේ", "ගව", "එළු", "කුකුළ", "වත්ත", "காய்கறி", "மிளகாய்", "சோளம்", "வெங்காய", "வாழை", "தென்னை", "தேயிலை", "மாடு", "ஆடு", "கோழி", "தோட்ட", "leaf", "leaves", "grain", "harvest", "soil", "wee", "kumbura", "වී", "කුඹුර", "වගා", "ගොවි", "පැළ", "කොළ", "පස", "நெல்", "வயல்", "பயிர்", "விவசாய", "இலை", "மண்"]
    };

    /* ---------- answer builders ---------- */
    function diseaseAnswer(d, lang, q) {
        const name = loc(d.name, lang);
        const wantPrevent = any(q, W.prevent), wantSigns = any(q, W.signs) && !any(q, ["treat*", "cure", "control", "medicine", "spray", "ප්‍රතිකාර", "බෙහෙත්", "சிகிச்சை", "மருந்து"]);
        let text = "🩺 " + name + "\n" + loc(d.summary, lang) + "\n\n";
        if (wantSigns) text += tr("lbl_symptoms", lang) + ":\n" + bullets(list(d.id, "symptoms", d.symptoms, lang)) + "\n\n";
        if (!wantPrevent) text += tr("lbl_manage", lang) + ":\n" + bullets(list(d.id, "manage", d.manage, lang)) + "\n\n";
        text += tr("lbl_prevent", lang) + ":\n" + bullets(list(d.id, "prevent", d.prevent, lang).slice(0, wantPrevent ? 9 : 2));
        return { text, links: [["disease-library.html#" + d.id, "nav_diseases"], ["upload-image.html", "nav_scan"]] };
    }
    function pestAnswer(p, lang, q) {
        const name = loc(p.name, lang);
        const wantPrevent = any(q, W.prevent);
        let text = (p.group === "animal" ? "🐾 " : "🐛 ") + name + "\n" + loc(p.summary, lang) + "\n\n";
        if (any(q, W.signs)) text += tr("lbl_symptoms", lang) + ":\n" + bullets(list(p.id, "signs", p.signs, lang)) + "\n\n";
        if (!wantPrevent) text += tr("lbl_manage", lang) + ":\n" + bullets(list(p.id, "manage", p.manage, lang)) + "\n\n";
        text += tr("lbl_prevent", lang) + ":\n" + bullets(list(p.id, "prevent", p.prevent, lang).slice(0, wantPrevent ? 9 : 2));
        return { text, links: [["pests.html#" + p.id, "nav_pests"]] };
    }
    function weedicideAnswer(w, lang) {
        let text = "🧴 " + (lang === "si" ? w.nameSi : w.name) + " (" + loc(w.ai, lang) + ") · " + w.code + "\n" + loc(w.about, lang);
        w.uses.forEach(u => {
            text += "\n\n" + (u.label ? loc(u.label, lang) + ":\n" : "");
            text += bullets([
                tr("wd_when", lang) + ": " + loc(u.when, lang),
                tr("wd_mix", lang) + ": " + tr("wd_mix_val", lang).replace("{ml}", u.per10),
                tr("wd_rate", lang) + ": " + tr("wd_rate_val", lang).replace("{ha}", u.perHa).replace("{ac}", Math.round(u.perHa * 0.4))
            ].concat(u.water ? [loc(u.water, lang)] : []));
        });
        if (w.notes.length) text += "\n\n" + tr("wd_notes", lang) + ":\n" + bullets(w.notes.map(n => loc(n, lang)));
        return { text, links: [["weeds.html#wd-" + w.id, "nav_weeds"]] };
    }
    function varietyLine(v, lang) {
        return v.id + " – " + varietyAge(v) + " " + tr("v_days", lang) + ", " + (v.red ? tr("v_red", lang) : tr("v_white", lang)) + ", " + tr("g_" + v.grain, lang) + ", " + v.yield + " " + tr("v_tha", lang);
    }
    function varietyAnswer(v, lang) {
        const res = ["blast", "blb", "gm", "bph"].filter(k => v.res[k]).map(k => tr("r_" + k, lang) + ": " + tr("rl_" + v.res[k], lang));
        const text = "🌾 " + varietyLine(v, lang) + "\n• " + tr("use_" + v.use, lang) + "\n" + bullets(res);
        return { text, links: [["varieties.html", "nav_varieties"], ["my-crop.html?v=" + encodeURIComponent(v.id), "v_use_crop"]] };
    }
    function districtAnswer(d, lang) {
        const zi = ZONE_INFO[d.zone];
        const rec = recommendVarieties(d);
        let text = "📍 " + (d[lang] || d.id) + " – " + tr("zone_" + d.zone, lang) + " (" + (lang === "si" ? zi.rainSi : lang === "ta" ? zi.rainTa : zi.rain) + ")\n\n";
        text += tr("v_for", lang) + ":\n" + bullets(rec.main.slice(0, 5).map(v => varietyLine(v, lang)));
        if (d.iron) text += "\n\n" + tr("v_iron_note", lang);
        if (d.saline) text += "\n\n" + tr("v_saline_note", lang);
        text += "\n\n" + tr("off_zone_" + d.zone, lang);
        return { text, links: [["varieties.html", "nav_varieties"], ["weather.html", "nav_weather"]] };
    }
    function seasonKey() {
        const n = new Date(), m = n.getMonth() + 1, day = n.getDate();
        if (m === 10 || m === 11 || (m === 9 && day >= 15)) return "off_sow_maha";
        if (m === 12 || m === 1) return "off_grow_maha";
        if (m === 2 || m === 3) return "off_harv_maha";
        if (m === 4 || m === 5) return "off_sow_yala";
        if (m === 6 || m === 7) return "off_grow_yala";
        return "off_harv_yala";
    }
    function myDistrict() {
        try { return findDistrict(myDistrictId()); } catch (e) { return null; }
    }
    function myCrop() {
        try { return JSON.parse(AgriStore.get("agricare_crop") || "null"); } catch (e) { return null; }
    }
    function cropNowAnswer(lang) {
        const crop = myCrop();
        if (!crop) {
            const d = myDistrict();
            return { text: tr(seasonKey(), lang) + (d ? "\n\n" + tr("off_zone_" + d.zone, lang) : "") + "\n\n" + tr("chat_set_crop", lang), links: [["my-crop.html", "nav_crop"]] };
        }
        const v = VARIETIES.find(x => x.id === crop.variety) || VARIETIES[0];
        const age = varietyAge(v);
        const [y, mo, dd] = crop.sowed.split("-").map(Number);
        const sown = new Date(y, mo - 1, dd), now = new Date();
        const day = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - sown) / 86400000);
        const st = cropStages(age).find(s => day >= s.from && day <= s.to) || cropStages(age).slice(-1)[0];
        const jobs = cropJobs(age).filter(j => j.day >= day - 3 && j.day <= day + 7).map(j => tr(j.key, lang) + " (" + tr("c_day", lang) + " " + j.day + ")");
        const tasks = (translations[lang]["do_" + st.id] || translations.en["do_" + st.id] || []);
        let text = "🌱 " + v.id + (crop.field ? " · " + crop.field : "") + " – " + tr("c_day", lang) + " " + Math.max(0, day) + " · " + tr("st_" + st.id, lang) + "\n\n";
        text += bullets(jobs.concat(Array.isArray(tasks) ? tasks : []));
        return { text, links: [["my-crop.html", "nav_crop"]] };
    }

    /* ---------- main ---------- */
    function answerInner(question, forceLang) {
        const lang = forceLang || detectLang(question);
        const q = " " + norm(question) + " ";
        const pack = (r, src) => ({ lang, source: src, text: r.text, action: r.action, links: (r.links || []).map(([href, key]) => ({ href: base() + href, label: tr(key, lang) })) });

        // 1. a named disease or pest (the longest name found wins)
        let best = null;
        const consider = (kind, id, words) => words.forEach(w => {
            if (hit(q, w) && (!best || norm(w).length > best.len)) best = { kind, id, len: norm(w).length };
        });
        DISEASES.forEach(d => consider("disease", d.id, (DISEASE_WORDS[d.id] || []).concat([d.name.en, d.name.si, d.name.ta])));
        if (typeof PESTS !== "undefined") PESTS.forEach(p => consider("pest", p.id, (PEST_WORDS[p.id] || []).concat([p.name.en, p.name.si, p.name.ta])));
        // a few general words are weaker than topic words ("bug" in "spray bug"): keep, still the best answer
        if (best && best.kind === "disease") return pack(diseaseAnswer(DISEASES.find(d => d.id === best.id), lang, q), "entity");
        if (best && best.kind === "pest") return pack(pestAnswer(PESTS.find(p => p.id === best.id), lang, q), "entity");

        // a weedicide by name, or a weed by name
        if (typeof WEEDICIDES !== "undefined") {
            const PW = {
                sofit: ["sofit", "සොෆිට්", "சோஃபிட்", "pretilachlor", "ප්‍රිටිලැක්ලෝර්", "ප්රිටිලැක්ලෝර්"],
                solito: ["solito", "සොලිටෝ", "சொலிட்டோ", "pyribenzoxim"],
                profit: ["profit 500", "profit ec", "profit weed*", "ප්‍රොෆිට්", "ප්රොෆිට්", "புரொஃபிட்", "propanil", "ප්‍රොපනිල්"],
                facet: ["facet", "quinclorac", "ෆැසෙට්", "ක්වින්ක්ලෝරැක්", "பசெட்", "குயின்குளோராக்"],
                mcpa: ["mcpa", "m c p a", "එම්.සී.පී.ඒ", "එම් සී පී ඒ", "எம்.சீ.பீ.ஏ"],
                diuron: ["diuron", "liquido", "ඩයියුරෝන්", "ලික්විඩෝ", "டையூரோன்"]
            };
            const found = WEEDICIDES.find(w => (PW[w.id] || []).some(k => hit(q, k)));
            if (found) return pack(weedicideAnswer(found, lang), "entity");
            const wid = Object.keys(WEEDS).find(id => [WEEDS[id].en.toLowerCase(), WEEDS[id].si].some(k => k && hit(q, k)));
            if (wid) {
                const prods = WEEDICIDES.filter(w => w.uses.some(u => (u.weeds || []).includes(wid)));
                const text = "🌿 " + (WEEDS[wid][lang] || WEEDS[wid].en) + ":\n" + bullets(prods.map(w => {
                    const u = w.uses.find(x => (x.weeds || []).includes(wid));
                    return (lang === "si" ? w.nameSi : w.name) + " – " + loc(u.when, lang) + ", " + tr("wd_mix_val", lang).replace("{ml}", u.per10);
                }));
                return pack({ text, links: [["weeds.html", "nav_weeds"]] }, "entity");
            }
        }

        // contact: call / SMS / phone number
        if (any(q, ["call", "contact", "phone number", "telephone", "hotline", "help line", "helpline", "sms", "whatsapp", "talk to", "speak to", "your number",
                    "අමතන්න", "ඇමතුම", "ඇමතිය", "කෝල්", "දුරකථන", "අංකය", "නොම්මර", "එස්එම්එස්", "සම්බන්ධ කර", "කතා කරන්න ඕන", "කතා කරන්න පුළුවන්",
                    "அழை", "தொடர்பு", "தொலைபேசி", "இலக்கம்", "கோல்", "பேச வேண்டும்", "பேசலாமா"])) {
            return pack({ text: tr("ct_kb", lang), action: "contact" }, "entity");
        }

        // 2. a variety code such as "Bg 352", "at362", "bw 367"
        const vm = q.replace(/බීජී|බී ජී/g, "bg").replace(/ඒටී/g, "at").match(/\b(bg|at|ld|bw)\s*-?\s*(\d{2,3}(?:-\d)?)\b/);
        if (vm) {
            const id = vm[1].charAt(0).toUpperCase() + vm[1].charAt(1) + " " + vm[2];
            const v = VARIETIES.find(x => x.id.toLowerCase() === id.toLowerCase());
            if (v) return pack(varietyAnswer(v, lang), "entity");
        }

        // 3. a district name
        const dist = AGRI_DISTRICTS.find(d => hit(q, d.id.toLowerCase()) || (d.si && q.indexOf(norm(d.si)) >= 0) || (d.ta && q.indexOf(norm(d.ta)) >= 0));

        // 4. topics by score
        let topId = null, topScore = 0;
        Object.keys(T).forEach(id => {
            const s = count(q, T[id].words);
            if (s > topScore) { topScore = s; topId = id; }
        });
        const isVariety = any(q, W.variety);

        if (dist && (isVariety || !topId || topId === "hello")) return pack(districtAnswer(dist, lang), "entity");
        if (isVariety && (!topId || topScore < 2)) {
            const d = myDistrict();
            if (d) return pack(districtAnswer(d, lang), "kb");
            return pack({ text: tr("v_tip_water", lang) + "\n" + tr("v_tip_blast", lang), links: [["varieties.html", "nav_varieties"]] }, "kb");
        }
        if (any(q, W.now) && (!topId || topId === "hello")) return pack(cropNowAnswer(lang), "kb");
        if (any(q, W.season) && (!topId || topId === "weather" || topId === "seed")) {
            const d = dist || myDistrict();
            return pack({ text: tr("w_maha", lang) + "\n\n" + tr("w_yala", lang) + "\n\n" + tr("w_off_now", lang) + ": " + tr(seasonKey(), lang) + (d ? "\n\n" + tr("off_zone_" + d.zone, lang) : ""), links: [["weather.html", "nav_weather"]] }, "kb");
        }
        if (topId && !(topId === "hello" && q.trim().split(" ").length > 4)) {
            return pack({ text: T[topId].answers[lang] || T[topId].answers.en, links: T[topId].links }, "kb");
        }
        if (dist) return pack(districtAnswer(dist, lang), "kb");

        // 5. not understood
        const farm = any(q, W.farm);
        return { lang, source: "none", farm, text: tr(farm ? "chat_unknown" : "chat_offtopic", lang), links: [] };
    }

    /* confident = a sure match (a named disease, pest, variety or district, or a short topic question).
       Other questions go to the AI first, with this answer as a hint. */
    function answer(question, forceLang) {
        const r = answerInner(question, forceLang);
        const words = norm(question).split(" ").length;
        r.confident = r.source === "entity" || (r.source === "kb" && words <= 7);
        if (r.source === "entity") r.source = "kb";
        return r;
    }

    /* Short summary of the site's knowledge for the AI (keeps its advice the same as the website's) */
    function context(lang) {
        const d = myDistrict(), crop = myCrop();
        const lines = [];
        lines.push("Today: " + new Date().toDateString() + ". Current period: " + translations.en[seasonKey()]);
        if (d) {
            const rec = recommendVarieties(d);
            lines.push("Farmer's district: " + d.id + " (" + d.zone + " zone" + (d.iron ? ", iron-toxic low fields" : "") + (d.saline ? ", saline coastal fields" : "") + "). Recommended varieties: " + rec.main.slice(0, 5).map(v => v.id + " (" + varietyAge(v) + " days)").join(", ") + (rec.special.length ? "; special: " + rec.special.map(v => v.id + " for " + v.use).join(", ") : ""));
        }
        if (crop) lines.push("Farmer's crop: " + crop.variety + " sown " + crop.sowed + (crop.field ? " in field '" + crop.field + "'" : ""));
        lines.push("AgriCare disease advice (use the same products and steps):");
        DISEASES.forEach(x => lines.push("- " + x.name.en + ": " + x.manage.join("; ")));
        if (typeof PESTS !== "undefined") {
            lines.push("AgriCare pest advice:");
            PESTS.forEach(x => lines.push("- " + x.name.en + (x.protected ? " (protected animal – never harm)" : "") + ": " + x.manage.join("; ")));
        }
        if (typeof WEEDICIDES !== "undefined") {
            lines.push("AgriCare weedicide guide (paddy, label doses):");
            WEEDICIDES.forEach(w => w.uses.forEach(u => lines.push("- " + w.name + " [" + w.code + ", " + w.ai.en + "]" + (u.label ? " " + u.label.en : "") + " (" + u.crop + "): " + u.when.en + "; " + u.per10 + " ml per 10 L; " + u.perHa + " ml/ha (" + Math.round(u.perHa * 0.4) + " ml/acre)" + (u.water ? "; " + u.water.en : ""))));
            lines.push("- Do not use weedicides with the same group code in the same field season after season.");
        }
        lines.push("DOA varieties: " + VARIETIES.map(v => v.id + " " + varietyAge(v) + "d" + (v.red ? " red" : "") + " " + v.use).join(", "));
        lines.push("Website pages the farmer can open: Scan (photo of a leaf → disease + treatment plan with alarms), Diseases, Pests, Weather (7-day forecast with spray advice), Varieties, My Crop (stage + dated jobs), Monitor (treatment alarms), Shops (nearest agro shops).");
        return lines.join("\n");
    }

    /* Example questions for the chips */
    function suggestions(lang) {
        return {
            en: ["What to do this week?", "Blast treatment", "Urea schedule", "Best variety for my district", "Yellow leaves", "Rats in my field"],
            si: ["මේ සතියේ කළ යුත්තේ මොනවාද?", "පාළුවට ප්‍රතිකාර", "යූරියා දාන්නේ කවදාද?", "මගේ දිස්ත්‍රික්කයට හොඳම වී වර්ගය", "කොළ කහ වෙලා", "කුඹුරේ මීයෝ"],
            ta: ["இந்த வாரம் என்ன செய்வது?", "குலை நோய்க்குச் சிகிச்சை", "யூரியா எப்போது இடுவது?", "என் மாவட்டத்துக்குச் சிறந்த இனம்", "மஞ்சள் இலைகள்", "வயலில் எலிகள்"]
        }[lang] || [];
    }

    return { answer, context, suggestions, detectLang };
})();

/* ---------- chat strings ---------- */
Object.assign(translations.en, {
    ct_centres: "Rice research centres (Department of Agriculture)",
    chat_header: "AgriCare Officer", chat_online: "Online · English · සිංහල · தமிழ்", chat_launch: "Ask AgriCare",
    nav_contact: "Contact us", ct_title: "Contact AgriCare", ct_lead: "Call or send an SMS to the AgriCare help line or the office for your district.",
    ct_district: "Your district", ct_call: "Call", ct_sms: "SMS", ct_main: "AgriCare help line", ct_main_note: "Main line for all districts",
    ct_none: "The phone number for your district will be added soon. Leave your number below and we will call you.",
    ct_or: "or", ct_cb_title: "Ask us to call you", ct_cb_lead: "Leave your number and an AgriCare officer will call you back.",
    ct_name: "Your name", ct_phone: "Mobile number", ct_msg: "What is the problem? (optional)", ct_send: "Request a call",
    ct_sent: "Thank you! We got your request and will call you on {phone} soon.", ct_fail: "Could not send. Please try again.",
    ct_back: "Back to chat", ct_more: "More ways to contact", ct_kb: "📞 Here is the number for your district. Tap to call or send an SMS – or ask us to call you.",
    chat_welcome: "Ayubowan! 🙏 I'm your AgriCare agriculture officer. Ask me anything about your paddy – type, or press 🎤 and speak.",
    chat_placeholder: "Ask about diseases, fertilizer, water...",
    chat_unknown: "I couldn't find that in my farm notes. Try asking with the name of the disease, pest, variety or district – for example \"blast treatment\", \"urea schedule\", \"Bg 352\" or \"varieties for Kurunegala\". You can also scan a photo of the sick leaf.",
    chat_offtopic: "I'm AgriCare's farm officer, so I can only help with paddy and farming questions – diseases, pests, fertilizer, water, varieties, weather and harvest.",
    chat_set_crop: "Tell AgriCare your variety and sowing date in My Crop, and I'll tell you exactly what to do each week.",
    chat_thinking: "Thinking...", chat_ai: "AI answer", chat_offline: "From AgriCare's farm notes",
    chat_listen: "Listening... speak now", chat_mic_no: "Voice typing doesn't work in this browser. Please type your question.",
    chat_clear: "Clear chat", chat_speak: "Read aloud", chat_stop: "Stop", chat_try: "Try asking"
});
Object.assign(translations.si, {
    ct_centres: "වී පර්යේෂණ මධ්‍යස්ථාන (කෘෂිකර්ම දෙපාර්තමේන්තුව)",
    chat_header: "AgriCare නිලධාරී", chat_online: "සබැඳිව · English · සිංහල · தமிழ்", chat_launch: "AgriCare ගෙන් අහන්න",
    nav_contact: "අප අමතන්න", ct_title: "AgriCare අමතන්න", ct_lead: "AgriCare උපකාරක අංකයට හෝ ඔබේ දිස්ත්‍රික්කයේ කාර්යාලයට අමතන්න හෝ SMS එකක් යවන්න.",
    ct_district: "ඔබේ දිස්ත්‍රික්කය", ct_call: "අමතන්න", ct_sms: "SMS", ct_main: "AgriCare උපකාරක අංකය", ct_main_note: "සියලු දිස්ත්‍රික්ක සඳහා ප්‍රධාන අංකය",
    ct_none: "ඔබේ දිස්ත්‍රික්කයේ දුරකථන අංකය ඉක්මනින් එක් කෙරේ. ඔබේ අංකය පහතින් දෙන්න, අපි ඔබව අමතන්නම්.",
    ct_or: "හෝ", ct_cb_title: "ඔබව අමතන්න කියන්න", ct_cb_lead: "ඔබේ අංකය දෙන්න, AgriCare නිලධාරියෙක් ඔබව නැවත අමතයි.",
    ct_name: "ඔබේ නම", ct_phone: "ජංගම දුරකථන අංකය", ct_msg: "ගැටලුව කුමක්ද? (අවශ්‍ය නම්)", ct_send: "ඇමතුමක් ඉල්ලන්න",
    ct_sent: "ස්තූතියි! ඔබේ ඉල්ලීම ලැබුණා. ඉක්මනින් {phone} අංකයට අමතන්නම්.", ct_fail: "යැවිය නොහැකි විය. නැවත උත්සාහ කරන්න.",
    ct_back: "කතාබහට ආපසු", ct_more: "සම්බන්ධ වීමට තවත් ක්‍රම", ct_kb: "📞 ඔබේ දිස්ත්‍රික්කයට අංකය මෙන්න. ඇමතීමට හෝ SMS යැවීමට ඔබන්න – නැත්නම් ඔබව අමතන්න කියන්න.",
    chat_welcome: "ආයුබෝවන්! 🙏 මම ඔබේ AgriCare කෘෂිකර්ම නිලධාරියා. ඔබේ වී වගාව ගැන ඕනෑම දෙයක් අහන්න – ලියන්න, නැත්නම් 🎤 ඔබා කතා කරන්න.",
    chat_placeholder: "රෝග, පොහොර, ජලය ගැන අහන්න...",
    chat_unknown: "මගේ ගොවි සටහන්වල එය සොයාගත නොහැකි විය. රෝගයේ, පළිබෝධයාගේ, වී වර්ගයේ හෝ දිස්ත්‍රික්කයේ නම සමඟ අහන්න – උදා: \"පාළුවට ප්‍රතිකාර\", \"යූරියා කාලසටහන\", \"Bg 352\" හෝ \"කුරුණෑගලට වී වර්ග\". රෝගී කොළයේ ඡායාරූපයක් ස්කෑන් කිරීමටද හැකිය.",
    chat_offtopic: "මම AgriCare ගොවි නිලධාරියා නිසා වී සහ ගොවිතැන් ප්‍රශ්නවලට පමණක් උදව් කළ හැකිය – රෝග, පළිබෝධ, පොහොර, ජලය, වී වර්ග, කාලගුණය සහ අස්වනු.",
    chat_set_crop: "\"මගේ වගාව\" හි ඔබේ වී වර්ගය සහ වැපිරූ දිනය AgriCare වෙත කියන්න, එවිට සෑම සතියකම කළ යුතු දේ මම හරියටම කියන්නම්.",
    chat_thinking: "සිතමින්...", chat_ai: "AI පිළිතුර", chat_offline: "AgriCare ගොවි සටහන් වලින්",
    chat_listen: "අසමින්... දැන් කතා කරන්න", chat_mic_no: "මෙම බ්‍රවුසරයේ කටහඬින් ලිවීම ක්‍රියා නොකරයි. කරුණාකර ප්‍රශ්නය ලියන්න.",
    chat_clear: "කතාබහ මකන්න", chat_speak: "හඬින් කියවන්න", chat_stop: "නවත්වන්න", chat_try: "මෙසේ අහන්න"
});
Object.assign(translations.ta, {
    ct_centres: "நெல் ஆராய்ச்சி நிலையங்கள் (விவசாயத் திணைக்களம்)",
    chat_header: "AgriCare அலுவலர்", chat_online: "இணைப்பில் · English · සිංහල · தமிழ்", chat_launch: "AgriCare இடம் கேளுங்கள்",
    nav_contact: "எம்மைத் தொடர்புகொள்ள", ct_title: "AgriCare ஐத் தொடர்புகொள்ள", ct_lead: "AgriCare உதவி இலக்கத்தை அல்லது உங்கள் மாவட்ட அலுவலகத்தை அழையுங்கள் அல்லது SMS அனுப்புங்கள்.",
    ct_district: "உங்கள் மாவட்டம்", ct_call: "அழை", ct_sms: "SMS", ct_main: "AgriCare உதவி இலக்கம்", ct_main_note: "எல்லா மாவட்டங்களுக்குமான பிரதான இலக்கம்",
    ct_none: "உங்கள் மாவட்டத்தின் தொலைபேசி இலக்கம் விரைவில் சேர்க்கப்படும். கீழே உங்கள் இலக்கத்தைத் தாருங்கள், நாங்கள் அழைப்போம்.",
    ct_or: "அல்லது", ct_cb_title: "உங்களை அழைக்கச் சொல்லுங்கள்", ct_cb_lead: "உங்கள் இலக்கத்தைத் தாருங்கள், AgriCare அலுவலர் உங்களைத் திரும்ப அழைப்பார்.",
    ct_name: "உங்கள் பெயர்", ct_phone: "கைபேசி இலக்கம்", ct_msg: "என்ன பிரச்சினை? (விரும்பினால்)", ct_send: "அழைப்பைக் கோருங்கள்",
    ct_sent: "நன்றி! உங்கள் கோரிக்கை கிடைத்தது. விரைவில் {phone} இலக்கத்துக்கு அழைப்போம்.", ct_fail: "அனுப்ப முடியவில்லை. மீண்டும் முயலுங்கள்.",
    ct_back: "அரட்டைக்குத் திரும்ப", ct_more: "தொடர்புகொள்ள மேலும் வழிகள்", ct_kb: "📞 உங்கள் மாவட்டத்துக்கான இலக்கம் இதோ. அழைக்க அல்லது SMS அனுப்பத் தட்டுங்கள் – அல்லது உங்களை அழைக்கச் சொல்லுங்கள்.",
    chat_welcome: "வணக்கம்! 🙏 நான் உங்கள் AgriCare விவசாய அலுவலர். உங்கள் நெல் பற்றி எதையும் கேளுங்கள் – தட்டச்சு செய்யுங்கள், அல்லது 🎤 அழுத்திப் பேசுங்கள்.",
    chat_placeholder: "நோய், உரம், நீர் பற்றிக் கேளுங்கள்...",
    chat_unknown: "எனது விவசாயக் குறிப்புகளில் அதைக் காணவில்லை. நோய், பூச்சி, இனம் அல்லது மாவட்டத்தின் பெயருடன் கேளுங்கள் – உதா: \"குலை நோய்க்குச் சிகிச்சை\", \"யூரியா அட்டவணை\", \"Bg 352\" அல்லது \"குருநாகலுக்கான இனங்கள்\". நோயுற்ற இலையின் படத்தையும் ஸ்கேன் செய்யலாம்.",
    chat_offtopic: "நான் AgriCare விவசாய அலுவலர், எனவே நெல் மற்றும் விவசாயக் கேள்விகளுக்கு மட்டுமே உதவ முடியும் – நோய், பூச்சி, உரம், நீர், இனங்கள், வானிலை, அறுவடை.",
    chat_set_crop: "\"எனது பயிர்\" இல் உங்கள் இனத்தையும் விதைத்த திகதியையும் AgriCare க்குச் சொல்லுங்கள், ஒவ்வொரு வாரமும் செய்ய வேண்டியதைச் சரியாகச் சொல்வேன்.",
    chat_thinking: "யோசிக்கிறது...", chat_ai: "AI பதில்", chat_offline: "AgriCare விவசாயக் குறிப்புகளிலிருந்து",
    chat_listen: "கேட்கிறது... இப்போது பேசுங்கள்", chat_mic_no: "இந்த உலாவியில் குரல் தட்டச்சு இயங்காது. தயவுசெய்து கேள்வியைத் தட்டச்சு செய்யுங்கள்.",
    chat_clear: "அரட்டையை அழி", chat_speak: "உரக்க வாசி", chat_stop: "நிறுத்து", chat_try: "இப்படிக் கேளுங்கள்"
});
