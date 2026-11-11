/* AgriCare chat – the "digital agriculture officer" on every page.
   Answers come from, in order:
   1. sure matches in AgriCare's own farm notes (AgriBrain) – instant, works offline
   2. the AgriCare server's AI (when the server has an AI key)        – /api/chat
   3. Claude, when the page is opened inside Claude                   – claude.use("sample")
   4. AgriCare's farm notes again (the best match), so there is always an answer.
   The 📞 button opens "Contact us": call / SMS / WhatsApp the district office, or ask for a call back. */
(function () {
    if (typeof AgriBrain === "undefined") return;
    const STORE = "agricare_chat";
    const LANG_NAME = { en: "English", si: "Sinhala (සිංහල, Sinhala script)", ta: "Tamil (தமிழ், Tamil script)" };
    const STOP_AI = ["not_granted", "sampling_disabled", "not_declared", "capability_disabled", "capability_removed", "session_expired"];

    const S = { history: [], busy: false, aiOff: false, serverAI: null, sample: undefined, ctl: null, rec: null, lastQ: "" };
    try { S.history = JSON.parse(AgriStore.get(STORE) || "[]").filter(m => m && m.text && !m.pending); } catch (e) { S.history = []; }
    const save = () => AgriStore.set(STORE, JSON.stringify(S.history.filter(m => !m.pending).slice(-30).map(m => {
        const { _el, ...rest } = m; return rest;
    })));
    const $ = id => document.getElementById(id);
    function el(tag, cls, text) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }

    /* ---------- icons (simple line icons) ---------- */
    const P = {
        phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
        sms: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
        wa: '<path d="M3 21l1.7-5A9 9 0 1 1 8 19.4z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2z"/>',
        trash: '<path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
        close: '<path d="M6 6l12 12M18 6L6 18"/>',
        mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
        send: '<path d="M5 12h13M13 6l6 6-6 6"/>',
        speak: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
        stop: '<rect x="7" y="7" width="10" height="10" rx="1.5"/>',
        back: '<path d="M15 6l-6 6 6 6"/>',
        chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
        leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-4 6-6 10-8"/>'
    };
    const icon = (name, size) => '<svg class="ic" width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[name] + '</svg>';

    /* ---------- widget ---------- */
    document.querySelectorAll("#chat-container").forEach(n => n.remove());
    const box = el("div"); box.id = "chat-container";
    box.innerHTML =
        '<section id="chat-window" class="chat-win" role="dialog" aria-labelledby="chat-title" hidden>' +
        '  <header class="chat-head">' +
        '    <div class="chat-avatar" aria-hidden="true">' + icon("leaf", 22) + '<i class="chat-dot"></i></div>' +
        '    <div class="chat-id"><b id="chat-title" data-i18n="chat_header">AgriCare Officer</b><small data-i18n="chat_online">Online · English · සිංහල · தமிழ்</small></div>' +
        '    <div class="chat-actions">' +
        '      <button type="button" id="chat-contact-btn" class="chat-ib" data-i18n-title="nav_contact" title="Contact us" aria-label="Contact us">' + icon("phone") + '</button>' +
        '      <button type="button" id="chat-clear" class="chat-ib" data-i18n-title="chat_clear" title="Clear chat" aria-label="Clear chat">' + icon("trash") + '</button>' +
        '      <button type="button" id="chat-close" class="chat-ib" aria-label="Close chat">' + icon("close") + '</button>' +
        '    </div>' +
        '  </header>' +
        '  <div class="chat-main" id="chat-main">' +
        '    <div id="chat-body" aria-live="polite"></div>' +
        '    <div class="chat-chips" id="chat-chips"></div>' +
        '    <div class="chat-compose">' +
        '      <input type="text" id="chat-input" autocomplete="off" data-i18n-placeholder="chat_placeholder" placeholder="Ask about diseases, fertilizer, water...">' +
        '      <button type="button" id="chat-mic" class="chat-mic" aria-label="Speak your question">' + icon("mic", 20) + '</button>' +
        '      <button type="button" id="chat-send" class="chat-send" aria-label="Send" disabled>' + icon("send", 20) + '</button>' +
        '    </div>' +
        '  </div>' +
        '  <div class="chat-sheet" id="chat-sheet" hidden></div>' +
        '</section>' +
        '<button type="button" id="chat-btn" class="chat-fab" aria-label="Open chat assistant" aria-expanded="false">' +
        '  <span class="fab-ic">' + icon("chat", 24) + '</span><span class="fab-label" data-i18n="chat_launch">Ask AgriCare</span>' +
        '</button>';
    document.body.appendChild(box);

    function openChat(open, sheet) {
        const win = $("chat-window");
        const show = open == null ? win.hidden : open;
        win.hidden = !show;
        box.classList.toggle("open", show);
        $("chat-btn").setAttribute("aria-expanded", String(show));
        $("chat-btn").querySelector(".fab-ic").innerHTML = icon(show ? "close" : "chat", 24);
        if (show) {
            if (sheet) showContact(true); else { showContact(false); render(); }
            if (!sheet && matchMedia("(pointer:fine)").matches) $("chat-input").focus();
        }
    }
    window.toggleChat = () => openChat();
    $("chat-btn").addEventListener("click", () => openChat());
    $("chat-close").addEventListener("click", () => openChat(false));
    $("chat-contact-btn").addEventListener("click", () => showContact($("chat-sheet").hidden));
    $("chat-clear").addEventListener("click", () => {
        if (S.ctl) S.ctl.abort();
        S.history = []; save(); showContact(false); render();
    });
    $("chat-send").addEventListener("click", () => send());
    $("chat-input").addEventListener("keydown", e => { if (e.key === "Enter") send(); });
    $("chat-input").addEventListener("input", () => { $("chat-send").disabled = !$("chat-input").value.trim(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("chat-window").hidden) openChat(false); });

    /* ---------- drawing ---------- */
    function clean(text) {
        return String(text || "").replace(/\*\*(.+?)\*\*/g, "$1").replace(/^#+\s*/gm, "").replace(/^\s*[-*]\s+/gm, "• ").trim();
    }
    /* Show answer text as a title, short paragraphs and bullet points */
    function fill(node, text) {
        node.innerHTML = "";
        const lines = clean(text).split("\n");
        lines.forEach((line, i) => {
            const s = line.trim();
            if (!s) { if (i && i < lines.length - 1) node.appendChild(el("div", "b-gap")); return; }
            if (s.startsWith("•")) node.appendChild(el("div", "b-li", s.replace(/^•\s*/, "")));
            else if (/[:：]$/.test(s) && s.length < 90) node.appendChild(el("div", "b-h", s));
            else if (i === 0 && /^\p{Extended_Pictographic}/u.test(s)) node.appendChild(el("div", "b-title", s));
            else node.appendChild(el("p", "b-p", s));
        });
    }
    function typing(node) {
        node.innerHTML = '<span class="dots" aria-label="' + t("chat_thinking") + '"><i></i><i></i><i></i></span>';
    }
    function bubble(m, welcome) {
        const row = el("div", "msg-row " + (m.role === "user" ? "from-user" : "from-bot"));
        if (m.role === "bot") {
            const av = el("div", "msg-av"); av.innerHTML = icon("leaf", 15); av.setAttribute("aria-hidden", "true");
            row.appendChild(av);
        }
        const col = el("div", "msg-col");
        const b = el("div", m.role === "user" ? "msg user-msg" : "msg bot-msg");
        if (m.role === "user") b.textContent = m.text;
        else if (m.text) fill(b, m.text);
        else typing(b);
        col.appendChild(b);
        if (m.role === "bot" && m.action === "contact" && !m.pending) col.appendChild(contactCard(true));
        if (m.role === "bot" && !m.pending && !welcome) {
            const meta = el("div", "msg-meta");
            if (m.source === "ai") meta.appendChild(el("span", "msg-src ai", "✨ " + t("chat_ai")));
            else if (m.source === "kb") meta.appendChild(el("span", "msg-src", t("chat_offline")));
            if (typeof AgriVoice !== "undefined") {
                const sp = el("button", "msg-ib");
                sp.type = "button"; sp.title = t("chat_speak"); sp.setAttribute("aria-label", t("chat_speak"));
                sp.innerHTML = icon("speak", 15);
                sp.addEventListener("click", () => speak(m, sp));
                meta.appendChild(sp);
            }
            (m.links || []).forEach(l => {
                const a = el("a", "msg-link", l.label);
                a.href = l.href;
                meta.appendChild(a);
            });
            col.appendChild(meta);
        }
        row.appendChild(col);
        m._el = b;
        return row;
    }
    function render() {
        const body = $("chat-body");
        body.innerHTML = "";
        body.appendChild(bubble({ role: "bot", text: t("chat_welcome") }, true));
        S.history.forEach(m => body.appendChild(bubble(m)));
        body.scrollTop = body.scrollHeight;
        renderChips();
    }
    function renderChips() {
        const chips = $("chat-chips");
        chips.innerHTML = "";
        const list = S.history.length > 2 ? [] : AgriBrain.suggestions(getLanguage());
        list.forEach(q => {
            const c = el("button", "chat-chip", q);
            c.type = "button";
            c.addEventListener("click", () => send(q));
            chips.appendChild(c);
        });
        const call = el("button", "chat-chip chip-call");
        call.type = "button";
        call.innerHTML = icon("phone", 14) + "<span></span>";
        call.lastChild.textContent = t("nav_contact");
        call.addEventListener("click", () => showContact(true));
        chips.appendChild(call);
    }
    function update(m) {
        if (!m._el) return;
        if (m.text) fill(m._el, m.text); else typing(m._el);
        const body = $("chat-body");
        body.scrollTop = body.scrollHeight;
    }

    /* ---------- contact: call / SMS / WhatsApp / call back ---------- */
    function district() {
        const sel = $("ct-district");
        if (sel && sel.value) return sel.value;
        try { return myDistrictId(); } catch (e) { return ""; }
    }
    function smsBody(d) {
        const q = S.lastQ ? " " + S.lastQ : "";
        return "AgriCare" + (d ? " (" + d + ")" : "") + ":" + q;
    }
    function contactButtons(c, d) {
        const wrap = el("div", "ct-btns");
        const add = (cls, href, ic, label, ext) => {
            const a = el("a", "ct-btn " + cls);
            a.href = href;
            if (ext) { a.target = "_blank"; a.rel = "noopener"; }
            a.innerHTML = icon(ic, 18) + "<span></span>";
            a.lastChild.textContent = label;
            wrap.appendChild(a);
        };
        if (c.phone) add("call", AgriContacts.tel(c.phone), "phone", t("ct_call"));
        if (c.phone && AgriContacts.isMobile(c.phone)) add("sms", AgriContacts.sms(c.phone, smsBody(d)), "sms", t("ct_sms"));
        if (c.whatsapp) add("wa", AgriContacts.whatsapp(c.whatsapp, smsBody(d)), "wa", "WhatsApp", true);
        return wrap;
    }
    /* small card inside a chat answer */
    function contactCard() {
        const card = el("div", "ct-mini");
        const d = district();
        const c = AgriContacts.forDistrict(d);
        if (c) {
            card.appendChild(el("div", "ct-mini-name", (AgriContacts.name(c) || t("ct_main")) + (c.isMain ? "" : " · " + districtLabel(d))));
            card.appendChild(el("div", "ct-mini-num", c.phone || c.whatsapp));
            card.appendChild(contactButtons(c, d));
        }
        const more = el("button", "ct-more", c ? t("ct_more") : t("ct_cb_title"));
        more.type = "button";
        more.addEventListener("click", () => showContact(true));
        card.appendChild(more);
        return card;
    }
    function districtLabel(id) {
        const d = (typeof findDistrict === "function") && findDistrict(id);
        return d ? districtName(d) : (id || "");
    }
    function showContact(show) {
        $("chat-sheet").hidden = !show;
        $("chat-main").hidden = show;
        $("chat-contact-btn").classList.toggle("on", show);
        if (show) { drawContact(); AgriContacts.load().then(drawContactCard); }
    }
    function drawContact() {
        const sh = $("chat-sheet");
        sh.innerHTML = "";
        const back = el("button", "ct-back");
        back.type = "button";
        back.innerHTML = icon("back", 18) + "<span></span>";
        back.lastChild.textContent = t("ct_back");
        back.addEventListener("click", () => { showContact(false); render(); });
        sh.appendChild(back);

        sh.appendChild(el("h3", "ct-title", t("ct_title")));
        sh.appendChild(el("p", "ct-lead", t("ct_lead")));

        const lab = el("label", "ct-field");
        lab.appendChild(el("span", null, t("ct_district")));
        const sel = el("select"); sel.id = "ct-district";
        lab.appendChild(sel);
        sh.appendChild(lab);
        if (typeof fillDistrictSelect === "function") fillDistrictSelect(sel, district());
        sel.addEventListener("change", () => { AgriStore.set("agricare_district", sel.value); drawContactCard(); });

        const card = el("div", "ct-card"); card.id = "ct-card";
        sh.appendChild(card);
        drawContactCard();

        sh.appendChild(el("div", "ct-or", t("ct_or")));

        // call-back request
        const f = el("form", "ct-form"); f.noValidate = true;
        f.appendChild(el("h4", null, t("ct_cb_title")));
        f.appendChild(el("p", "ct-lead", t("ct_cb_lead")));
        const user = (typeof AgriAPI !== "undefined" && AgriAPI.user) || {};
        const field = (id, label, type, value, tag) => {
            const w = el("label", "ct-field");
            w.appendChild(el("span", null, label));
            const i = el(tag || "input"); i.id = id;
            if (type) i.type = type;
            if (value) i.value = value;
            if (tag === "textarea") i.rows = 3;
            w.appendChild(i);
            f.appendChild(w);
            return i;
        };
        const nm = field("ct-name", t("ct_name"), "text", user.role === "farmer" ? user.name : "");
        const ph = field("ct-phone", t("ct_phone"), "tel", user.role === "farmer" ? user.phone : "");
        ph.inputMode = "tel"; ph.placeholder = "07X XXX XXXX";
        const msg = field("ct-msg", t("ct_msg"), null, S.lastQ, "textarea");
        const status = el("p", "ct-status"); status.setAttribute("role", "status");
        const btn = el("button", "ct-submit", t("ct_send")); btn.type = "submit";
        f.append(status, btn);
        f.addEventListener("submit", async e => {
            e.preventDefault();
            status.className = "ct-status"; status.textContent = "";
            btn.disabled = true;
            try {
                await AgriAPI.post("/api/contact-requests", { name: nm.value.trim(), phone: ph.value.trim(), district: district(), message: msg.value.trim(), language: getLanguage() });
                f.innerHTML = "";
                const done = el("div", "ct-done");
                done.appendChild(el("div", "ct-done-ic", "✓"));
                done.appendChild(el("p", null, t("ct_sent").replace("{phone}", ph.value.trim())));
                f.appendChild(done);
            } catch (err) {
                status.className = "ct-status err";
                status.textContent = (err && err.message) || t("ct_fail");
                btn.disabled = false;
            }
        });
        sh.appendChild(f);
        sh.scrollTop = 0;
    }
    function drawContactCard() {
        const card = $("ct-card");
        if (!card) return;
        card.innerHTML = "";
        const d = district();
        const c = AgriContacts.forDistrict(d);
        if (!c) {
            card.classList.add("empty");
            card.appendChild(el("p", null, t("ct_none")));
            drawCentres();
            return;
        }
        card.classList.remove("empty");
        const top = el("div", "ct-card-top");
        const av = el("div", "ct-card-av"); av.innerHTML = icon("phone", 20);
        const who = el("div");
        who.appendChild(el("b", null, AgriContacts.name(c) || (c.isMain ? t("ct_main") : "AgriCare " + districtLabel(d))));
        who.appendChild(el("small", null, c.isMain ? t("ct_main_note") : districtLabel(d)));
        top.append(av, who);
        card.appendChild(top);
        card.appendChild(el("div", "ct-num", c.phone || c.whatsapp));
        if (c.hours) card.appendChild(el("div", "ct-hours", "🕘 " + c.hours));
        card.appendChild(contactButtons(c, d));
        // the main AgriCare line too, when the district has its own office
        const main = !c.isMain && AgriContacts.forDistrict("");
        if (main) {
            const row = el("div", "ct-mainrow");
            const info = el("div");
            info.appendChild(el("b", null, AgriContacts.name(main) || t("ct_main")));
            info.appendChild(el("span", null, main.phone));
            row.appendChild(info);
            row.appendChild(contactButtons(main, d));
            card.appendChild(row);
        }
        drawCentres();
    }
    function drawCentres() {
        const sh = $("chat-sheet");
        let box = $("ct-centres");
        if (box) box.remove();
        if (typeof AGRI_CENTRES === "undefined" || !AGRI_CENTRES.length) return;
        box = el("details", "ct-centres"); box.id = "ct-centres";
        box.appendChild(el("summary", null, "🌾 " + t("ct_centres")));
        AGRI_CENTRES.forEach(c => {
            const row = el("div", "ct-centre");
            row.appendChild(el("b", null, localText(c.name)));
            const links = el("div", "ct-centre-links");
            const a = el("a", "msg-link", "📞 " + c.phone); a.href = AgriContacts.tel(c.phone);
            links.appendChild(a);
            if (c.email) { const m = el("a", "msg-link", "✉️ " + c.email); m.href = "mailto:" + c.email; links.appendChild(m); }
            row.appendChild(links);
            box.appendChild(row);
        });
        $("ct-card").after(box);
    }

    /* ---------- speaking the answer ---------- */
    function speak(m, btn) {
        if (btn.classList.contains("on")) {
            AgriVoice.stop(); btn.classList.remove("on"); btn.innerHTML = icon("speak", 15); return;
        }
        document.querySelectorAll(".msg-ib.on").forEach(b => { b.classList.remove("on"); b.innerHTML = icon("speak", 15); });
        const text = clean(m.text).replace(/[•→✨🩺🐛🐾🌾📍🌱🙏📞]/gu, " ").replace(/\n+/g, ". ");
        const keep = window.__agriLang;
        window.__agriLang = m.lang || getLanguage();
        btn.classList.add("on"); btn.innerHTML = icon("stop", 15);
        try {
            AgriVoice.speak(text, () => { btn.classList.remove("on"); btn.innerHTML = icon("speak", 15); });
        } finally { window.__agriLang = keep; }
    }

    /* ---------- voice typing ---------- */
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) $("chat-mic").hidden = true;
    $("chat-mic").addEventListener("click", () => {
        if (S.rec) { S.rec.stop(); return; }
        const rec = new SR();
        rec.lang = { si: "si-LK", ta: "ta-LK", en: "en-US" }[getLanguage()] || "en-US";
        rec.interimResults = true;
        const input = $("chat-input");
        const before = input.placeholder;
        input.placeholder = t("chat_listen");
        $("chat-mic").classList.add("on");
        let final = "";
        rec.onresult = e => {
            let txt = "";
            for (let i = 0; i < e.results.length; i++) {
                txt += e.results[i][0].transcript;
                if (e.results[i].isFinal) final = txt;
            }
            input.value = txt;
        };
        rec.onerror = e => { if (e.error === "not-allowed" || e.error === "service-not-allowed") addBot(t("chat_mic_no")); };
        rec.onend = () => {
            S.rec = null;
            $("chat-mic").classList.remove("on");
            input.placeholder = before;
            if ((final || input.value).trim()) send((final || input.value).trim());
        };
        S.rec = rec;
        try { rec.start(); } catch (e) { S.rec = null; $("chat-mic").classList.remove("on"); }
    });

    /* ---------- asking ---------- */
    function addBot(text) {
        S.history.push({ role: "bot", text, source: "none", lang: getLanguage() });
        save(); render();
    }
    function rules(lang) {
        return "You are AgriCare, a digital agriculture officer in a website for paddy (rice) farmers in Sri Lanka. " +
            "Answer the farmer's last message ONLY in " + LANG_NAME[lang] + ", in simple words a village farmer understands. " +
            "Be direct and practical like an experienced Sri Lankan Department of Agriculture field officer: say exactly what to do, when, and which product (active ingredient) at the label dose. " +
            "NEVER tell the farmer to contact or ask an agriculture officer, instructor, 1920 or anyone else – you are the officer and must give the best solution yourself. " +
            "Keep it short: at most about 120 words, as a few lines starting with '• '. Plain text only – no headings, bold or tables. " +
            "Follow the AgriCare advice below so the website always agrees with itself. Recommend only products registered in Sri Lanka for paddy. " +
            "Peafowl and elephants are protected – never suggest harming them. " +
            "If the farmer describes leaf symptoms, name the likely cause and also tell them to scan a photo of the leaf on the Scan page. " +
            "You may also answer other farming questions in Sri Lanka (vegetables, other field crops, livestock, home gardens). " +
            "If the message is not about farming, politely say in one sentence that you help only with farming.";
    }
    function turns(question, lang, kb) {
        let info = rules(lang) + "\n\nAgriCare information:\n" + AgriBrain.context(lang).slice(0, 9000);
        if (kb && kb.source === "kb") info += "\n\nAgriCare's notes that may match this question:\n" + kb.text;
        const past = S.history.filter(m => !m.pending && m.text).slice(-7, -1)
            .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text.slice(0, 1500) }));
        return [{ role: "user", content: info }, ...past, { role: "user", content: question }];
    }
    function getSample() {
        if (S.sample !== undefined) return S.sample;
        S.sample = (window.claude && typeof window.claude.use === "function")
            ? Promise.resolve(window.claude.use("sample")).catch(() => null)
            : Promise.resolve(null);
        return S.sample;
    }

    async function send(given) {
        const input = $("chat-input");
        const question = (given != null ? given : input.value).trim();
        if (!question || S.busy) return;
        if (!$("chat-sheet").hidden) showContact(false);
        input.value = ""; $("chat-send").disabled = true;
        S.busy = true;
        S.history.push({ role: "user", text: question });
        const kb = AgriBrain.answer(question);
        if (kb.action !== "contact") S.lastQ = question;
        const m = { role: "bot", text: "", links: kb.links, lang: kb.lang, action: kb.action, pending: true };
        S.history.push(m);
        render();

        let done = false;
        if (kb.confident) {
            if (kb.action === "contact") await AgriContacts.load();
            await new Promise(r => setTimeout(r, 450));
            m.text = kb.text; m.source = "kb"; done = true;
        }
        if (!done && S.serverAI !== false && typeof AgriAPI !== "undefined") {
            try {
                if ((await AgriAPI.detect()) === "server") {
                    const r = await AgriAPI.post("/api/chat", { message: question, lang: kb.lang, history: turns(question, kb.lang, kb).slice(1, -1), context: AgriBrain.context(kb.lang), hint: kb.source === "kb" ? kb.text : "" });
                    if (r && r.answer) { m.text = r.answer; m.source = "ai"; done = true; }
                    else if (r && r.ai === false) S.serverAI = false;
                } else S.serverAI = false;
            } catch (e) { /* fall through */ }
        }
        if (!done && !S.aiOff) {
            const sample = await getSample();
            if (sample) {
                const ctl = new AbortController();
                S.ctl = ctl;
                try {
                    const res = await sample(turns(question, kb.lang, kb), {
                        modelTier: "quick", cache: false, signal: ctl.signal,
                        onText: ({ text }) => { m.text = text; m.source = "ai"; update(m); }
                    });
                    m.text = res.text; m.source = "ai"; done = true;
                } catch (e) {
                    if (e && STOP_AI.includes(e.code)) S.aiOff = true;
                    if (e && e.code === "cancelled") { S.busy = false; return; }
                    m.text = "";
                }
                S.ctl = null;
            }
        }
        if (!done) { m.text = kb.text; m.source = kb.source === "kb" ? "kb" : "none"; }

        m.pending = false;
        save();
        render();
        S.busy = false;
    }

    AgriContacts.load();
    document.addEventListener("agricare:lang", () => {
        if ($("chat-window").hidden) { renderChips(); return; }
        if (!$("chat-sheet").hidden) drawContact(); else render();
    });
    window.AgriChat = { send, open: openChat, contact: () => openChat(true, true) };
})();
