/* AgriCare – connection to the backend (backend/app.py)
   Load after translations.js (and after treatment.js on pages that have it).

   When the site is opened through the backend (python app.py → http://localhost:5000) everything is
   saved on the server. When there is no server (opening index.html directly, or the preview),
   the site keeps working in "offline mode" with data saved only in this browser.

   If the website and the API are on different addresses, set before this file:
       <script>window.AGRICARE_API_URL = "https://your-api.example.com";</script>   */

Object.assign(translations.en, {
    disc_title: "Before you use AgriCare advice",
    disc_p1: "AgriCare gives decision support only. It does not replace your Agriculture Instructor or a field check by an officer.",
    disc_p2: "A photo diagnosis can be wrong. Always read the product label, use only the label dose, wear protective clothing, and confirm the dose with your Agrarian Service Centre before spraying.",
    disc_p3: "The AgriCare team is not responsible for crop loss, harm to people, animals or water, or other damage caused by using a chemical wrongly or against the label.",
    disc_check: "I have read this and I understand",
    disc_ok: "Continue",
    disc_privacy: "How we use your data",
    nav_privacy: "Privacy",
    up_no_model: "The AgriCare model is not running on the server right now, so no diagnosis can be given. Please try again later or contact your Agriculture Instructor.",
    wd_label_max: "This is the label dose. Never mix or spray more – an overdose can burn the paddy and harm people, animals and water.",
    wd_size_bad: "Enter a field size greater than 0.",
    wd_size_big: "Check the field size: more than 50 hectares is unusual for one field. Calculate one field at a time.",
    wd_wrong_time: "Your crop is on day {n}. This product is used on day {a}–{b}. Used at the wrong time it may not work or may damage the crop – check with your Agriculture Instructor.",
    up_not_leaf: "This does not look like a paddy leaf. Take a close-up photo of the affected paddy leaf in daylight and scan again.",
    api_offline: "Offline mode: no server, data is saved only on this device.",
    api_local: "Browser demo mode: the AgriCare server is not running, so accounts and data are saved only in this browser.",
    up_uncertain: "AgriCare is not sure about this photo. Take a clear photo of one leaf in daylight, close up and in focus, and scan again.",
    nav_officer: "Officer",
    session_expired: "Please log in again."
});
Object.assign(translations.si, {
    disc_title: "AgriCare උපදෙස් භාවිතයට පෙර",
    disc_p1: "AgriCare ලබා දෙන්නේ තීරණ ගැනීමට සහාය පමණි. එය ඔබගේ කෘෂිකර්ම උපදේශකවරයාට හෝ නිලධාරියෙකුගේ ක්ෂේත්‍ර පරීක්ෂාවට ආදේශකයක් නොවේ.",
    disc_p2: "ඡායාරූපයකින් කරන රෝග හඳුනාගැනීම වැරදි විය හැක. ඉසීමට පෙර සෑම විටම නිෂ්පාදන ලේබලය කියවන්න, ලේබලයේ මාත්‍රාව පමණක් භාවිත කරන්න, ආරක්ෂිත ඇඳුම් අඳින්න, සහ ගොවිජන සේවා මධ්‍යස්ථානයෙන් මාත්‍රාව තහවුරු කරගන්න.",
    disc_p3: "රසායන ද්‍රව්‍ය වැරදි ලෙස හෝ ලේබලයට පටහැනිව භාවිත කිරීමෙන් සිදුවන බෝග හානි, මිනිසුන්ට, සතුන්ට හෝ ජලයට වන හානි හෝ වෙනත් හානි සඳහා AgriCare කණ්ඩායම වගකියන්නේ නැත.",
    disc_check: "මම මෙය කියවා තේරුම් ගත්තෙමි",
    disc_ok: "ඉදිරියට",
    disc_privacy: "ඔබගේ දත්ත භාවිත කරන ආකාරය",
    nav_privacy: "පෞද්ගලිකත්වය",
    up_no_model: "AgriCare ආකෘතිය දැනට සේවාදායකයේ ක්‍රියාත්මක නොවන නිසා රෝග විනිශ්චයක් ලබා දිය නොහැක. කරුණාකර පසුව නැවත උත්සාහ කරන්න, නැතහොත් ඔබගේ කෘෂිකර්ම උපදේශකවරයා අමතන්න.",
    wd_label_max: "මෙය ලේබලයේ මාත්‍රාවයි. කිසිවිටෙක මීට වැඩියෙන් මිශ්‍ර නොකරන්න, නොඉසින්න – වැඩි මාත්‍රාවක් වී වගාව පිළිස්සීමට සහ මිනිසුන්ට, සතුන්ට හා ජලයට හානි කිරීමට හේතු විය හැක.",
    wd_size_bad: "0ට වැඩි කුඹුරු ප්‍රමාණයක් ඇතුළත් කරන්න.",
    wd_size_big: "කුඹුරු ප්‍රමාණය පරීක්ෂා කරන්න: එක් කුඹුරකට හෙක්ටයාර 50කට වඩා අසාමාන්‍යයි. එක් වරකට එක් කුඹුරක් ගණනය කරන්න.",
    wd_wrong_time: "ඔබගේ වගාව දින {n}යි. මෙම නිෂ්පාදනය භාවිත කරන්නේ දින {a}–{b} අතරයි. වැරදි කාලයේ යෙදුවොත් එය ක්‍රියා නොකළ හැක, නැතහොත් වගාවට හානි විය හැක – ඔබගේ කෘෂිකර්ම උපදේශකවරයාගෙන් විමසන්න.",
    up_not_leaf: "මෙය වී කොළයක ඡායාරූපයක් ලෙස නොපෙනේ. රෝගී වී කොළය ළඟින්, දිවා ආලෝකයේ ඡායාරූපයක් ගෙන නැවත ස්කෑන් කරන්න.",
    api_offline: "සේවාදායකය නැත: දත්ත මෙම උපාංගයේ පමණක් සුරැකේ.",
    api_local: "බ්‍රව්සර් ප්‍රදර්ශන ප්‍රකාරය: AgriCare සේවාදායකය ක්‍රියාත්මක නැති නිසා ගිණුම් සහ දත්ත මෙම බ්‍රව්සරයේ පමණක් සුරැකේ.",
    up_uncertain: "මෙම ඡායාරූපය ගැන AgriCare හට විශ්වාස නැත. දිවා ආලෝකයේ, ළඟින් සහ පැහැදිලිව එක් කොළයක ඡායාරූපයක් ගෙන නැවත ස්කෑන් කරන්න.",
    nav_officer: "නිලධාරී",
    session_expired: "කරුණාකර නැවත පිවිසෙන්න."
});
Object.assign(translations.ta, {
    disc_title: "AgriCare ஆலோசனையைப் பயன்படுத்தும் முன்",
    disc_p1: "AgriCare முடிவெடுக்க உதவி மட்டுமே வழங்குகிறது. இது உங்கள் விவசாயப் போதனாசிரியரையோ அலுவலரின் வயல் பரிசோதனையையோ மாற்றாது.",
    disc_p2: "படத்தின் மூலம் செய்யும் நோய் கண்டறிதல் தவறாக இருக்கலாம். தெளிப்பதற்கு முன் எப்போதும் தயாரிப்பின் லேபிளைப் படியுங்கள், லேபிள் அளவை மட்டும் பயன்படுத்துங்கள், பாதுகாப்பு உடை அணியுங்கள், கமநல சேவை நிலையத்தில் அளவை உறுதிப்படுத்துங்கள்.",
    disc_p3: "இரசாயனங்களைத் தவறாக அல்லது லேபிளுக்கு மாறாகப் பயன்படுத்துவதால் ஏற்படும் பயிர் இழப்பு, மனிதர்கள், விலங்குகள் அல்லது நீருக்கு ஏற்படும் தீங்கு அல்லது வேறு சேதங்களுக்கு AgriCare குழு பொறுப்பல்ல.",
    disc_check: "இதைப் படித்து புரிந்துகொண்டேன்",
    disc_ok: "தொடரவும்",
    disc_privacy: "உங்கள் தரவை எப்படிப் பயன்படுத்துகிறோம்",
    nav_privacy: "தனியுரிமை",
    up_no_model: "AgriCare மாதிரி தற்போது சேவையகத்தில் இயங்கவில்லை, எனவே நோய் கண்டறிதல் வழங்க முடியாது. பின்னர் மீண்டும் முயற்சிக்கவும் அல்லது உங்கள் விவசாயப் போதனாசிரியரைத் தொடர்புகொள்ளவும்.",
    wd_label_max: "இது லேபிள் அளவு. ஒருபோதும் இதற்கு மேல் கலக்கவோ தெளிக்கவோ வேண்டாம் – அதிக அளவு நெற்பயிரை எரிக்கவும் மனிதர்கள், விலங்குகள், நீருக்குத் தீங்கு செய்யவும் கூடும்.",
    wd_size_bad: "0 ஐ விடப் பெரிய வயல் அளவை உள்ளிடுங்கள்.",
    wd_size_big: "வயல் அளவைச் சரிபாருங்கள்: ஒரு வயலுக்கு 50 ஹெக்டேருக்கு மேல் அசாதாரணம். ஒரு நேரத்தில் ஒரு வயலைக் கணக்கிடுங்கள்.",
    wd_wrong_time: "உங்கள் பயிர் {n} ஆம் நாளில் உள்ளது. இந்தத் தயாரிப்பு {a}–{b} நாட்களில் பயன்படுத்தப்படுகிறது. தவறான நேரத்தில் பயன்படுத்தினால் வேலை செய்யாமல் போகலாம் அல்லது பயிருக்குச் சேதம் ஏற்படலாம் – உங்கள் விவசாயப் போதனாசிரியரிடம் கேளுங்கள்.",
    up_not_leaf: "இது நெல் இலையின் படமாகத் தெரியவில்லை. பாதிக்கப்பட்ட நெல் இலையை அருகிலிருந்து, பகல் வெளிச்சத்தில் படம் எடுத்து மீண்டும் ஸ்கேன் செய்யுங்கள்.",
    api_offline: "சேவையகம் இல்லை: தரவு இந்தச் சாதனத்தில் மட்டும் சேமிக்கப்படும்.",
    api_local: "உலாவி மாதிரி முறை: AgriCare சேவையகம் இயங்கவில்லை, எனவே கணக்குகளும் தரவும் இந்த உலாவியில் மட்டும் சேமிக்கப்படும்.",
    up_uncertain: "இந்தப் படம் பற்றி AgriCare க்கு உறுதியில்லை. பகல் வெளிச்சத்தில், அருகிலிருந்து, தெளிவாக ஒரு இலையைப் படம் எடுத்து மீண்டும் ஸ்கேன் செய்யுங்கள்.",
    nav_officer: "அலுவலர்",
    session_expired: "மீண்டும் உள்நுழையுங்கள்."
});

