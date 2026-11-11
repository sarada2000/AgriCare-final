/* AgriCare – farm data for the Weather, Varieties and My Crop pages.
   Variety facts are from the Rice Research & Development Institute, Department of Agriculture Sri Lanka
   (doa.gov.lk, rrdi_rice_* pages). Usage figures: DOA "Rice Varietal Distribution in Sri Lanka 2015". */

/* ---------- Districts ---------- */
// zone: dry / intermediate / wet. hill: mid or up country. saline: coastal saline fields are common.
// iron: iron-toxic (bog / poorly drained) wet zone fields are common.
const AGRI_DISTRICTS = [
    { id: "Ampara", si: "අම්පාර", ta: "அம்பாறை", lat: 7.2975, lng: 81.6820, zone: "dry", saline: true },
    { id: "Anuradhapura", si: "අනුරාධපුර", ta: "அனுராதபுரம்", lat: 8.3114, lng: 80.4037, zone: "dry" },
    { id: "Badulla", si: "බදුල්ල", ta: "பதுளை", lat: 6.9934, lng: 81.0550, zone: "intermediate", hill: true },
    { id: "Batticaloa", si: "මඩකලපුව", ta: "மட்டக்களப்பு", lat: 7.7310, lng: 81.6747, zone: "dry", saline: true },
    { id: "Colombo", si: "කොළඹ", ta: "கொழும்பு", lat: 6.9271, lng: 79.8612, zone: "wet", iron: true },
    { id: "Galle", si: "ගාල්ල", ta: "காலி", lat: 6.0535, lng: 80.2210, zone: "wet", iron: true, saline: true },
    { id: "Gampaha", si: "ගම්පහ", ta: "கம்பஹா", lat: 7.0873, lng: 79.9990, zone: "wet", iron: true },
    { id: "Hambantota", si: "හම්බන්තොට", ta: "அம்பாந்தோட்டை", lat: 6.1241, lng: 81.1185, zone: "dry", saline: true },
    { id: "Jaffna", si: "යාපනය", ta: "யாழ்ப்பாணம்", lat: 9.6615, lng: 80.0255, zone: "dry", saline: true },
    { id: "Kalutara", si: "කළුතර", ta: "களுத்துறை", lat: 6.5854, lng: 79.9607, zone: "wet", iron: true, saline: true },
    { id: "Kandy", si: "මහනුවර", ta: "கண்டி", lat: 7.2906, lng: 80.6337, zone: "wet", hill: true },
    { id: "Kegalle", si: "කෑගල්ල", ta: "கேகாலை", lat: 7.2513, lng: 80.3464, zone: "wet", iron: true },
    { id: "Kilinochchi", si: "කිලිනොච්චිය", ta: "கிளிநொச்சி", lat: 9.3803, lng: 80.3770, zone: "dry", saline: true },
    { id: "Kurunegala", si: "කුරුණෑගල", ta: "குருநாகல்", lat: 7.4818, lng: 80.3609, zone: "intermediate" },
    { id: "Mannar", si: "මන්නාරම", ta: "மன்னார்", lat: 8.9810, lng: 79.9044, zone: "dry", saline: true },
    { id: "Matale", si: "මාතලේ", ta: "மாத்தளை", lat: 7.4675, lng: 80.6234, zone: "intermediate" },
    { id: "Matara", si: "මාතර", ta: "மாத்தறை", lat: 5.9549, lng: 80.5550, zone: "wet", iron: true },
    { id: "Monaragala", si: "මොණරාගල", ta: "மொனராகலை", lat: 6.8728, lng: 81.3507, zone: "intermediate" },
    { id: "Mullaitivu", si: "මුලතිව්", ta: "முல்லைத்தீவு", lat: 9.2671, lng: 80.8142, zone: "dry" },
    { id: "Nuwara Eliya", si: "නුවරඑළිය", ta: "நுவரெலியா", lat: 6.9497, lng: 80.7891, zone: "wet", hill: true },
    { id: "Polonnaruwa", si: "පොළොන්නරුව", ta: "பொலன்னறுவை", lat: 7.9403, lng: 81.0188, zone: "dry" },
    { id: "Puttalam", si: "පුත්තලම", ta: "புத்தளம்", lat: 8.0362, lng: 79.8283, zone: "dry", saline: true },
    { id: "Ratnapura", si: "රත්නපුර", ta: "இரத்தினபுரி", lat: 6.6828, lng: 80.3992, zone: "wet", iron: true },
    { id: "Trincomalee", si: "ත්‍රිකුණාමලය", ta: "திருகோணமலை", lat: 8.5874, lng: 81.2152, zone: "dry", saline: true },
    { id: "Vavuniya", si: "වවුනියාව", ta: "வவுனியா", lat: 8.7514, lng: 80.4971, zone: "dry" }
];

function districtName(d) {
    const lang = getLanguage();
    return (lang !== "en" && d[lang]) || d.id;
}
function findDistrict(id) { return AGRI_DISTRICTS.find(d => d.id === id) || null; }
function nearestDistrict(lat, lng) {
    let best = null, bd = Infinity;
    AGRI_DISTRICTS.forEach(d => { const k = (d.lat - lat) ** 2 + (d.lng - lng) ** 2; if (k < bd) { bd = k; best = d; } });
    return best;
}
/* The farmer's district: from the profile, the last chosen one, or Polonnaruwa */
function myDistrictId() {
    const chosen = AgriStore.get("agricare_district");
    if (chosen && findDistrict(chosen)) return chosen;
    try {
        const u = JSON.parse(AgriStore.get("agricare_user_json") || "null");
        if (u && u.district && findDistrict(u.district)) return u.district;
    } catch (e) {}
    return "Polonnaruwa";
}
function fillDistrictSelect(sel, selected) {
    sel.innerHTML = "";
    AGRI_DISTRICTS.forEach(d => {
        const o = document.createElement("option");
        o.value = d.id; o.textContent = districtName(d);
        if (d.id === selected) o.selected = true;
        sel.appendChild(o);
    });
}

const ZONE_INFO = {
    dry: { rain: "below 1,750 mm", rainSi: "මි.මී. 1,750ට අඩු", rainTa: "1,750 மி.மீ. க்குக் குறைவு" },
    intermediate: { rain: "1,750 – 2,500 mm", rainSi: "මි.මී. 1,750 – 2,500", rainTa: "1,750 – 2,500 மி.மீ." },
    wet: { rain: "above 2,500 mm", rainSi: "මි.මී. 2,500ට වැඩි", rainTa: "2,500 மி.மீ. க்கு மேல்" }
};

