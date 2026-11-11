// Home tab: greeting, big scan button, numbers, today's treatment reminders and recent scans.
import 'package:flutter/material.dart';

import '../api.dart';
import '../content.dart';
import '../i18n.dart';
import '../widgets.dart';
import 'crop_screen.dart';
import 'diseases_screen.dart';
import 'history_screen.dart';
import 'officer_screen.dart';
import 'pages.dart';
import 'plans_screen.dart';

class DashboardScreen extends StatefulWidget {
  final void Function(int tab) goTo;
  const DashboardScreen({super.key, required this.goTo});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  List<dynamic> _scans = [];
  List<dynamic> _plans = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    dataVersion.addListener(_load);
    _load();
  }

  @override
  void dispose() {
    dataVersion.removeListener(_load);
    super.dispose();
  }

  Future<void> _load() async {
    try {
      final s = await Api.instance.get('/api/scans');
      final p = await Api.instance.get('/api/plans');
      _scans = s['scans'] as List? ?? [];
      _plans = p['plans'] as List? ?? [];
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  /// Steps of active plans that are due today or late (the in-app alarm list).
  List<Map<String, dynamic>> _dueTasks() {
    final now = DateTime.now();
    final endOfToday = DateTime(now.year, now.month, now.day, 23, 59, 59);
    final out = <Map<String, dynamic>>[];
    for (final p in _plans) {
      if (p['status'] != 'active') continue;
      for (final t in (p['tasks'] as List? ?? [])) {
        if (t['done'] == true) continue;
        final due = DateTime.tryParse('${t['dueAt'] ?? ''}')?.toLocal();
        if (due != null && due.isBefore(endOfToday)) out.add({'plan': p, 'task': t, 'due': due});
      }
    }
    out.sort((a, b) => (a['due'] as DateTime).compareTo(b['due'] as DateTime));
    return out;
  }

  @override
  Widget build(BuildContext context) {
    final name = (Api.instance.user?['name'] ?? '').toString().split(' ').first;
    final due = _dueTasks();
    final active = _plans.where((p) => p['status'] == 'active').length;
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
        children: [
          ScreenTitle('${tr('hello')}, $name', subtitle: tr('home_sub')),
          const SizedBox(height: 18),
          if (Api.instance.isOfficer) ...[
            Panel(
              color: AppColors.gold.withValues(alpha: 0.12),
              onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const OfficerScreen())),
              child: const Row(children: [
                Icon(Icons.admin_panel_settings_outlined, color: AppColors.gold, size: 30),
                SizedBox(width: 12),
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Officer dashboard', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17)),
                    Text('Farmers, calls, late steps, scans, diseases and shops', style: TextStyle(color: AppColors.muted)),
                  ]),
                ),
                Icon(Icons.chevron_right, color: AppColors.muted),
              ]),
            ),
            const SizedBox(height: 16),
          ],
          _hero(),
          const SizedBox(height: 16),
          Row(children: [
            _stat(Icons.camera_alt_outlined, '${_scans.length}', tr('stat_scans')),
            const SizedBox(width: 10),
            _stat(Icons.event_note_outlined, '$active', tr('stat_plans')),
            const SizedBox(width: 10),
            _stat(Icons.alarm, '${due.length}', tr('stat_due'), warn: due.isNotEmpty),
          ]),
          const SizedBox(height: 16),
          const CropSummaryCard(),
          const SizedBox(height: 16),
          const ToolsGrid(),
          const SizedBox(height: 24),
          _sectionTitle(tr('today_tasks'), () => widget.goTo(4)),
          const SizedBox(height: 10),
          if (_loading) const LinearProgressIndicator(),
          if (!_loading && due.isEmpty)
            Panel(
              child: Row(children: [
                const Icon(Icons.check_circle_outline, color: AppColors.accent),
                const SizedBox(width: 12),
                Expanded(child: Text(tr('no_tasks'), style: const TextStyle(color: AppColors.muted))),
              ]),
            ),
          for (final d in due.take(4)) ...[_taskCard(d), const SizedBox(height: 8)],
          const SizedBox(height: 16),
          _sectionTitle(tr('recent_scans'), () {
            Navigator.of(context).push(MaterialPageRoute(builder: (_) => const HistoryScreen(standalone: true)));
          }),
          const SizedBox(height: 10),
          if (!_loading && _scans.isEmpty)
            EmptyState(icon: Icons.eco_outlined, text: tr('no_scans'), buttonText: tr('scan_now'), onPressed: () => widget.goTo(1)),
          for (final s in _scans.take(3)) ...[ScanTile(scan: s as Map<String, dynamic>), const SizedBox(height: 8)],
        ],
      ),
    );
  }

  Widget _hero() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        gradient: const LinearGradient(
          colors: [Color(0xFF2E5A1C), Color(0xFF16261A)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        border: Border.all(color: AppColors.accent.withValues(alpha: 0.35)),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(tr('hero_title'), style: const TextStyle(fontSize: 21, fontWeight: FontWeight.w800, height: 1.2)),
              const SizedBox(height: 8),
              Text(tr('hero_text'), style: const TextStyle(color: Color(0xFFD5E2CC), height: 1.4)),
            ]),
          ),
          const SizedBox(width: 10),
          Container(
            width: 58,
            height: 58,
            decoration: BoxDecoration(color: AppColors.accent.withValues(alpha: 0.2), shape: BoxShape.circle),
            child: const Icon(Icons.document_scanner_outlined, color: AppColors.accent, size: 30),
          ),
        ]),
        const SizedBox(height: 16),
        FilledButton.icon(
          onPressed: () => widget.goTo(1),
          icon: const Icon(Icons.camera_alt),
          label: Text(tr('scan_now')),
        ),
      ]),
    );
  }

  Widget _stat(IconData icon, String value, String label, {bool warn = false}) {
    final c = warn ? AppColors.gold : AppColors.accent;
    return Expanded(
      child: Panel(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Icon(icon, color: c, size: 22),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
          Text(label, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(color: AppColors.muted, fontSize: 12)),
        ]),
      ),
    );
  }

  Widget _sectionTitle(String text, VoidCallback onMore) => Row(children: [
        Expanded(child: Text(text, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800))),
        TextButton(onPressed: onMore, child: Text(tr('see_all'), style: const TextStyle(color: AppColors.accent))),
      ]);

  Widget _taskCard(Map<String, dynamic> d) {
    final plan = d['plan'] as Map<String, dynamic>;
    final task = d['task'] as Map<String, dynamic>;
    final dueAt = d['due'] as DateTime;
    final now = DateTime.now();
    final late = dueAt.isBefore(DateTime(now.year, now.month, now.day));
    final text = localMap(task['text']);
    return Panel(
      padding: const EdgeInsets.all(14),
      onTap: () => Navigator.of(context)
          .push(MaterialPageRoute(builder: (_) => PlanDetailScreen(plan: plan)))
          .then((_) => _load()),
      child: Row(children: [
        Icon(Icons.alarm, color: late ? AppColors.danger : AppColors.gold),
        const SizedBox(width: 12),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(diseaseName(plan['disease'] as String), style: const TextStyle(fontWeight: FontWeight.w700)),
            if (text.isNotEmpty)
              Text(text, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(color: AppColors.muted, fontSize: 13)),
          ]),
        ),
        const SizedBox(width: 8),
        Pill(late ? tr('overdue') : tr('today'), color: late ? AppColors.danger : AppColors.gold),
      ]),
    );
  }
}

