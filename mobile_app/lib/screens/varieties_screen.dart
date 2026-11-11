// Paddy varieties (same content as the website's varieties.html): best varieties for your district,
// filters by age and colour, disease resistance, and "Use for my crop".
import 'package:flutter/material.dart';

import '../content.dart';
import '../main.dart';
import '../widgets.dart';
import 'crop_screen.dart';

class VarietiesScreen extends StatefulWidget {
  const VarietiesScreen({super.key});

  @override
  State<VarietiesScreen> createState() => _VarietiesScreenState();
}

class _VarietiesScreenState extends State<VarietiesScreen> {
  late String _district = Content.instance.myDistrict()['id'].toString();
  String _age = '';
  String _colour = '';

  bool _pass(Map<String, dynamic> v) {
    if (_age.isNotEmpty && Content.ageGroup(v) != _age) return false;
    if (_colour == 'red' && v['red'] != true) return false;
    if (_colour == 'white' && v['red'] == true) return false;
    return true;
  }

  @override
  Widget build(BuildContext context) {
    final c = Content.instance;
    final d = c.district(_district) ?? c.myDistrict();
    final rec = c.recommendVarieties(d);
    final best = rec['main']!.where(_pass).toList();
    final special = rec['special']!.where(_pass).toList();
    final all = c.varieties.where(_pass).toList();
    return Scaffold(
      appBar: AppBar(title: Text(wt('nav_varieties')), actions: const [LanguageMenu()]),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
        children: [
          ScreenTitle(wt('v_title'), subtitle: wt('v_lead')),
          const SizedBox(height: 14),
          DropdownButtonFormField<String>(
            initialValue: _district,
            isExpanded: true,
            dropdownColor: AppColors.surface2,
            decoration: InputDecoration(labelText: wt('w_district'), prefixIcon: const Icon(Icons.place_outlined)),
            items: [for (final x in c.districts) DropdownMenuItem(value: x['id'].toString(), child: Text(c.districtName(x)))],
            onChanged: (v) => setState(() => _district = v ?? _district),
          ),
          const SizedBox(height: 10),
          Row(children: [
            Expanded(
              child: DropdownButtonFormField<String>(
                initialValue: _age,
                isExpanded: true,
                dropdownColor: AppColors.surface2,
                decoration: InputDecoration(labelText: wt('v_filter_age')),
                items: [
                  DropdownMenuItem(value: '', child: Text(wt('v_any'))),
                  for (final g in const ['2.5', '3', '3.5', '4']) DropdownMenuItem(value: g, child: Text(_groupText(g))),
                ],
                onChanged: (v) => setState(() => _age = v ?? ''),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: DropdownButtonFormField<String>(
                initialValue: _colour,
                isExpanded: true,
                dropdownColor: AppColors.surface2,
                decoration: InputDecoration(labelText: wt('v_filter_colour')),
                items: [
                  DropdownMenuItem(value: '', child: Text(wt('v_any'))),
                  DropdownMenuItem(value: 'white', child: Text(wt('v_white'))),
                  DropdownMenuItem(value: 'red', child: Text(wt('v_red'))),
                ],
                onChanged: (v) => setState(() => _colour = v ?? ''),
              ),
            ),
          ]),
          const SizedBox(height: 18),
          Text('${wt('v_for')}: ${c.districtName(d)}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
          const SizedBox(height: 4),
          Text(wt('zone_${d['zone']}') + (d['hill'] == true ? ' (${wt('w_hill')})' : ''),
              style: const TextStyle(color: AppColors.accent, fontWeight: FontWeight.w700)),
          const SizedBox(height: 10),
          if (d['iron'] == true) _note(wt('v_iron_note'), warn: true),
          if (d['saline'] == true) _note(wt('v_saline_note'), warn: true),
          _note(wt('v_tip_water')),
          _note(wt('v_tip_blast')),
          const SizedBox(height: 8),
          if (best.isEmpty) Text(wt('lib_empty'), style: const TextStyle(color: AppColors.muted)),
          for (var i = 0; i < best.length; i++) ...[_card(best[i], best: i < 3), const SizedBox(height: 10)],
          if (special.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(wt('v_special'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 10),
            for (final v in special) ...[_card(v), const SizedBox(height: 10)],
          ],
          const SizedBox(height: 8),
          Text(wt('v_all'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
          const SizedBox(height: 10),
          for (final v in all) ...[_row(v), const SizedBox(height: 8)],
          const SizedBox(height: 10),
          Text(wt('v_source'), style: const TextStyle(color: AppColors.muted, fontSize: 12)),
        ],
      ),
    );
  }

  static String _groupText(String g) =>
      '${const {'2.5': '2½', '3': '3', '3.5': '3½', '4': '4–4½'}[g]} ${wt('v_months')}';

  static String _ageText(Map<String, dynamic> v) {
    final d = v['days'] as List;
    return '${d[0] == d[1] ? d[0] : '${d[0]}–${d[1]}'} ${wt('v_days')}';
  }

  static Color _resColor(String? r) {
    if (r == null || r.isEmpty) return AppColors.muted;
    if (r.startsWith('R')) return AppColors.accent;
    if (r.startsWith('MR')) return const Color(0xFFB8D86B);
    if (r.startsWith('MS')) return AppColors.gold;
    return AppColors.danger;
  }

  static String _resText(String? r) =>
      (r == null || r.isEmpty) ? '–' : r.split('/').map((x) => wt('rl_$x')).join(' / ');

  Widget _note(String text, {bool warn = false}) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Panel(
          padding: const EdgeInsets.all(12),
          color: warn ? AppColors.gold.withValues(alpha: 0.1) : null,
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Icon(warn ? Icons.warning_amber_rounded : Icons.lightbulb_outline, color: warn ? AppColors.gold : AppColors.accent, size: 20),
            const SizedBox(width: 10),
            Expanded(child: Text(text, style: const TextStyle(height: 1.4))),
          ]),
        ),
      );

  Widget _card(Map<String, dynamic> v, {bool best = false}) {
    final res = Map<String, dynamic>.from(v['res'] as Map);
    return Panel(
      color: best ? AppColors.accent.withValues(alpha: 0.07) : null,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          if (best) const Padding(padding: EdgeInsets.only(right: 6), child: Icon(Icons.star_rounded, color: AppColors.gold)),
          Text(v['id'].toString(), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
          if (v['nick'] != null) ...[
            const SizedBox(width: 8),
            Flexible(child: Text(v['nick'].toString(), style: const TextStyle(color: AppColors.muted), overflow: TextOverflow.ellipsis)),
          ],
          const Spacer(),
          Pill(v['red'] == true ? wt('v_red') : wt('v_white'), color: v['red'] == true ? AppColors.danger : AppColors.fg),
        ]),
        const SizedBox(height: 8),
        Wrap(spacing: 14, runSpacing: 4, children: [
          Text('⏱ ${_groupText(Content.ageGroup(v))} · ${_ageText(v)}'),
          Text('🌾 ${wt('g_${v['grain']}')}'),
          Text('📈 ${v['yield']} ${wt('v_tha')}'),
        ]),
        const SizedBox(height: 10),
        Wrap(spacing: 6, runSpacing: 6, children: [
          for (final k in const ['blast', 'blb', 'gm', 'bph'])
            Pill('${wt('r_$k')}: ${_resText(res[k]?.toString())}', color: _resColor(res[k]?.toString())),
        ]),
        const SizedBox(height: 10),
        Text(wt('use_${v['use']}') + (v['popular'] != null ? ' · ${v['popular']}% ${wt('v_popular')}' : ''),
            style: const TextStyle(color: AppColors.muted, fontSize: 13)),
        const SizedBox(height: 10),
        OutlinedButton.icon(
          onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => CropScreen(variety: v['id'].toString()))),
          icon: const Icon(Icons.calendar_month),
          label: Text(wt('v_use_crop')),
        ),
      ]),
    );
  }

  Widget _row(Map<String, dynamic> v) {
    final res = Map<String, dynamic>.from(v['res'] as Map);
    return Panel(
      padding: const EdgeInsets.all(12),
      onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => CropScreen(variety: v['id'].toString()))),
      child: Row(children: [
        SizedBox(
          width: 82,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(v['id'].toString(), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
            if (v['red'] == true) Text(wt('v_red'), style: const TextStyle(color: AppColors.danger, fontSize: 11)),
          ]),
        ),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('${_ageText(v)} · ${v['yield']} ${wt('v_tha')}', style: const TextStyle(fontSize: 13)),
            Text(wt('g_${v['grain']}'), style: const TextStyle(color: AppColors.muted, fontSize: 12)),
          ]),
        ),
        for (final k in const ['blast', 'blb', 'gm', 'bph'])
          Container(
            width: 10,
            height: 10,
            margin: const EdgeInsets.only(left: 4),
            decoration: BoxDecoration(color: _resColor(res[k]?.toString()), shape: BoxShape.circle),
          ),
      ]),
    );
  }
}
