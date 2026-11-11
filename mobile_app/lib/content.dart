// The website's farm content, bundled inside the app (assets/data/*.json, exported from the website's
// pages/*.js files with tools/extract.js). Works without the server: pests, weeds, varieties, crop calendar,
// learning hub and the offline chat all read from here.
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:shared_preferences/shared_preferences.dart';

import 'api.dart';
import 'i18n.dart';

class Content {
  Content._();
  static final Content instance = Content._();

  Map<String, dynamic> _tr = {};          // website translations: en / si / ta -> key -> text (or list)
  Map<String, dynamic> _content = {};     // longer Sinhala / Tamil lists: si / ta -> id -> field -> list
  List<Map<String, dynamic>> diseases = [];
  List<Map<String, dynamic>> pests = [];
  Map<String, dynamic> pestPlans = {};
  Map<String, dynamic> weeds = {};
  Map<String, dynamic> weedKinds = {};
  List<Map<String, dynamic>> weedicides = [];
  List<Map<String, dynamic>> districts = [];
  Map<String, dynamic> zones = {};
  List<Map<String, dynamic>> varieties = [];
  Map<String, dynamic> chat = {};
  Map<String, dynamic>? crop;             // the farmer's crop: {variety, sowed (yyyy-mm-dd), field}
  bool loaded = false;

  static List<Map<String, dynamic>> _maps(dynamic l) =>
      (l as List? ?? []).map((e) => Map<String, dynamic>.from(e as Map)).toList();

  Future<Map<String, dynamic>> _json(String name) async =>
      jsonDecode(await rootBundle.loadString('assets/data/$name')) as Map<String, dynamic>;

  Future<void> load() async {
    if (loaded) return;
    try {
      _tr = await _json('translations.json');
      _content = await _json('content_i18n.json');
      diseases = _maps(jsonDecode(await rootBundle.loadString('assets/data/diseases.json')));
      final p = await _json('pests.json');
      pests = _maps(p['pests']);
      pestPlans = Map<String, dynamic>.from(p['plans'] as Map);
      final w = await _json('weeds.json');
      weeds = Map<String, dynamic>.from(w['weeds'] as Map);
      weedKinds = Map<String, dynamic>.from(w['kinds'] as Map);
      weedicides = _maps(w['weedicides']);
      final f = await _json('farm.json');
      districts = _maps(f['districts']);
      zones = Map<String, dynamic>.from(f['zones'] as Map);
      varieties = _maps(f['varieties']);
      chat = await _json('chat.json');
      final prefs = await SharedPreferences.getInstance();
      final c = prefs.getString('agricare_crop');
      if (c != null) crop = Map<String, dynamic>.from(jsonDecode(c) as Map);
      loaded = true;
    } catch (e) {
      debugPrint('Content load failed: $e');
    }
  }

  Future<void> saveCrop(Map<String, dynamic>? c) async {
    crop = c;
    final prefs = await SharedPreferences.getInstance();
    if (c == null) {
      await prefs.remove('agricare_crop');
    } else {
      await prefs.setString('agricare_crop', jsonEncode(c));
    }
    cropVersion.value++;
  }

  /// Goes up when the farmer saves their crop, so the home screen updates.
  final ValueNotifier<int> cropVersion = ValueNotifier<int>(0);

  // ---------- text ----------
  dynamic _raw(String key, [String? lang]) {
    final l = lang ?? appLanguage.value;
    final m = _tr[l];
    if (m is Map && m[key] != null) return m[key];
    final e = _tr['en'];
    if (e is Map && e[key] != null) return e[key];
    return null;
  }

  /// A website text by key, in the app language (falls back to English, then the key).
  String t(String key, [String? lang]) {
    final v = _raw(key, lang);
    if (v == null) return key;
    if (v is List) return v.join('\n');
    return v.toString();
  }

  /// A website list by key (e.g. the tasks for a crop stage).
  List<String> tList(String key, [String? lang]) {
    final v = _raw(key, lang);
    if (v is List) return v.map((e) => e.toString()).toList();
    if (v is String && v.isNotEmpty) return [v];
    return [];
  }