/* ---------- Rice varieties (DOA / RRDI) ---------- */
// days = [min, max]; grain: sr = short round (samba), ib = intermediate bold (nadu), lm = long medium.
// res: R resistant, MR moderately resistant, MS moderately susceptible, S susceptible, "" not stated.
const VARIETIES = [
    { id: "Bg 250", days: [85, 85], red: false, grain: "ib", yield: 4.5, year: 2005, res: { blast: "MR", blb: "MR", gm: "MR", bph: "R" }, use: "escape" },
    { id: "Bg 300", days: [93, 93], red: false, grain: "ib", yield: 5.0, year: 1987, res: { blast: "MR", blb: "MR", gm: "R", bph: "MR" }, use: "general" },
    { id: "At 308", days: [95, 95], red: false, grain: "sr", yield: 6.5, year: null, res: { blast: "R", blb: "MS", gm: "MR", bph: "MS" }, use: "general" },
    { id: "At 354", days: [95, 95], red: false, grain: "lm", yield: 6.5, year: 1992, res: { blast: "MS", blb: "S", gm: "MR", bph: "MR" }, use: "saline" },
    { id: "At 307", days: [97, 97], red: false, grain: "ib", yield: 7.0, year: 2005, res: { blast: "R", blb: "MS", gm: "R", bph: "R" }, use: "general" },
    { id: "Bg 366", days: [97, 100], red: false, grain: "ib", yield: 6.0, year: 2009, res: { blast: "MR", blb: "MR", gm: "MR", bph: "" }, use: "general" },
    { id: "Bg 352", days: [98, 102], red: false, grain: "ib", yield: 4.9, year: 1992, res: { blast: "MR", blb: "MR", gm: "", bph: "MR" }, use: "general", popular: 18.7 },
    { id: "Ld 365", days: [102, 102], red: true, grain: "sr", yield: 4.5, year: 2008, res: { blast: "MR", blb: "MS", gm: "MR", bph: "MR" }, use: "wet" },
    { id: "Bg 357", days: [103, 105], red: false, grain: "lm", yield: 5.8, year: 1997, res: { blast: "MR/MS", blb: "MR", gm: "R", bph: "MR" }, use: "general" },
    { id: "Bg 358", days: [103, 105], red: false, grain: "sr", yield: 4.8, year: 1999, res: { blast: "S", blb: "MR", gm: "", bph: "MR" }, use: "general" },
    { id: "Bg 359", days: [103, 105], red: false, grain: "ib", yield: 5.9, year: 1999, res: { blast: "MS", blb: "MR", gm: "R", bph: "MR" }, use: "wet" },
    { id: "Bg 360", days: [103, 106], red: false, grain: "sr", yield: 4.2, year: 1999, res: { blast: "S", blb: "MR", gm: "R", bph: "MR" }, use: "general", nick: "Keeri samba" },
    { id: "Bg 94-1", days: [105, 105], red: false, grain: "lm", yield: 4.1, year: 1975, res: { blast: "MR", blb: "MS", gm: "S", bph: "S" }, use: "general" },
    { id: "Bw 361", days: [105, 105], red: true, grain: "ib", yield: 4.5, year: 2002, res: { blast: "", blb: "MR", gm: "R/MR", bph: "MR" }, use: "iron" },
    { id: "Bw 367", days: [105, 105], red: false, grain: "sr", yield: 5.2, year: 2011, res: { blast: "R/MR", blb: "MR/MS", gm: "MR/MS", bph: "R/MR" }, use: "iron" },
    { id: "At 362", days: [110, 110], red: true, grain: "lm", yield: 7.0, year: 2002, res: { blast: "MR/MS", blb: "MR/MS", gm: "R/MR", bph: "R/MR" }, use: "general", popular: 12.4 },
    { id: "Bg 379-2", days: [132, 132], red: false, grain: "ib", yield: 6.1, year: 1980, res: { blast: "MR", blb: "MR", gm: "", bph: "MR" }, use: "general", nick: "Yakada marang" }
];
VARIETIES.find(v => v.id === "Bg 300").popular = 15.6;

function varietyAge(v) { return Math.round((v.days[0] + v.days[1]) / 2); }
function ageGroup(v) {
    const d = varietyAge(v);
    return d <= 90 ? "2.5" : d <= 100 ? "3" : d <= 115 ? "3.5" : "4";
}

/* Best varieties for a district, best first (by zone, soil problems and usage) */
function recommendVarieties(d) {
    const pick = ids => ids.map(id => VARIETIES.find(v => v.id === id)).filter(Boolean);
    let list;
    if (d.zone === "dry") list = pick(["Bg 352", "Bg 300", "At 362", "Bg 366", "At 307", "Bg 358", "Bg 250", "Bg 379-2"]);
    else if (d.zone === "intermediate") list = pick(["Bg 352", "Bg 358", "At 307", "Bg 300", "Bg 94-1", "At 308", "Bg 357", "Bg 366"]);
    else list = pick(["Bg 359", "Bg 300", "Ld 365", "Bg 358", "At 307", "At 362", "Bg 366"]);
    const extra = [];
    if (d.iron) extra.push(...pick(["Bw 367", "Bw 361"]));
    if (d.saline) extra.push(...pick(["At 354"]));
    return { main: list, special: extra };
}

/* ---------- Crop stages (from sowing date and variety age) ---------- */
// Rice: ripening ≈ 30 days (flowering → harvest); reproductive ≈ 35 days (panicle start → flowering).
function cropStages(ageDays) {
    const flower = ageDays - 30;
    const pi = Math.max(30, flower - 35);
    return [
        { id: "establish", from: 0, to: 14 },
        { id: "tiller", from: 15, to: pi - 1 },
        { id: "panicle", from: pi, to: flower - 1 },
        { id: "flower", from: flower, to: flower + 14 },
        { id: "ripen", from: flower + 15, to: ageDays - 1 },
        { id: "harvest", from: ageDays, to: ageDays + 7 }
    ];
}
/* Key dated jobs */
function cropJobs(ageDays) {
    const flower = ageDays - 30, pi = Math.max(30, flower - 35);
    return [
        { day: 0, key: "job_basal" },
        { day: 3, key: "job_weed" },
        { day: 14, key: "job_td1" },
        { day: 28, key: "job_td2" },
        { day: pi, key: "job_td3" },
        { day: flower - 7, key: "job_water" },
        { day: flower, key: "job_flower" },
        { day: ageDays - 14, key: "job_drain" },
        { day: ageDays, key: "job_harvest" }
    ].sort((a, b) => a.day - b.day);
}

