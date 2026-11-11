// Loads the website's data files and writes JSON assets for the Flutter app.
const fs = require('fs'), vm = require('vm'), path = require('path');
const pages = process.argv[2], out = process.argv[3];
const noop = () => {};
const elStub = () => new Proxy(function () {}, { get: (t, k) => k === Symbol.toPrimitive ? () => '' : elStub(), apply: () => elStub(), set: () => true });
const ctx = {
  console, setTimeout: noop, setInterval: noop, clearTimeout: noop, clearInterval: noop,
  document: elStub(), navigator: { language: 'en', userAgent: '' }, location: { pathname: '/pages/x.html', search: '', hash: '' },
  localStorage: { getItem: () => null, setItem: noop, removeItem: noop }, sessionStorage: { getItem: () => null, setItem: noop },
  CustomEvent: function () {}, Event: function () {}, Image: function () {}, Audio: function () {}, URLSearchParams,
  speechSynthesis: { getVoices: () => [], speak: noop, cancel: noop, addEventListener: noop }, fetch: () => Promise.reject(),
  addEventListener: noop, matchMedia: () => ({ matches: false, addEventListener: noop }),
};
ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
const files = ['translations.js', 'content-i18n.js', 'diseases.js', 'treatment.js', 'pests.js', 'weedicides.js', 'farm-data.js', 'chat-kb.js'];
const read = f => {
  let t = fs.readFileSync(path.join(pages, f), 'utf8');
  if (f === 'chat-kb.js') {
    const pw = t.match(/const PW = (\{[\s\S]*?\n\s*\});/);
    t = t.replace('    function answerInner(', '    globalThis.__kb = { DISEASE_WORDS, PEST_WORDS, T, W, PW: ' + (pw ? pw[1] : '{}') + ', SUGG: suggestions };\n    function answerInner(');
  }
  return t;
};
for (const f of files) vm.runInContext(read(f), ctx, { filename: f });
// other files that only add text; they may touch the page, so errors are ignored
for (const f of ['api.js', 'contacts.js', 'shops.js', 'chat.js']) {
  try { vm.runInContext(read(f), ctx, { filename: f }); } catch (e) { console.log('skip part of', f, String(e).slice(0, 80)); }
}
let src = `
;__out = {
  translations, CONTENT_I18N, DISEASES, PESTS, PEST_PLANS, WEEDS, WEED_KIND, WEEDICIDES, AGRI_DISTRICTS, ZONE_INFO, VARIETIES,
  PEST_ART_SVG: Object.fromEntries(PESTS.map(p => [p.id, PEST_ART[p.id] ? PEST_ART[p.id]() : ''])),
};`;
vm.runInContext(src, ctx, { filename: 'site.js' });
const o = ctx.__out;
fs.mkdirSync(out, { recursive: true });
const w = (name, data) => { fs.writeFileSync(path.join(out, name), JSON.stringify(data)); console.log(name, JSON.stringify(data).length); };
w('translations.json', o.translations);
const kb = ctx.__kb;
w('chat.json', { diseaseWords: kb.DISEASE_WORDS, pestWords: kb.PEST_WORDS, topics: kb.T, words: kb.W, weedicideWords: kb.PW,
  suggestions: { en: kb.SUGG('en'), si: kb.SUGG('si'), ta: kb.SUGG('ta') } });
w('diseases.json', o.DISEASES);
w('content_i18n.json', o.CONTENT_I18N);
w('pests.json', { pests: o.PESTS, plans: o.PEST_PLANS });
w('weeds.json', { weeds: o.WEEDS, kinds: o.WEED_KIND, weedicides: o.WEEDICIDES });
w('farm.json', { districts: o.AGRI_DISTRICTS, zones: o.ZONE_INFO, varieties: o.VARIETIES });
const art = path.join(out, 'pests'); fs.mkdirSync(art, { recursive: true });
for (const [id, svg] of Object.entries(o.PEST_ART_SVG)) if (svg) fs.writeFileSync(path.join(art, id + '.svg'), svg);
console.log('svgs', Object.keys(o.PEST_ART_SVG).length);
