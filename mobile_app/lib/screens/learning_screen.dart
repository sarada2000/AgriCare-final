// Solutions & Learning Hub (same text as the website's learning-hub.html).
import 'package:flutter/material.dart';

import '../content.dart';
import '../main.dart';
import '../widgets.dart';

class _Topic {
  final String title, note;
  final IconData icon;
  final List<String> lead, items, after;
  final bool table;
  const _Topic(this.title, this.note, this.icon,
      {this.lead = const [], this.items = const [], this.after = const [], this.table = false});
}

const _topics = [
  _Topic('hub_nav_seed', 'hub_seed_note', Icons.spa_outlined,
      items: ['hub_seed_1', 'hub_seed_2', 'hub_seed_3', 'hub_seed_4', 'hub_seed_5']),
  _Topic('hub_nav_fert', 'hub_fert_note', Icons.science_outlined,
      lead: ['hub_fert_p'], items: ['hub_fert_1', 'hub_fert_2', 'hub_fert_3', 'hub_fert_4', 'hub_fert_5']),
  _Topic('hub_nav_water', 'hub_water_note', Icons.water_drop_outlined, table: true, after: ['hub_water_p']),
  _Topic('hub_nav_spray', 'hub_spray_note', Icons.sanitizer_outlined,
      items: ['hub_spray_1', 'hub_spray_2', 'hub_spray_3', 'hub_spray_4', 'hub_spray_5', 'hub_spray_6']),
  _Topic('hub_nav_harvest', 'hub_harvest_note', Icons.agriculture_outlined,
      items: ['hub_harv_1', 'hub_harv_2', 'hub_harv_3', 'hub_harv_4']),
  _Topic('hub_nav_help', 'hub_help_note', Icons.support_agent, lead: ['hub_help_p1', 'hub_help_p2']),
];

class LearningScreen extends StatelessWidget {
  const LearningScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(wt('nav_solutions')), actions: const [LanguageMenu()]),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 32),
        children: [
          ScreenTitle(wt('hub_title'), subtitle: wt('hub_lead')),
          const SizedBox(height: 14),
          for (final t in _topics) ...[_TopicCard(t), const SizedBox(height: 12)],
        ],
      ),
    );
  }
}

class _TopicCard extends StatelessWidget {
  final _Topic t;
  const _TopicCard(this.t);

  static const _body = TextStyle(color: AppColors.fg, height: 1.5, fontSize: 14.5);

  bool _has(String key) => wt(key) != key && wt(key).trim().isNotEmpty;

  @override
  Widget build(BuildContext context) {
    return Panel(
      padding: EdgeInsets.zero,
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          leading: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(color: AppColors.accent.withValues(alpha: 0.14), borderRadius: BorderRadius.circular(12)),
            child: Icon(t.icon, color: AppColors.accent),
          ),
          title: Text(wt(t.title), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
          subtitle: _has(t.note)
              ? Text(wt(t.note), maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(color: AppColors.muted, fontSize: 13))
              : null,
          expandedCrossAxisAlignment: CrossAxisAlignment.start,
          children: [
            for (final k in t.lead)
              if (_has(k)) Padding(padding: const EdgeInsets.only(bottom: 10), child: Text.rich(htmlSpan(wt(k), _body))),
            for (final k in t.items)
              if (_has(k))
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    const Padding(padding: EdgeInsets.only(top: 2), child: Icon(Icons.check_circle, size: 18, color: AppColors.accent)),
                    const SizedBox(width: 10),
                    Expanded(child: Text.rich(htmlSpan(wt(k), _body))),
                  ]),
                ),
            if (t.table) _waterTable(),
            for (final k in t.after)
              if (_has(k)) Padding(padding: const EdgeInsets.only(top: 10), child: Text.rich(htmlSpan(wt(k), _body))),
          ],
        ),
      ),
    );
  }

  Widget _waterTable() {
    return Column(children: [
      for (var i = 1; i <= 5; i++)
        Container(
          width: double.infinity,
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: AppColors.surface2, borderRadius: BorderRadius.circular(12)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Expanded(child: Text(wt('hub_w${i}_s'), style: const TextStyle(fontWeight: FontWeight.w800))),
              Pill(wt('hub_w${i}_l'), color: const Color(0xFF6BB8FF), icon: Icons.water_drop),
            ]),
            const SizedBox(height: 6),
            Text(wt('hub_w${i}_w'), style: const TextStyle(color: AppColors.muted, height: 1.4)),
          ]),
        ),
    ]);
  }
}
