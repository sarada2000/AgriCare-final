// My paddy crop (same as the website's my-crop.html): choose the variety and sowing date, then see
// today's crop stage, what to do this week and the dated calendar of jobs until harvest.
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../content.dart';
import '../i18n.dart';
import '../main.dart';
import '../plan_sheet.dart' show ymd;
import '../widgets.dart';

const _stageColors = {
  'establish': Color(0xFF6BB8FF),
  'tiller': Color(0xFF8FD646),
  'panicle': Color(0xFF4CAF50),
  'flower': Color(0xFFE7BD52),
  'ripen': Color(0xFFE09A3E),
  'harvest': Color(0xFFC4793A),
};

String fmtDate(DateTime d) {
  const en = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return '${d.day} ${en[d.month - 1]} ${d.year}';
}

class CropScreen extends StatefulWidget {
  final String? variety;
  const CropScreen({super.key, this.variety});

  @override
  State<CropScreen> createState() => _CropScreenState();
}

class _CropScreenState extends State<CropScreen> {
  final _field = TextEditingController();
  late String _variety;
  late DateTime _sowed;

  @override
  void initState() {
    super.initState();
    final crop = Content.instance.crop;
    _variety = widget.variety ?? crop?['variety']?.toString() ?? 'Bg 352';
    if (Content.instance.variety(_variety) == null) _variety = 'Bg 352';
    _sowed = crop?['sowed'] != null ? Content.parseDate(crop!['sowed'].toString()) : Content.today();
    _field.text = crop?['field']?.toString() ?? '';
  }

  Future<void> _save() async {
    await Content.instance.saveCrop({'variety': _variety, 'sowed': ymd(_sowed), 'field': _field.text.trim()});
    if (!mounted) return;
    FocusScope.of(context).unfocus();
    setState(() {});
    showMessage(context, '✓ ${wt('c_save')}');
  }

