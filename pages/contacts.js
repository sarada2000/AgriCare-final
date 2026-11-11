/* AgriCare – phone numbers farmers can call, SMS or WhatsApp.

   ✏️ EDIT HERE: put the number for each district between the quotes, e.g.
        Anuradhapura: { name: "AgriCare Anuradhapura", phone: "0771234567", whatsapp: "0771234567" },
   - phone    = number for calls and SMS (mobile or land line)
   - whatsapp = WhatsApp number (leave "" if none)
   - A district with no number uses the main line (_main).
   Numbers saved in the Officer Dashboard (Contact numbers section) replace the numbers in this file. */

const AGRI_CONTACT_DEFAULTS = {
    _main:          { name: { en: "AgriCare help line (call / SMS)", si: "AgriCare උපකාරක අංකය (ඇමතුම් / SMS)", ta: "AgriCare உதவி இலக்கம் (அழைப்பு / SMS)" }, phone: "075 082 0214", whatsapp: "", hours: "" },
    Ampara:         { name: "", phone: "", whatsapp: "" },
    Anuradhapura:   { name: "", phone: "", whatsapp: "" },
    Badulla:        { name: "", phone: "", whatsapp: "" },
    Batticaloa:     { name: "", phone: "", whatsapp: "" },
    Colombo:        { name: "", phone: "", whatsapp: "" },
    Galle:          { name: { en: "Rice Research Station – Labuduwa", si: "වී පර්යේෂණ ස්ථානය – ලබුදූව", ta: "நெல் ஆராய்ச்சி நிலையம் – லபுதுவ" }, phone: "091 224 4345", whatsapp: "" },
    Gampaha:        { name: "", phone: "", whatsapp: "" },
    Hambantota:     { name: { en: "Rice Research Station – Ambalantota", si: "වී පර්යේෂණ ස්ථානය – අම්බලන්තොට", ta: "நெல் ஆராய்ச்சி நிலையம் – அம்பலாந்தோட்டை" }, phone: "047 222 3228", whatsapp: "" },
    Jaffna:         { name: "", phone: "", whatsapp: "" },
    Kalutara:       { name: { en: "Regional Rice Research & Development Centre – Bombuwala", si: "ප්‍රාදේශීය වී පර්යේෂණ හා සංවර්ධන මධ්‍යස්ථානය – බෝඹුවල", ta: "பிராந்திய நெல் ஆராய்ச்சி மற்றும் அபிவிருத்தி நிலையம் – பொம்புவல" }, phone: "034 228 1673", whatsapp: "" },
    Kandy:          { name: "", phone: "", whatsapp: "" },
    Kegalle:        { name: "", phone: "", whatsapp: "" },
    Kilinochchi:    { name: "", phone: "", whatsapp: "" },
    Kurunegala:     { name: { en: "Rice Research & Development Institute – Bathalagoda", si: "වී පර්යේෂණ හා සංවර්ධන ආයතනය – බතලගොඩ", ta: "நெல் ஆராய்ச்சி மற்றும் அபிவிருத்தி நிறுவனம் – பதலகொட" }, phone: "037 225 8561", whatsapp: "" },
    Mannar:         { name: "", phone: "", whatsapp: "" },
    Matale:         { name: "", phone: "", whatsapp: "" },
    Matara:         { name: "", phone: "", whatsapp: "" },
    Monaragala:     { name: "", phone: "", whatsapp: "" },
    Mullaitivu:     { name: "", phone: "", whatsapp: "" },
    "Nuwara Eliya": { name: "", phone: "", whatsapp: "" },
    Polonnaruwa:    { name: "", phone: "", whatsapp: "" },
    Puttalam:       { name: "", phone: "", whatsapp: "" },
    Ratnapura:      { name: "", phone: "", whatsapp: "" },
    Trincomalee:    { name: "", phone: "", whatsapp: "" },
    Vavuniya:       { name: "", phone: "", whatsapp: "" }
};