/* ---------- Text (3 languages) ---------- */
Object.assign(translations.en, {
    w_off_title: "Live forecast not available right now",
    w_off_text: "The forecast needs internet. Here is the advice for this time of the year in your district. Press Try again when you are online.",
    w_retry: "↻ Try again", w_off_now: "What to do this month",
    off_sow_maha: "Maha sowing time. Prepare the land and sow when the monsoon rain starts. Make field drains ready for heavy rain.",
    off_grow_maha: "Maha crop is growing. Give urea top-dressings on time. After rainy, cool weeks, check the leaves for blast and leaf blight.",
    off_harv_maha: "Maha harvest time. Drain the field 10–14 days before harvest. Dry the grain well before storing.",
    off_sow_yala: "Yala sowing time. Sow only the area your water can cover and choose a short-duration variety (3 – 3½ months).",
    off_grow_yala: "Yala crop is growing. Keep 2–5 cm water in the field. In hot, dry weeks watch for brown planthopper and thrips.",
    off_harv_yala: "Yala harvest time. Drain the field 10–14 days before harvest and prepare the land for the next Maha season.",
    off_zone_dry: "Dry zone: most rain comes in Maha, so plan Yala by the water in your tank.",
    off_zone_intermediate: "Intermediate zone: both seasons are possible; Yala needs a reliable water source.",
    off_zone_wet: "Wet zone: rain in both seasons – keep drains clear and watch for blast and leaf blight.",
    // weather
    w_title: "Weather & Climate", w_lead: "7-day forecast for your field, with farming advice for each day.",
    w_use_loc: "📍 My location", w_district: "District", w_loading: "Loading the forecast...",
    w_error: "Could not load the forecast. Check your internet connection and try again.",
    w_now: "Now", w_today: "Today", w_rain: "Rain", w_chance: "chance", w_humidity: "Humidity", w_wind: "Wind",
    w_advice: "Farm advice", w_week: "Next 7 days", w_updated: "Updated",
    w_climate: "Climate of this district", w_zone: "Zone", w_annual_rain: "Yearly rainfall",
    zone_dry: "Dry zone", zone_intermediate: "Intermediate zone", zone_wet: "Wet zone", w_hill: "mid/up country",
    w_seasons: "Paddy seasons",
    w_maha: "Maha season: sow around October–November with the north-east monsoon rains; harvest around February–March. The main season in the dry zone.",
    w_yala: "Yala season: sow around April–May; harvest around August–September. Plant only the area your tank or canal water can cover.",
    adv_rain_spray: "Rain expected – do not spray or apply urea today. It will be washed away.",
    adv_heavy: "Heavy rain – open the drains, strengthen bunds, and after the rain check for bacterial leaf blight.",
    adv_blast: "Blast risk – cool nights and very humid air. Check leaves for grey spindle-shaped spots; if you see them, spray tricyclazole on a dry morning.",
    adv_dry: "Dry spell – keep 2–5 cm of water in the field. Young crops: watch for thrips (rolled leaf tips).",
    adv_hot: "Very hot – keep water in the field, especially at flowering.",
    adv_wind: "Strong wind – do not spray today.",
    adv_spray_ok: "Good day to spray or apply fertilizer – best in the early morning.",
    adv_bph: "Hot and humid with standing water – check the base of the plants for brown planthopper.",
    // varieties
    v_title: "Paddy Varieties", v_lead: "Department of Agriculture rice varieties, with the best choices for your district.",
    v_for: "Best for", v_special: "For problem fields", v_all: "All varieties", v_age: "Age", v_days: "days",
    v_months: "months", v_yield: "Average yield", v_tha: "t/ha", v_grain: "Grain", v_red: "Red rice", v_white: "White rice",
    g_sr: "Short round (samba)", g_ib: "Intermediate bold (nadu)", g_lm: "Long medium",
    r_blast: "Blast", r_blb: "Leaf blight", r_gm: "Gall midge", r_bph: "Brown planthopper",
    rl_R: "Resistant", rl_MR: "Mod. resistant", rl_MS: "Mod. susceptible", rl_S: "Susceptible",
    use_general: "General cultivation", use_wet: "Wet zone", use_iron: "Iron-toxic (bog) soils", use_saline: "Saline coastal fields",
    use_escape: "Drought/flood-prone fields (short escape crop)",
    v_popular: "of Sri Lanka's paddy land", v_filter_age: "Age", v_filter_colour: "Colour", v_any: "Any",
    v_iron_note: "Many low-lying fields here have iron toxicity (orange water, bronze leaves). Grow Bw 367 or Bw 361 in those fields.",
    v_saline_note: "Coastal fields here can be salty. In salty fields grow At 354.",
    v_tip_water: "Not sure of water till harvest? Choose a shorter variety (3 months or less).",
    v_tip_blast: "Blast is common in your area? Avoid Bg 358 and Bg 360 (susceptible) – choose At 307, At 308 or Bg 352.",
    v_use_crop: "Use in My Crop", v_source: "Source: Rice Research & Development Institute, Department of Agriculture (doa.gov.lk). Usage: DOA varietal survey 2015.",
    // my crop
    c_title: "My Crop", c_lead: "Tell AgriCare when you sowed. It shows your crop's stage and exactly what to do this week.",
    c_variety: "Variety", c_sowed: "Sowing date", c_field: "Field name", c_save: "Show my crop calendar",
    c_day: "Day", c_dayof: "of {n} days", w_loc_denied: "Location is off or blocked. Choose your district instead.", c_stage_now: "Stage now", c_this_week: "This week", c_calendar: "Crop calendar",
    c_harvest_on: "Expected harvest", c_days_left: "days to harvest", c_edit: "Change", c_not_sown: "Sowing date is in the future.",
    st_establish: "Establishment", st_tiller: "Tillering", st_panicle: "Panicle forming", st_flower: "Flowering", st_ripen: "Ripening", st_harvest: "Harvest",
    do_establish: ["Keep 2–5 cm of water once seedlings are 3–4 days old.", "Control weeds in the first 2 weeks – the most important weeding time.", "Fill gaps with extra seedlings before day 14.", "Watch for thrips in dry weather (rolled, dry leaf tips): flood the field."],
    do_tiller: ["Apply urea top-dressings on time (see the calendar). Do not apply extra urea.", "Keep a shallow water level; alternate wetting and drying is fine.", "Every week: check for blast spots, gall midge silver shoots and brown planthopper at the base.", "Keep bunds clean of weeds – rats and pests hide there."],
    do_panicle: ["Last urea top-dressing at the start of this stage.", "Keep about 5 cm of water – never let the field dry now.", "Watch for stem borer deadhearts, leaf folder and sheath blight.", "If blast is in your area, protect the crop now – neck blast comes next."],
    do_flower: ["Keep water in the field – dry soil now means empty grains.", "Do not spray during flowering hours (late morning).", "Watch for paddy bugs (bad smell, empty grains) and birds."],
    do_ripen: ["Drain the field 10–14 days before harvest.", "Guard against birds and rats.", "Prepare clean bags, tarpaulin and a drying place."],
    do_harvest: ["Harvest when 80–85% of the grains on the panicle are golden.", "Thresh soon after cutting.", "Dry the paddy to 14% moisture before storing."],
    job_basal: "Basal fertilizer (TSP + MOP) at sowing, as in the DOA recommendation for your variety age",
    job_weed: "Weed control – apply a pre-emergence weedicide (see the Weeds page) or hand weed",
    job_td1: "1st urea top-dressing",
    job_td2: "2nd urea top-dressing (with MOP if recommended)",
    job_td3: "Last urea top-dressing – panicle forming starts",
    job_water: "Keep 5 cm water – flowering in one week",
    job_flower: "Flowering – keep water, no spraying in late morning",
    job_drain: "Drain the field",
    job_harvest: "Harvest (80–85% golden grains)",
    c_gcal: "Add to Google Calendar"
});

