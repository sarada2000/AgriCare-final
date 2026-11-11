// AgriCare chat brain: answers farming questions with no internet, in English, Sinhala and Tamil.
// A Dart copy of the website's pages/chat-kb.js, reading the same words and answers (assets/data/chat.json).
import 'content.dart';
import 'i18n.dart';

/// A button under an answer that opens a page of the app.
class BrainLink {
  final String page;   // diseases, scan, pests, weeds, varieties, crop, weather, shops, contact, learning
  final String label;
  const BrainLink(this.page, this.label);
}

class BrainAnswer {
  final String text;
  final List<BrainLink> links;
  final bool confident;
  final String source;  // kb, none
  const BrainAnswer(this.text, this.links, {this.confident = false, this.source = 'kb'});
}

class AgriBrain {
  AgriBrain._();
  static final AgriBrain instance = AgriBrain._();

  Content get _c => Content.instance;
  Map<String, dynamic> get _kb => _c.chat;

  // ---------- helpers ----------
  static String norm(String s) => s
      .toLowerCase()
      .replaceAll(RegExp('[‌‍]'), '')
      .replaceAll(RegExp('[?!.,;:()"\'“”‘’]'), ' ')
      .replaceAll(RegExp(r'\s+'), ' ')
      .trim();

  static final _latin = RegExp(r'^[a-z0-9 \-*]+$');

  static bool hit(String q, String kw) {
    final k0 = norm(kw);
    if (k0.isEmpty) return false;
    if (_latin.hasMatch(k0)) {
      final prefix = k0.endsWith('*');
      final k = RegExp.escape(k0.replaceFirst('*', ''));
      return RegExp('(^|[^a-z0-9])$k${prefix ? '' : r'(s|es)?(?![a-z0-9])'}').hasMatch(q);
    }
    return q.contains(k0);
  }

  static List<String> _words(dynamic l) => (l as List? ?? []).map((e) => e.toString()).toList();
  static bool any(String q, List<String> kws) => kws.any((k) => hit(q, k));
  static int count(String q, List<String> kws) => kws.where((k) => hit(q, k)).length;
  static String bullets(List<String> a) => a.map((x) => '• $x').join('\n');

  String detectLang(String text) {
    if (RegExp('[඀-෿]').hasMatch(text)) return 'si';
    if (RegExp('[஀-௿]').hasMatch(text)) return 'ta';
    return appLanguage.value;
  }

  String _tr(String key, String lang) => _c.t(key, lang);
  String _loc(dynamic m, String lang) => _c.local(m, lang);
  List<String> _list(String id, String field, dynamic english, String lang) => _c.localList(id, field, english, lang);
  List<String> _w(String name) => _words((_kb['words'] as Map?)?[name]);

  static const _pageOf = {
    'disease-library.html': 'diseases',
    'upload-image.html': 'scan',
    'pests.html': 'pests',
    'weeds.html': 'weeds',
    'varieties.html': 'varieties',
    'my-crop.html': 'crop',
    'weather.html': 'weather',
    'shops.html': 'shops',
    'contact.html': 'contact',
    'learning-hub.html': 'learning',
    'monitor.html': 'plans',
  };

  List<BrainLink> _links(List<List<String>> raw, String lang) {
    final out = <BrainLink>[];
    for (final l in raw) {
      final file = l[0].split(RegExp('[#?]')).first.split('/').last;
      final page = _pageOf[file];
      if (page != null) out.add(BrainLink(page, _tr(l[1], lang)));
    }
    return out;
  }

  List<String> suggestions() => _words((_kb['suggestions'] as Map?)?[appLanguage.value]);

  // ---------- answer builders ----------
  BrainAnswer _disease(Map<String, dynamic> d, String lang, String q) {
    final id = d['id'] as String;
    final wantPrevent = any(q, _w('prevent'));
    final wantSigns = any(q, _w('signs')) &&
        !any(q, ['treat*', 'cure', 'control', 'medicine', 'spray', 'ප්‍රතිකාර', 'බෙහෙත්', 'சிகிச்சை', 'மருந்து']);
    var text = '🩺 ${_loc(d['name'], lang)}\n${_loc(d['summary'], lang)}\n\n';
    if (wantSigns) text += '${_tr('lbl_symptoms', lang)}:\n${bullets(_list(id, 'symptoms', d['symptoms'], lang))}\n\n';
    if (!wantPrevent) text += '${_tr('lbl_manage', lang)}:\n${bullets(_list(id, 'manage', d['manage'], lang))}\n\n';
    final prev = _list(id, 'prevent', d['prevent'], lang);
    text += '${_tr('lbl_prevent', lang)}:\n${bullets(prev.take(wantPrevent ? 9 : 2).toList())}';
    return BrainAnswer(text, _links([['disease-library.html', 'nav_diseases'], ['upload-image.html', 'nav_scan']], lang));
  }