  /// {"en": .., "si": .., "ta": ..} -> text in the app language.
  String local(dynamic m, [String? lang]) {
    if (m is! Map) return m?.toString() ?? '';
    final l = lang ?? appLanguage.value;
    return (m[l] ?? m['en'] ?? '').toString();
  }

  /// Sinhala / Tamil version of a list (symptoms, manage...) for a disease or pest, else the English list.
  List<String> localList(String id, String field, dynamic english, [String? lang]) {
    final l = lang ?? appLanguage.value;
    List<String> asList(dynamic v) =>
        v is List ? v.map((e) => e.toString()).toList() : (v == null || v == '' ? <String>[] : [v.toString()]);
    if (l == 'en') return asList(english);
    final byLang = _content[l];
    if (byLang is Map && byLang[id] is Map && (byLang[id] as Map)[field] != null) {
      return asList((byLang[id] as Map)[field]);
    }
    return asList(english);
  }

  // ---------- names ----------
  Map<String, dynamic>? pest(String id) {
    for (final p in pests) {
      if (p['id'] == id) return p;
    }
    return null;
  }

  Map<String, dynamic>? webDisease(String id) {
    for (final d in diseases) {
      if (d['id'] == id) return d;
    }
    return null;
  }

  Map<String, dynamic>? district(String? id) {
    for (final d in districts) {
      if (d['id'] == id) return d;
    }
    return null;
  }

  String districtName(Map<String, dynamic> d) {
    final l = appLanguage.value;
    return (l != 'en' && d[l] != null) ? d[l].toString() : d['id'].toString();
  }

  /// The farmer's district: from their account, else Colombo.
  Map<String, dynamic> myDistrict() =>
      district(Api.instance.user?['district']?.toString()) ?? district('Colombo') ?? districts.first;

  Map<String, dynamic>? variety(String? id) {
    for (final v in varieties) {
      if (v['id'] == id) return v;
    }
    return null;
  }

  // ---------- varieties & crop (same rules as the website's farm-data.js) ----------
  static int varietyAge(Map<String, dynamic> v) {
    final d = v['days'] as List;
    return (((d[0] as num) + (d[1] as num)) / 2).round();
  }

  static String ageGroup(Map<String, dynamic> v) {
    final d = varietyAge(v);
    return d <= 90 ? '2.5' : d <= 100 ? '3' : d <= 115 ? '3.5' : '4';
  }

  /// Best varieties for a district, best first: {main: [...], special: [...]}.
  Map<String, List<Map<String, dynamic>>> recommendVarieties(Map<String, dynamic> d) {
    List<Map<String, dynamic>> pick(List<String> ids) =>
        ids.map(variety).whereType<Map<String, dynamic>>().toList();
    List<Map<String, dynamic>> main;
    if (d['zone'] == 'dry') {
      main = pick(['Bg 352', 'Bg 300', 'At 362', 'Bg 366', 'At 307', 'Bg 358', 'Bg 250', 'Bg 379-2']);
    } else if (d['zone'] == 'intermediate') {
      main = pick(['Bg 352', 'Bg 358', 'At 307', 'Bg 300', 'Bg 94-1', 'At 308', 'Bg 357', 'Bg 366']);
    } else {
      main = pick(['Bg 359', 'Bg 300', 'Ld 365', 'Bg 358', 'At 307', 'At 362', 'Bg 366']);
    }
    final special = <Map<String, dynamic>>[];
    if (d['iron'] == true) special.addAll(pick(['Bw 367', 'Bw 361']));
    if (d['saline'] == true) special.addAll(pick(['At 354']));
    return {'main': main, 'special': special};
  }

  static List<CropStage> cropStages(int ageDays) {
    final flower = ageDays - 30;
    final pi = flower - 35 > 30 ? flower - 35 : 30;
    return [
      const CropStage('establish', 0, 14),
      CropStage('tiller', 15, pi - 1),
      CropStage('panicle', pi, flower - 1),
      CropStage('flower', flower, flower + 14),
      CropStage('ripen', flower + 15, ageDays - 1),
      CropStage('harvest', ageDays, ageDays + 7),
    ];
  }

