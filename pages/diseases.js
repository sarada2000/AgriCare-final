/* AgriCare – paddy disease data
   Used by the disease library and the scan result page.
   "id" values must match the class labels your model returns. */

const DISEASES = [
    {
        id: "blast",
        type: "fungal",
        swatch: "sw-blast",
        sci: "Magnaporthe oryzae (Pyricularia oryzae)",
        name: { en: "Rice Blast", si: "කොළ පාළුව (බ්ලාස්ට්)", ta: "குலை நோய் (பிளாஸ்ட்)" },
        summary: {
            en: "The most damaging fungal disease of paddy. It attacks leaves, the neck of the panicle and nodes, and can wipe out a field in a wet season.",
            si: "වී වගාවට වැඩිම හානි කරන දිලීර රෝගයයි. කොළ, කරලේ බෙල්ල සහ ගැට වලට හානි කරන අතර තෙත් කන්නයකදී මුළු කුඹුරම විනාශ කළ හැකිය.",
            ta: "நெல்லுக்கு அதிக சேதம் விளைவிக்கும் பூஞ்சை நோய். இலைகள், கதிர்க் கழுத்து, கணுக்களைத் தாக்கி, ஈரமான போகத்தில் முழு வயலையும் அழிக்கக்கூடியது."
        },
        symptoms: [
            "Spindle or diamond-shaped spots with grey-white centres and brown borders",
            "Spots join up and whole leaves dry out",
            "Neck blast: the panicle neck turns black and breaks; grains stay empty"
        ],
        conditions: [
            "Too much nitrogen fertilizer",
            "Cool nights, high humidity and long periods of leaf wetness",
            "Dense planting and susceptible varieties"
        ],
        manage: [
            "Stop extra urea until the disease is under control",
            "Spray tricyclazole 75% WP (or isoprothiolane) at the dose on the label, covering the leaves well; repeat after 10–14 days if new spots appear",
            "Spray at early booting and heading if neck blast is a risk in your area"
        ],
        prevent: [
            "Grow a blast-resistant variety recommended by the Department of Agriculture",
            "Apply nitrogen in split doses, never all at once",
            "Burn or plough in infected straw and stubble after harvest"
        ]
    },
    {
        id: "bacterial_leaf_blight",
        type: "bacterial",
        swatch: "sw-blb",
        sci: "Xanthomonas oryzae pv. oryzae",
        name: { en: "Bacterial Leaf Blight", si: "බැක්ටීරියා කොළ අංගමාරය", ta: "பாக்டீரியா இலைக் கருகல் நோய்" },
        summary: {
            en: "A bacterial disease that spreads with wind-driven rain and flood water. Leaves dry from the tip down and the crop loses its ability to fill grain.",
            si: "සුළං සහිත වැසි හා ගංවතුර සමඟ පැතිරෙන බැක්ටීරියා රෝගයකි. කොළ අග සිට වියළී යන අතර ඇට පිරීම අඩු වේ.",
            ta: "காற்றுடன் கூடிய மழை, வெள்ள நீருடன் பரவும் பாக்டீரியா நோய். இலைகள் நுனியிலிருந்து காய்ந்து, மணி நிரம்புவது குறையும்."
        },
        symptoms: [
            "Water-soaked streaks along the leaf edge, starting at the tip",
            "Streaks turn yellow, then straw-white, with a wavy margin",
            "Milky drops of bacterial ooze on young lesions in the morning",
            "Kresek: whole seedlings wilt and die soon after transplanting"
        ],
        conditions: [
            "Storms, heavy rain and flooded fields",
            "Wounds from clipping seedlings or strong wind",
            "High nitrogen"
        ],
        manage: [
            "No spray cures it. Drain the field for a few days to slow the spread",
            "Do not top-dress with more nitrogen while it is active",
            "Keep water from infected fields out of healthy ones"
        ],
        prevent: [
            "Use resistant varieties and clean seed",
            "Avoid cutting the tips of seedlings at transplanting",
            "Remove weeds and volunteer rice from bunds and channels"
        ]
    },
    {
        id: "brown_spot",
        type: "fungal",
        swatch: "sw-brown",
        sci: "Bipolaris oryzae (Cochliobolus miyabeanus)",
        name: { en: "Brown Spot", si: "දුඹුරු පුල්ලි රෝගය", ta: "பழுப்புப் புள்ளி நோய்" },
        summary: {
            en: "A fungal disease linked to weak, under-fed plants. It is a sign that the soil is short of nutrients, especially potassium.",
            si: "දුර්වල, පෝෂණය අඩු පැළවලට ඇති වන දිලීර රෝගයකි. පසේ පෝෂක, විශේෂයෙන් පොටෑසියම් හිඟ බව පෙන්වයි.",
            ta: "பலவீனமான, ஊட்டச்சத்துக் குறைந்த பயிர்களுடன் தொடர்புடைய பூஞ்சை நோய். மண்ணில் ஊட்டச்சத்து, குறிப்பாகப் பொட்டாசியம் குறைவு என்பதைக் காட்டுகிறது."
        },
        symptoms: [
            "Small oval brown spots, about the size of a sesame seed, with grey centres",
            "A yellow halo around many spots",
            "Spotted, discoloured grains and poor seedling growth"
        ],
        conditions: [
            "Poor or unbalanced fertilizer, especially low potassium",
            "Drought stress and sandy, leached soils",
            "Infected seed"
        ],
        manage: [
            "Correct the fertilizer balance, especially potassium (MOP)",
            "Keep the field watered; avoid drought stress",
            "Use a recommended fungicide only if the attack is severe"
        ],
        prevent: [
            "Use certified seed or treat seed before sowing",
            "Follow the Department of Agriculture fertilizer recommendation for your soil",
            "Add organic matter to improve weak soils"
        ]
    },
    {
        id: "sheath_blight",
        type: "fungal",
        swatch: "sw-sheath",
        sci: "Rhizoctonia solani",
        name: { en: "Sheath Blight", si: "කොපු අංගමාරය", ta: "இலையுறைக் கருகல் நோய்" },
        summary: {
            en: "A fungus that starts on the leaf sheath near the water line and climbs up the plant in dense, heavily fertilised crops.",
            si: "ජල මට්ටම අසල කොළ කොපුවෙන් ආරම්භ වී, ඝනව වැවූ පොහොර වැඩි කුඹුරුවල පැළය දිගේ ඉහළට පැතිරෙන දිලීරයකි.",
            ta: "நீர் மட்டத்துக்கு அருகில் இலையுறையில் தொடங்கி, அடர்த்தியான, அதிக உரமிட்ட பயிர்களில் மேல்நோக்கிப் பரவும் பூஞ்சை."
        },
        symptoms: [
            "Oval grey-green patches on the sheath just above the water",
            "Patches grow, turn bleached with a brown edge, and join up",
            "Small brown fungal bodies (sclerotia) on the lesions"
        ],
        conditions: [
            "Close spacing and a thick, humid canopy",
            "High nitrogen",
            "Warm, humid weather from maximum tillering onward"
        ],
        manage: [
            "Spray hexaconazole 5% SC (or propiconazole) at the label dose",
            "Direct the spray at the lower part of the plant",
            "Hold back extra nitrogen"
        ],
        prevent: [
            "Use the recommended plant spacing",
            "Remove weeds and infected stubble that carry sclerotia",
            "Apply balanced fertilizer"
        ]
    },
    {
        id: "tungro",
        type: "viral",
        swatch: "sw-tungro",
        sci: "Rice tungro bacilliform & spherical viruses",
        name: { en: "Rice Tungro", si: "ටුන්ග්‍රෝ රෝගය", ta: "துங்ரோ நோய்" },
        summary: {
            en: "A virus spread by the green leafhopper. Infected plants stay stunted and yellow-orange, and there is no cure once a plant is infected.",
            si: "කොළ පැළ කීඩෑවා මගින් පැතිරෙන වෛරසයකි. රෝගී පැළ කුරු වී කහ-තැඹිලි පැහැ වන අතර ආසාදනය වූ පසු සුව කළ නොහැක.",
            ta: "பச்சைத் தத்துப்பூச்சியால் பரவும் வைரஸ். பாதிக்கப்பட்ட பயிர்கள் குட்டையாகி மஞ்சள்-செம்மஞ்சள் நிறமாகும்; பாதிக்கப்பட்ட பின் குணப்படுத்த முடியாது."
        },
        symptoms: [
            "Young leaves turn yellow to orange, starting at the tip",
            "Plants are stunted with fewer tillers",
            "Late or incomplete panicles with many empty grains"
        ],
        conditions: [
            "Large numbers of green leafhoppers",
            "Staggered planting, so infected and young crops overlap",
            "Infected ratoons and volunteer plants nearby"
        ],
        manage: [
            "Pull out and destroy infected plants early",
            "Control green leafhoppers with imidacloprid or thiamethoxam at the label dose while the crop is young",
            "Tell neighbouring farmers so everyone removes infected plants in the same week"
        ],
        prevent: [
            "Plant at the same time as neighbouring fields",
            "Plough in stubble and ratoons after harvest",
            "Use tolerant varieties in areas where tungro is common"
        ]
    },
    {
        id: "red_stripe",
        type: "fungal",
        swatch: "sw-redstripe",
        sci: "Gonatophragmium sp. (some studies report Microbacterium sp.)",
        name: { en: "Red Stripe", si: "රතු ඉරි රෝගය", ta: "சிவப்புக் கோடு நோய்" },
        summary: {
            en: "Small yellow-orange spots on the leaf with a red-orange stripe running up towards the leaf tip. It appears from panicle start to ripening and can dry the upper leaves, reducing grain filling.",
            si: "කොළ මත කුඩා කහ-තැඹිලි ලප ඇති වී කොළ අග දෙසට රතු-තැඹිලි ඉරක් ඇදී යයි. කරල් හටගැනීමේ සිට ඉදීම දක්වා පෙනෙන අතර ඉහළ කොළ වියළී ඇට පිරීම අඩු කළ හැකිය.",
            ta: "இலையில் சிறிய மஞ்சள்-செம்மஞ்சள் புள்ளிகள் தோன்றி, இலை நுனியை நோக்கி சிவப்பு-செம்மஞ்சள் கோடு ஓடும். கதிர் உருவாதல் முதல் முற்றுதல் வரை தோன்றி, மேல் இலைகளைக் காய வைத்து மணி நிரம்புவதைக் குறைக்கும்."
        },
        symptoms: [
            "Pin-sized yellow-green to light orange spots, usually near the leaf base",
            "A red-orange stripe grows from each spot up towards the leaf tip",
            "Stripes join and the leaf dries from the tip, looking burnt"
        ],
        conditions: [
            "Hot weather with high humidity and long leaf wetness",
            "Too much nitrogen fertilizer",
            "From panicle start to ripening; dense, thick crops"
        ],
        manage: [
            "Stop extra urea now",
            "Spray thiophanate-methyl at the label dose, covering the upper leaves well; repeat after 10–14 days if new stripes appear",
            "Drain the field for 2–3 days, then keep a shallow water level"
        ],
        prevent: [
            "Apply nitrogen in split doses, never too much",
            "Use the recommended seed rate and spacing so the crop is not too dense",
            "Drain the field from time to time around panicle start"
        ]
    }
];