/* Rice research centres of the Department of Agriculture (office numbers), shown to every farmer */
const AGRI_CENTRES = [
    { name: { en: "Rice Research & Development Institute (RRDI) – Bathalagoda, Ibbagamuwa",
              si: "වී පර්යේෂණ හා සංවර්ධන ආයතනය – බතලගොඩ, ඉබ්බාගමුව",
              ta: "நெல் ஆராய்ச்சி மற்றும் அபிவிருத்தி நிறுவனம் – பதலகொட, இப்பாகமுவ" },
      phone: "037 225 8561", email: "rrdi@doa.gov.lk" },
    { name: { en: "Regional Rice Research & Development Centre – Bombuwala",
              si: "ප්‍රාදේශීය වී පර්යේෂණ හා සංවර්ධන මධ්‍යස්ථානය – බෝඹුවල",
              ta: "பிராந்திய நெல் ஆராய்ச்சி மற்றும் அபிவிருத்தி நிலையம் – பொம்புவல" },
      phone: "034 228 1673" },
    { name: { en: "Rice Research Station – Ambalantota", si: "වී පර්යේෂණ ස්ථානය – අම්බලන්තොට", ta: "நெல் ஆராய்ச்சி நிலையம் – அம்பலாந்தோட்டை" },
      phone: "047 222 3228" },
    { name: { en: "Rice Research Station – Labuduwa", si: "වී පර්යේෂණ ස්ථානය – ලබුදූව", ta: "நெல் ஆராய்ச்சி நிலையம் – லபுதுவ" },
      phone: "091 224 4345" },
    { name: { en: "Rice Research Station – Bentota", si: "වී පර්යේෂණ ස්ථානය – බෙන්තොට", ta: "நெல் ஆராய்ச்சி நிலையம் – பெந்தோட்டை" },
      phone: "034 227 5173" },
    { name: { en: "Ministry of Agriculture – Head Office, Battaramulla", si: "කෘෂිකර්ම අමාත්‍යාංශය – ප්‍රධාන කාර්යාලය, බත්තරමුල්ල", ta: "விவசாய அமைச்சு – தலைமை அலுவலகம், பத்தரமுல்ல" },
      phone: "011 203 4300", email: "info@agrimin.gov.lk" }
];

const AgriContacts = {
    data: null,
    _loading: null,

    /* Numbers from this file, replaced by the ones saved by the officer */
    load(force) {
        if (this._loading && !force) return this._loading;
        const merged = JSON.parse(JSON.stringify(AGRI_CONTACT_DEFAULTS));
        this.data = merged;
        this._loading = (typeof AgriAPI === "undefined" ? Promise.resolve(null) : AgriAPI.get("/api/contacts").catch(() => null))
            .then(r => {
                const saved = (r && r.contacts) || {};
                Object.keys(saved).forEach(d => { merged[d] = Object.assign({}, merged[d] || {}, saved[d]); });
                this.data = merged;
                return merged;
            });
        return this._loading;
    },

    /* The contact for a district, or the main line when the district has no number */
    forDistrict(id) {
        const all = this.data || AGRI_CONTACT_DEFAULTS;
        const own = id && all[id];
        if (own && (own.phone || own.whatsapp)) return Object.assign({ district: id, isMain: false }, own);
        const main = all._main || {};
        if (main.phone || main.whatsapp) return Object.assign({ district: id || null, isMain: true }, main);
        return null;
    },
    /* a name can be plain text or { en, si, ta } */
    name(c) {
        const n = c && c.name;
        if (!n) return "";
        return typeof n === "object" ? (n[(typeof getLanguage === "function") ? getLanguage() : "en"] || n.en || "") : n;
    },
    /* Sri Lankan mobiles start with 07 (or +947): only these can get an SMS */
    isMobile(n) { const d = String(n || "").replace(/\D/g, ""); return /^07\d{8}$/.test(d) || /^947\d{8}$/.test(d); },
    digits(n) { return String(n || "").replace(/[^\d+]/g, ""); },
    tel(n) { return "tel:" + this.digits(n); },
    sms(n, body) { return "sms:" + this.digits(n) + (body ? "?body=" + encodeURIComponent(body) : ""); },
    whatsapp(n, body) {
        let d = String(n || "").replace(/\D/g, "");
        if (d.startsWith("0")) d = "94" + d.slice(1);          // Sri Lankan number → international
        return "https://wa.me/" + d + (body ? "?text=" + encodeURIComponent(body) : "");
    }
};
