// Disease library, read from GET /api/diseases (the diseases table).
import 'package:flutter/material.dart';

import '../api.dart';
import '../i18n.dart';
import '../main.dart';
import '../pictures.dart';
import '../voice.dart';
import '../widgets.dart';

String prettyLabel(String id) =>
    id.split('_').map((w) => w.isEmpty ? w : w[0].toUpperCase() + w.substring(1)).join(' ');

List<String> linesOf(dynamic text) =>
    (text ?? '').toString().split('\n').map((s) => s.trim()).where((s) => s.isNotEmpty).toList();

/// Symptoms, treatment and dose of one disease, in the chosen language.
class DiseaseInfo extends StatelessWidget {
  final Map<String, dynamic> disease;
  const DiseaseInfo({super.key, required this.disease});

  @override
  Widget build(BuildContext context) {
    final symptoms = linesOf(localField(disease, 'symptoms'));
    final treatment = linesOf(localField(disease, 'treatment'));
    final chemical = disease['chemical'];
    final dose = disease['dose_per_10l'];
    final maxDose = disease['max_dose_per_10l'];
    Widget section(IconData icon, String title, List<String> items) => Padding(
          padding: const EdgeInsets.only(bottom: 14),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Icon(icon, color: AppColors.accent, size: 20),
              const SizedBox(width: 8),
              Text(title, style: const TextStyle(color: AppColors.accent, fontWeight: FontWeight.w800, fontSize: 15)),
            ]),
            const SizedBox(height: 8),
            for (final i in items)
              Padding(
                padding: const EdgeInsets.only(bottom: 8, left: 4),
                child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  const Padding(
                    padding: EdgeInsets.only(top: 7),
                    child: Icon(Icons.circle, size: 6, color: AppColors.muted),
                  ),
                  const SizedBox(width: 10),
                  Expanded(child: Text(i, style: const TextStyle(height: 1.45))),
                ]),
              ),
          ]),
        );
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (symptoms.isNotEmpty) section(Icons.visibility_outlined, tr('symptoms'), symptoms),
      if (treatment.isNotEmpty) section(Icons.healing_outlined, tr('treatment'), treatment),
      if (chemical != null || dose != null)
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.accent.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.accent.withValues(alpha: 0.5)),
          ),
          child: Row(children: [
            const Icon(Icons.science_outlined, color: AppColors.accent),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                '${tr('recommended')}: ${chemical ?? ''}'
                '${dose != null ? ' · $dose ml / 10 L' : ''}'
                '${maxDose != null ? ' (${tr('max')} $maxDose)' : ''}',
                style: const TextStyle(fontWeight: FontWeight.w700, height: 1.4),
              ),
            ),
          ]),
        ),
    ]);
  }
}

class DiseasesScreen extends StatefulWidget {
  const DiseasesScreen({super.key});

  @override
  State<DiseasesScreen> createState() => _DiseasesScreenState();
}

class _DiseasesScreenState extends State<DiseasesScreen> {
  String _q = '';
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    dataVersion.addListener(_refresh);
    if (Api.instance.diseases.isEmpty) _reload();
  }

  @override
  void dispose() {
    dataVersion.removeListener(_refresh);
    super.dispose();
  }

  void _refresh() {
    if (mounted) setState(() {});
  }

  Future<void> _reload() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await Api.instance.loadDiseases();
    } catch (e) {
      _error = e.toString();
    }
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    final all = Api.instance.diseases.values.where((d) => d['id'] != 'healthy').toList()
      ..sort((a, b) => localField(a, 'name').compareTo(localField(b, 'name')));
    final q = _q.toLowerCase();
    final shown = all
        .where((d) =>
            q.isEmpty ||
            '${d['name_en']} ${d['name_si']} ${d['name_ta']} ${localField(d, 'symptoms')}'.toLowerCase().contains(q))
        .toList();
    return RefreshIndicator(
      onRefresh: _reload,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
        children: [
          ScreenTitle(tr('tab_diseases'), subtitle: '${all.length} · AgriCare'),
          const SizedBox(height: 14),
          TextField(
            decoration: InputDecoration(prefixIcon: const Icon(Icons.search), hintText: tr('search')),
            onChanged: (v) => setState(() => _q = v),
          ),
          const SizedBox(height: 14),
          if (_loading) const LinearProgressIndicator(),
          if (_error != null) Text(_error!, style: const TextStyle(color: AppColors.danger)),
          if (all.isEmpty && !_loading)
            EmptyState(icon: Icons.menu_book_outlined, text: tr('retry'), buttonText: tr('retry'), onPressed: _reload),
          for (final d in shown) ...[
            Panel(
              padding: const EdgeInsets.all(12),
              onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => DiseaseDetailScreen(disease: d))),
              child: Row(children: [
                DiseaseAvatar(d['id'] as String, size: 60),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(localField(d, 'name'), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
                    if (appLanguage.value != 'en')
                      Text('${d['name_en']}', style: const TextStyle(color: AppColors.muted, fontSize: 13)),
                    if (d['chemical'] != null) ...[
                      const SizedBox(height: 4),
                      Text('${d['chemical']}', style: const TextStyle(color: AppColors.accent, fontSize: 12.5)),
                    ],
                  ]),
                ),
                const Icon(Icons.chevron_right, color: AppColors.muted),
              ]),
            ),
            const SizedBox(height: 10),
          ],
        ],
      ),
    );
  }
}

class DiseaseDetailScreen extends StatelessWidget {
  final Map<String, dynamic> disease;
  const DiseaseDetailScreen({super.key, required this.disease});

  @override
  Widget build(BuildContext context) {
    final id = disease['id'] as String;
    return Scaffold(
      appBar: AppBar(
        title: Text(localField(disease, 'name'), overflow: TextOverflow.ellipsis),
        actions: [
          ValueListenableBuilder<bool>(
            valueListenable: Voice.instance.speaking,
            builder: (_, speaking, __) => IconButton(
              tooltip: speaking ? tr('stop') : tr('listen'),
              icon: Icon(speaking ? Icons.stop_circle_outlined : Icons.volume_up_outlined, color: AppColors.accent),
              onPressed: () async {
                if (speaking) {
                  await Voice.instance.stop();
                  return;
                }
                final n = await Voice.instance.play(['name_$id', 'sum_$id']);
                if (n == 0 && context.mounted) showMessage(context, tr('no_voice'));
              },
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        children: [
          DiseasePicture(id, height: 200, radius: 20),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(22),
              gradient: LinearGradient(
                colors: [DiseaseAvatar.colorFor(id).withValues(alpha: 0.25), AppColors.surface],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              border: Border.all(color: AppColors.line),
            ),
            child: Row(children: [
              DiseaseAvatar(id, size: 64),
              const SizedBox(width: 16),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(localField(disease, 'name'), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 4),
                  Text('${disease['name_en']}  ·  ${disease['name_si']}  ·  ${disease['name_ta']}',
                      style: const TextStyle(color: AppColors.muted, fontSize: 12.5, height: 1.4)),
                ]),
              ),
            ]),
          ),
          const SizedBox(height: 16),
          Panel(child: DiseaseInfo(disease: disease)),
        ],
      ),
    );
  }
}
