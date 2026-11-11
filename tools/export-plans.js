/* Writes backend/data/plans.json from the website's treatment plans, so the server and website
   always use the same steps. Run again after editing pages/treatment.js or pages/diseases.js:
       node tools/export-plans.js */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const store = {}, noop = () => {};
const ctx = {
    console, URLSearchParams, Promise, setTimeout, clearTimeout, setInterval: () => 0, clearInterval: noop, CustomEvent: function () {},
    localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    location: { pathname: "/pages/x.html", protocol: "file:", search: "" }, navigator: {},
    document: { addEventListener: noop, dispatchEvent: noop, querySelectorAll: () => [], documentElement: {}, getElementById: () => null }
};
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ["translations.js", "diseases.js", "treatment.js", "pests.js"]) vm.runInContext(fs.readFileSync(path.join(root, "pages", f), "utf8"), ctx);
const data = vm.runInContext(`(() => {
    const out = {};
    const all = DISEASES.concat([HEALTHY], PESTS.map(p => ({ id: p.id, name: p.name, type: "pest:" + p.group })));
    all.forEach(d => {
        out[d.id] = {
            name: d.name, type: d.type || null,
            steps: (TREATMENT_PLANS[d.id] || []).map(s => ({ day: s.day, check: !!s.check, text: s.text }))
        };
    });
    return out;
})()`, ctx);
fs.mkdirSync(path.join(root, "backend", "data"), { recursive: true });
fs.writeFileSync(path.join(root, "backend", "data", "plans.json"), JSON.stringify(data, null, 1));
console.log("Wrote backend/data/plans.json:", Object.keys(data).join(", "));
process.exit(0);