  static List<CropJob> cropJobs(int ageDays) {
    final flower = ageDays - 30;
    final pi = flower - 35 > 30 ? flower - 35 : 30;
    final jobs = [
      const CropJob(0, 'job_basal'),
      const CropJob(3, 'job_weed'),
      const CropJob(14, 'job_td1'),
      const CropJob(28, 'job_td2'),
      CropJob(pi, 'job_td3'),
      CropJob(flower - 7, 'job_water'),
      CropJob(flower, 'job_flower'),
      CropJob(ageDays - 14, 'job_drain'),
      CropJob(ageDays, 'job_harvest'),
    ];
    jobs.sort((a, b) => a.day.compareTo(b.day));
    return jobs;
  }

  static DateTime today() {
    final n = DateTime.now();
    return DateTime(n.year, n.month, n.day);
  }

  static DateTime parseDate(String s) {
    final p = s.split('-').map(int.parse).toList();
    return DateTime(p[0], p[1], p[2]);
  }

  /// Days since sowing of the saved crop, or null.
  int? cropDay() {
    final c = crop;
    if (c == null || c['sowed'] == null) return null;
    try {
      return today().difference(parseDate(c['sowed'].toString())).inDays;
    } catch (_) {
      return null;
    }
  }

  /// Maha / Yala advice key for this month (same as the website).
  static String seasonKey() {
    final n = DateTime.now();
    final m = n.month;
    if (m == 10 || m == 11 || (m == 9 && n.day >= 15)) return 'off_sow_maha';
    if (m == 12 || m == 1) return 'off_grow_maha';
    if (m == 2 || m == 3) return 'off_harv_maha';
    if (m == 4 || m == 5) return 'off_sow_yala';
    if (m == 6 || m == 7) return 'off_grow_yala';
    return 'off_harv_yala';
  }
}

class CropStage {
  final String id;
  final int from;
  final int to;
  const CropStage(this.id, this.from, this.to);
}

class CropJob {
  final int day;
  final String key;
  const CropJob(this.day, this.key);
}

/// Short way to read website text: wt('pest_title').
String wt(String key) => Content.instance.t(key);

/// Replaces {name} placeholders, e.g. fill('of {n} days', {'n': 105}).
String fill(String s, Map<String, Object?> values) {
  var out = s;
  values.forEach((k, v) => out = out.split('{$k}').join('${v ?? ''}'));
  return out;
}

/// Turns the website's small HTML (<strong>, <b>, <em>, <br>) into styled text.
TextSpan htmlSpan(String html, TextStyle base) {
  final spans = <TextSpan>[];
  final re = RegExp(r'<(/?)(strong|b|em|i|br)\s*/?>', caseSensitive: false);
  var bold = false, italic = false, last = 0;
  String clean(String s) => s
      .replaceAll(RegExp(r'<[^>]+>'), '')
      .replaceAll('&amp;', '&')
      .replaceAll('&nbsp;', ' ')
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll('&quot;', '"')
      .replaceAll('&#39;', "'");
  void add(String s) {
    if (s.isEmpty) return;
    spans.add(TextSpan(
      text: clean(s),
      style: TextStyle(
        fontWeight: bold ? FontWeight.w800 : null,
        fontStyle: italic ? FontStyle.italic : null,
      ),
    ));
  }

  for (final m in re.allMatches(html)) {
    add(html.substring(last, m.start));
    final closing = m.group(1) == '/';
    final tag = m.group(2)!.toLowerCase();
    if (tag == 'br') {
      spans.add(const TextSpan(text: '\n'));
    } else if (tag == 'strong' || tag == 'b') {
      bold = !closing;
    } else {
      italic = !closing;
    }
    last = m.end;
  }
  add(html.substring(last));
  return TextSpan(style: base, children: spans);
}
