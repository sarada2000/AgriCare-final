// Pests & animals (same content as the website's pests.html): search, insect / animal filter,
// picture, how it attacks, signs, what to do, prevention, the day-by-day plan and "Start treatment plan".
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../content.dart';
import '../i18n.dart';
import '../main.dart';
import '../pictures.dart';
import '../plan_sheet.dart';
import '../voice.dart';
import '../widgets.dart';

class PestArt extends StatelessWidget {
  final String id;
  final double height;
  final BorderRadius radius;
  const PestArt(this.id, {super.key, this.height = 150, this.radius = const BorderRadius.all(Radius.circular(16))});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: radius,
      child: SizedBox(
        height: height,
        width: double.infinity,
        child: PhotoOr(urls: pestPhotoUrls(id), fallback: diseaseDrawing(id)),
      ),
    );
  }
}

class PestsScreen extends StatefulWidget {
  const PestsScreen({super.key});

  @override
  State<PestsScreen> createState() => _PestsScreenState();
}

class _PestsScreenState extends State<PestsScreen> {
  final _search = TextEditingController();
  String _group = 'all';

  bool _matches(Map<String, dynamic> p, String q) {
    if (q.isEmpty) return true;
    final c = Content.instance;
    final name = p['name'] as Map;
    final hay = [
      name['en'], name['si'], name['ta'], p['sci'], c.local(p['summary']),
      ...(p['attack'] as List? ?? []), ...(p['signs'] as List? ?? []),
      ...c.localList(p['id'] as String, 'attack', const []), ...c.localList(p['id'] as String, 'signs', const []),
    ].join(' ').toLowerCase();
    return hay.contains(q);
  }

  @override
  Widget build(BuildContext context) {
    final c = Content.instance;
    final q = _search.text.trim().toLowerCase();
    final list = c.pests.where((p) => (_group == 'all' || p['group'] == _group) && _matches(p, q)).toList();
    return Scaffold(
      appBar: AppBar(title: Text(wt('nav_pests')), actions: const [LanguageMenu()]),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
        children: [
          ScreenTitle(wt('pest_title'), subtitle: wt('pest_lead')),
          const SizedBox(height: 14),
          TextField(
            controller: _search,
            onChanged: (_) => setState(() {}),
            decoration: InputDecoration(prefixIcon: const Icon(Icons.search), hintText: wt('pest_title')),
          ),
          const SizedBox(height: 10),
          Wrap(spacing: 8, children: [
            for (final g in const ['all', 'insect', 'animal'])
              ChoiceChip(
                label: Text(g == 'all' ? wt('filter_all') : g == 'insect' ? wt('pest_insects') : wt('pest_animals')),
                selected: _group == g,
                onSelected: (_) => setState(() => _group = g),
              ),
          ]),
          const SizedBox(height: 12),
          if (list.isEmpty) EmptyState(icon: Icons.search_off, text: wt('lib_empty')),
          for (final p in list) ...[_card(p), const SizedBox(height: 12)],
        ],
      ),
    );
  }

  Widget _card(Map<String, dynamic> p) {
    final c = Content.instance;
    final local = c.local(p['name']);
    final en = (p['name'] as Map)['en'].toString();
    return Panel(
      padding: EdgeInsets.zero,
      onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => PestDetailScreen(pest: p))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Stack(children: [
          PestArt(p['id'] as String, height: 130, radius: const BorderRadius.vertical(top: Radius.circular(17))),
          Positioned(
            left: 10,
            top: 10,
            child: Pill(p['group'] == 'insect' ? wt('pest_insects') : wt('pest_animals'),
                color: p['group'] == 'insect' ? AppColors.gold : const Color(0xFF6BB8FF)),
          ),
        ]),
        Padding(
          padding: const EdgeInsets.all(14),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(local, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800)),
            if (local != en) Text(en, style: const TextStyle(color: AppColors.muted, fontSize: 13)),
            const SizedBox(height: 6),
            Text(c.local(p['summary']),
                maxLines: 3, overflow: TextOverflow.ellipsis, style: const TextStyle(color: AppColors.muted, height: 1.4)),
          ]),
        ),
      ]),
    );
  }
}

class PestDetailScreen extends StatefulWidget {
  final Map<String, dynamic> pest;
  const PestDetailScreen({super.key, required this.pest});

  @override
  State<PestDetailScreen> createState() => _PestDetailScreenState();
}

class _PestDetailScreenState extends State<PestDetailScreen> {
  bool _started = false;

  @override
  void dispose() {
    Voice.instance.stop();
    super.dispose();
  }

  Future<void> _listen() async {
    if (Voice.instance.speaking.value) {
      await Voice.instance.stop();
      return;
    }
    final id = widget.pest['id'] as String;
    final played = await Voice.instance.play(['name_$id', 'sum_$id']);
    if (played == 0 && mounted) showMessage(context, tr('no_voice'));
  }