Object.assign(translations.si, {
    w_off_title: "සජීවී කාලගුණ අනාවැකිය දැන් ලබාගත නොහැක",
    w_off_text: "අනාවැකියට අන්තර්ජාලය අවශ්‍යයි. ඔබේ දිස්ත්‍රික්කයට වසරේ මේ කාලයට උපදෙස් පහතින්. අන්තර්ජාලය ඇති විට \"නැවත උත්සාහ කරන්න\" ඔබන්න.",
    w_retry: "↻ නැවත උත්සාහ කරන්න", w_off_now: "මේ මාසයේ කළ යුතු දේ",
    off_sow_maha: "මහ කන්නයේ වපුරන කාලයයි. මෝසම් වැසි ඇරඹෙන විට බිම සකස් කර වපුරන්න. තද වැස්සට කුඹුරේ කාණු සූදානම් කරන්න.",
    off_grow_maha: "මහ වගාව වැඩෙමින් පවතී. යූරියා මතුපිට පොහොර නියමිත දිනට යොදන්න. වැසි සහිත, සීතල සති වලින් පසු කොළ පාලු සහ කොළ අංගමාරය සඳහා පරීක්ෂා කරන්න.",
    off_harv_maha: "මහ කන්නයේ අස්වනු නෙළන කාලයයි. අස්වැන්නට දින 10–14කට පෙර කුඹුරෙන් ජලය බැස යවන්න. ගබඩා කිරීමට පෙර වී හොඳින් වියළන්න.",
    off_sow_yala: "යල කන්නයේ වපුරන කාලයයි. ඔබේ ජලයෙන් ආවරණය කළ හැකි ප්‍රමාණය පමණක් වපුරා කෙටි කාලීන (මාස 3 – 3½) ප්‍රභේදයක් තෝරන්න.",
    off_grow_yala: "යල වගාව වැඩෙමින් පවතී. කුඹුරේ සෙ.මී. 2–5 ජලය තබාගන්න. උණුසුම්, වියළි සතිවල දුඹුරු පැල කීඩෑවා සහ තිරිප්ස් ගැන විමසිලිමත් වන්න.",
    off_harv_yala: "යල කන්නයේ අස්වනු නෙළන කාලයයි. අස්වැන්නට දින 10–14කට පෙර ජලය බැස යවා ඊළඟ මහ කන්නයට බිම සකස් කරන්න.",
    off_zone_dry: "වියළි කලාපය: වැඩිපුර වැසි ලැබෙන්නේ මහ කන්නයේදීය, එබැවින් යල වගාව වැවේ ජලය අනුව සැලසුම් කරන්න.",
    off_zone_intermediate: "අතරමැදි කලාපය: කන්න දෙකම කළ හැකිය; යල සඳහා විශ්වාසදායක ජල මූලාශ්‍රයක් අවශ්‍යයි.",
    off_zone_wet: "තෙත් කලාපය: කන්න දෙකේම වැසි ලැබේ – කාණු පිරිසිදුව තබා පාලු සහ කොළ අංගමාරය ගැන විමසිලිමත් වන්න.",
    w_title: "කාලගුණය සහ දේශගුණය", w_lead: "ඔබේ කුඹුර සඳහා දින 7ක කාලගුණ අනාවැකිය, සෑම දිනකටම ගොවිතැන් උපදෙස් සමඟ.",
    w_use_loc: "📍 මගේ ස්ථානය", w_district: "දිස්ත්‍රික්කය", w_loading: "කාලගුණ අනාවැකිය ලබාගනිමින්...",
    w_error: "කාලගුණ අනාවැකිය ලබාගත නොහැකි විය. අන්තර්ජාල සම්බන්ධතාව පරීක්ෂා කර නැවත උත්සාහ කරන්න.",
    w_now: "දැන්", w_today: "අද", w_rain: "වැසි", w_chance: "අවස්ථාව", w_humidity: "ආර්ද්‍රතාව", w_wind: "සුළඟ",
    w_advice: "ගොවිතැන් උපදෙස්", w_week: "ඉදිරි දින 7", w_updated: "යාවත්කාලීන කළේ",
    w_climate: "මෙම දිස්ත්‍රික්කයේ දේශගුණය", w_zone: "කලාපය", w_annual_rain: "වාර්ෂික වර්ෂාපතනය",
    zone_dry: "වියළි කලාපය", zone_intermediate: "අතරමැදි කලාපය", zone_wet: "තෙත් කලාපය", w_hill: "මැද/උඩරට",
    w_seasons: "වී වගා කන්න",
    w_maha: "මහ කන්නය: ඊසාන දිග මෝසම් වැසි සමඟ ඔක්තෝබර්–නොවැම්බර් පමණ වපුරන්න; පෙබරවාරි–මාර්තු පමණ අස්වනු නෙළන්න. වියළි කලාපයේ ප්‍රධාන කන්නයයි.",
    w_yala: "යල කන්නය: අප්‍රේල්–මැයි පමණ වපුරන්න; අගෝස්තු–සැප්තැම්බර් පමණ අස්වනු නෙළන්න. ඔබේ වැවේ හෝ ඇළේ ජලයෙන් ආවරණය කළ හැකි ප්‍රමාණය පමණක් වගා කරන්න.",
    adv_rain_spray: "වැසි අපේක්ෂිතයි – අද ඉසීම හෝ යූරියා යෙදීම නොකරන්න. එය සේදී යයි.",
    adv_heavy: "තද වැසි – කාණු විවෘත කර නියර ශක්තිමත් කරන්න; වැස්සෙන් පසු බැක්ටීරියා කොළ අංගමාරය ඇත්දැයි බලන්න.",
    adv_blast: "පාළුව අවදානම – සීතල රාත්‍රී සහ ඉතා තෙත් වාතය. කොළවල අළු දිගටි පුල්ලි ඇත්දැයි බලන්න; දුටුවහොත් වියළි උදෑසනක ට්‍රයිසයික්ලසෝල් (tricyclazole) ඉසින්න.",
    adv_dry: "වියළි කාලය – කුඹුරේ සෙ.මී. 2–5 ජලය තබාගන්න. ළපටි බෝගවල තිරිප්ස් (රෝල් වූ කොළ අග) ගැන සැලකිලිමත් වන්න.",
    adv_hot: "ඉතා උණුසුම් – විශේෂයෙන් මල් පිපෙන කාලයේ කුඹුරේ ජලය තබාගන්න.",
    adv_wind: "තද සුළඟ – අද නොඉසින්න.",
    adv_spray_ok: "ඉසීමට හෝ පොහොර යෙදීමට හොඳ දිනයකි – උදෑසන වඩාත් සුදුසුයි.",
    adv_bph: "උණුසුම්, තෙත් සහ ජලය රැඳී ඇත – පැළ පාමුල දුඹුරු පැල කීඩෑවා ඇත්දැයි බලන්න.",
    v_title: "වී වර්ග", v_lead: "කෘෂිකර්ම දෙපාර්තමේන්තුවේ වී වර්ග, ඔබේ දිස්ත්‍රික්කයට හොඳම තේරීම් සමඟ.",
    v_for: "වඩාත් සුදුසු", v_special: "ගැටලු සහිත කුඹුරු සඳහා", v_all: "සියලු වී වර්ග", v_age: "වයස", v_days: "දින",
    v_months: "මාස", v_yield: "සාමාන්‍ය අස්වැන්න", v_tha: "ටො/හෙ", v_grain: "ඇටය", v_red: "රතු සහල්", v_white: "සුදු සහල්",
    g_sr: "කෙටි රවුම් (සම්බා)", g_ib: "මධ්‍යම තද (නාඩු)", g_lm: "දිගු මධ්‍යම",
    r_blast: "පාළුව", r_blb: "කොළ අංගමාරය", r_gm: "ගොබ මැස්සා", r_bph: "දුඹුරු පැල කීඩෑවා",
    rl_R: "ප්‍රතිරෝධී", rl_MR: "මධ්‍යම ප්‍රතිරෝධී", rl_MS: "මධ්‍යම ලක්විය හැකි", rl_S: "ලක්විය හැකි",
    use_general: "සාමාන්‍ය වගාව", use_wet: "තෙත් කලාපය", use_iron: "යකඩ විෂ (මඩ) පස", use_saline: "ලවණ සහිත වෙරළබඩ කුඹුරු",
    use_escape: "නියඟ/ගංවතුර අවදානම් කුඹුරු (කෙටිකාලීන බෝගය)",
    v_popular: "ශ්‍රී ලංකාවේ කුඹුරු බිමෙන්", v_filter_age: "වයස", v_filter_colour: "වර්ණය", v_any: "ඕනෑම",
    v_iron_note: "මෙහි බොහෝ පහත් කුඹුරුවල යකඩ විෂ ඇත (තැඹිලි පැහැ ජලය, තඹ පැහැ කොළ). එවැනි කුඹුරුවල Bw 367 හෝ Bw 361 වගා කරන්න.",
    v_saline_note: "මෙහි වෙරළබඩ කුඹුරු ලවණ සහිත විය හැක. ලවණ සහිත කුඹුරුවල At 354 වගා කරන්න.",
    v_tip_water: "අස්වනු නෙළන තුරු ජලය ගැන විශ්වාස නැද්ද? කෙටි වයසේ වී වර්ගයක් (මාස 3 හෝ අඩු) තෝරන්න.",
    v_tip_blast: "ඔබේ ප්‍රදේශයේ පාළුව බහුලද? Bg 358 සහ Bg 360 (ලක්විය හැකි) වළක්වා At 307, At 308 හෝ Bg 352 තෝරන්න.",
    v_use_crop: "මගේ වගාවට යොදන්න", v_source: "මූලාශ්‍රය: වී පර්යේෂණ හා සංවර්ධන ආයතනය, කෘෂිකර්ම දෙපාර්තමේන්තුව (doa.gov.lk). භාවිතය: කෘ.දෙ. වී වර්ග සමීක්ෂණය 2015.",
    c_title: "මගේ වගාව", c_lead: "ඔබ වැපිරූ දිනය AgriCare ට කියන්න. ඔබේ බෝගයේ අවධිය සහ මේ සතියේ කළ යුතු දේ හරියටම පෙන්වයි.",
    c_variety: "වී වර්ගය", c_sowed: "වැපිරූ දිනය", c_field: "කුඹුරේ නම", c_save: "මගේ වගා දින දර්ශනය පෙන්වන්න",
    c_day: "දිනය", c_dayof: "දින {n}න්", w_loc_denied: "ස්ථාන සේවාව අක්‍රියයි හෝ අවහිරයි. ඒ වෙනුවට දිස්ත්‍රික්කය තෝරන්න.", c_stage_now: "දැන් අවධිය", c_this_week: "මේ සතිය", c_calendar: "වගා දින දර්ශනය",
    c_harvest_on: "අපේක්ෂිත අස්වනු දිනය", c_days_left: "අස්වනු නෙළීමට දින", c_edit: "වෙනස් කරන්න", c_not_sown: "වැපිරීමේ දිනය අනාගතයේය.",
    st_establish: "පැළ ස්ථාපිත වීම", st_tiller: "පඳුරු දැමීම", st_panicle: "කරල් හටගැනීම", st_flower: "මල් පිපීම", st_ripen: "ඉදීම", st_harvest: "අස්වනු",
    do_establish: ["පැළ දින 3–4 වූ පසු සෙ.මී. 2–5 ජලය තබාගන්න.", "පළමු සති 2 තුළ වල් පැළ පාලනය කරන්න – වැදගත්ම වල් නෙළන කාලයයි.", "දින 14ට පෙර හිස් තැන් අමතර පැළවලින් පුරවන්න.", "වියළි කාලයේ තිරිප්ස් (රෝල් වූ, වියළි කොළ අග) ගැන බලන්න: කුඹුරට ජලය බඳින්න."],
    do_tiller: ["නියමිත වේලාවට යූරියා මතුපිට පොහොර යොදන්න (දින දර්ශනය බලන්න). අමතර යූරියා නොයොදන්න.", "නොගැඹුරු ජල මට්ටමක් තබාගන්න; මාරුවෙන් මාරුවට තෙත් කිරීම හා වියළීම සුදුසුයි.", "සෑම සතියකම: පාළුව පුල්ලි, ගොබ මැස්සාගේ රිදී දළු සහ පාමුල දුඹුරු පැල කීඩෑවා පරීක්ෂා කරන්න.", "නියර වල් පැළවලින් තොරව තබාගන්න – මීයන් සහ පළිබෝධකයන් එහි සැඟවේ."],
    do_panicle: ["මෙම අවධිය ආරම්භයේ අවසාන යූරියා මතුපිට පොහොර යොදන්න.", "සෙ.මී. 5ක් පමණ ජලය තබාගන්න – දැන් කුඹුර කිසි විටෙක වියළීමට ඉඩ නොදෙන්න.", "කඳ පණුවාගේ මළ දළු, කොළ හකුළන දළඹුවා සහ කොපු අංගමාරය ගැන බලන්න.", "ඔබේ ප්‍රදේශයේ පාළුව ඇත්නම් දැන් බෝගය ආරක්ෂා කරන්න – ඊළඟට බෙල්ලේ පාළුව එයි."],
    do_flower: ["කුඹුරේ ජලය තබාගන්න – දැන් පස වියළීමෙන් ඇට හිස් වේ.", "මල් පිපෙන වේලාවේ (උදේ අග) නොඉසින්න.", "වී මකුණන් (නරක ගඳ, හිස් ඇට) සහ කුරුල්ලන් ගැන බලන්න."],
    do_ripen: ["අස්වනු නෙළීමට දින 10–14කට පෙර කුඹුරේ ජලය බැස යවන්න.", "කුරුල්ලන්ගෙන් සහ මීයන්ගෙන් ආරක්ෂා කරන්න.", "පිරිසිදු මලු, තාප්පාල් සහ වියළන ස්ථානයක් සූදානම් කරන්න."],
    do_harvest: ["කරලේ ඇටවලින් 80–85%ක් රන්වන් වූ විට අස්වනු නෙළන්න.", "කැපූ විගස පාගන්න.", "ගබඩා කිරීමට පෙර වී 14% තෙතමනයට වියළන්න."],
    job_basal: "වැපිරීමේදී මූලික පොහොර (TSP + MOP), ඔබේ වී වර්ගයේ වයසට කෘ.දෙ. නිර්දේශය පරිදි",
    job_weed: "වල් පාලනය – පූර්ව-පැළවීමේ වල් නාශකයක් යොදන්න හෝ අතින් වල් නෙළන්න",
    job_td1: "1 වන යූරියා මතුපිට පොහොර",
    job_td2: "2 වන යූරියා මතුපිට පොහොර (නිර්දේශිත නම් MOP සමඟ)",
    job_td3: "අවසාන යූරියා මතුපිට පොහොර – කරල් හටගැනීම ආරම්භ වේ",
    job_water: "සෙ.මී. 5 ජලය තබාගන්න – සතියකින් මල් පිපේ",
    job_flower: "මල් පිපීම – ජලය තබාගන්න, උදේ අග නොඉසින්න",
    job_drain: "කුඹුරේ ජලය බැස යවන්න",
    job_harvest: "අස්වනු නෙළීම (ඇට 80–85% රන්වන්)",
    c_gcal: "Google Calendar ට එක් කරන්න"
});

