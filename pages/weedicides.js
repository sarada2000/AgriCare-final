/* AgriCare – weedicides (weed killers) for paddy
   From the farmers' weedicide guide (pages 1.2 – 1.6). Doses are the label recommendations.
   dap = days after sowing / transplanting when the product is applied. */

const WEEDS = {
    weedy_rice:     { kind: "grass",  en: "Weedy rice",        si: "වල් වී",          ta: "களை நெல்" },
    bajiri:         { kind: "grass",  en: "Bajiri",            si: "බජිරි",           ta: "Bajiri" },
    maruk:          { kind: "grass",  en: "Maruk",             si: "මාරුක්",          ta: "Maruk" },
    heen_maruk:     { kind: "grass",  en: "Heen maruk",        si: "හීන් මාරුක්",      ta: "Heen maruk" },
    wel_maruk:      { kind: "grass",  en: "Wel maruk",         si: "වෙල් මාරුක්",      ta: "Wel maruk" },
    gojara:         { kind: "grass",  en: "Gojara",            si: "ගොජර",            ta: "Gojara" },
    ashwa_waligaya: { kind: "grass",  en: "Ashwa waligaya",    si: "අශ්ව වලිගය",       ta: "Ashwa waligaya" },
    batadella:      { kind: "grass",  en: "Batadella",         si: "බටදැල්ල",          ta: "Batadella" },
    maha_kudametta: { kind: "sedge",  en: "Maha kudametta",    si: "මහ කුඩමැට්ට",      ta: "Maha kudametta" },
    heen_kudametta: { kind: "sedge",  en: "Heen kudametta",    si: "හීන් කුඩමැට්ට",     ta: "Heen kudametta" },
    thunessa:       { kind: "sedge",  en: "Thunessa",          si: "තුනැස්ස",           ta: "Thunessa" },
    thunhiriya:     { kind: "sedge",  en: "Thunhiriya",        si: "තුන්හිරිය",          ta: "Thunhiriya" },
    japan_jabara:   { kind: "broad",  en: "Japan jabara",      si: "ජපන් ජබර",         ta: "Japan jabara" },
    diya_siyabala:  { kind: "broad",  en: "Diya siyabala",     si: "දිය සියඹලා",        ta: "Diya siyabala" },
    ambul_embilla:  { kind: "broad",  en: "Ambul embilla",     si: "ඇඹුල් ඇඹිලිය",      ta: "Ambul embilla" },
    girapala:       { kind: "broad",  en: "Girapala",          si: "ගිරාපලා",          ta: "Girapala" }
};
const WEED_KIND = {
    grass: { en: "grass", si: "තෘණ", ta: "புல்" },
    sedge: { en: "sedge", si: "පන් වර්ග", ta: "கோரை" },
    broad: { en: "broad-leaf", si: "පළල් පත්‍ර", ta: "அகன்ற இலை" }
};
const RICE_ANNUALS = ["bajiri", "maruk", "heen_maruk", "gojara", "ashwa_waligaya", "batadella", "maha_kudametta", "heen_kudametta", "thunessa", "thunhiriya"];

