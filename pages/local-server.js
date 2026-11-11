/* AgriCare – demo server that runs inside the browser.

   Used ONLY when the real backend (backend/app.py) is not running, e.g. in the preview link or when
   index.html is opened directly. It answers the same /api/... requests as the real server, so sign-up,
   password checking, saved plans and the officer dashboard all work - but every account and record
   is stored only in THIS browser (localStorage). The real backend is what you deploy.

   Demo officer account (browser mode only): 0700000000 / admin123 */

const LocalServer = (() => {
    const KEY = "agricare_localdb";
    const OFFICER = { phone: "0700000000", password: "admin123" };
    const DISTRICTS = ["Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota",
        "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara",
        "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"];
    const KNOWN = ["bacterial_leaf_blight", "blast", "brown_spot", "healthy", "red_stripe", "sheath_blight", "tungro"];
    let memory = null;
    const failed = {};

    /* ---------- storage ---------- */
    function load() {
        if (memory) return memory;
        let db = null;
        try { db = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { /* blocked */ }
        memory = db || { users: [], tokens: {}, scans: [], plans: [], shops: [], seq: { user: 0, scan: 0, plan: 0, shop: 0 } };
        return memory;
    }
    function save() {
        try { localStorage.setItem(KEY, JSON.stringify(memory)); }
        catch (e) {
            // storage full (photos): drop the oldest scan thumbnails and try once more
            memory.scans.slice(0, Math.ceil(memory.scans.length / 2)).forEach(s => { s.thumb = null; });
            try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch (e2) { /* keep in memory */ }
        }
    }
    const nowIso = () => new Date().toISOString().replace(/\.\d+Z$/, "Z");
    const nextId = k => { const db = load(); db.seq[k] = (db.seq[k] || 0) + 1; return db.seq[k]; };

    /* ---------- passwords ---------- */
    async function hash(password, salt) {
        const text = salt + ":" + password;
        if (window.crypto && crypto.subtle && window.TextEncoder) {
            const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
            return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
        }
        let h = 5381;
        for (let i = 0; i < text.length; i++) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;
        return "d" + h.toString(16);
    }
    const randomHex = n => {
        const a = new Uint8Array(n);
        (window.crypto && crypto.getRandomValues) ? crypto.getRandomValues(a) : a.forEach((_, i) => { a[i] = Math.random() * 256; });
        return Array.from(a).map(b => b.toString(16).padStart(2, "0")).join("");
    };

    async function ensureOfficer() {
        const db = load();
        if (db.users.some(u => u.role === "officer")) return;
        const salt = randomHex(8);
        db.users.push({ id: nextId("user"), name: "Agriculture Officer (demo)", phone: OFFICER.phone, salt,
                        hash: await hash(OFFICER.password, salt), role: "officer", district: null, language: "en",
                        smsReminders: false, createdAt: nowIso() });
        save();
    }

    function normalizePhone(raw) {
        let d = String(raw || "").replace(/\D/g, "");
        if (d.startsWith("94") && d.length === 11) d = "0" + d.slice(2);
        if (d.length === 9 && d.startsWith("7")) d = "0" + d;
        return /^0\d{9}$/.test(d) ? d : null;
    }
    const publicUser = u => ({ id: u.id, name: u.name, phone: u.phone, role: u.role, district: u.district,
                               language: u.language, smsReminders: !!u.smsReminders, createdAt: u.createdAt });

    /* ---------- responses ---------- */
    const ok = (data, status = 200) => ({ status, data });
    const fail = (message, status = 400, field) => ({ status, data: field ? { error: message, field } : { error: message } });

    function userFromToken(token) {
        const db = load();
        const id = token && db.tokens[token];
        return id ? db.users.find(u => u.id === id) || null : null;
    }

    /* ---------- treatment plans ---------- */
    function steps(disease) { return (typeof TREATMENT_PLANS !== "undefined" && TREATMENT_PLANS[disease]) || []; }
    function dueAt(startDate, alarmTime, day) {
        const [y, m, d] = startDate.split("-").map(Number);
        const [hh, mm] = alarmTime.split(":").map(Number);
        return new Date(y, m - 1, d + day, hh, mm).toISOString().replace(/\.\d+Z$/, "Z");
    }
    function planOut(p) {
        return {
            id: "s" + p.id, serverId: p.id, clientId: p.clientId, disease: p.disease, field: p.field || "",
            startDate: p.startDate, alarmTime: p.alarmTime, confidence: p.confidence, scanId: p.scanId,
            status: p.tasks.every(t => t.done) ? "completed" : "active", createdAt: p.createdAt,
            tasks: p.tasks.map(t => Object.assign({}, t))
        };
    }
    function createPlan(user, data) {
        const db = load();
        if (!steps(data.disease).length) throw new Error("Unknown disease.");
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data.startDate || "")) throw new Error("Start date must look like 2026-10-02.");
        const alarm = data.alarmTime || "07:00";
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(alarm)) throw new Error("Alarm time must look like 07:00.");
        let clientId = String(data.clientId || data.id || "") || null;
        if (clientId && clientId.startsWith("s")) clientId = null;
        if (clientId) {
            const existing = db.plans.find(p => p.userId === user.id && p.clientId === clientId);
            if (existing) return existing;
        }
        const given = {};
        (data.tasks || []).forEach(t => { if (t && t.id) given[t.id] = t; });
        const p = {
            id: nextId("plan"), userId: user.id, clientId, disease: data.disease, field: String(data.field || "").slice(0, 60),
            startDate: data.startDate, alarmTime: alarm, confidence: data.confidence ?? null, scanId: data.scanId || null,
            createdAt: nowIso(),
            tasks: steps(data.disease).map((s, i) => {
                const g = given["t" + i] || {};
                return { id: "t" + i, day: s.day, check: !!s.check, dueAt: dueAt(data.startDate, alarm, s.day),
                         done: !!g.done, doneAt: g.doneAt || null,
                         condition: ["better", "same", "worse"].includes(g.condition) ? g.condition : null,
                         snoozeUntil: g.snoozeUntil || null, alarmedAt: g.alarmedAt || null, remindedAt: null };
            })
        };
        db.plans.push(p);
        return p;
    }
    const plansOf = userId => load().plans.filter(p => p.userId === userId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id).map(planOut);

    /* ---------- demo prediction ---------- */
    async function makeThumb(file) {
        try {
            const bmp = await createImageBitmap(file);
            const c = document.createElement("canvas");
            const scale = Math.min(1, 240 / Math.max(bmp.width, bmp.height));
            c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
            c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
            return c.toDataURL("image/jpeg", 0.6);
        } catch (e) { return null; }
    }
    async function predict(user, form) {
        const file = form && form.get && form.get("file");
        if (!file || !file.size) return fail("Choose a leaf photo to upload.");
        if (!/^image\//.test(file.type || "")) return fail("This file is not a photo. Choose a JPG or PNG image.");
        const thumb = await makeThumb(file);
        if (!thumb) return fail("This file is not a photo. Choose a JPG or PNG image.");
        if (typeof plantShare === "function") {
            try { if (plantShare(await createImageBitmap(file)) < LEAF_MIN_SHARE) return fail(t("up_not_leaf"), 422, "not_leaf"); }
            catch (e) { /* cannot read: carry on */ }
        }
        const bytes = new Uint8Array(await file.arrayBuffer());
        let h = 5381;
        for (let i = 0; i < bytes.length; i += Math.max(1, Math.floor(bytes.length / 4096))) h = ((h * 33) ^ bytes[i]) >>> 0;
        const label = KNOWN[h % KNOWN.length];
        const confidence = Math.round((0.82 + (h % 15) / 100) * 100) / 100;
        const rest = Math.round((1 - confidence) / 2 * 100) / 100;
        const top = [{ label, confidence }].concat(KNOWN.filter(k => k !== label).slice(0, 2).map(l => ({ label: l, confidence: rest })));
        const db = load();
        const s = { id: nextId("scan"), userId: user.id, label, confidence, demo: true, uncertain: false, top,
                    thumb, district: user.district, at: nowIso() };
        db.scans.push(s);
        save();
        const scan = scanOut(s);
        return ok({ scan, label, confidence, top, demo: true, uncertain: false }, 201);
    }
    const scanOut = s => ({ id: s.id, label: s.label, confidence: s.confidence, demo: s.demo, uncertain: s.uncertain,
                            top: s.top, image: s.thumb, thumb: s.thumb, district: s.district, at: s.at });

    /* ---------- shops ---------- */
    function km(lat1, lng1, lat2, lng2) {
        const r = Math.PI / 180, a = Math.sin((lat2 - lat1) * r / 2) ** 2 +
            Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin((lng2 - lng1) * r / 2) ** 2;
        return 2 * 6371 * Math.asin(Math.sqrt(a));
    }

    /* ---------- officer ---------- */
    const diseaseName = id => (typeof diseaseInfo === "function" ? diseaseInfo(id).name.en : id);
    const stepText = (d, i) => { const s = steps(d)[i]; return s ? s.text.en : ""; };
    function stats(days) {
        const db = load();
        const since = new Date(Date.now() - days * 86400000).toISOString();
        const now = nowIso();
        const farmers = db.users.filter(u => u.role === "farmer");
        const scans = db.scans.filter(s => s.at >= since);
        const plans = db.plans.map(planOut);
        const active = plans.filter(p => p.status === "active");
        const byDisease = {};
        scans.forEach(s => { byDisease[s.label] = (byDisease[s.label] || 0) + 1; });
        const districts = {};
        scans.filter(s => s.label !== "healthy").forEach(s => {
            const name = s.district || "Unknown";
            const d = districts[name] = districts[name] || { district: name, total: 0, diseases: {} };
            d.total++; d.diseases[s.label] = (d.diseases[s.label] || 0) + 1;
        });
        return {
            summary: {
                farmers: farmers.length, newFarmers: farmers.filter(u => u.createdAt >= since).length,
                scans: scans.length, diseasedScans: scans.filter(s => s.label !== "healthy").length,
                activePlans: active.length,
                overdueSteps: active.reduce((n, p) => n + p.tasks.filter(t => !t.done && t.dueAt < now).length, 0),
                worseReports: plans.reduce((n, p) => n + p.tasks.filter(t => t.condition === "worse").length, 0),
                demoScans: scans.filter(s => s.demo).length, days
            },
            byDisease: Object.entries(byDisease).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, name: diseaseName(label), count })),
            byDistrict: Object.values(districts).sort((a, b) => b.total - a.total),
            perDay: [],
            model: { mode: "demo", classes: KNOWN, inputSize: [224, 224], error: null, browser: true }
        };
    }
    function attention() {
        const db = load();
        const now = nowIso();
        const late = [], worse = [];
        db.plans.forEach(p => {
            const u = db.users.find(x => x.id === p.userId) || {};
            const active = p.tasks.some(t => !t.done);
            p.tasks.forEach((t, idx) => {
                const r = { id: p.id * 100 + idx, idx, day: t.day, due_at: t.dueAt, done_at: t.doneAt, plan_id: p.id,
                            disease: p.disease, field_name: p.field, user_id: u.id, name: u.name, phone: u.phone,
                            district: u.district, diseaseName: diseaseName(p.disease), step: stepText(p.disease, idx) };
                if (active && !t.done && t.dueAt < now) late.push(r);
                if (t.condition === "worse") worse.push(r);
            });
        });
        late.sort((a, b) => a.due_at.localeCompare(b.due_at));
        return { overdue: late.slice(0, 200), worse: worse.slice(0, 100) };
    }

    /* ---------- router ---------- */
    async function handle(method, fullPath, body, token) {
        await ensureOfficer();
        const [path, qs] = fullPath.split("?");
        const q = new URLSearchParams(qs || "");
        const db = load();
        const user = userFromToken(token);
        const need = () => user ? null : fail("Please log in again.", 401);
        const needOfficer = () => need() || (user.role === "officer" ? null : fail("Only agriculture officers can do this.", 403));
        let m;

        if (path === "/api/health") return ok({ ok: true, model: "demo", browser: true });
        if (path === "/api/model") return ok(stats(30).model);
        if (path === "/api/auth/districts") return ok({ districts: DISTRICTS });

        if (method === "POST" && path === "/api/auth/register") {
            const name = String(body.name || "").trim(), phone = normalizePhone(body.phone), password = body.password || "";
            if (name.length < 2) return fail("Enter your name.", 400, "name");
            if (!phone) return fail("Enter a 10-digit Sri Lankan mobile number, e.g. 0771234567.", 400, "phone");
            if (password.length < 6) return fail("Password must be at least 6 characters.", 400, "password");
            if (body.district && !DISTRICTS.includes(body.district)) return fail("Choose a district from the list.", 400, "district");
            if (db.users.some(u => u.phone === phone)) return fail("This mobile number already has an account. Log in instead.", 409, "phone");
            const salt = randomHex(8);
            const u = { id: nextId("user"), name: name.slice(0, 80), phone, salt, hash: await hash(password, salt), role: "farmer",
                        district: body.district || null, language: ["en", "si", "ta"].includes(body.language) ? body.language : "en",
                        smsReminders: body.smsReminders !== false, createdAt: nowIso() };
            db.users.push(u);
            const tok = "local." + randomHex(16);
            db.tokens[tok] = u.id;
            save();
            return ok({ token: tok, user: publicUser(u) }, 201);
        }
        if (method === "POST" && path === "/api/auth/login") {
            const phone = normalizePhone(body.phone), password = body.password || "";
            if (!phone || !password) return fail("Enter your mobile number and password.");
            const now = Date.now();
            const tries = (failed[phone] || []).filter(t => now - t < 15 * 60000);
            if (tries.length >= 8) return fail("Too many wrong tries. Wait 15 minutes and try again.", 429);
            const u = db.users.find(x => x.phone === phone);
            if (!u || (await hash(password, u.salt)) !== u.hash) {
                tries.push(now); failed[phone] = tries;
                return fail("Mobile number or password is wrong.", 401);
            }
            delete failed[phone];
            const tok = "local." + randomHex(16);
            db.tokens[tok] = u.id;
            u.lastLoginAt = nowIso();
            save();
            return ok({ token: tok, user: publicUser(u) });
        }
        if (path === "/api/auth/me") {
            if (need()) return need();
            if (method === "DELETE") {
                if ((await hash(body.password || "", user.salt)) !== user.hash) return fail("Password is wrong.", 400, "password");
                if (user.role === "officer") return fail("Officer accounts are removed by the system administrator.", 403);
                const db = load();
                db.users = db.users.filter(u => u.id !== user.id);
                db.scans = (db.scans || []).filter(x => x.userId !== user.id);
                const myPlans = (db.plans || []).filter(x => x.userId === user.id).map(x => x.id);
                db.plans = (db.plans || []).filter(x => x.userId !== user.id);
                if (db.tasks) db.tasks = db.tasks.filter(x => !myPlans.includes(x.planId));
                save();
                return ok({ ok: true });
            }
            if (method === "PATCH") {
                if (["en", "si", "ta"].includes(body.language)) user.language = body.language;
                if (body.district === null || DISTRICTS.includes(body.district)) user.district = body.district ?? user.district;
                if ("smsReminders" in body) user.smsReminders = !!body.smsReminders;
                if (body.name && body.name.trim().length >= 2) user.name = body.name.trim().slice(0, 80);
                save();
            }
            return ok({ user: publicUser(user) });
        }

        if (method === "POST" && path === "/api/predict") return need() || predict(user, body);
        if (method === "GET" && path === "/api/scans") {
            if (need()) return need();
            return ok({ scans: db.scans.filter(s => s.userId === user.id).sort((a, b) => b.at.localeCompare(a.at))
                .slice(0, Number(q.get("limit") || 40)).map(scanOut) });
        }

        if (path === "/api/plans" && method === "GET") return need() || ok({ plans: plansOf(user.id) });
        if (path === "/api/plans" && method === "POST") {
            if (need()) return need();
            try { const p = createPlan(user, body); save(); return ok({ plan: planOut(p) }, 201); }
            catch (e) { return fail(e.message); }
        }
        if (path === "/api/plans/sync" && method === "POST") {
            if (need()) return need();
            let created = 0;
            (body.plans || []).slice(0, 50).forEach(p => {
                if (!p || String(p.id || "").startsWith("s")) return;
                try { createPlan(user, p); created++; } catch (e) { /* skip */ }
            });
            save();
            return ok({ plans: plansOf(user.id), created });
        }
        if ((m = path.match(/^\/api\/plans\/s?(\d+)(\/tasks)?$/))) {
            if (need()) return need();
            const p = db.plans.find(x => x.id === Number(m[1]) && x.userId === user.id);
            if (!p) return fail("Plan not found.", 404);
            if (method === "GET") return ok({ plan: planOut(p) });
            if (method === "DELETE") { db.plans.splice(db.plans.indexOf(p), 1); save(); return ok({ ok: true }); }
            if (method === "PUT" && m[2]) {
                (body.tasks || []).forEach(t => {
                    const task = p.tasks.find(x => x.id === t.id);
                    if (!task) return;
                    task.done = !!t.done;
                    task.doneAt = task.done ? (t.doneAt || nowIso()) : null;
                    task.condition = ["better", "same", "worse"].includes(t.condition) ? t.condition : null;
                    task.snoozeUntil = t.snoozeUntil || null;
                    task.alarmedAt = t.alarmedAt || null;
                });
                save();
                return ok({ plan: planOut(p) });
            }
        }

        if (path === "/api/shops" && method === "GET") {
            const lat = parseFloat(q.get("lat")), lng = parseFloat(q.get("lng"));
            const list = db.shops.map(s => Object.assign({}, s));
            if (isNaN(lat) || isNaN(lng)) return ok({ shops: list });
            const radius = Math.min(parseFloat(q.get("radius") || "25"), 200);
            return ok({ shops: list.map(s => Object.assign(s, { km: Math.round(km(lat, lng, s.lat, s.lng) * 100) / 100 }))
                .filter(s => s.km <= radius).sort((a, b) => a.km - b.km) });
        }
        if (path === "/api/shops" && method === "POST") {
            if (needOfficer()) return needOfficer();
            const name = String(body.name || "").trim(), lat = parseFloat(body.lat), lng = parseFloat(body.lng);
            if (name.length < 2) return fail("Enter the shop name.");
            if (isNaN(lat) || isNaN(lng)) return fail("Enter the shop location (latitude and longitude).");
            if (!(lat >= 5.7 && lat <= 10 && lng >= 79.4 && lng <= 82.1)) return fail("That location is not in Sri Lanka.");
            const s = { id: nextId("shop"), name: name.slice(0, 120), type: ["agro", "asc", "garden"].includes(body.type) ? body.type : "agro",
                        lat, lng, phone: body.phone || "", address: body.address || "", district: body.district || null,
                        hours: body.hours || "", verified: true };
            db.shops.push(s); save();
            return ok({ shop: s }, 201);
        }
        if ((m = path.match(/^\/api\/shops\/(\d+)$/)) && method === "DELETE") {
            if (needOfficer()) return needOfficer();
            const i = db.shops.findIndex(s => s.id === Number(m[1]));
            if (i < 0) return fail("Shop not found.", 404);
            db.shops.splice(i, 1); save();
            return ok({ ok: true });
        }

        /* contact numbers and call-back requests */
        if (path === "/api/contacts" && method === "GET") return ok({ contacts: db.contacts || {} });
        if (path === "/api/contact-requests" && method === "POST") {
            const name = String(body.name || "").trim().slice(0, 80), phone = normalizePhone(body.phone);
            if (name.length < 2) return fail("Enter your name.", 400, "name");
            if (!phone) return fail("Enter a valid mobile number, e.g. 0771234567.", 400, "phone");
            db.requests = db.requests || [];
            const dayAgo = new Date(Date.now() - 86400000).toISOString();
            if (db.requests.filter(r => r.phone === phone && r.created_at >= dayAgo).length >= 5) return fail("We already have your request. We will call you soon.", 429);
            const r = { id: nextId("request"), user_id: user ? user.id : null, name, phone,
                        district: DISTRICTS.includes(body.district) ? body.district : null,
                        message: String(body.message || "").trim().slice(0, 1000),
                        language: ["en", "si", "ta"].includes(body.language) ? body.language : "en",
                        status: "new", created_at: nowIso(), done_at: null };
            db.requests.push(r); save();
            return ok({ ok: true, id: r.id }, 201);
        }

        if (path.startsWith("/api/admin/")) {
            if (needOfficer()) return needOfficer();
            if (path === "/api/admin/contacts" && method === "PUT") {
                const data = body.contacts || {};
                const clean = raw => {
                    const text = String(raw || "").replace(/[^\d+ ]/g, "").trim(), digits = text.replace(/\D/g, "");
                    if (!digits) return "";
                    return digits.length >= 3 && digits.length <= 15 ? text : null;
                };
                db.contacts = db.contacts || {};
                for (const d of Object.keys(data)) {
                    if (d !== "_main" && !DISTRICTS.includes(d)) return fail("Unknown district: " + d);
                    const c = data[d] || {}, phone = clean(c.phone), wa = clean(c.whatsapp);
                    if (phone === null || wa === null) return fail("Check the number for " + (d === "_main" ? "the main line" : d) + ".", 400, d);
                    if (!phone && !wa) { delete db.contacts[d]; continue; }
                    db.contacts[d] = { name: String(c.name || "").slice(0, 80), phone: phone || wa, whatsapp: wa, hours: String(c.hours || "").slice(0, 80) };
                }
                save();
                return ok({ contacts: db.contacts });
            }
            if (path === "/api/admin/contact-requests" && method === "GET") {
                const st = q.get("status") || "new";
                return ok({ requests: (db.requests || []).filter(r => st === "all" || r.status === st).slice().reverse() });
            }
            if ((m = path.match(/^\/api\/admin\/contact-requests\/(\d+)$/)) && method === "PATCH") {
                const r = (db.requests || []).find(x => x.id === Number(m[1]));
                if (!r) return fail("Request not found.", 404);
                if (!["new", "done"].includes(body.status)) return fail("Status must be new or done.");
                r.status = body.status; r.done_at = body.status === "done" ? nowIso() : null; save();
                return ok({ ok: true });
            }
            if (path === "/api/admin/stats") return ok(stats(Math.max(1, Math.min(Number(q.get("days") || 30), 365))));
            if (path === "/api/admin/overdue") return ok(attention());
            if (path === "/api/admin/reminders") return ok({ reminders: [] });
            if (path === "/api/admin/scans") {
                return ok({ scans: db.scans.slice().sort((a, b) => b.at.localeCompare(a.at)).slice(0, Number(q.get("limit") || 50)).map(s => {
                    const u = db.users.find(x => x.id === s.userId) || {};
                    return Object.assign(scanOut(s), { farmer: u.name, farmerPhone: u.phone, name: diseaseName(s.label) });
                }) });
            }
            if (path === "/api/admin/farmers") {
                const term = (q.get("q") || "").toLowerCase();
                const now = nowIso();
                return ok({ farmers: db.users.filter(u => u.role === "farmer")
                    .filter(u => !term || [u.name, u.phone, u.district].some(x => (x || "").toLowerCase().includes(term)))
                    .map(u => {
                        const ps = plansOf(u.id);
                        const sc = db.scans.filter(s => s.userId === u.id).sort((a, b) => b.at.localeCompare(a.at));
                        return { id: u.id, name: u.name, phone: u.phone, district: u.district, language: u.language,
                                 created_at: u.createdAt, last_login_at: u.lastLoginAt || null, is_demo: 0, scans: sc.length,
                                 active_plans: ps.filter(p => p.status === "active").length,
                                 overdue: ps.filter(p => p.status === "active").reduce((n, p) => n + p.tasks.filter(t => !t.done && t.dueAt < now).length, 0),
                                 last_label: sc[0] ? sc[0].label : null };
                    }).reverse() });
            }
            if ((m = path.match(/^\/api\/admin\/farmers\/(\d+)$/))) {
                const u = db.users.find(x => x.id === Number(m[1]) && x.role === "farmer");
                if (!u) return fail("Farmer not found.", 404);
                return ok({ farmer: { id: u.id, name: u.name, phone: u.phone, district: u.district, language: u.language, created_at: u.createdAt },
                            scans: db.scans.filter(s => s.userId === u.id).map(scanOut).reverse(), plans: plansOf(u.id) });
            }
        }
        return fail("Not found.", 404);
    }

    return { handle, OFFICER };
})();
