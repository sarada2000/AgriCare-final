/* AgriCare – agro-chemical / medicine shop finder
   1. Gets the farmer's location (GPS) or a chosen district.
   2. Looks up real shops nearby from OpenStreetMap (free, no API key).
   3. Adds any shops you have verified yourself (VERIFIED_SHOPS below).
   4. Sorts by distance and gives Directions / Call buttons.
   If OpenStreetMap has few shops in an area, the Google Maps search button always works. */

/* ===== ADD SHOPS YOU HAVE CHECKED YOURSELF =====
   Only add real shops you have confirmed. Example format:
   { name: "Shop name", lat: 7.2083, lng: 79.8358, phone: "031 222 2222", address: "Main Street, Town", type: "agro" }
   type: "agro" (agro-chemical shop) or "asc" (Agrarian Service Centre) */
const VERIFIED_SHOPS = [];

Object.assign(translations.en, {
    nav_shops: "Shops",
    shop_title: "Find a Medicine Shop",
    shop_lead: "Find agro-chemical shops and Agrarian Service Centres near your field, sorted by distance.",
    shop_use_loc: "📍 Use my location",
    shop_or_district: "or choose your district",
    shop_district_ph: "Select district",
    shop_radius: "Search within",
    shop_locating: "Finding your location...",
    shop_searching: "Searching for shops near you...",
    shop_loc_denied: "Location is turned off or blocked. Choose your district instead.",
    shop_found: "shops found",
    shop_none: "No shops are listed on the map near this location yet. Use the Google Maps search below, or try a larger search distance.",
    shop_error: "Could not load shop data. Check your internet connection, or use the Google Maps search below.",
    shop_google: "🔎 Search agro shops on Google Maps",
    shop_directions: "Directions",
    shop_call: "Call",
    shop_away: "km away",
    shop_type_agro: "Agro-chemical shop",
    shop_type_asc: "Agrarian Service Centre",
    shop_type_garden: "Garden & farm supplies",
    shop_verified: "Verified by AgriCare",
    shop_you: "You are here",
    shop_need: "What to ask for",
    shop_tip: "Call the shop before you travel to check they have the product. Take a photo of your diagnosis to show the shop owner.",
    shop_source: "Shop locations come from OpenStreetMap contributors and may be incomplete."
});
Object.assign(translations.si, {
    nav_shops: "සාප්පු",
    shop_title: "ඖෂධ සාප්පුවක් සොයන්න",
    shop_lead: "ඔබේ කුඹුර අසල ඇති කෘෂි රසායන සාප්පු සහ ගොවිජන සේවා මධ්‍යස්ථාන දුර අනුව සොයාගන්න.",
    shop_use_loc: "📍 මගේ ස්ථානය භාවිත කරන්න",
    shop_or_district: "නැතහොත් ඔබේ දිස්ත්‍රික්කය තෝරන්න",
    shop_district_ph: "දිස්ත්‍රික්කය තෝරන්න",
    shop_radius: "සෙවුම් දුර",
    shop_locating: "ඔබේ ස්ථානය සොයමින්...",
    shop_searching: "ඔබ අසල සාප්පු සොයමින්...",
    shop_loc_denied: "ස්ථාන සේවාව අක්‍රියයි හෝ අවහිරයි. ඒ වෙනුවට දිස්ත්‍රික්කය තෝරන්න.",
    shop_found: "සාප්පු හමු විය",
    shop_none: "මෙම ස්ථානය අසල සිතියමේ තවම සාප්පු ලැයිස්තුගත කර නැත. පහත Google Maps සෙවුම භාවිත කරන්න, නැතහොත් සෙවුම් දුර වැඩි කරන්න.",
    shop_error: "සාප්පු දත්ත ලබාගත නොහැකි විය. අන්තර්ජාල සම්බන්ධතාව පරීක්ෂා කරන්න, නැතහොත් පහත Google Maps සෙවුම භාවිත කරන්න.",
    shop_google: "🔎 Google Maps හි කෘෂි සාප්පු සොයන්න",
    shop_directions: "මාර්ගය",
    shop_call: "අමතන්න",
    shop_away: "කි.මී. දුරින්",
    shop_type_agro: "කෘෂි රසායන සාප්පුව",
    shop_type_asc: "ගොවිජන සේවා මධ්‍යස්ථානය",
    shop_type_garden: "උද්‍යාන සහ ගොවි උපකරණ",
    shop_verified: "AgriCare මගින් තහවුරු කළ",
    shop_you: "ඔබ මෙතැන",
    shop_need: "ඉල්ලිය යුතු දේ",
    shop_tip: "භාණ්ඩය තිබේදැයි දැනගැනීමට යාමට පෙර සාප්පුවට අමතන්න. ඔබේ රෝග විනිශ්චයේ ඡායාරූපයක් සාප්පු හිමියාට පෙන්වන්න.",
    shop_source: "සාප්පු ස්ථාන OpenStreetMap දායකයින්ගෙනි; සම්පූර්ණ නොවිය හැක."
});
Object.assign(translations.ta, {
    nav_shops: "கடைகள்",
    shop_title: "மருந்துக் கடையைக் கண்டறியுங்கள்",
    shop_lead: "உங்கள் வயலுக்கு அருகிலுள்ள விவசாய இரசாயனக் கடைகளையும் கமநல சேவை நிலையங்களையும் தூர அடிப்படையில் கண்டறியுங்கள்.",
    shop_use_loc: "📍 எனது இருப்பிடத்தைப் பயன்படுத்து",
    shop_or_district: "அல்லது உங்கள் மாவட்டத்தைத் தேர்வுசெய்யுங்கள்",
    shop_district_ph: "மாவட்டத்தைத் தேர்வுசெய்",
    shop_radius: "தேடல் தூரம்",
    shop_locating: "உங்கள் இருப்பிடத்தைக் கண்டறிகிறது...",
    shop_searching: "அருகிலுள்ள கடைகளைத் தேடுகிறது...",
    shop_loc_denied: "இருப்பிடம் முடக்கப்பட்டுள்ளது அல்லது தடுக்கப்பட்டுள்ளது. மாவட்டத்தைத் தேர்வுசெய்யுங்கள்.",
    shop_found: "கடைகள் கிடைத்தன",
    shop_none: "இந்த இடத்துக்கு அருகில் வரைபடத்தில் இன்னும் கடைகள் பட்டியலிடப்படவில்லை. கீழே உள்ள Google Maps தேடலைப் பயன்படுத்துங்கள், அல்லது தேடல் தூரத்தை அதிகரியுங்கள்.",
    shop_error: "கடைத் தரவைப் பெற முடியவில்லை. இணைய இணைப்பைச் சரிபாருங்கள், அல்லது கீழே உள்ள Google Maps தேடலைப் பயன்படுத்துங்கள்.",
    shop_google: "🔎 Google Maps இல் விவசாயக் கடைகளைத் தேடு",
    shop_directions: "வழி",
    shop_call: "அழை",
    shop_away: "கி.மீ. தூரத்தில்",
    shop_type_agro: "விவசாய இரசாயனக் கடை",
    shop_type_asc: "கமநல சேவை நிலையம்",
    shop_type_garden: "தோட்ட & விவசாயப் பொருட்கள்",
    shop_verified: "AgriCare உறுதிப்படுத்தியது",
    shop_you: "நீங்கள் இங்கே",
    shop_need: "கேட்க வேண்டியது",
    shop_tip: "பொருள் உள்ளதா என அறியப் புறப்படும் முன் கடையை அழையுங்கள். உங்கள் நோய் கண்டறிதலின் படத்தைக் கடைக்காரரிடம் காட்டுங்கள்.",
    shop_source: "கடை இருப்பிடங்கள் OpenStreetMap பங்களிப்பாளர்களிடமிருந்து; முழுமையற்றதாக இருக்கலாம்."
});