const WEEDICIDES = [
    {
        id: "sofit", name: "Sofit Pretilachlor", nameSi: "සොෆිට් ප්‍රිටිලැක්ලෝර්", code: "K3", color: "#2e8b57",
        ai: { en: "Pretilachlor 300 g/l EC + fenclorim 100 g/l", si: "ප්‍රිටිලැක්ලෝර් 300 ග්‍රෑ/ලී ඊ.සී. + ෆෙන්ක්ලෝරිම් 100 ග්‍රෑ/ලී", ta: "பிரிட்டிலாக்குளோர் 300 கி/லீ EC + ஃபென்குளோரிம் 100 கி/லீ" },
        type: { en: "Pre-emergence (before weeds come up)", si: "පූර්ව නිර්ගමන (වල් පැළ මතුවීමට පෙර)", ta: "முளைப்புக்கு முந்திய (களை முளைக்கும் முன்)" },
        about: {
            en: "Kills annual grasses, sedges and broad-leaf weeds that grow from seed. The fenclorim in it protects the rice plants from damage.",
            si: "බීජ මගින් පැළවන පළල් පත්‍ර, පන් වර්ග හා තෘණ වර්ග ඇතුළු වල් මර්දනය කරයි. ෆෙන්ක්ලෝරිම් මගින් වී පැළ වලට විය හැකි හානියෙන් ආරක්ෂා කරයි.",
            ta: "விதையிலிருந்து முளைக்கும் ஒருபருவப் புல், கோரை, அகன்ற இலைக் களைகளைக் கட்டுப்படுத்தும். இதிலுள்ள ஃபென்குளோரிம் நெற்பயிரைச் சேதத்திலிருந்து பாதுகாக்கும்."
        },
        uses: [
            {
                crop: "rice", dap: [0, 4], weeds: RICE_ANNUALS,
                per10: "40–50", perHa: 1600, sprayHa: [320, 400],
                when: { en: "0–4 days after sowing or transplanting", si: "වී වපුරා හෝ පැළ සිටුවා දින 0–4 අතර", ta: "விதைத்து அல்லது நட்டு 0–4 நாட்களுக்குள்" },
                water: {
                    en: "The soil surface must be moist when you spray. Let water back in 2–3 days after spraying.",
                    si: "යොදන අවස්ථාවේ පස මතුපිට තෙත්ව තිබිය යුතුයි. යෙදූ දින 2–3 කට පසු නැවත වතුර බඳින්න.",
                    ta: "தெளிக்கும்போது மண் மேற்பரப்பு ஈரமாக இருக்க வேண்டும். தெளித்து 2–3 நாட்களுக்குப் பின் மீண்டும் நீர் கட்டுங்கள்."
                }
            },
            {
                crop: "rice", dap: [-2, -2], weeds: ["weedy_rice"], label: { en: "For weedy rice", si: "වල් වී මර්දනය සඳහා", ta: "களை நெல்லுக்கு" },
                per10: "50–62", perHa: 2000, sprayHa: [320, 400],
                when: { en: "2 days BEFORE sowing", si: "වී වැපිරීමට දින 2 කට පෙර", ta: "விதைப்பதற்கு 2 நாட்கள் முன்" },
                water: {
                    en: "The soil surface must be moist. After applying, do not plough or puddle the field again.",
                    si: "යොදන අවස්ථාවේ පස මතුපිට තෙත්ව තිබිය යුතුය. යෙදීමෙන් පසු බිම් සැකසීම හා පෝරුගෑම නොකළ යුතුය.",
                    ta: "மண் மேற்பரப்பு ஈரமாக இருக்க வேண்டும். இட்ட பின் மீண்டும் உழவோ சேறாக்கவோ வேண்டாம்."
                }
            }
        ],
        notes: [
            { en: "Choose only ONE of the two uses above, depending on what your field needs.", si: "ක්ෂේත්‍රයේ අවශ්‍යතාවය මත ඉහත නිර්දේශ දෙකෙන් එකක් පමණක් තෝරා ගන්න.", ta: "உங்கள் வயலின் தேவைக்கேற்ப மேலே உள்ள இரண்டில் ஒன்றை மட்டும் தேர்ந்தெடுங்கள்." }
        ]
    },
    {
        id: "solito", name: "Solito 320 EC", nameSi: "සොලිටෝ 320 ඊ.සී.", code: "K3+B", color: "#d9822b",
        ai: { en: "Pretilachlor 300 g/l + pyribenzoxim 20 g/l EC", si: "ප්‍රිටිලැක්ලෝර් 300 ග්‍රෑ/ලී + පයිරිබෙන්සොක්සිම් 20 ග්‍රෑ/ලී ඊ.සී.", ta: "பிரிட்டிலாக்குளோர் 300 கி/லீ + பைரிபென்சாக்சிம் 20 கி/லீ EC" },
        type: { en: "Pre- and post-emergence", si: "පූර්ව සහ පශ්චාත් නිර්ගමන", ta: "முளைப்புக்கு முந்திய மற்றும் பிந்திய" },
        about: {
            en: "Kills all the common annual weeds of paddy – grasses, sedges and broad-leaf weeds.",
            si: "වී වගාවේ භාවිතා කරන පූර්ව සහ පශ්චාත් නිර්ගමන සියල්ල නසන වල්නාශකයකි.",
            ta: "நெல்வயலின் பொதுவான ஒருபருவக் களைகள் அனைத்தையும் – புல், கோரை, அகன்ற இலை – அழிக்கும்."
        },
        uses: [{
            crop: "rice", dap: [6, 10], weeds: RICE_ANNUALS,
            per10: "30–40", perHa: 1250, sprayHa: [320, 400],
            when: { en: "6–10 days after sowing or transplanting, or when the weeds have 1–2 leaves", si: "වී වපුරා හෝ පැළ සිටුවා දින 6–10 අතර කාලයේදී හෝ වල් පැළෑටි වල පත්‍ර 1–2 අවස්ථාවේදී", ta: "விதைத்து அல்லது நட்டு 6–10 நாட்களில், அல்லது களைகளுக்கு 1–2 இலைகள் இருக்கும்போது" },
            water: {
                en: "Drain the water before spraying so the weeds are well exposed. Let water back in 2–3 days after spraying.",
                si: "යෙදීමට පෙර වල් පැළෑටි හොඳින් මතුවන සේ ජලය කඩාහරින්න. යෙදීමෙන් දින 2–3 කට පසු නැවත වතුර බඳින්න.",
                ta: "தெளிக்கும் முன் களைகள் நன்கு வெளியே தெரியும்படி நீரை வடியுங்கள். 2–3 நாட்களுக்குப் பின் மீண்டும் நீர் கட்டுங்கள்."
            }
        }],
        notes: []
    },
    {
        id: "profit", name: "Profit 500 EC", nameSi: "ප්‍රොෆිට් 500 ඊ.සී.", code: "C2+K3", color: "#c9a227",
        ai: { en: "Propanil 330 g/l + pretilachlor 170 g/l EC", si: "ප්‍රොපනිල් 330 ග්‍රෑ/ලී + ප්‍රිටිලැක්ලෝර් 170 ග්‍රෑ/ලී ඊ.සී.", ta: "புரொப்பனில் 330 கி/லீ + பிரிட்டிலாக்குளோர் 170 கி/லீ EC" },
        type: { en: "Post-emergence, with contact and residual action", si: "ස්පර්ශ හා ශේෂ ක්‍රියාකාරිත්වයක් සහිත පශ්චාත් නිර්ගමන", ta: "தொடுகை மற்றும் எஞ்சிய செயற்பாட்டுடன் முளைப்புக்குப் பிந்திய" },
        about: {
            en: "Kills weeds that have already come up, and keeps working in the soil for 2–3 weeks against new ones.",
            si: "මතු වූ වල් පැළෑටි විනාශ කරන අතර ශේෂ ක්‍රියාකාරිත්වය සති 2–3 ක් පවතී.",
            ta: "ஏற்கனவே முளைத்த களைகளை அழித்து, புதியவற்றுக்கு எதிராக 2–3 வாரங்கள் மண்ணில் செயற்படும்."
        },
        uses: [{
            crop: "rice", dap: [6, 10], weeds: RICE_ANNUALS,
            per10: "50–63", perHa: 2000, sprayHa: [320, 400],
            when: { en: "6–10 days after sowing or transplanting, or when the weeds have 2–3 leaves", si: "වී වපුරා හෝ පැළ සිටුවා දින 6–10 අතර කාලයේදී හෝ වල් පැළෑටි වල පත්‍ර 2–3 ක් අවස්ථාවේදී", ta: "விதைத்து அல்லது நட்டு 6–10 நாட்களில், அல்லது களைகளுக்கு 2–3 இலைகள் இருக்கும்போது" },
            water: {
                en: "Let water back in 2–3 days after spraying and keep it. The residual action lasts 2–3 weeks.",
                si: "දින 2–3 කට පසු නැවත වතුර බැඳ පවත්වාගන්න. ශේෂ ක්‍රියාකාරිත්වය සති 2–3 පවතී.",
                ta: "2–3 நாட்களுக்குப் பின் மீண்டும் நீர் கட்டிப் பேணுங்கள். எஞ்சிய செயற்பாடு 2–3 வாரங்கள் நீடிக்கும்."
            }
        }],
        notes: []
    },
    {
        id: "facet", name: "Facet Quinclorac", nameSi: "ෆැසෙට් ක්වින්ක්ලෝරැක්", code: "O", color: "#e3c20f",
        ai: { en: "Quinclorac 250 g/l SC", si: "ක්වින්ක්ලෝරැක් 250 ග්‍රෑ/ලී එස්.සී.", ta: "குயின்குளோராக் 250 கி/லீ SC" },
        type: { en: "Post-emergence, systemic", si: "පශ්චාත් නිර්ගමන, සංස්ථානික", ta: "முளைப்புக்குப் பிந்திய, உட்புகும்" },
        about: {
            en: "Made especially for Maruk and Wel maruk and other annual grasses that grow from seed.",
            si: "බීජ මගින් පැළවන ඒකවාර්ෂික තෘණ වර්ග, මාරුක් වෙල් මාරුක් වැනි එකයිනොක්ලෝවා විශේෂ මර්දනයට.",
            ta: "விதையிலிருந்து முளைக்கும் Maruk, Wel maruk போன்ற ஒருபருவப் புற்களுக்கென்றே தயாரிக்கப்பட்டது."
        },
        uses: [{
            crop: "rice", dap: [8, 15], weeds: ["maruk", "wel_maruk", "heen_maruk"],
            per10: "20–25", per16: "32–40", perHa: 800, sprayHa: [320, 400],
            when: { en: "8–15 days after sowing or transplanting", si: "වී වපුරා හෝ පැළ සිටුවා දවස් 8–15 අතර", ta: "விதைத்து அல்லது நட்டு 8–15 நாட்களில்" },
            water: {
                en: "Best when the soil is moist, saturated or under a thin layer of water. Let water back in 1–3 days after spraying and keep it in the field for at least 7 days – close all outlets.",
                si: "පසේ තෙතමනය පැවතීම හෝ සංතෘප්තව පැවතීම හෝ මඳ වශයෙන් ජලයෙන් පිරී පැවතීම සුදුසුය. යොදා දින 1–3 කට පසු නැවත ජලය සපයා අවම වශයෙන් දින 7 ක් යනතුරු ජලය කුඹුරේ රඳවාගන්න; ජලය ඉවත්වන දොරටු සියල්ල වසා තබන්න.",
                ta: "மண் ஈரமாக, நீர் நிறைந்து அல்லது மெல்லிய நீர்ப்படலத்துடன் இருக்கும்போது சிறந்தது. தெளித்து 1–3 நாட்களில் மீண்டும் நீர் விட்டுக் குறைந்தது 7 நாட்கள் வயலில் நீரை வையுங்கள் – எல்லா வெளியேற்ற வாய்களையும் மூடுங்கள்."
            }
        }],
        notes: [
            { en: "It stays in the soil: do not use water from these fields for other crops.", si: "පසේ අවශේෂ ඉතිරිවන බැවින් යෙදීමෙන් පසු කුඹුරුවල ජලය වෙනත් වගාවන්ට නොයොදන්න.", ta: "இது மண்ணில் தங்கும்: இந்த வயல்களின் நீரை வேறு பயிர்களுக்குப் பயன்படுத்த வேண்டாம்." },
            { en: "Next season you can grow rice, other cereals, maize and sorghum in these fields.", si: "ඊළඟ කන්නයේ මෙම කුඹුරුවල වී, ධාන්‍ය වර්ග, ඉරිඟු හා සෝගම් වගා කළ හැක.", ta: "அடுத்த போகத்தில் இவ்வயல்களில் நெல், தானியங்கள், சோளம், சோர்கம் பயிரிடலாம்." },
            { en: "Grow chilli, tobacco, potatoes and vegetables only after 1 year.", si: "යොදා වසරකට පසු මිරිස්, දුම්කොළ, අල සහ එළවළු වගා කළ හැක.", ta: "மிளகாய், புகையிலை, கிழங்கு வகைகள், காய்கறிகள் ஒரு வருடத்துக்குப் பின்னரே பயிரிடுங்கள்." },
            { en: "No carrot or tomato for 2 years after using it.", si: "යොදා වසර දෙකක් යනතුරු කැරට් සහ තක්කාලි වගා නොකරන්න.", ta: "இட்ட பின் 2 வருடங்களுக்குக் கரட், தக்காளி பயிரிட வேண்டாம்." }
        ]
    },
    {
        id: "mcpa", name: "CIC M.C.P.A. 60", nameSi: "සී.අයි.සී. එම්.සී.පී.ඒ. 60", code: "O", color: "#3a9d3a",
        ai: { en: "MCPA 600 g/l SL", si: "එම්.සී.පී.ඒ. 600 ග්‍රෑ/ලී එස්.එල්.", ta: "MCPA 600 கி/லீ SL" },
        type: { en: "Post-emergence, selective, systemic", si: "තෝරා නසන, පශ්චාත් නිර්ගමන, සංස්ථානික", ta: "தெரிவுசெய்து அழிக்கும், முளைப்புக்குப் பிந்திய, உட்புகும்" },
        about: {
            en: "For sedges like Thunessa and Kudametta and broad-leaf weeds like Japan jabara, Diya siyabala and Ambul embilla.",
            si: "වී වගාවේ තුනැස්ස, කුඩමැට්ට වැනි පන් වර්ග, ජපන් ජබර, දිය සියඹලා හා ඇඹුල් ඇඹිලිය වැනි පළල් පත්‍ර වල් මර්දනය කරයි.",
            ta: "Thunessa, Kudametta போன்ற கோரைகளுக்கும் Japan jabara, Diya siyabala, Ambul embilla போன்ற அகன்ற இலைக் களைகளுக்கும்."
        },
        uses: [
            {
                crop: "rice", dap: [21, 28], weeds: ["thunhiriya", "thunessa", "maha_kudametta", "heen_kudametta", "japan_jabara", "diya_siyabala", "ambul_embilla", "girapala"],
                per10: "45–56", perHa: 1800, sprayHa: [320, 400],
                when: { en: "21–28 days after sowing or transplanting", si: "වී වපුරා හෝ පැළ සිටුවා දින 21–28 අතර කාලයේදී", ta: "விதைத்து அல்லது நட்டு 21–28 நாட்களில்" },
                water: {
                    en: "Drain the water before spraying so the weeds are fully exposed. Let water back in 2–3 days after spraying.",
                    si: "වල්නාශක ඉසීමට පෙර කුඹුරේ ජලය කඩා හැර වල් පැළෑටි හොඳින් නිරාවරණය කරන්න. යෙදීමෙන් දින 2–3 කට පසු නැවත වතුර බඳින්න.",
                    ta: "தெளிக்கும் முன் களைகள் முழுமையாக வெளியே தெரியும்படி நீரை வடியுங்கள். 2–3 நாட்களுக்குப் பின் மீண்டும் நீர் கட்டுங்கள்."
                }
            },
            {
                crop: "tea", weeds: ["girapala"], label: { en: "For tea", si: "තේ සඳහා", ta: "தேயிலைக்கு" },
                per10: "30", perHa: 1750, sprayHa: [550, 550],
                when: { en: "On annual broad-leaf weeds such as Girapala, Gatakola and Wathupalu", si: "ගිරාපලා, ගැටකොළ, වතුපාලු වැනි ඒක වාර්ෂික පළල් පත්‍ර වල් මත", ta: "Girapala, Gatakola, Wathupalu போன்ற ஒருபருவ அகன்ற இலைக் களைகளில்" }
            }
        ],
        notes: []
    },
    {
        id: "diuron", name: "Liquido Diuron", nameSi: "ලික්විඩෝ ඩයියුරෝන්", code: "C2", color: "#7a7f85", notPaddy: true,
        ai: { en: "Diuron 500 g/l SC", si: "ඩයියුරෝන් 500 ග්‍රෑ/ලී එස්.සී.", ta: "டையூரோன் 500 கி/லீ SC" },
        type: { en: "Pre- and early post-emergence, systemic – for PINEAPPLE (not for paddy)", si: "පූර්ව හා මුලික අවධිවල පශ්චාත් නිර්ගමන, සංස්ථානික – අන්නාසි සඳහා (වී සඳහා නොවේ)", ta: "முளைப்புக்கு முந்திய மற்றும் ஆரம்ப பிந்திய, உட்புகும் – அன்னாசிக்கு (நெல்லுக்கு அல்ல)" },
        about: {
            en: "For grasses (Thinithana, Gurutana, Bala tana) and broad-leaf weeds (Wathu pala, Maha girapala, Wadakiriya, Nidikumba, Gatakola …) in pineapple.",
            si: "අන්නාසි වගාවේ තෘණ (තිනිතණ, ගුරුතණ, බැල තණ) සහ පළල් පත්‍ර (වතු පාළු, මහ ගිරාපලා, වදකිරිය, නිදිකුම්බා, ගැටකොළ …) වල් මර්දනයට.",
            ta: "அன்னாசியில் புற்கள் (Thinithana, Gurutana, Bala tana) மற்றும் அகன்ற இலைக் களைகளுக்கு (Wathu pala, Maha girapala, Wadakiriya, Nidikumba, Gatakola …)."
        },
        uses: [{
            crop: "pineapple", weeds: [],
            per10: "45", perHa: 1800, sprayHa: null,
            when: { en: "On young weeds, when the soil is moist", si: "පසේ තෙතමනය ඇති විට, ළපටි වල් මත", ta: "மண் ஈரமாக இருக்கும்போது இளம் களைகளில்" }
        }],
        notes: [
            { en: "Soil moisture makes it work. Do not dig or turn the soil where you have sprayed; spray again where weeds come back.", si: "පසෙහි තෙතමනය තිබීම වල් මර්දනය කාර්යක්ෂම කරයි. වල්නාශක ඉසින තැන්වල පස පෙරලීමෙන් වළකින්න. වල් පැළෑටි මතුවන ස්ථානවලට නැවත යොදන්න.", ta: "மண் ஈரம் இதைச் செயல்பட வைக்கும். தெளித்த இடங்களில் மண்ணைக் கிளற வேண்டாம்; களை மீண்டும் வரும் இடங்களில் மீண்டும் இடுங்கள்." },
            { en: "Do not spray onto the crop. With a wetting agent (Superwet N, 20–25 ml per 10 L) it works on the leaves and controls weeds for 2–3 months.", si: "බෝගය මතට යෙදීමෙන් වළකින්න. තෙත්කාරක (සුපර්වෙට් එන්) මි.ලී. 20–25 සෑම ලීටර් 10 කට මිශ්‍ර කර යෙදීමෙන් පත්‍ර මත ක්‍රියාකාරී වී මාස 2–3 දක්වා වල් මර්දනය වේ.", ta: "பயிரின் மேல் தெளிக்க வேண்டாம். நனைப்பான் (Superwet N, 10 லீட்டருக்கு 20–25 மி.லீ.) சேர்த்தால் இலைகளில் செயற்பட்டு 2–3 மாதங்கள் களையைக் கட்டுப்படுத்தும்." },
            { en: "Shake the bottle well before use. Stop 14 days before harvest.", si: "භාවිතයට පෙර බෝතලය හොඳින් සොලවන්න. පෙර අස්වනු කාලය – දින 14.", ta: "பயன்படுத்தும் முன் போத்தலை நன்கு குலுக்குங்கள். அறுவடைக்கு 14 நாட்கள் முன் நிறுத்துங்கள்." }
        ]
    }
];