/// One row of scan history: photo, disease name, confidence and date.
class ScanTile extends StatelessWidget {
  final Map<String, dynamic> scan;
  const ScanTile({super.key, required this.scan});

  static String date(String? iso) {
    final d = DateTime.tryParse(iso ?? '')?.toLocal();
    if (d == null) return '';
    String two(int n) => n.toString().padLeft(2, '0');
    return '${d.year}-${two(d.month)}-${two(d.day)}  ${two(d.hour)}:${two(d.minute)}';
  }

  @override
  Widget build(BuildContext context) {
    final label = scan['label'] as String;
    final conf = ((scan['confidence'] as num) * 100).round();
    final uncertain = scan['uncertain'] == true;
    final thumb = scan['thumb'] as String?;
    return Panel(
      padding: const EdgeInsets.all(10),
      child: Row(children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: thumb == null
              ? DiseaseAvatar(label, size: 60)
              : Image.network(Api.instance.fileUrl(thumb),
                  width: 60, height: 60, fit: BoxFit.cover, errorBuilder: (_, __, ___) => DiseaseAvatar(label, size: 60)),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(diseaseName(label), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
            const SizedBox(height: 4),
            Text(date(scan['at'] as String?), style: const TextStyle(color: AppColors.muted, fontSize: 12.5)),
          ]),
        ),
        Pill('$conf%',
            color: uncertain ? AppColors.gold : (label == 'healthy' ? AppColors.accent : AppColors.danger)),
      ]),
    );
  }
}

/// Name of a disease in the chosen language, from the disease library.
String diseaseName(String id) {
  final d = Api.instance.diseases[id];
  if (d != null) return localField(d, 'name');
  final p = Content.instance.pest(id) ?? Content.instance.webDisease(id);   // pests have plans too
  return p != null ? Content.instance.local(p['name']) : prettyLabel(id);
}