/* What to ask for at the shop, per disease */
const SHOP_NEEDS = {
    blast: { en: "A fungicide recommended for rice blast, such as tricyclazole.", si: "පාළුව රෝගයට නිර්දේශිත දිලීර නාශකයක්, උදා: ට්‍රයිසයික්ලසෝල්.", ta: "குலை நோய்க்குப் பரிந்துரைக்கப்பட்ட பூஞ்சைக்கொல்லி, உ.ம்: ட்ரைசைக்ளசோல்." },
    bacterial_leaf_blight: { en: "No spray cures leaf blight. Ask about clean seed and a resistant variety for next season.", si: "කොළ අංගමාරය සුව කරන ඉසීමක් නැත. ඊළඟ කන්නයට පිරිසිදු බීජ හා ප්‍රතිරෝධී ප්‍රභේද ගැන විමසන්න.", ta: "இலைக் கருகலைக் குணப்படுத்தும் தெளிப்பு இல்லை. அடுத்த போகத்துக்குச் சுத்தமான விதை, எதிர்ப்புத் திறன் கொண்ட இனம் பற்றிக் கேளுங்கள்." },
    brown_spot: { en: "Potassium fertilizer (MOP). A fungicide only if the attack is severe.", si: "පොටෑසියම් පොහොර (MOP). හානිය දරුණු නම් පමණක් දිලීර නාශකයක්.", ta: "பொட்டாசியம் உரம் (MOP). பாதிப்பு கடுமையானால் மட்டும் பூஞ்சைக்கொல்லி." },
    sheath_blight: { en: "A fungicide recommended for sheath blight, such as hexaconazole.", si: "කොපු අංගමාරයට නිර්දේශිත දිලීර නාශකයක්, උදා: හෙක්සකොනසෝල්.", ta: "இலையுறைக் கருகலுக்குப் பரிந்துரைக்கப்பட்ட பூஞ்சைக்கொல்லி, உ.ம்: ஹெக்சகொனசோல்." },
    red_stripe: { en: "A fungicide with thiophanate-methyl for red stripe.", si: "රතු ඉරි රෝගයට තයෝෆැනේට්-මෙතිල් (thiophanate-methyl) අඩංගු දිලීර නාශකයක්.", ta: "சிவப்புக் கோடு நோய்க்கு தயோஃபனேட்-மெதில் (thiophanate-methyl) கொண்ட பூஞ்சைக்கொல்லி." },
    tungro: { en: "An insecticide for green leafhoppers: imidacloprid or thiamethoxam. There is no medicine for the virus itself, so remove infected plants.", si: "කොළ පැල කීඩෑවන්ට කෘමිනාශකයක්: ඉමිඩාක්ලෝප්‍රිඩ් (imidacloprid) හෝ තයමිතොක්සම් (thiamethoxam). වෛරසයටම ඖෂධයක් නැති නිසා රෝගී පැළ ඉවත් කරන්න.", ta: "பச்சைத் தத்துப்பூச்சிக்குப் பூச்சிக்கொல்லி: இமிடாகுளோப்ரிட் (imidacloprid) அல்லது தயமீதாக்சம் (thiamethoxam). வைரஸுக்கே மருந்து இல்லை, எனவே நோயுற்ற பயிர்களை அகற்றுங்கள்." }
};