  @override
  Widget build(BuildContext context) {
    final c = Content.instance;
    return Scaffold(
      appBar: AppBar(title: Text(wt('nav_crop')), actions: const [LanguageMenu()]),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 32),
        children: [
          ScreenTitle(wt('c_title'), subtitle: wt('c_lead')),
          const SizedBox(height: 14),
          Panel(
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              DropdownButtonFormField<String>(
                initialValue: _variety,
                isExpanded: true,
                dropdownColor: AppColors.surface2,
                decoration: InputDecoration(labelText: wt('c_variety'), prefixIcon: const Icon(Icons.spa_outlined)),
                items: [
                  for (final v in c.varieties)
                    DropdownMenuItem(
                      value: v['id'].toString(),
                      child: Text('${v['id']} · ${Content.varietyAge(v)} ${wt('v_days')}${v['red'] == true ? ' · ${wt('v_red')}' : ''}'),
                    ),
                ],
                onChanged: (v) => setState(() => _variety = v ?? _variety),
              ),
              const SizedBox(height: 10),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.calendar_today, color: AppColors.accent),
                title: Text(wt('c_sowed')),
                trailing: Text(fmtDate(_sowed), style: const TextStyle(fontWeight: FontWeight.w700)),
                onTap: () async {
                  final d = await showDatePicker(context: context, initialDate: _sowed, firstDate: DateTime(2024), lastDate: DateTime(2030));
                  if (d != null) setState(() => _sowed = d);
                },
              ),
              TextField(
                controller: _field,
                maxLength: 60,
                decoration: InputDecoration(labelText: wt('c_field'), prefixIcon: const Icon(Icons.landscape_outlined)),
              ),
              const SizedBox(height: 6),
              FilledButton.icon(onPressed: _save, icon: const Icon(Icons.save_outlined), label: Text(wt('c_save'))),
            ]),
          ),
          if (c.crop != null) ..._output(),
        ],
      ),
    );
  }

  List<Widget> _output() {
    final c = Content.instance;
    final crop = c.crop!;
    final v = c.variety(crop['variety']?.toString()) ?? c.variety('Bg 352')!;
    final age = Content.varietyAge(v);
    final sown = Content.parseDate(crop['sowed'].toString());
    final day = Content.today().difference(sown).inDays;
    final stages = Content.cropStages(age);
    final harvest = sown.add(Duration(days: age));
    CropStage? cur;
    if (day >= 0) {
      cur = stages.last;
      for (final s in stages) {
        if (day >= s.from && day <= s.to) {
          cur = s;
          break;
        }
      }
    }
    final jobs = Content.cropJobs(age);
    final field = (crop['field'] ?? '').toString();
    final week = jobs.where((j) => j.day >= day - 3 && j.day <= day + 7).toList();
    final stageTasks = cur == null ? <String>[] : c.tList('do_${cur.id}');
    return [
      const SizedBox(height: 18),
      Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(22),
          gradient: const LinearGradient(colors: [Color(0xFF2E5A1C), Color(0xFF16261A)], begin: Alignment.topLeft, end: Alignment.bottomRight),
          border: Border.all(color: AppColors.accent.withValues(alpha: 0.35)),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(wt('c_stage_now').toUpperCase(),
              style: const TextStyle(color: AppColors.accent, fontSize: 12, fontWeight: FontWeight.w800, letterSpacing: 1.1)),
          const SizedBox(height: 6),
          Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
            Expanded(
              child: Text(day < 0 ? wt('c_not_sown') : wt('st_${cur!.id}'),
                  style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, height: 1.1)),
            ),
            Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Text(day < 0 ? '–' : '$day', style: const TextStyle(fontSize: 34, fontWeight: FontWeight.w900, color: AppColors.accent)),
              Text(fill(wt('c_dayof'), {'n': age}), style: const TextStyle(color: Color(0xFFD5E2CC), fontSize: 12)),
            ]),
          ]),
          const SizedBox(height: 8),
          Text(
            '${v['id']}${field.isNotEmpty ? ' · $field' : ''} · ${wt('c_harvest_on')}: ${fmtDate(harvest)}'
            '${day >= 0 && day < age ? ' · ${age - day} ${wt('c_days_left')}' : ''}',
            style: const TextStyle(color: Color(0xFFD5E2CC), height: 1.4),
          ),
          const SizedBox(height: 14),
          _stageBar(stages, cur, day, age),
        ]),
      ),
      const SizedBox(height: 18),
      Text(wt('c_this_week'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
      const SizedBox(height: 10),
      for (final j in week)
        _advice('📅 ${fmtDate(sown.add(Duration(days: j.day)))} – ${wt(j.key)}', j.day < day ? AppColors.gold : AppColors.accent),
      for (final t in stageTasks) _advice(t, const Color(0xFF6BB8FF)),
      if (week.isEmpty && stageTasks.isEmpty) Text(tr('no_tasks'), style: const TextStyle(color: AppColors.muted)),
      const SizedBox(height: 18),
      Text(wt('c_calendar'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
      const SizedBox(height: 10),
      for (final j in jobs) _calItem(j, sown, day, field),
    ];
  }

  Widget _stageBar(List<CropStage> stages, CropStage? cur, int day, int age) {
    final total = age + 7;
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      LayoutBuilder(builder: (context, box) {
        return Stack(clipBehavior: Clip.none, children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Row(children: [
              for (final s in stages)
                Expanded(
                  flex: s.to - s.from + 1,
                  child: Container(
                    height: 14,
                    color: (_stageColors[s.id] ?? AppColors.accent).withValues(alpha: cur?.id == s.id ? 1 : 0.35),
                  ),
                ),
            ]),
          ),
          if (day >= 0)
            Positioned(
              left: (box.maxWidth * (day / total).clamp(0.0, 1.0).toDouble()) - 2,
              top: -4,
              child: Container(width: 4, height: 22, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(2))),
            ),
        ]);
      }),
      const SizedBox(height: 6),
      Row(children: [
        for (final s in stages)
          Expanded(
            flex: s.to - s.from + 1,
            child: Text(
              wt('st_${s.id}'),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 10,
                color: cur?.id == s.id ? Colors.white : const Color(0xFFB9C9AF),
                fontWeight: cur?.id == s.id ? FontWeight.w800 : FontWeight.w500,
              ),
            ),
          ),
      ]),
    ]);
  }

  Widget _advice(String text, Color color) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.10),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: color.withValues(alpha: 0.4)),
          ),
          child: Text(text, style: const TextStyle(height: 1.4)),
        ),
      );

  Widget _calItem(CropJob j, DateTime sown, int day, String field) {
    final when = sown.add(Duration(days: j.day));
    final state = j.day < day ? 'done' : j.day <= day + 7 ? 'today' : 'upcoming';
    final color = state == 'done' ? AppColors.muted : state == 'today' ? AppColors.gold : AppColors.accent;
    return IntrinsicHeight(
      child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        SizedBox(
          width: 30,
          child: Column(children: [
            Container(
              width: 22,
              height: 22,
              decoration: BoxDecoration(color: color.withValues(alpha: 0.2), shape: BoxShape.circle, border: Border.all(color: color)),
              child: state == 'done' ? Icon(Icons.check, size: 14, color: color) : null,
            ),
            Expanded(child: Container(width: 2, color: AppColors.line)),
          ]),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 14),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Text('${wt('c_day')} ${j.day}', style: TextStyle(fontWeight: FontWeight.w800, color: color)),
                const SizedBox(width: 8),
                Text(fmtDate(when), style: const TextStyle(color: AppColors.muted, fontSize: 13)),
              ]),
              const SizedBox(height: 4),
              Text(wt(j.key), style: TextStyle(height: 1.4, color: state == 'done' ? AppColors.muted : AppColors.fg)),
              if (j.day >= day)
                TextButton.icon(
                  style: TextButton.styleFrom(padding: EdgeInsets.zero, visualDensity: VisualDensity.compact),
                  onPressed: () => launchUrl(_gcal('${wt(j.key)}${field.isNotEmpty ? ' ($field)' : ''}', when),
                      mode: LaunchMode.externalApplication),
                  icon: const Icon(Icons.event, size: 16),
                  label: Text(wt('c_gcal')),
                ),
            ]),
          ),
        ),
      ]),
    );
  }

  Uri _gcal(String title, DateTime date) {
    String d8(DateTime d) => '${d.year}${d.month.toString().padLeft(2, '0')}${d.day.toString().padLeft(2, '0')}';
    final next = date.add(const Duration(days: 1));
    return Uri.https('calendar.google.com', '/calendar/render', {
      'action': 'TEMPLATE',
      'text': 'AgriCare – $title',
      'dates': '${d8(date)}/${d8(next)}',
    });
  }
}