  BrainAnswer _pest(Map<String, dynamic> p, String lang, String q) {
    final id = p['id'] as String;
    final wantPrevent = any(q, _w('prevent'));
    var text = '${p['group'] == 'animal' ? '🐾' : '🐛'} ${_loc(p['name'], lang)}\n${_loc(p['summary'], lang)}\n\n';
    if (any(q, _w('signs'))) text += '${_tr('lbl_symptoms', lang)}:\n${bullets(_list(id, 'signs', p['signs'], lang))}\n\n';
    if (!wantPrevent) text += '${_tr('lbl_manage', lang)}:\n${bullets(_list(id, 'manage', p['manage'], lang))}\n\n';
    final prev = _list(id, 'prevent', p['prevent'], lang);
    text += '${_tr('lbl_prevent', lang)}:\n${bullets(prev.take(wantPrevent ? 9 : 2).toList())}';
    return BrainAnswer(text, _links([['pests.html', 'nav_pests']], lang));
  }

  String _wName(Map<String, dynamic> w, String lang) => lang == 'si' && w['nameSi'] != null ? w['nameSi'].toString() : w['name'].toString();

  BrainAnswer _weedicide(Map<String, dynamic> w, String lang) {
    var text = '🧴 ${_wName(w, lang)} (${_loc(w['ai'], lang)}) · ${w['code']}\n${_loc(w['about'], lang)}';
    for (final u0 in (w['uses'] as List)) {
      final u = u0 as Map;
      final perHa = (u['perHa'] as num);
      text += '\n\n${u['label'] != null ? '${_loc(u['label'], lang)}:\n' : ''}';
      text += bullets([
        '${_tr('wd_when', lang)}: ${_loc(u['when'], lang)}',
        '${_tr('wd_mix', lang)}: ${_tr('wd_mix_val', lang).replaceAll('{ml}', '${u['per10']}')}',
        '${_tr('wd_rate', lang)}: ${_tr('wd_rate_val', lang).replaceAll('{ha}', '${perHa.round()}').replaceAll('{ac}', '${(perHa * 0.4).round()}')}',
        if (u['water'] != null) _loc(u['water'], lang),
      ]);
    }
    final notes = (w['notes'] as List? ?? []);
    if (notes.isNotEmpty) text += '\n\n${_tr('wd_notes', lang)}:\n${bullets(notes.map((n) => _loc(n, lang)).toList())}';
    return BrainAnswer(text, _links([['weeds.html', 'nav_weeds']], lang));
  }

  String _varietyLine(Map<String, dynamic> v, String lang) =>
      '${v['id']} – ${Content.varietyAge(v)} ${_tr('v_days', lang)}, ${v['red'] == true ? _tr('v_red', lang) : _tr('v_white', lang)}, '
      '${_tr('g_${v['grain']}', lang)}, ${v['yield']} ${_tr('v_tha', lang)}';

  BrainAnswer _variety(Map<String, dynamic> v, String lang) {
    final res = Map<String, dynamic>.from(v['res'] as Map);
    final lines = ['blast', 'blb', 'gm', 'bph']
        .where((k) => (res[k] ?? '').toString().isNotEmpty)
        .map((k) => '${_tr('r_$k', lang)}: ${_tr('rl_${res[k]}', lang)}')
        .toList();
    final text = '🌾 ${_varietyLine(v, lang)}\n• ${_tr('use_${v['use']}', lang)}\n${bullets(lines)}';
    return BrainAnswer(text, _links([['varieties.html', 'nav_varieties'], ['my-crop.html', 'v_use_crop']], lang));
  }