const HEALTHY = {
    id: "healthy",
    swatch: "sw-healthy",
    name: { en: "Healthy leaf", si: "නිරෝගී කොළය", ta: "ஆரோக்கியமான இலை" },
    summary: {
        en: "No disease signs found on this leaf. Keep checking your field every week, especially after rain.",
        si: "මෙම කොළයේ රෝග ලක්ෂණ හමු නොවීය. විශේෂයෙන් වැසි වලින් පසු, සතිපතා ඔබේ කුඹුර පරීක්ෂා කරන්න.",
        ta: "இந்த இலையில் நோய் அறிகுறிகள் இல்லை. குறிப்பாக மழைக்குப் பின், ஒவ்வொரு வாரமும் வயலைச் சோதியுங்கள்."
    }
};

function localText(obj) {
    const lang = (typeof getLanguage === "function") ? getLanguage() : "en";
    return obj[lang] || obj.en;
}

/* ---------- Real photos ----------
   Put your photos in the folder img/diseases/ with these names (the names from your own image folder).
   A disease without a photo keeps its drawing. You can also name a photo by its id, e.g. img/diseases/blast.jpg */
const DISEASE_PHOTOS = {
    blast: ["paddy blast.jpg", "Paddy blast.jpg"],
    bacterial_leaf_blight: ["bacterial leaf blight.jpg", "Bacterial leaf blight.jpg"],
    brown_spot: ["Brown spot.jpg", "brown spot.jpg"],
    sheath_blight: ["sheath blight.jpg", "Sheath blight.jpg"],
    tungro: ["tungro.jpg", "Tungro.jpg"],
    red_stripe: ["red stripe.jpg", "Red stripe.jpg"],
    gall_midge: ["gall midge.jpg", "Gall midge.jpg"],
    leaf_folder: ["leaf folder.jpg", "Leaf folder.jpg"],
    paddy_bug: ["rice bug.jpg", "Rice bug.jpg"],
    stem_borer: ["stem borer.jpg", "Stem borer.jpg"]
};
function diseasePhotoUrls(id) {
    const base = location.pathname.indexOf("/pages/") >= 0 ? "../" : "";
    return (DISEASE_PHOTOS[id] || []).concat([id + ".jpg", id + ".png"])
        .map(name => base + "img/diseases/" + encodeURIComponent(name));
}
/* Try the photo names one by one; when one loads, show it in `box` (over the drawing) */
function addDiseasePhoto(box, id, alt, onShown) {
    const urls = diseasePhotoUrls(id);
    let i = 0;
    const next = () => {
        if (i >= urls.length) return;
        const img = new Image();
        img.onload = () => {
            img.className = "swatch-photo";
            img.alt = alt || "";
            img.loading = "lazy";
            box.insertBefore(img, box.firstChild);
            box.classList.add("has-photo");
            if (onShown) onShown(img);
        };
        img.onerror = next;
        img.src = urls[i++];
    };
    next();
}


