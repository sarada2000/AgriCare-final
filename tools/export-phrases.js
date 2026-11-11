/* Writes voice/phrases.json: every Sinhala and Tamil sentence AgriCare can speak.
   Run again after editing texts:  node tools/export-phrases.js
   Then run:                       python tools/make_voices.py */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");

const store = {};
const noop = () => {};
const ctx = {
    console, URLSearchParams, Promise, setTimeout, clearTimeout, setInterval, clearInterval, CustomEvent: function () {},
    localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    location: { pathname: "/pages/x.html", protocol: "file:", search: "" },
    navigator: {},
    document: { addEventListener: noop, dispatchEvent: noop, querySelectorAll: () => [], documentElement: {}, getElementById: () => null }
};
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ["translations.js", "diseases.js", "treatment.js", "pests.js"]) {
    vm.runInContext(fs.readFileSync(path.join(root, "pages", f), "utf8"), ctx, { filename: f });
}
const out = {};
for (const lang of ["en", "si", "ta"]) out[lang] = vm.runInContext('agriVoicePhrases("' + lang + '")', ctx);
fs.mkdirSync(path.join(root, "voice"), { recursive: true });
fs.writeFileSync(path.join(root, "voice", "phrases.json"), JSON.stringify(out, null, 1));
console.log("Wrote voice/phrases.json:", Object.keys(out.en).length, "English,", Object.keys(out.si).length, "Sinhala and", Object.keys(out.ta).length, "Tamil phrases");
process.exit(0);