  BrainAnswer _district(Map<String, dynamic> d, String lang) {
    final zi = _c.zones[d['zone']] as Map? ?? {};
    final rain = lang == 'si' ? zi['rainSi'] : lang == 'ta' ? zi['rainTa'] : zi['rain'];
    final rec = _c.recommendVarieties(d);
    var text = '📍 ${d[lang] ?? d['id']} – ${_tr('zone_${d['zone']}', lang)} ($rain)\n\n';
    text += '${_tr('v_for', lang)}:\n${bullets(rec['main']!.take(5).map((v) => _varietyLine(v, lang)).toList())}';
    if (d['iron'] == true) text += '\n\n${_tr('v_iron_note', lang)}';
    if (d['saline'] == true) text += '\n\n${_tr('v_saline_note', lang)}';
    text += '\n\n${_tr('off_zone_${d['zone']}', lang)}';
    return BrainAnswer(text, _links([['varieties.html', 'nav_varieties'], ['weather.html', 'nav_weather']], lang));
  }

  BrainAnswer _cropNow(String lang) {
    final crop = _c.crop;
    if (crop == null) {
      final d = _c.myDistrict();
      return BrainAnswer(
        '${_tr(Content.seasonKey(), lang)}\n\n${_tr('off_zone_${d['zone']}', lang)}\n\n${_tr('chat_set_crop', lang)}',
        _links([['my-crop.html', 'nav_crop']], lang),
      );
    }
    final v = _c.variety(crop['variety']?.toString()) ?? _c.varieties.first;
    final age = Content.varietyAge(v);
    final day = _c.cropDay() ?? 0;
    final stages = Content.cropStages(age);
    var st = stages.last;
    for (final s in stages) {
      if (day >= s.from && day <= s.to) {
        st = s;
        break;
      }
    }
    final jobs = Content.cropJobs(age)
        .where((j) => j.day >= day - 3 && j.day <= day + 7)
        .map((j) => '${_tr(j.key, lang)} (${_tr('c_day', lang)} ${j.day})')
        .toList();
    final tasks = _c.tList('do_${st.id}', lang);
    final field = (crop['field'] ?? '').toString();
    final text = '🌱 ${v['id']}${field.isNotEmpty ? ' · $field' : ''} – ${_tr('c_day', lang)} ${day < 0 ? 0 : day} · '
        '${_tr('st_${st.id}', lang)}\n\n${bullets([...jobs, ...tasks])}';
    return BrainAnswer(text, _links([['my-crop.html', 'nav_crop']], lang));
  }

  // ---------- main ----------
  BrainAnswer answer(String question) {
    final r = _answer(question);
    final words = norm(question).split(' ').length;
    final confident = r.source == 'entity' || (r.source == 'kb' && words <= 7);
    return BrainAnswer(r.text, r.links, confident: confident, source: r.source == 'none' ? 'none' : 'kb');
  }