/* ---------- page strings ---------- */
Object.assign(translations.en, {
    nav_weeds: "Weeds", tile_weeds: "Which weedicide, when, and how much",
    wd_title: "Weed Control", wd_lead: "Which weedicide to use, when to spray it, and exactly how much for your field.",
    wd_timeline: "When to spray", wd_timeline_lead: "Days after sowing or transplanting. Use one product for each stage – not all of them.",
    wd_your_day: "Your crop: day {n}", wd_due: "Due now", wd_day: "Day", wd_days: "days", wd_before: "before sowing",
    wd_calc: "Dose calculator", wd_calc_lead: "Enter your field size to see how much weedicide and water you need.",
    wd_product: "Weedicide", wd_size: "Field size", wd_unit_ac: "acres", wd_unit_ha: "hectares", wd_unit_pe: "perches", wd_tank: "Sprayer tank",
    wd_need_product: "Weedicide to buy", wd_need_water: "Water", wd_need_tanks: "Tank loads", wd_per_tank: "Weedicide per tank",
    wd_finder: "Which weedicide for my weed?", wd_finder_lead: "Tap a weed to see the products that control it.", wd_all: "All",
    wd_controls: "Weeds it controls", wd_when: "When", wd_mix: "Mix", wd_mix_val: "{ml} ml in a 10 L tank", wd_mix16: " ({ml} ml in 16 L)",
    wd_rate: "Per field", wd_rate_val: "{ha} ml per hectare ({ac} ml per acre)", wd_spray_val: "Spray volume: {lo}–{hi} L per hectare ({alo}–{ahi} L per acre)",
    wd_water: "Water", wd_notes: "Important", wd_type: "Type", wd_code: "Group",
    wd_not_paddy: "Not for paddy", wd_crop_tea: "Tea", wd_crop_pineapple: "Pineapple",
    wd_rules_title: "Rules for every weedicide",
    wd_rule1: "The letter code on the label (K3, C2, O, B…) is the weedicide's group. Do not use weedicides with the same code in the same field season after season – the weeds become resistant. Change the group.",
    wd_rule2: "Always follow the label instructions exactly – more is not better and can burn the rice.",
    wd_rule3: "Measure with a measuring cup, mix in clean water, and spray evenly across the whole field.",
    wd_rule4: "Wear gloves, a mask, long sleeves and boots. Wash after spraying and keep children away.",
    wd_rule5: "Spray on a calm day with no rain expected – check the Weather page.",
    wd_source: "Doses from the weedicide guide book. Always check the label on your bottle.",
    wd_open_weather: "🌦 Check a good spray day", wd_photo_note: "Bottle pictures from the weedicide guide."
});
Object.assign(translations.si, {
    nav_weeds: "වල් පාලනය", tile_weeds: "කුමන වල්නාශකය, කවදා, කොපමණ",
    wd_title: "වල් පාලනය", wd_lead: "භාවිත කළ යුතු වල්නාශකය, ඉසිය යුතු කාලය සහ ඔබේ කුඹුරට අවශ්‍ය නිවැරදි ප්‍රමාණය.",
    wd_timeline: "ඉසිය යුතු කාලය", wd_timeline_lead: "වී වපුරා හෝ පැළ සිටුවා දින ගණන. එක් අවස්ථාවකට එක් වල්නාශකයක් පමණක් – සියල්ලම නොවේ.",
    wd_your_day: "ඔබේ වගාව: දින {n}", wd_due: "දැන් කළ යුතුයි", wd_day: "දිනය", wd_days: "දින", wd_before: "වැපිරීමට පෙර",
    wd_calc: "මාත්‍රා ගණකය", wd_calc_lead: "අවශ්‍ය වල්නාශක සහ ජල ප්‍රමාණය දැනගැනීමට ඔබේ කුඹුරේ ප්‍රමාණය ඇතුළත් කරන්න.",
    wd_product: "වල්නාශකය", wd_size: "කුඹුරේ ප්‍රමාණය", wd_unit_ac: "අක්කර", wd_unit_ha: "හෙක්ටයාර", wd_unit_pe: "පර්චස්", wd_tank: "ඉසින ටැංකිය",
    wd_need_product: "මිලදී ගත යුතු වල්නාශක", wd_need_water: "ජලය", wd_need_tanks: "ටැංකි ගණන", wd_per_tank: "ටැංකියකට වල්නාශක",
    wd_finder: "මගේ වල් පැළෑටියට කුමන වල්නාශකයද?", wd_finder_lead: "වල් පැළෑටියක් ඔබා එය මර්දනය කරන වල්නාශක බලන්න.", wd_all: "සියල්ල",
    wd_controls: "පාලනය වන වල් පැළෑටි", wd_when: "යෙදිය යුතු කාලය", wd_mix: "මිශ්‍රණ අනුපාතය", wd_mix_val: "ජලය ලීටර් 10 කට මි.ලී. {ml}", wd_mix16: " (ලීටර් 16 කට මි.ලී. {ml})",
    wd_rate: "යෙදිය යුතු ප්‍රමාණය", wd_rate_val: "හෙක්ටයාරයකට මි.ලී. {ha} (අක්කරයකට මි.ලී. {ac})", wd_spray_val: "ඉසින ප්‍රමාණය: හෙක්ටයාරයකට ලී. {lo}–{hi} (අක්කරයකට ලී. {alo}–{ahi})",
    wd_water: "ජල පාලනය", wd_notes: "වැදගත්", wd_type: "වර්ගය", wd_code: "කේතය",
    wd_not_paddy: "වී සඳහා නොවේ", wd_crop_tea: "තේ", wd_crop_pineapple: "අන්නාසි",
    wd_rules_title: "සෑම වල්නාශකයකටම නීති",
    wd_rule1: "ලේබලයේ ඇති අකුරු කේතය (K3, C2, O, B…) වල්නාශකයේ කාණ්ඩයයි. එකම කේතය සහිත වල්නාශක එක් කුඹුරකට අඛණ්ඩව කන්නයෙන් කන්නය යෙදීමෙන් වළකින්න – වල් පැළෑටි ප්‍රතිරෝධී වේ. කාණ්ඩය මාරු කරන්න.",
    wd_rule2: "ලේබලයේ උපදෙස් අනිවාර්යයෙන්ම පිළිපදින්න – වැඩිපුර යෙදීම හොඳ නැත, වී පැළ පිළිස්සිය හැක.",
    wd_rule3: "මිනුම් කෝප්පයකින් මැන, පිරිසිදු ජලයේ මිශ්‍ර කර, මුළු කුඹුර පුරා ඒකාකාරව ඉසින්න.",
    wd_rule4: "අත්වැසුම්, මුහුණු ආවරණ, දිගු අත් සහ බූට් පළඳින්න. ඉසීමෙන් පසු සෝදන්න, ළමයින් ඈත් කර තබන්න.",
    wd_rule5: "වැසි නොමැති, සුළං මද දිනයක ඉසින්න – \"කාලගුණය\" පිටුව බලන්න.",
    wd_source: "මාත්‍රා වල්නාශක මාර්ගෝපදේශ පොතෙනි. සැමවිටම ඔබේ බෝතලයේ ලේබලය පරීක්ෂා කරන්න.",
    wd_open_weather: "🌦 හොඳ ඉසින දිනයක් බලන්න", wd_photo_note: "බෝතල් පින්තූර වල්නාශක මාර්ගෝපදේශයෙනි."
});
Object.assign(translations.ta, {
    nav_weeds: "களைகள்", tile_weeds: "எந்தக் களைக்கொல்லி, எப்போது, எவ்வளவு",
    wd_title: "களைக் கட்டுப்பாடு", wd_lead: "எந்தக் களைக்கொல்லி, எப்போது தெளிப்பது, உங்கள் வயலுக்கு எவ்வளவு என்பது சரியாக.",
    wd_timeline: "எப்போது தெளிப்பது", wd_timeline_lead: "விதைத்த அல்லது நட்ட பின் நாட்கள். ஒவ்வொரு கட்டத்துக்கும் ஒரு பொருள் மட்டும் – எல்லாம் அல்ல.",
    wd_your_day: "உங்கள் பயிர்: நாள் {n}", wd_due: "இப்போது", wd_day: "நாள்", wd_days: "நாட்கள்", wd_before: "விதைப்புக்கு முன்",
    wd_calc: "அளவுக் கணிப்பான்", wd_calc_lead: "தேவையான களைக்கொல்லி மற்றும் நீரின் அளவை அறிய உங்கள் வயலின் அளவை உள்ளிடுங்கள்.",
    wd_product: "களைக்கொல்லி", wd_size: "வயல் அளவு", wd_unit_ac: "ஏக்கர்", wd_unit_ha: "ஹெக்டேயர்", wd_unit_pe: "பேர்ச்சஸ்", wd_tank: "தெளிப்புத் தொட்டி",
    wd_need_product: "வாங்க வேண்டிய களைக்கொல்லி", wd_need_water: "நீர்", wd_need_tanks: "தொட்டிகள்", wd_per_tank: "தொட்டிக்குக் களைக்கொல்லி",
    wd_finder: "என் களைக்கு எந்தக் களைக்கொல்லி?", wd_finder_lead: "ஒரு களையைத் தட்டி அதைக் கட்டுப்படுத்தும் பொருட்களைப் பாருங்கள்.", wd_all: "அனைத்தும்",
    wd_controls: "கட்டுப்படுத்தும் களைகள்", wd_when: "எப்போது", wd_mix: "கலவை", wd_mix_val: "10 லீ. தொட்டியில் {ml} மி.லீ.", wd_mix16: " (16 லீ.க்கு {ml} மி.லீ.)",
    wd_rate: "வயலுக்கு", wd_rate_val: "ஹெக்டேயருக்கு {ha} மி.லீ. (ஏக்கருக்கு {ac} மி.லீ.)", wd_spray_val: "தெளிப்பு அளவு: ஹெக்டேயருக்கு {lo}–{hi} லீ. (ஏக்கருக்கு {alo}–{ahi} லீ.)",
    wd_water: "நீர் முகாமை", wd_notes: "முக்கியம்", wd_type: "வகை", wd_code: "குழு",
    wd_not_paddy: "நெல்லுக்கு அல்ல", wd_crop_tea: "தேயிலை", wd_crop_pineapple: "அன்னாசி",
    wd_rules_title: "எல்லாக் களைக்கொல்லிகளுக்குமான விதிகள்",
    wd_rule1: "லேபிளிலுள்ள எழுத்துக் குறியீடு (K3, C2, O, B…) களைக்கொல்லியின் குழு. ஒரே குறியீடுள்ள களைக்கொல்லிகளை ஒரே வயலில் போகம் தோறும் தொடர்ந்து பயன்படுத்த வேண்டாம் – களைகள் எதிர்ப்புத் திறன் பெறும். குழுவை மாற்றுங்கள்.",
    wd_rule2: "லேபிள் அறிவுறுத்தல்களைக் கட்டாயம் பின்பற்றுங்கள் – அதிகம் நல்லதல்ல, நெல்லை எரிக்கலாம்.",
    wd_rule3: "அளவுக் குவளையால் அளந்து, சுத்தமான நீரில் கலந்து, வயல் முழுவதும் சமமாகத் தெளியுங்கள்.",
    wd_rule4: "கையுறை, முகமூடி, நீண்ட கை ஆடை, பூட்ஸ் அணியுங்கள். தெளித்தபின் கழுவுங்கள், குழந்தைகளைத் தூரத்தில் வையுங்கள்.",
    wd_rule5: "மழை இல்லாத, காற்று குறைந்த நாளில் தெளியுங்கள் – \"வானிலை\" பக்கத்தைப் பாருங்கள்.",
    wd_source: "அளவுகள் களைக்கொல்லி வழிகாட்டி நூலிலிருந்து. உங்கள் போத்தலின் லேபிளை எப்போதும் சரிபாருங்கள்.",
    wd_open_weather: "🌦 நல்ல தெளிப்பு நாளைப் பாருங்கள்", wd_photo_note: "போத்தல் படங்கள் களைக்கொல்லி வழிகாட்டியிலிருந்து."
});
