// Weed control (same content as the website's weeds.html): when to spray, the dose calculator
// (always the label dose), which weedicide for which weed, product cards and the safety rules.
import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../content.dart';
import '../i18n.dart';
import '../main.dart';
import '../pictures.dart';
import '../widgets.dart';
import 'crop_screen.dart';
import 'weather_screen.dart';

Color _hex(String? s) {
  final h = (s ?? '#8FD646').replaceAll('#', '');
  return Color(int.parse(h.length == 6 ? 'FF$h' : h, radix: 16));
}

String _pName(Map<String, dynamic> p) =>
    appLanguage.value == 'si' && p['nameSi'] != null ? p['nameSi'].toString() : p['name'].toString();

int _r10(num n) => (n / 10).round() * 10;

String _fmtMl(num ml) => ml >= 1000 ? '${(ml / 10).round() / 100} L' : '${ml.round()} ml';

class WeedsScreen extends StatefulWidget {
  const WeedsScreen({super.key});

  @override
  State<WeedsScreen> createState() => _WeedsScreenState();
}

class _WeedsScreenState extends State<WeedsScreen> {
  // calculator
  String _prod = '';
  final _size = TextEditingController(text: '1');
  String _unit = 'ac';
  int _tank = 16;
  // finder
  String _weed = 'all';

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        appBar: AppBar(
          title: Text(wt('wd_title')),
          actions: const [LanguageMenu()],
          bottom: TabBar(
            isScrollable: true,
            tabAlignment: TabAlignment.start,
            labelColor: AppColors.accent,
            unselectedLabelColor: AppColors.muted,
            indicatorColor: AppColors.accent,
            tabs: [
              Tab(text: wt('wd_timeline')),
              Tab(text: wt('wd_calc')),
              Tab(text: wt('wd_finder')),
              Tab(text: wt('wd_rules_title')),
            ],
          ),
        ),
        body: TabBarView(children: [_timeline(), _calculator(), _finder(), _rules()]),
      ),
    );
  }

  // ---------------------------------------------------------------- timeline
  Widget _timeline() {
    final c = Content.instance;
    final day = c.cropDay();
    final stages = <MapEntry<Map<String, dynamic>, Map<String, dynamic>>>[];
    for (final p in c.weedicides) {
      for (final u in (p['uses'] as List)) {
        final use = Map<String, dynamic>.from(u as Map);
        if (use['crop'] == 'rice' && use['dap'] != null) stages.add(MapEntry(p, use));
      }
    }
    stages.sort((a, b) => ((a.value['dap'] as List)[0] as num).compareTo((b.value['dap'] as List)[0] as num));
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
      children: [
        ScreenTitle(wt('wd_title'), subtitle: wt('wd_lead')),
        const SizedBox(height: 10),
        Text(wt('wd_timeline_lead'), style: const TextStyle(color: AppColors.muted, height: 1.4)),
        const SizedBox(height: 12),
        if (day != null && day <= 40)
          Padding(padding: const EdgeInsets.only(bottom: 12), child: Pill(fill(wt('wd_your_day'), {'n': day}), icon: Icons.eco)),
        if (day == null)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: OutlinedButton.icon(
              onPressed: () => Navigator.of(context)
                  .push(MaterialPageRoute(builder: (_) => const CropScreen()))
                  .then((_) => setState(() {})),
              icon: const Icon(Icons.calendar_month),
              label: Text(wt('nav_crop')),
            ),
          ),
        for (final s in stages) _stageTile(s.key, s.value, day),
      ],
    );
  }

  Widget _stageTile(Map<String, dynamic> p, Map<String, dynamic> u, int? day) {
    final c = Content.instance;
    final dap = (u['dap'] as List).map((e) => (e as num).toInt()).toList();
    final due = day != null && day >= dap[0] - 1 && day <= dap[1];
    final days = dap[0] < 0 ? '${dap[0]}' : dap[0] == dap[1] ? '${dap[0]}' : '${dap[0]}–${dap[1]}';
    final color = _hex(p['color'] as String?);
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Panel(
        color: due ? AppColors.accent.withValues(alpha: 0.10) : null,
        child: Row(children: [
          Container(
            width: 64,
            padding: const EdgeInsets.symmetric(vertical: 8),
            decoration: BoxDecoration(color: AppColors.surface2, borderRadius: BorderRadius.circular(12)),
            child: Column(children: [
              Text(days, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
              Text(dap[0] < 0 ? wt('wd_before') : wt('wd_days'),
                  textAlign: TextAlign.center, style: const TextStyle(fontSize: 11, color: AppColors.muted)),
            ]),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Wrap(spacing: 6, runSpacing: 4, crossAxisAlignment: WrapCrossAlignment.center, children: [
                Text(_pName(p), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                _code(p['code'].toString(), color),
                if (due) Pill(wt('wd_due'), color: AppColors.gold),
              ]),
              const SizedBox(height: 4),
              Text((u['label'] != null ? '${c.local(u['label'])} · ' : '') + c.local(p['type']),
                  style: const TextStyle(color: AppColors.muted, fontSize: 13)),
            ]),
          ),
        ]),
      ),
    );
  }

  Widget _code(String code, Color color) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
        decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(6)),
        child: Text(code, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 12)),
      );

  // ---------------------------------------------------------------- calculator
  Widget _calculator() {
    final c = Content.instance;
    final options = <String, String>{};
    for (final p in c.weedicides) {
      final uses = p['uses'] as List;
      for (var i = 0; i < uses.length; i++) {
        final u = uses[i] as Map;
        options['${p['id']}:$i'] = _pName(p) +
            (u['label'] != null ? ' – ${c.local(u['label'])}' : '') +
            (u['crop'] == 'pineapple' ? ' – ${wt('wd_crop_pineapple')}' : '');
      }
    }
    if (!options.containsKey(_prod)) _prod = options.keys.first;
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
      children: [
        Text(wt('wd_calc'), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
        const SizedBox(height: 4),
        Text(wt('wd_calc_lead'), style: const TextStyle(color: AppColors.muted, height: 1.4)),
        const SizedBox(height: 16),
        DropdownButtonFormField<String>(
          initialValue: _prod,
          isExpanded: true,
          dropdownColor: AppColors.surface2,
          decoration: InputDecoration(labelText: wt('wd_product')),
          items: [
            for (final e in options.entries)
              DropdownMenuItem(value: e.key, child: Text(e.value, overflow: TextOverflow.ellipsis)),
          ],
          onChanged: (v) => setState(() => _prod = v ?? _prod),
        ),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(
            child: TextField(
              controller: _size,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(labelText: wt('wd_size')),
              onChanged: (_) => setState(() {}),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: DropdownButtonFormField<String>(
              initialValue: _unit,
              dropdownColor: AppColors.surface2,
              decoration: const InputDecoration(labelText: ' '),
              items: [
                DropdownMenuItem(value: 'ac', child: Text(wt('wd_unit_ac'))),
                DropdownMenuItem(value: 'ha', child: Text(wt('wd_unit_ha'))),
                DropdownMenuItem(value: 'pe', child: Text(wt('wd_unit_pe'))),
              ],
              onChanged: (v) => setState(() => _unit = v ?? _unit),
            ),
          ),
        ]),
        const SizedBox(height: 12),
        Text(wt('wd_tank'), style: const TextStyle(color: AppColors.muted)),
        const SizedBox(height: 6),
        SegmentedButton<int>(
          segments: const [
            ButtonSegment(value: 10, label: Text('10 L')),
            ButtonSegment(value: 16, label: Text('16 L')),
            ButtonSegment(value: 20, label: Text('20 L')),
          ],
          selected: {_tank},
          onSelectionChanged: (s) => setState(() => _tank = s.first),
        ),
        const SizedBox(height: 16),
        ..._calcResult(),
        const SizedBox(height: 12),
        OutlinedButton.icon(
          onPressed: () => Navigator.of(context).push(MaterialPageRoute(
              builder: (_) => Scaffold(appBar: AppBar(title: Text(tr('tab_weather'))), body: const WeatherScreen()))),
          icon: const Icon(Icons.cloud_outlined),
          label: Text(wt('wd_open_weather')),
        ),
      ],
    );
  }

  List<Widget> _calcResult() {
    final c = Content.instance;
    final parts = _prod.split(':');
    final p = c.weedicides.firstWhere((x) => x['id'] == parts[0]);
    final u = Map<String, dynamic>.from((p['uses'] as List)[int.parse(parts[1])] as Map);
    final size = double.tryParse(_size.text.replaceAll(',', '.')) ?? 0;
    final ha = _unit == 'ha' ? size : _unit == 'pe' ? size * 0.0025293 : size * 0.404686;
    if (!(size > 0)) return [_alert(wt('wd_size_bad'))];
    if (ha > 50) return [_alert(wt('wd_size_big'))];
    final perHa = (u['perHa'] as num).toDouble();
    final product = perHa * ha;
    final per10 = u['per10'].toString().split('–').map((s) => double.tryParse(s.trim()) ?? 0.0).toList();
    final lo10 = per10.first, hi10 = per10.last;
    final spray = u['sprayHa'] != null
        ? (u['sprayHa'] as List).map((e) => (e as num).toDouble()).toList()
        : [perHa / hi10 * 10, perHa / lo10 * 10];
    final wLo = spray[0] * ha, wHi = spray[1] * ha;
    final tLo = math.max(1, (wLo / _tank).ceil()), tHi = math.max(1, (wHi / _tank).ceil());
    final ptLo = lo10 * _tank / 10, ptHi = hi10 * _tank / 10;
    final out = <Widget>[
      _tile(wt('wd_need_product'), _fmtMl(product), big: true),
      const SizedBox(height: 8),
      Row(children: [
        Expanded(child: _tile(wt('wd_need_water'), wLo.round() == wHi.round() ? '${wLo.round()} L' : '${wLo.round()}–${wHi.round()} L')),
        const SizedBox(width: 8),
        Expanded(child: _tile(wt('wd_need_tanks'), tLo == tHi ? '$tLo' : '$tLo–$tHi')),
      ]),
      const SizedBox(height: 8),
      _tile(wt('wd_per_tank'), ptLo.round() == ptHi.round() ? '${ptHi.round()} ml' : '${ptLo.round()}–${ptHi.round()} ml'),
      const SizedBox(height: 10),
      Text('🗓 ${c.local(u['when'])}${u['water'] != null ? ' · 💧 ${c.local(u['water'])}' : ''}', style: const TextStyle(height: 1.4)),
      const SizedBox(height: 10),
      Panel(
        color: AppColors.accent.withValues(alpha: 0.08),
        child: Text('🛡 ${wt('wd_label_max')}', style: const TextStyle(height: 1.4)),
      ),
    ];
    final day = c.cropDay();
    final dap = u['dap'] as List?;
    if (u['crop'] == 'rice' && dap != null && day != null) {
      final a = (dap[0] as num).toInt(), b = (dap[1] as num).toInt();
      if (day < a - 1 || day > b + 1) {
        out.add(const SizedBox(height: 10));
        out.add(_alert(fill(wt('wd_wrong_time'), {'n': day, 'a': a, 'b': b})));
      }
    }
    return out;
  }

  Widget _tile(String label, String value, {bool big = false}) => Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: big ? AppColors.accent.withValues(alpha: 0.14) : AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: big ? AppColors.accent.withValues(alpha: 0.5) : AppColors.line),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(value, style: TextStyle(fontSize: big ? 28 : 20, fontWeight: FontWeight.w800, color: big ? AppColors.accent : AppColors.fg)),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(color: AppColors.muted, fontSize: 13)),
        ]),
      );

  Widget _alert(String text) => Panel(
        color: AppColors.danger.withValues(alpha: 0.12),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Icon(Icons.warning_amber_rounded, color: AppColors.danger),
          const SizedBox(width: 10),
          Expanded(child: Text(text, style: const TextStyle(height: 1.4))),
        ]),
      );

  // ---------------------------------------------------------------- finder + product cards
  Widget _finder() {
    final c = Content.instance;
    final list = c.weedicides
        .where((p) => _weed == 'all' || (p['uses'] as List).any((u) => ((u as Map)['weeds'] as List? ?? []).contains(_weed)))
        .toList();
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
      children: [
        Text(wt('wd_finder'), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
        const SizedBox(height: 4),
        Text(wt('wd_finder_lead'), style: const TextStyle(color: AppColors.muted, height: 1.4)),
        const SizedBox(height: 12),
        Align(
          alignment: Alignment.centerLeft,
          child: ChoiceChip(
            label: Text(wt('wd_all')),
            selected: _weed == 'all',
            onSelected: (_) => setState(() => _weed = 'all'),
          ),
        ),
        const SizedBox(height: 10),
        GridView.count(
          crossAxisCount: 3,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
          childAspectRatio: 0.78,
          children: [for (final id in c.weeds.keys) _weedCard(id)],
        ),
        const SizedBox(height: 14),
        for (final p in list) ...[_product(p), const SizedBox(height: 12)],
        Text(wt('wd_source'), style: const TextStyle(color: AppColors.muted, fontSize: 12)),
      ],
    );
  }

  Widget _weedCard(String id) {
    final c = Content.instance;
    final w = c.weeds[id] as Map;
    final on = _weed == id;
    return Material(
      color: on ? AppColors.accent.withValues(alpha: 0.16) : AppColors.surface,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () => setState(() => _weed = on ? 'all' : id),
        child: Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: on ? AppColors.accent : AppColors.line, width: on ? 2 : 1),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Expanded(child: WeedPicture(id, radius: 10)),
            const SizedBox(height: 5),
            Text(c.local(w), maxLines: 1, overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12.5)),
            Text(c.local(c.weedKinds[w['kind']]), maxLines: 1, overflow: TextOverflow.ellipsis,
                style: const TextStyle(color: AppColors.muted, fontSize: 11)),
          ]),
        ),
      ),
    );
  }

  String _weedLabel(String id) {
    final c = Content.instance;
    final w = c.weeds[id];
    if (w == null) return id;
    return '${c.local(w)} (${c.local(c.weedKinds[(w as Map)['kind']])})';
  }

  Widget _product(Map<String, dynamic> p) {
    final c = Content.instance;
    final color = _hex(p['color'] as String?);
    final notes = (p['notes'] as List? ?? []);
    return Panel(
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          BottlePicture(p['id'].toString(), p['code'].toString(), color),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(_pName(p), style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800)),
              if (appLanguage.value == 'si') Text(p['name'].toString(), style: const TextStyle(color: AppColors.muted, fontSize: 12)),
              const SizedBox(height: 2),
              Text(c.local(p['ai']), style: const TextStyle(color: AppColors.muted, fontSize: 13)),
              const SizedBox(height: 6),
              Wrap(spacing: 6, runSpacing: 4, children: [
                Pill('${wt('wd_code')} ${p['code']}', color: color),
                Pill(c.local(p['type']), color: AppColors.accent),
                if (p['notPaddy'] == true) Pill(wt('wd_not_paddy'), color: AppColors.danger),
              ]),
            ]),
          ),
        ]),
        const SizedBox(height: 10),
        Text(c.local(p['about']), style: const TextStyle(height: 1.45)),
        for (final u in (p['uses'] as List)) _use(Map<String, dynamic>.from(u as Map)),
        if (notes.isNotEmpty) ...[
          const SizedBox(height: 10),
          Text('⚠️ ${wt('wd_notes')}', style: const TextStyle(fontWeight: FontWeight.w800)),
          const SizedBox(height: 4),
          for (final n in notes) Text('• ${c.local(n)}', style: const TextStyle(height: 1.45)),
        ],
      ]),
    );
  }

  Widget _use(Map<String, dynamic> u) {
    final c = Content.instance;
    final perHa = (u['perHa'] as num);
    final rows = <List<String>>[
      [wt('wd_when'), c.local(u['when'])],
      [wt('wd_mix'), fill(wt('wd_mix_val'), {'ml': u['per10']}) + (u['per16'] != null ? fill(wt('wd_mix16'), {'ml': u['per16']}) : '')],
      [
        wt('wd_rate'),
        fill(wt('wd_rate_val'), {'ha': perHa.round(), 'ac': (perHa * 0.4).round()}) +
            (u['sprayHa'] != null
                ? '. ${fill(wt('wd_spray_val'), {
                    'lo': (u['sprayHa'] as List)[0],
                    'hi': (u['sprayHa'] as List)[1],
                    'alo': _r10(((u['sprayHa'] as List)[0] as num) * 0.4),
                    'ahi': _r10(((u['sprayHa'] as List)[1] as num) * 0.4),
                  })}'
                : ''),
      ],
      if (u['water'] != null) [wt('wd_water'), c.local(u['water'])],
    ];
    final weeds = (u['weeds'] as List? ?? []).map((e) => e.toString()).toList();
    return Container(
      margin: const EdgeInsets.only(top: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: AppColors.surface2, borderRadius: BorderRadius.circular(14)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        if (u['label'] != null || u['crop'] != 'rice')
          Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Text(u['label'] != null ? c.local(u['label']) : wt('wd_crop_${u['crop']}'),
                style: const TextStyle(fontWeight: FontWeight.w800)),
          ),
        for (final r in rows)
          Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(r[0], style: const TextStyle(color: AppColors.muted, fontSize: 12, fontWeight: FontWeight.w700)),
              Text(r[1], style: const TextStyle(height: 1.4)),
            ]),
          ),
        if (weeds.isNotEmpty)
          Wrap(spacing: 6, runSpacing: 6, children: [
            for (final w in weeds)
              Pill(_weedLabel(w), color: w == _weed ? AppColors.gold : AppColors.muted),
          ]),
      ]),
    );
  }

  // ---------------------------------------------------------------- rules
  Widget _rules() {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
      children: [
        Text(wt('wd_rules_title'), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
        const SizedBox(height: 12),
        for (final k in const ['wd_rule1', 'wd_rule2', 'wd_rule3', 'wd_rule4', 'wd_rule5'])
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Panel(
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Icon(Icons.verified_user_outlined, color: AppColors.accent),
                const SizedBox(width: 12),
                Expanded(child: Text(wt(k), style: const TextStyle(height: 1.45))),
              ]),
            ),
          ),
        Panel(
          color: AppColors.gold.withValues(alpha: 0.1),
          child: Text(tr('disclaimer'), style: const TextStyle(height: 1.45)),
        ),
      ],
    );
  }
}