  BrainAnswer _answer(String question) {
    final lang = detectLang(question);
    final q = ' ${norm(question)} ';
    BrainAnswer entity(BrainAnswer a) => BrainAnswer(a.text, a.links, source: 'entity');

    // 1. a named disease or pest (the longest name found wins)
    String? bestKind, bestId;
    var bestLen = 0;
    void consider(String kind, String id, List<String> words) {
      for (final w in words) {
        if (hit(q, w) && norm(w).length > bestLen) {
          bestKind = kind;
          bestId = id;
          bestLen = norm(w).length;
        }
      }
    }

    final dWords = _kb['diseaseWords'] as Map? ?? {};
    final pWords = _kb['pestWords'] as Map? ?? {};
    for (final d in _c.diseases) {
      final n = d['name'] as Map;
      consider('disease', d['id'] as String, [..._words(dWords[d['id']]), '${n['en']}', '${n['si']}', '${n['ta']}']);
    }
    for (final p in _c.pests) {
      final n = p['name'] as Map;
      consider('pest', p['id'] as String, [..._words(pWords[p['id']]), '${n['en']}', '${n['si']}', '${n['ta']}']);
    }
    if (bestKind == 'disease') return entity(_disease(_c.webDisease(bestId!)!, lang, q));
    if (bestKind == 'pest') return entity(_pest(_c.pest(bestId!)!, lang, q));

    // a weedicide by name, or a weed by name
    final pw = _kb['weedicideWords'] as Map? ?? {};
    for (final w in _c.weedicides) {
      if (_words(pw[w['id']]).any((k) => hit(q, k))) return entity(_weedicide(w, lang));
    }
    for (final wid in _c.weeds.keys) {
      final weed = _c.weeds[wid] as Map;
      final keys = ['${weed['en']}'.toLowerCase(), if (weed['si'] != null) '${weed['si']}'];
      if (keys.any((k) => k.isNotEmpty && hit(q, k))) {
        final prods = _c.weedicides.where((w) => (w['uses'] as List).any((u) => ((u as Map)['weeds'] as List? ?? []).contains(wid)));
        final lines = prods.map((w) {
          final u = (w['uses'] as List).firstWhere((x) => ((x as Map)['weeds'] as List? ?? []).contains(wid)) as Map;
          return '${_wName(w, lang)} – ${_loc(u['when'], lang)}, ${_tr('wd_mix_val', lang).replaceAll('{ml}', '${u['per10']}')}';
        }).toList();
        return entity(BrainAnswer('🌿 ${weed[lang] ?? weed['en']}:\n${bullets(lines)}', _links([['weeds.html', 'nav_weeds']], lang)));
      }
    }

    // contact: call / SMS / phone number
    if (any(q, const [
      'call', 'contact', 'phone number', 'telephone', 'hotline', 'help line', 'helpline', 'sms', 'whatsapp', 'talk to', 'speak to', 'your number',
      'අමතන්න', 'ඇමතුම', 'ඇමතිය', 'කෝල්', 'දුරකථන', 'අංකය', 'නොම්මර', 'එස්එම්එස්', 'සම්බන්ධ කර', 'කතා කරන්න ඕන', 'කතා කරන්න පුළුවන්',
      'அழை', 'தொடர்பு', 'தொலைபேசி', 'இலக்கம்', 'கோல்', 'பேச வேண்டும்', 'பேசலாமா',
    ])) {
      return entity(BrainAnswer(_tr('ct_kb', lang), [BrainLink('contact', tr('contact_title'))]));
    }

    // 2. a variety code such as "Bg 352", "at362", "bw 367"
    final vq = q.replaceAll(RegExp('බීජී|බී ජී'), 'bg').replaceAll('ඒටී', 'at');
    final vm = RegExp(r'\b(bg|at|ld|bw)\s*-?\s*(\d{2,3}(?:-\d)?)\b').firstMatch(vq);
    if (vm != null) {
      final code = vm.group(1)!;
      final id = '${code[0].toUpperCase()}${code[1]} ${vm.group(2)}';
      for (final v in _c.varieties) {
        if (v['id'].toString().toLowerCase() == id.toLowerCase()) return entity(_variety(v, lang));
      }
    }

    // 3. a district name
    Map<String, dynamic>? dist;
    for (final d in _c.districts) {
      if (hit(q, d['id'].toString().toLowerCase()) ||
          (d['si'] != null && q.contains(norm('${d['si']}'))) ||
          (d['ta'] != null && q.contains(norm('${d['ta']}')))) {
        dist = d;
        break;
      }
    }

    // 4. topics by score
    final topics = _kb['topics'] as Map? ?? {};
    String? topId;
    var topScore = 0;
    for (final id in topics.keys) {
      final s = count(q, _words((topics[id] as Map)['words']));
      if (s > topScore) {
        topScore = s;
        topId = id.toString();
      }
    }
    final isVariety = any(q, _w('variety'));

    if (dist != null && (isVariety || topId == null || topId == 'hello')) return entity(_district(dist, lang));
    if (isVariety && (topId == null || topScore < 2)) return _district(_c.myDistrict(), lang);
    if (any(q, _w('now')) && (topId == null || topId == 'hello')) return _cropNow(lang);
    if (any(q, _w('season')) && (topId == null || topId == 'weather' || topId == 'seed')) {
      final d = dist ?? _c.myDistrict();
      return BrainAnswer(
        '${_tr('w_maha', lang)}\n\n${_tr('w_yala', lang)}\n\n${_tr('w_off_now', lang)}: ${_tr(Content.seasonKey(), lang)}'
        '\n\n${_tr('off_zone_${d['zone']}', lang)}',
        _links([['weather.html', 'nav_weather']], lang),
      );
    }
    if (topId != null && !(topId == 'hello' && q.trim().split(' ').length > 4)) {
      final t = topics[topId] as Map;
      final answers = t['answers'] as Map;
      final raw = (t['links'] as List? ?? []).map((l) => (l as List).map((e) => e.toString()).toList()).toList();
      return BrainAnswer((answers[lang] ?? answers['en']).toString(), _links(raw, lang));
    }
    if (dist != null) return _district(dist, lang);

    // 5. not understood
    final farm = any(q, _w('farm'));
    return BrainAnswer(_tr(farm ? 'chat_unknown' : 'chat_offtopic', lang), const [], source: 'none');
  }
}