  @override
  Widget build(BuildContext context) {
    final c = Content.instance;
    final p = widget.pest;
    final id = p['id'] as String;
    final local = c.local(p['name']);
    final en = (p['name'] as Map)['en'].toString();
    final steps = (c.pestPlans[id] as List? ?? []);
    final note = c.localList(id, 'note', p['note']);
    return Scaffold(
      appBar: AppBar(title: Text(local), actions: const [LanguageMenu()]),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 32),
        children: [
          PestArt(id, height: 190),
          const SizedBox(height: 14),
          Text(local, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, height: 1.2)),
          if (local != en) Text(en, style: const TextStyle(color: AppColors.muted)),
          const SizedBox(height: 6),
          Wrap(spacing: 8, runSpacing: 6, children: [
            Pill(p['group'] == 'insect' ? wt('pest_insects') : wt('pest_animals'), color: AppColors.gold),
            if (p['protected'] == true) Pill('⚖ ${wt('pest_protected')}', color: AppColors.danger),
            Text('${p['sci']}', style: const TextStyle(color: AppColors.muted, fontStyle: FontStyle.italic)),
          ]),
          const SizedBox(height: 12),
          Text(c.local(p['summary']), style: const TextStyle(fontSize: 15, height: 1.5)),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(
              child: ValueListenableBuilder<bool>(
                valueListenable: Voice.instance.speaking,
                builder: (_, speaking, __) => OutlinedButton.icon(
                  onPressed: _listen,
                  icon: Icon(speaking ? Icons.stop : Icons.volume_up),
                  label: Text(speaking ? tr('stop') : tr('listen')),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => launchUrl(
                  Uri.parse('https://www.google.com/search?tbm=isch&q=${Uri.encodeComponent('${p['sci'].toString().split(',').first} $en paddy')}'),
                  mode: LaunchMode.externalApplication,
                ),
                icon: const Icon(Icons.photo_library_outlined),
                label: Text(wt('pest_photos'), overflow: TextOverflow.ellipsis),
              ),
            ),
          ]),
          const SizedBox(height: 16),
          _numbered(wt('pest_attack'), c.localList(id, 'attack', p['attack']), Icons.bug_report_outlined),
          _bullets(wt('pest_signs'), c.localList(id, 'signs', p['signs']), Icons.visibility_outlined),
          _bullets(wt('lbl_manage'), c.localList(id, 'manage', p['manage']), Icons.medical_services_outlined),
          _bullets(wt('lbl_prevent'), c.localList(id, 'prevent', p['prevent']), Icons.shield_outlined),
          if (note.isNotEmpty)
            Panel(
              color: AppColors.danger.withValues(alpha: 0.1),
              child: Text('⚠ ${note.join(' ')}', style: const TextStyle(height: 1.45)),
            ),
          if (steps.isNotEmpty) ...[
            const SizedBox(height: 16),
            Text('🩺 ${wt('pest_plan_title')}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
            const SizedBox(height: 10),
            for (final s in steps) _step(s as Map),
            const SizedBox(height: 12),
            if (_started)
              Panel(
                color: AppColors.accent.withValues(alpha: 0.12),
                child: Row(children: [
                  const Icon(Icons.check_circle, color: AppColors.accent),
                  const SizedBox(width: 10),
                  Expanded(child: Text(wt('plan_created'))),
                ]),
              )
            else
              FilledButton.icon(
                onPressed: () async {
                  final ok = await startPlanFlow(context, id, local);
                  if (ok && mounted) setState(() => _started = true);
                },
                icon: const Icon(Icons.alarm_add),
                label: Text(wt('plan_start')),
              ),
          ],
          const SizedBox(height: 16),
          Text(wt('pest_chem_note'), style: const TextStyle(color: AppColors.muted, fontSize: 13, height: 1.4)),
        ],
      ),
    );
  }

  Widget _head(String title, IconData icon) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Row(children: [
          Icon(icon, color: AppColors.accent, size: 20),
          const SizedBox(width: 8),
          Expanded(child: Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800))),
        ]),
      );

  Widget _bullets(String title, List<String> items, IconData icon) {
    if (items.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Panel(
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          _head(title, icon),
          for (final i in items)
            Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Padding(padding: EdgeInsets.only(top: 7), child: Icon(Icons.circle, size: 6, color: AppColors.accent)),
                const SizedBox(width: 10),
                Expanded(child: Text(i, style: const TextStyle(height: 1.45))),
              ]),
            ),
        ]),
      ),
    );
  }

  Widget _numbered(String title, List<String> items, IconData icon) {
    if (items.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Panel(
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          _head(title, icon),
          for (var i = 0; i < items.length; i++)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                CircleAvatar(
                  radius: 11,
                  backgroundColor: AppColors.accent.withValues(alpha: 0.2),
                  child: Text('${i + 1}', style: const TextStyle(fontSize: 11, color: AppColors.accent, fontWeight: FontWeight.w800)),
                ),
                const SizedBox(width: 10),
                Expanded(child: Text(items[i], style: const TextStyle(height: 1.45))),
              ]),
            ),
        ]),
      ),
    );
  }

  Widget _step(Map s) {
    final check = s['check'] == true;
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Panel(
        padding: const EdgeInsets.all(12),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(
            width: 52,
            padding: const EdgeInsets.symmetric(vertical: 6),
            decoration: BoxDecoration(
              color: (check ? AppColors.gold : AppColors.accent).withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(children: [
              Text(wt('plan_day'), style: const TextStyle(fontSize: 10, color: AppColors.muted)),
              Text('${(s['day'] as num).toInt() + 1}',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: check ? AppColors.gold : AppColors.accent)),
            ]),
          ),
          const SizedBox(width: 12),
          Expanded(child: Text(Content.instance.local(s['text']), style: const TextStyle(height: 1.45))),
        ]),
      ),
    );
  }
}
