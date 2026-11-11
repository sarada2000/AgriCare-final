// Treatment plans and reminders: list from GET /api/plans, tick steps with PUT /api/plans/<id>/tasks.
import 'package:flutter/material.dart';

import '../api.dart';
import '../i18n.dart';
import '../main.dart';
import '../voice.dart';
import '../widgets.dart';
import 'dashboard_screen.dart';

class PlansScreen extends StatefulWidget {
  const PlansScreen({super.key});

  @override
  State<PlansScreen> createState() => PlansScreenState();
}

class PlansScreenState extends State<PlansScreen> {
  List<dynamic> _plans = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    dataVersion.addListener(reload);
    reload();
  }

  @override
  void dispose() {
    dataVersion.removeListener(reload);
    super.dispose();
  }

  Future<void> reload() async {
    if (!mounted) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final d = await Api.instance.get('/api/plans');
      _plans = d['plans'] as List? ?? [];
    } catch (e) {
      _error = e.toString();
    }
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: reload,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
        children: [
          ScreenTitle(tr('tab_plans')),
          const SizedBox(height: 14),
          if (_loading) const LinearProgressIndicator(),
          if (_error != null) Text(_error!, style: const TextStyle(color: AppColors.danger)),
          if (!_loading && _plans.isEmpty && _error == null) EmptyState(icon: Icons.event_note_outlined, text: tr('no_plans')),
          for (final p in _plans) ...[_planCard(p as Map<String, dynamic>), const SizedBox(height: 10)],
        ],
      ),
    );
  }

  Widget _planCard(Map<String, dynamic> p) {
    final tasks = p['tasks'] as List? ?? [];
    final done = tasks.where((t) => t['done'] == true).length;
    final finished = p['status'] == 'completed';
    final field = (p['field'] as String?) ?? '';
    return Panel(
      onTap: () => Navigator.of(context)
          .push(MaterialPageRoute(builder: (_) => PlanDetailScreen(plan: p)))
          .then((_) => reload()),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          DiseaseAvatar(p['disease'] as String, size: 44),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(diseaseName(p['disease'] as String), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
              Text('${field.isNotEmpty ? '$field  ·  ' : ''}${p['startDate']}  ·  ⏰ ${p['alarmTime']}',
                  style: const TextStyle(color: AppColors.muted, fontSize: 12.5)),
            ]),
          ),
          Pill(finished ? tr('completed') : tr('active'), color: finished ? AppColors.accent : AppColors.gold),
        ]),
        const SizedBox(height: 14),
        Row(children: [
          Text(tr('progress'), style: const TextStyle(color: AppColors.muted, fontSize: 12.5)),
          const Spacer(),
          Text('$done / ${tasks.length}', style: const TextStyle(fontWeight: FontWeight.w700)),
        ]),
        const SizedBox(height: 6),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: tasks.isEmpty ? 0 : done / tasks.length,
            minHeight: 8,
            backgroundColor: AppColors.line,
          ),
        ),
      ]),
    );
  }
}

class PlanDetailScreen extends StatefulWidget {
  final Map<String, dynamic> plan;
  const PlanDetailScreen({super.key, required this.plan});

  @override
  State<PlanDetailScreen> createState() => _PlanDetailScreenState();
}

class _PlanDetailScreenState extends State<PlanDetailScreen> {
  late Map<String, dynamic> _plan = widget.plan;
  bool _saving = false;

  Future<void> _toggle(Map<String, dynamic> task, bool done) async {
    setState(() => _saving = true);
    try {
      final d = await Api.instance.put('/api/plans/${_plan['id']}/tasks', {
        'tasks': [
          {'id': task['id'], 'done': done, 'condition': task['condition']}
        ]
      });
      setState(() => _plan = Map<String, dynamic>.from(d['plan'] as Map));
      dataVersion.value++;
    } catch (e) {
      if (mounted) showMessage(context, e.toString());
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  String _state(Map<String, dynamic> t) {
    if (t['done'] == true) return 'done';
    final due = DateTime.tryParse('${t['dueAt'] ?? ''}')?.toLocal();
    if (due == null) return 'upcoming';
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    if (due.isBefore(today)) return 'late';
    if (due.isBefore(today.add(const Duration(days: 1)))) return 'today';
    return 'upcoming';
  }

  @override
  Widget build(BuildContext context) {
    final disease = _plan['disease'] as String;
    final tasks = (_plan['tasks'] as List? ?? []).cast<Map<String, dynamic>>();
    return Scaffold(
      appBar: AppBar(title: Text(diseaseName(disease))),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
        children: [
          if (_saving) const LinearProgressIndicator(),
          Panel(
            child: Row(children: [
              const Icon(Icons.alarm, color: AppColors.accent),
              const SizedBox(width: 12),
              Expanded(
                child: Text('${tr('start_date')}: ${_plan['startDate']}\n${tr('alarm_time')}: ${_plan['alarmTime']}',
                    style: const TextStyle(height: 1.5)),
              ),
            ]),
          ),
          const SizedBox(height: 14),
          for (var i = 0; i < tasks.length; i++) ...[_step(disease, i, tasks[i]), const SizedBox(height: 8)],
        ],
      ),
    );
  }

  Widget _step(String disease, int i, Map<String, dynamic> t) {
    final state = _state(t);
    final color = switch (state) {
      'done' => AppColors.accent,
      'late' => AppColors.danger,
      'today' => AppColors.gold,
      _ => AppColors.muted,
    };
    final label = switch (state) {
      'late' => tr('overdue'),
      'today' => tr('today'),
      'done' => tr('completed'),
      _ => tr('upcoming'),
    };
    final text = localMap(t['text']);
    return Panel(
      padding: const EdgeInsets.fromLTRB(6, 10, 12, 10),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Checkbox(
          value: t['done'] == true,
          onChanged: _saving ? null : (v) => _toggle(t, v == true),
        ),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const SizedBox(height: 10),
            Row(children: [
              Text('${tr('day')} ${(t['day'] as num).toInt() + 1}', style: const TextStyle(fontWeight: FontWeight.w800)),
              if (t['check'] == true) ...[const SizedBox(width: 8), Pill(tr('check_step'), color: AppColors.muted)],
              const Spacer(),
              Pill(label, color: color),
            ]),
            const SizedBox(height: 6),
            Text(text.isEmpty ? '—' : text,
                style: TextStyle(
                    height: 1.45,
                    color: t['done'] == true ? AppColors.muted : AppColors.fg,
                    decoration: t['done'] == true ? TextDecoration.lineThrough : null)),
            Align(
              alignment: Alignment.centerRight,
              child: IconButton(
                tooltip: tr('listen'),
                icon: const Icon(Icons.volume_up_outlined, color: AppColors.accent, size: 20),
                onPressed: () async {
                  final day = (t['day'] as num).toInt() + 1;
                  final n = await Voice.instance.play(['day_$day', 'step_${disease}_$i']);
                  if (n == 0 && mounted) showMessage(context, tr('no_voice'));
                },
              ),
            ),
          ]),
        ),
      ]),
    );
  }
}