/* District capitals – used when GPS is off */
const DISTRICTS = [
    ["Ampara", 7.2975, 81.6820], ["Anuradhapura", 8.3114, 80.4037], ["Badulla", 6.9934, 81.0550],
    ["Batticaloa", 7.7310, 81.6747], ["Colombo", 6.9271, 79.8612], ["Galle", 6.0535, 80.2210],
    ["Gampaha", 7.0873, 79.9990], ["Hambantota", 6.1241, 81.1185], ["Jaffna", 9.6615, 80.0255],
    ["Kalutara", 6.5854, 79.9607], ["Kandy", 7.2906, 80.6337], ["Kegalle", 7.2513, 80.3464],
    ["Kilinochchi", 9.3803, 80.3770], ["Kurunegala", 7.4818, 80.3609], ["Mannar", 8.9810, 79.9044],
    ["Matale", 7.4675, 80.6234], ["Matara", 5.9549, 80.5550], ["Monaragala", 6.8728, 81.3507],
    ["Mullaitivu", 9.2671, 80.8142], ["Nuwara Eliya", 6.9497, 80.7891], ["Polonnaruwa", 7.9403, 81.0188],
    ["Puttalam", 8.0362, 79.8283], ["Ratnapura", 6.6828, 80.3992], ["Trincomalee", 8.5874, 81.2152],
    ["Vavuniya", 8.7514, 80.4971]
];

const OVERPASS_SERVERS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
];

function distanceKm(lat1, lng1, lat2, lng2) {
    const R = 6371, toRad = x => x * Math.PI / 180;
    const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
}

function shopTypeFromTags(tags) {
    const name = (tags.name || tags["name:en"] || "").toLowerCase();
    if (/agrarian|ගොවිජන|கமநல/.test(name)) return "asc";
    if (tags.shop === "agrarian" || /agro|agri|fertili|chemical|ගොවි|පොහොර|உரம்/.test(name)) return "agro";
    return "garden";
}

async function fetchShops(lat, lng, radiusKm) {
    const r = Math.round(radiusKm * 1000);
    const q = `[out:json][timeout:25];(` +
        `nwr["shop"~"agrarian|farm|garden_centre"](around:${r},${lat},${lng});` +
        `nwr["name"~"agro|agri|fertili|agrarian|ගොවි|පොහොර|கமநல|உரம்",i](around:${r},${lat},${lng});` +
        `);out center tags 80;`;
    let lastErr;
    for (const server of OVERPASS_SERVERS) {
        try {
            const res = await fetch(server, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: "data=" + encodeURIComponent(q)
            });
            if (!res.ok) throw new Error("HTTP " + res.status);
            const data = await res.json();
            const seen = new Set();
            return data.elements.map(e => {
                const tags = e.tags || {};
                const plat = e.lat ?? (e.center && e.center.lat);
                const plng = e.lon ?? (e.center && e.center.lon);
                const name = tags.name || tags["name:en"] || tags["name:si"] || tags["name:ta"];
                if (!name || plat == null) return null;
                const key = name.toLowerCase() + Math.round(plat * 1000);
                if (seen.has(key)) return null;
                seen.add(key);
                const addr = [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"]].filter(Boolean).join(", ");
                return { name, lat: plat, lng: plng, phone: tags.phone || tags["contact:phone"] || "", address: addr, type: shopTypeFromTags(tags), hours: tags.opening_hours || "" };
            }).filter(Boolean);
        } catch (err) { lastErr = err; }
    }
    throw lastErr || new Error("no server");
}

function googleMapsSearchUrl(lat, lng) {
    return `https://www.google.com/maps/search/agro+chemical+shop/@${lat},${lng},13z`;
}
function directionsUrl(lat, lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