/* Share of the photo that is plant-coloured (green to yellow-green). A paddy leaf photo is mostly
   plant colour; a face, a wall or a document is not. The model only knows paddy classes, so a photo
   that is not a leaf is stopped here instead of getting a wrong disease name. */
const LEAF_MIN_SHARE = 0.35;
function plantShare(source) {
    try {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(source, 0, 0, 64, 64);
        const d = g.getImageData(0, 0, 64, 64).data;
        let plant = 0;
        for (let i = 0; i < d.length; i += 4) {
            const r = d[i] / 255, gr = d[i + 1] / 255, b = d[i + 2] / 255;
            const max = Math.max(r, gr, b), min = Math.min(r, gr, b), v = max, s = max ? (max - min) / max : 0;
            if (max === min || s < 0.18 || v < 0.15) continue;
            let h = max === r ? (gr - b) / (max - min) : max === gr ? 2 + (b - r) / (max - min) : 4 + (r - gr) / (max - min);
            h = (h * 60 + 360) % 360;
            if (h >= 35 && h <= 170) plant++;
        }
        return plant / (64 * 64);
    } catch (e) { return 1; }          // cannot read the photo here: let the model decide
}

const AgriAPI = {
    base: (window.AGRICARE_API_URL || "").replace(/\/$/, ""),
    _online: null,
    inPages: location.pathname.includes("/pages/"),

    get token() { return AgriStore.get("agricare_token"); },
    get user() { try { return JSON.parse(AgriStore.get("agricare_user_json") || "null"); } catch (e) { return null; } },

    url(path) { return this.base + path; },
    /* turn "/uploads/x.jpg" from the server into a full address */
    asset(path) { return path && path.startsWith("/") ? this.base + path : path; },

    /* Which server answers? "server" = the real backend, "local" = the demo server in this browser
       (pages/local-server.js). Checked once per page. online() is true in both cases. */
    mode: null,
    detect() {
        if (this._detect) return this._detect;
        const useLocal = () => (this.mode = (typeof LocalServer !== "undefined") ? "local" : "none");
        if (location.protocol === "file:" && !this.base) return (this._detect = Promise.resolve(useLocal()));
        const ctrl = ("AbortController" in window) ? new AbortController() : null;
        const timer = setTimeout(() => ctrl && ctrl.abort(), 3500);
        this._detect = fetch(this.url("/api/health"), { signal: ctrl && ctrl.signal, cache: "no-store" })
            .then(r => r.ok ? r.json() : null)
            .then(j => { clearTimeout(timer); return (j && j.ok && !j.browser) ? (this.mode = "server") : useLocal(); })
            .catch(() => useLocal());
        return this._detect;
    },
    online() {
        if (!this._online) this._online = this.detect().then(m => m !== "none");
        return this._online;
    },

    async request(method, path, body) {
        if ((await this.detect()) === "local") return this.localRequest(method, path, body);
        const headers = {};
        if (this.token) headers.Authorization = "Bearer " + this.token;
        let payload = body;
        if (body && !(body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
            payload = JSON.stringify(body);
        }
        let res;
        try {
            res = await fetch(this.url(path), { method, headers, body: payload });
        } catch (e) {
            throw Object.assign(new Error("Cannot reach the AgriCare server. Check your internet connection."), { network: true });
        }
        let data = null;
        try { data = await res.json(); } catch (e) { /* not JSON */ }
        if (res.status === 401 && this.token && !path.startsWith("/api/auth/login")) {
            this.logoutLocal();
            location.href = (this.inPages ? "" : "pages/") + "login.html?expired=1";
        }
        if (!res.ok) throw Object.assign(new Error((data && data.error) || ("Server error " + res.status)), { status: res.status, data });
        return data;
    },
    async localRequest(method, path, body) {
        const res = await LocalServer.handle(method, path, body || {}, this.token);
        if (res.status === 401 && this.token && !path.startsWith("/api/auth/login")) {
            this.logoutLocal();
            location.href = (this.inPages ? "" : "pages/") + "login.html?expired=1";
        }
        if (res.status >= 300) throw Object.assign(new Error(res.data.error), { status: res.status, data: res.data });
        return res.data;
    },
    get(p) { return this.request("GET", p); },
    post(p, b) { return this.request("POST", p, b || {}); },
    put(p, b) { return this.request("PUT", p, b || {}); },
    patch(p, b) { return this.request("PATCH", p, b || {}); },
    del(p) { return this.request("DELETE", p); },

    /* after login/register */
    saveSession(token, user) {
        const prev = this.user;
        if (!prev || prev.id !== user.id) {
            // another person on this device: don't mix their plans and scans
            AgriStore.remove("agricare_plans");
            AgriStore.remove("agricare_scans");
            AgriStore.remove("agricare_last_scan");
        }
        AgriStore.set("agricare_token", token);
        AgriStore.set("agricare_user_json", JSON.stringify(user));
        AgriStore.set("isLoggedIn", "true");
        AgriStore.set("agricare_user", user.name);
        if (user.language) AgriStore.set("agricare_lang", user.language);
    },
    logoutLocal() {
        AgriStore.remove("agricare_token");
        AgriStore.remove("agricare_user_json");
        AgriStore.remove("isLoggedIn");
    }
};

/* Safety disclaimer: shown once before AgriCare gives disease or chemical advice.
   The farmer must tick the box to continue. The answer is kept on this device (version number,
   so a changed text is shown again). */
const AgriDisclaimer = {
    VERSION: "1",
    KEY: "agricare_disclaimer_ok",
    accepted() { return AgriStore.get(this.KEY) === this.VERSION; },
    require(onAccept) {
        if (this.accepted()) { if (onAccept) onAccept(); return; }
        if (document.getElementById("disc-modal")) return;
        const back = document.createElement("div");
        back.id = "disc-modal";
        back.className = "disc-back";
        back.setAttribute("role", "dialog");
        back.setAttribute("aria-modal", "true");
        const box = document.createElement("div");
        box.className = "disc-box";
        const h = document.createElement("h2"); h.textContent = "⚠️ " + t("disc_title"); box.appendChild(h);
        ["disc_p1", "disc_p2", "disc_p3"].forEach(k => { const p = document.createElement("p"); p.textContent = t(k); box.appendChild(p); });
        const priv = document.createElement("a");
        priv.href = (location.pathname.includes("/pages/") ? "" : "pages/") + "privacy.html";
        priv.textContent = t("disc_privacy");
        box.appendChild(priv);
        const lab = document.createElement("label"); lab.className = "disc-check";
        const cb = document.createElement("input"); cb.type = "checkbox";
        lab.appendChild(cb); lab.appendChild(document.createTextNode(" " + t("disc_check")));
        box.appendChild(lab);
        const btn = document.createElement("button");
        btn.type = "button"; btn.className = "btn btn-primary"; btn.textContent = t("disc_ok"); btn.disabled = true;
        cb.addEventListener("change", () => { btn.disabled = !cb.checked; });
        btn.addEventListener("click", () => {
            AgriStore.set(this.KEY, this.VERSION);
            back.remove();
            if (onAccept) onAccept();
        });
        box.appendChild(btn);
        back.appendChild(box);
        document.body.appendChild(back);
        cb.focus();
    }
};

/* Log out also ends the server session */
const _localLogout = typeof handleLogout === "function" ? handleLogout : null;
handleLogout = function (loginPath) {
    AgriAPI.logoutLocal();
    if (_localLogout) _localLogout(loginPath);
    else location.href = loginPath || "login.html";
};

/* Keep the farmer's language on the server too, so SMS reminders arrive in that language */
if (typeof setLanguage === "function") {
    const _setLanguage = setLanguage;
    setLanguage = function (lang) {
        _setLanguage(lang);
        if (AgriAPI.token) AgriAPI.online().then(ok => { if (ok) AgriAPI.patch("/api/auth/me", { language: lang }).catch(() => {}); });
    };
}

/* ---------- Sync plans and scans with the server ---------- */
const AgriSync = {
    pending: {},
    ready: false,

    async enabled() { return !!AgriAPI.token && await AgriAPI.online(); },

    /* Upload plans made offline, then take the server's copy of everything */
    async pull() {
        if (!(await this.enabled()) || typeof AgriPlans === "undefined") return;
        try {
            const local = AgriPlans.all().filter(p => !String(p.id).startsWith("s"));
            const res = await AgriAPI.post("/api/plans/sync", { plans: local });
            AgriPlans.save(res.plans);
            const sc = await AgriAPI.get("/api/scans?limit=40");
            const list = sc.scans.map(s => ({ at: s.at, label: s.label, confidence: s.confidence, demo: s.demo,
                                               thumb: AgriAPI.asset(s.thumb), serverId: s.id }));
            AgriScans.memory = list;
            AgriStore.set(AgriScans.KEY, JSON.stringify(list));
            document.dispatchEvent(new CustomEvent("agricare:plans"));
        } catch (e) { /* stay with the local copy */ }
        this.ready = true;
    },

    async createRemote(localPlan) {
        if (!(await this.enabled())) return;
        try {
            const res = await AgriAPI.post("/api/plans", Object.assign({}, localPlan, { clientId: localPlan.id }));
            const plans = AgriPlans.all().map(p => p.id === localPlan.id ? res.plan : p);
            AgriPlans.save(plans);
        } catch (e) { /* uploaded on the next sync */ }
    },

    /* Save step changes (debounced) */
    queueTasks(planId) {
        if (!String(planId).startsWith("s")) return;
        clearTimeout(this.pending[planId]);
        this.pending[planId] = setTimeout(async () => {
            if (!(await this.enabled())) return;
            const p = AgriPlans.all().find(x => x.id === planId);
            if (!p) return;
            AgriAPI.put("/api/plans/" + planId + "/tasks", { tasks: p.tasks }).catch(() => {});
        }, 800);
    },

    async removeRemote(planId) {
        if (!String(planId).startsWith("s") || !(await this.enabled())) return;
        AgriAPI.del("/api/plans/" + planId).catch(() => {});
    }
};

if (typeof AgriPlans !== "undefined") {
    const _create = AgriPlans.create.bind(AgriPlans);
    const _update = AgriPlans.update.bind(AgriPlans);
    const _remove = AgriPlans.remove.bind(AgriPlans);
    AgriPlans.create = function (opts) {
        const plan = _create(opts);
        if (opts && opts.scanId) plan.scanId = opts.scanId;
        AgriSync.createRemote(plan);
        return plan;
    };
    AgriPlans.update = function (planId, fn) { _update(planId, fn); AgriSync.queueTasks(planId); };
    AgriPlans.remove = function (planId) { _remove(planId); AgriSync.removeRemote(planId); };
}

/* ---------- On every page ---------- */
document.addEventListener("DOMContentLoaded", async () => {
    const ok = await AgriAPI.online();
    document.documentElement.dataset.server = AgriAPI.mode;
    if (!ok || !AgriAPI.token) return;

    // check the login is still valid and refresh the profile
    AgriAPI.get("/api/auth/me").then(r => AgriStore.set("agricare_user_json", JSON.stringify(r.user))).catch(() => {});

    // officers get a link to the dashboard
    const user = AgriAPI.user;
    const nav = document.querySelector("header nav");
    if (user && user.role === "officer" && nav && !nav.querySelector(".officer-link")) {
        const a = document.createElement("a");
        a.href = (AgriAPI.inPages ? "" : "pages/") + "admin.html";
        a.className = "officer-link" + (location.pathname.endsWith("admin.html") ? " active" : "");
        a.setAttribute("data-i18n", "nav_officer");
        a.textContent = t("nav_officer");
        const logout = nav.querySelector(".logout-link");
        nav.insertBefore(a, logout || null);
    }
    AgriSync.pull();
});