Object.assign(translations.ta, {
    w_off_title: "நேரடி முன்னறிவிப்பு இப்போது கிடைக்கவில்லை",
    w_off_text: "முன்னறிவிப்புக்கு இணையம் தேவை. உங்கள் மாவட்டத்துக்கான இந்தப் பருவ ஆலோசனை கீழே உள்ளது. இணையம் இருக்கும்போது \"மீண்டும் முயலுங்கள்\" அழுத்துங்கள்.",
    w_retry: "↻ மீண்டும் முயலுங்கள்", w_off_now: "இந்த மாதம் செய்ய வேண்டியவை",
    off_sow_maha: "பெரும்போக விதைப்புக் காலம். பருவமழை தொடங்கும்போது நிலத்தைத் தயார் செய்து விதையுங்கள். கனமழைக்காக வயல் வடிகால்களைத் தயார் செய்யுங்கள்.",
    off_grow_maha: "பெரும்போகப் பயிர் வளர்கிறது. யூரியா மேலுரத்தை உரிய நேரத்தில் இடுங்கள். மழையும் குளிரும் உள்ள வாரங்களுக்குப் பின் குலை நோய், இலைக் கருகல் உள்ளதா எனப் பாருங்கள்.",
    off_harv_maha: "பெரும்போக அறுவடைக் காலம். அறுவடைக்கு 10–14 நாள் முன் வயலிலிருந்து நீரை வடியுங்கள். சேமிக்கும் முன் நெல்லை நன்கு உலர்த்துங்கள்.",
    off_sow_yala: "சிறுபோக விதைப்புக் காலம். உங்கள் நீர் போதுமான அளவு பரப்பில் மட்டும் விதைத்து, குறுகிய கால (3 – 3½ மாத) இனத்தைத் தேர்ந்தெடுங்கள்.",
    off_grow_yala: "சிறுபோகப் பயிர் வளர்கிறது. வயலில் 2–5 செ.மீ. நீர் வையுங்கள். வெப்பமான, வறண்ட வாரங்களில் பழுப்புத் தத்துப்பூச்சி, இலைப்பேன் பற்றி கவனமாக இருங்கள்.",
    off_harv_yala: "சிறுபோக அறுவடைக் காலம். அறுவடைக்கு 10–14 நாள் முன் நீரை வடித்து, அடுத்த பெரும்போகத்துக்கு நிலத்தைத் தயார் செய்யுங்கள்.",
    off_zone_dry: "உலர் வலயம்: பெரும்பாலான மழை பெரும்போகத்தில் கிடைக்கும், எனவே சிறுபோகத்தைக் குள நீருக்கேற்ப திட்டமிடுங்கள்.",
    off_zone_intermediate: "இடை வலயம்: இரு போகங்களும் சாத்தியம்; சிறுபோகத்துக்கு நம்பகமான நீர் ஆதாரம் தேவை.",
    off_zone_wet: "ஈர வலயம்: இரு போகங்களிலும் மழை – வடிகால்களைச் சுத்தமாக வைத்து, குலை நோய், இலைக் கருகல் பற்றி கவனமாக இருங்கள்.",
    w_title: "வானிலையும் காலநிலையும்", w_lead: "உங்கள் வயலுக்கான 7 நாள் வானிலை முன்னறிவிப்பு, ஒவ்வொரு நாளுக்கும் விவசாய ஆலோசனையுடன்.",
    w_use_loc: "📍 எனது இருப்பிடம்", w_district: "மாவட்டம்", w_loading: "முன்னறிவிப்பைப் பெறுகிறது...",
    w_error: "முன்னறிவிப்பைப் பெற முடியவில்லை. இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயலுங்கள்.",
    w_now: "இப்போது", w_today: "இன்று", w_rain: "மழை", w_chance: "வாய்ப்பு", w_humidity: "ஈரப்பதம்", w_wind: "காற்று",
    w_advice: "விவசாய ஆலோசனை", w_week: "அடுத்த 7 நாட்கள்", w_updated: "புதுப்பிக்கப்பட்டது",
    w_climate: "இந்த மாவட்டத்தின் காலநிலை", w_zone: "வலயம்", w_annual_rain: "ஆண்டு மழைவீழ்ச்சி",
    zone_dry: "உலர் வலயம்", zone_intermediate: "இடை வலயம்", zone_wet: "ஈர வலயம்", w_hill: "மத்திய/மலைநாடு",
    w_seasons: "நெல் போகங்கள்",
    w_maha: "பெரும்போகம்: வடகிழக்குப் பருவமழையுடன் ஒக்டோபர்–நவம்பர் அளவில் விதையுங்கள்; பெப்ரவரி–மார்ச் அளவில் அறுவடை. உலர் வலயத்தின் முக்கிய போகம்.",
    w_yala: "சிறுபோகம்: ஏப்ரல்–மே அளவில் விதையுங்கள்; ஆகஸ்ட்–செப்டம்பர் அளவில் அறுவடை. உங்கள் குளம் அல்லது வாய்க்கால் நீர் போதுமான அளவு மட்டும் பயிரிடுங்கள்.",
    adv_rain_spray: "மழை எதிர்பார்க்கப்படுகிறது – இன்று தெளிக்கவோ யூரியா இடவோ வேண்டாம். அது கழுவிச் செல்லப்படும்.",
    adv_heavy: "கனமழை – வடிகால்களைத் திறந்து வரப்புகளை வலுப்படுத்துங்கள்; மழைக்குப் பின் பாக்டீரியா இலைக் கருகலைச் சோதியுங்கள்.",
    adv_blast: "குலை நோய் அபாயம் – குளிர்ந்த இரவுகளும் அதிக ஈரப்பதமும். இலைகளில் சாம்பல் நீள்வட்டப் புள்ளிகளைப் பாருங்கள்; தெரிந்தால் உலர்ந்த காலையில் ட்ரைசைக்ளசோல் (tricyclazole) தெளியுங்கள்.",
    adv_dry: "வறண்ட காலம் – வயலில் 2–5 செ.மீ. நீரைப் பேணுங்கள். இளம் பயிர்: இலைப்பேன் (சுருண்ட இலை நுனி) கவனியுங்கள்.",
    adv_hot: "மிக வெப்பம் – குறிப்பாகப் பூக்கும் பருவத்தில் வயலில் நீரைப் பேணுங்கள்.",
    adv_wind: "பலத்த காற்று – இன்று தெளிக்க வேண்டாம்.",
    adv_spray_ok: "தெளிக்கவோ உரம் இடவோ நல்ல நாள் – அதிகாலை சிறந்தது.",
    adv_bph: "வெப்பமும் ஈரப்பதமும் தேங்கிய நீரும் – பயிரின் அடிப்பகுதியில் பழுப்புத் தத்துப்பூச்சியைச் சோதியுங்கள்.",
    v_title: "நெல் இனங்கள்", v_lead: "விவசாயத் திணைக்கள நெல் இனங்கள், உங்கள் மாவட்டத்துக்கான சிறந்த தேர்வுகளுடன்.",
    v_for: "சிறந்தவை", v_special: "பிரச்சினையுள்ள வயல்களுக்கு", v_all: "அனைத்து இனங்களும்", v_age: "வயது", v_days: "நாட்கள்",
    v_months: "மாதங்கள்", v_yield: "சராசரி விளைச்சல்", v_tha: "தொ/ஹெ", v_grain: "மணி", v_red: "சிவப்பு அரிசி", v_white: "வெள்ளை அரிசி",
    g_sr: "குட்டை உருண்டை (சம்பா)", g_ib: "இடைத்தடிப்பு (நாடு)", g_lm: "நீள் இடை",
    r_blast: "குலை நோய்", r_blb: "இலைக் கருகல்", r_gm: "ஆனைக்கொம்பன் ஈ", r_bph: "பழுப்புத் தத்துப்பூச்சி",
    rl_R: "எதிர்ப்பு", rl_MR: "மித எதிர்ப்பு", rl_MS: "மித பாதிப்பு", rl_S: "பாதிப்புக்குள்ளாகும்",
    use_general: "பொதுப் பயிர்ச்செய்கை", use_wet: "ஈர வலயம்", use_iron: "இரும்பு நச்சு (சதுப்பு) மண்", use_saline: "உவர் கரையோர வயல்கள்",
    use_escape: "வறட்சி/வெள்ள அபாய வயல்கள் (குறுகிய காலப் பயிர்)",
    v_popular: "இலங்கை நெல் நிலத்தில்", v_filter_age: "வயது", v_filter_colour: "நிறம்", v_any: "எதுவும்",
    v_iron_note: "இங்கு பல தாழ்ந்த வயல்களில் இரும்பு நச்சு உள்ளது (செம்மஞ்சள் நீர், செப்பு நிற இலைகள்). அத்தகைய வயல்களில் Bw 367 அல்லது Bw 361 பயிரிடுங்கள்.",
    v_saline_note: "இங்கு கரையோர வயல்கள் உவராக இருக்கலாம். உவர் வயல்களில் At 354 பயிரிடுங்கள்.",
    v_tip_water: "அறுவடை வரை நீர் கிடைக்குமா என உறுதியில்லையா? குறுகிய வயது இனத்தை (3 மாதம் அல்லது குறைவு) தேர்ந்தெடுங்கள்.",
    v_tip_blast: "உங்கள் பகுதியில் குலை நோய் அதிகமா? Bg 358, Bg 360 (பாதிப்புக்குள்ளாகும்) தவிர்த்து At 307, At 308 அல்லது Bg 352 தேர்ந்தெடுங்கள்.",
    v_use_crop: "என் பயிரில் பயன்படுத்து", v_source: "மூலம்: நெல் ஆராய்ச்சி அபிவிருத்தி நிறுவனம், விவசாயத் திணைக்களம் (doa.gov.lk). பயன்பாடு: விவசாயத் திணைக்கள இன ஆய்வு 2015.",
    c_title: "என் பயிர்", c_lead: "நீங்கள் விதைத்த தேதியை AgriCare க்குச் சொல்லுங்கள். உங்கள் பயிரின் பருவத்தையும் இந்த வாரம் செய்ய வேண்டியதையும் சரியாகக் காட்டும்.",
    c_variety: "இனம்", c_sowed: "விதைத்த தேதி", c_field: "வயலின் பெயர்", c_save: "என் பயிர் நாட்காட்டியைக் காட்டு",
    c_day: "நாள்", c_dayof: "{n} நாட்களில்", w_loc_denied: "இருப்பிடம் முடக்கப்பட்டுள்ளது. மாவட்டத்தைத் தேர்வுசெய்யுங்கள்.", c_stage_now: "இப்போதைய பருவம்", c_this_week: "இந்த வாரம்", c_calendar: "பயிர் நாட்காட்டி",
    c_harvest_on: "எதிர்பார்க்கும் அறுவடை", c_days_left: "அறுவடைக்கு நாட்கள்", c_edit: "மாற்று", c_not_sown: "விதைப்புத் தேதி எதிர்காலத்தில் உள்ளது.",
    st_establish: "நிலைபெறுதல்", st_tiller: "தூர் வெடித்தல்", st_panicle: "கதிர் உருவாதல்", st_flower: "பூத்தல்", st_ripen: "முற்றுதல்", st_harvest: "அறுவடை",
    do_establish: ["நாற்றுகள் 3–4 நாள் ஆனதும் 2–5 செ.மீ. நீரைப் பேணுங்கள்.", "முதல் 2 வாரங்களில் களைகளைக் கட்டுப்படுத்துங்கள் – மிக முக்கியமான களையெடுப்புக் காலம்.", "14ஆம் நாளுக்கு முன் வெற்றிடங்களை மேலதிக நாற்றுகளால் நிரப்புங்கள்.", "வறண்ட காலத்தில் இலைப்பேனைக் கவனியுங்கள் (சுருண்ட, காய்ந்த இலை நுனி): வயலில் நீர் கட்டுங்கள்."],
    do_tiller: ["உரிய நேரத்தில் யூரியா மேலுரம் இடுங்கள் (நாட்காட்டியைப் பாருங்கள்). கூடுதல் யூரியா இட வேண்டாம்.", "குறைந்த நீர் மட்டத்தைப் பேணுங்கள்; மாறி மாறி நனைத்து உலர்த்துவது சரி.", "ஒவ்வொரு வாரமும்: குலை நோய்ப் புள்ளிகள், ஆனைக்கொம்பன் வெள்ளித் தூர்கள், அடிப்பகுதியில் பழுப்புத் தத்துப்பூச்சி சோதியுங்கள்.", "வரப்புகளைக் களையின்றி வையுங்கள் – எலிகளும் பூச்சிகளும் அங்கு ஒளிகின்றன."],
    do_panicle: ["இந்தப் பருவத் தொடக்கத்தில் கடைசி யூரியா மேலுரம் இடுங்கள்.", "சுமார் 5 செ.மீ. நீரைப் பேணுங்கள் – இப்போது வயலை ஒருபோதும் உலர விட வேண்டாம்.", "தண்டுத் துளைப்பான் டெட்ஹார்ட், இலை சுருட்டுப் புழு, இலையுறைக் கருகல் கவனியுங்கள்.", "உங்கள் பகுதியில் குலை நோய் இருந்தால் இப்போதே பயிரைப் பாதுகாருங்கள் – அடுத்து கழுத்துக் குலை நோய் வரும்."],
    do_flower: ["வயலில் நீரைப் பேணுங்கள் – இப்போது மண் உலர்ந்தால் மணிகள் பதராகும்.", "பூக்கும் நேரத்தில் (காலை பிற்பகுதி) தெளிக்க வேண்டாம்.", "கதிர் நாவாய்ப் பூச்சி (துர்நாற்றம், பதர் மணிகள்) மற்றும் பறவைகளைக் கவனியுங்கள்."],
    do_ripen: ["அறுவடைக்கு 10–14 நாட்களுக்கு முன் வயல் நீரை வடியுங்கள்.", "பறவைகளிடமிருந்தும் எலிகளிடமிருந்தும் பாதுகாருங்கள்.", "சுத்தமான பைகள், தார்ப்பாய், உலர்த்தும் இடத்தைத் தயார் செய்யுங்கள்."],
    do_harvest: ["கதிரில் 80–85% மணிகள் பொன்னிறமானதும் அறுவடை செய்யுங்கள்.", "வெட்டியவுடன் சூடடியுங்கள்.", "சேமிப்பதற்கு முன் நெல்லை 14% ஈரப்பதத்துக்கு உலர்த்துங்கள்."],
    job_basal: "விதைப்பின்போது அடியுரம் (TSP + MOP), உங்கள் இன வயதுக்கான விவசாயத் திணைக்களப் பரிந்துரைப்படி",
    job_weed: "களைக் கட்டுப்பாடு – முளைப்புக்கு முந்திய களைக்கொல்லி இடுங்கள் அல்லது கையால் களையெடுங்கள்",
    job_td1: "1ஆவது யூரியா மேலுரம்",
    job_td2: "2ஆவது யூரியா மேலுரம் (பரிந்துரைத்தால் MOP உடன்)",
    job_td3: "கடைசி யூரியா மேலுரம் – கதிர் உருவாதல் தொடங்குகிறது",
    job_water: "5 செ.மீ. நீரைப் பேணுங்கள் – ஒரு வாரத்தில் பூக்கும்",
    job_flower: "பூத்தல் – நீரைப் பேணுங்கள், காலை பிற்பகுதியில் தெளிக்க வேண்டாம்",
    job_drain: "வயல் நீரை வடியுங்கள்",
    job_harvest: "அறுவடை (80–85% பொன்னிற மணிகள்)",
    c_gcal: "Google Calendar இல் சேர்"
});

/* translations hold strings; the "do_" lists are arrays, so read them with tList */
function tList(key) {
    const lang = getLanguage();
    return (translations[lang] && translations[lang][key]) || translations.en[key] || [];
}