/* ---------- Disease data from the database ----------
   The page first has the built-in data above, then asks the server (GET /api/diseases)
   and replaces it with what officers keep in the database. If the server cannot be
   reached, the built-in data stays, so the page still works offline. */
   function linesOf(text) {
    return text ? text.split("\n").filter(s => s.trim()) : [];
}

function applyDiseaseRecord(r) {
    let d = r.id === "healthy" ? HEALTHY : DISEASES.find(x => x.id === r.id);
    if (!d) {                                    // a disease that is only in the database
        d = { id: r.id, sci: "", swatch: "sw-brown",
              type: r.id.startsWith("bacterial") ? "bacterial" : r.id === "hispa" ? "insect" : "fungal",
              summary: { en: "" }, symptoms: [], conditions: [], manage: [], prevent: [] };
        DISEASES.push(d);
    }
    d.name = { en: r.name_en, si: r.name_si, ta: r.name_ta };
    if (r.id === "healthy") return;
    d.symptoms = linesOf(r.symptoms_en);
    d.manage = linesOf(r.treatment_en);
    for (const lang of ["si", "ta"]) {
        const symptoms = linesOf(r["symptoms_" + lang]);
        const manage = linesOf(r["treatment_" + lang]);
        CONTENT_I18N[lang][r.id] = CONTENT_I18N[lang][r.id] || {};
        CONTENT_I18N[lang][r.id].symptoms = symptoms.length ? symptoms : undefined;
        CONTENT_I18N[lang][r.id].manage = manage.length ? manage : undefined;
    }
    d.chemical = r.chemical;
    d.dose = r.dose_per_10l;
    d.maxDose = r.max_dose_per_10l;
}

async function loadDiseasesFromApi() {
    try {
        const data = await AgriAPI.get("/api/diseases");
        data.diseases.forEach(applyDiseaseRecord);
        return true;
    } catch (e) {
        return false;                            // offline: keep the built-in data
    }
}