/// Small "My crop" card for the home screen.
class CropSummaryCard extends StatelessWidget {
  const CropSummaryCard({super.key});

  @override
  Widget build(BuildContext context) {
    final c = Content.instance;
    return ListenableBuilder(
      listenable: Listenable.merge([c.cropVersion, appLanguage]),
      builder: (context, _) {
        final crop = c.crop;
        void open() => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const CropScreen()));
        if (crop == null) {
          return Panel(
            onTap: open,
            child: Row(children: [
              const Icon(Icons.calendar_month, color: AppColors.accent, size: 30),
              const SizedBox(width: 12),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(wt('nav_crop'), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                  Text(wt('c_lead'), maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(color: AppColors.muted)),
                ]),
              ),
              const Icon(Icons.chevron_right, color: AppColors.muted),
            ]),
          );
        }
        final v = c.variety(crop['variety']?.toString()) ?? c.variety('Bg 352')!;
        final age = Content.varietyAge(v);
        final day = c.cropDay() ?? 0;
        final stages = Content.cropStages(age);
        var cur = stages.last;
        for (final s in stages) {
          if (day >= s.from && day <= s.to) {
            cur = s;
            break;
          }
        }
        final next = Content.cropJobs(age).where((j) => j.day >= day).toList();
        return Panel(
          onTap: open,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              const Icon(Icons.grass, color: AppColors.accent),
              const SizedBox(width: 8),
              Expanded(
                child: Text('${wt('nav_crop')} · ${v['id']}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
              ),
              Pill(day < 0 ? wt('c_not_sown') : '${wt('c_day')} $day / $age'),
            ]),
            const SizedBox(height: 10),
            Text(day < 0 ? wt('c_not_sown') : wt('st_${cur.id}'),
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.accent)),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: (day / age).clamp(0.0, 1.0).toDouble(),
                minHeight: 8,
                backgroundColor: AppColors.surface2,
              ),
            ),
            if (next.isNotEmpty) ...[
              const SizedBox(height: 10),
              Text('📅 ${wt('c_day')} ${next.first.day}: ${wt(next.first.key)}',
                  maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(color: AppColors.muted, height: 1.35)),
            ],
          ]),
        );
      },
    );
  }
}
