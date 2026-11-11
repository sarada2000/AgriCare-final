// Officer dashboard (same as the website's admin.html), only for officer accounts:
// overview numbers, farmers asking for a call, farmers who need attention, all farmers,
// latest scans, and managing the disease information and verified shops.
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../api.dart';
import '../i18n.dart';
import '../main.dart';
import '../widgets.dart';
import 'dashboard_screen.dart';
import 'diseases_screen.dart' show prettyLabel;

String _date(String? iso) => ScanTile.date(iso);

Future<void> _call(BuildContext context, String phone) async {
  final ok = await launchUrl(Uri.parse('tel:$phone'));
  if (!ok && context.mounted) showMessage(context, phone);
}

/// Loads from the server and shows a pull-to-refresh list.
class _ApiView extends StatefulWidget {
  final Future<Map<String, dynamic>> Function() load;
  final List<Widget> Function(BuildContext context, Map<String, dynamic> data, VoidCallback reload) build;
  final List<Widget> header;
  const _ApiView({super.key, required this.load, required this.build, this.header = const []});

  @override
  State<_ApiView> createState() => _ApiViewState();
}

class _ApiViewState extends State<_ApiView> {
  Map<String, dynamic>? _data;
  String? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    reload();
  }

  @override
  void didUpdateWidget(covariant _ApiView old) {
    super.didUpdateWidget(old);
    if (old.key != widget.key) reload();
  }

  Future<void> reload() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      _data = await widget.load();
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
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
        children: [
          ...widget.header,
          if (_loading) const LinearProgressIndicator(),
          if (_error != null)
            Panel(
              color: AppColors.danger.withValues(alpha: 0.1),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(_error!),
                const SizedBox(height: 8),
                OutlinedButton(onPressed: reload, child: Text(tr('retry'))),
              ]),
            ),
          if (!_loading && _error == null && _data != null) ...widget.build(context, _data!, reload),
        ],
      ),
    );
  }
}

Widget _title(String t) => Padding(
      padding: const EdgeInsets.only(top: 18, bottom: 10),
      child: Text(t, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
    );

Widget _empty(String t) => Panel(child: Text(t, style: const TextStyle(color: AppColors.muted)));

class OfficerScreen extends StatelessWidget {
  const OfficerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 6,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Officer dashboard', style: TextStyle(fontWeight: FontWeight.w800)),
          actions: const [LanguageMenu()],
          bottom: const TabBar(
            isScrollable: true,
            tabAlignment: TabAlignment.start,
            labelColor: AppColors.accent,
            unselectedLabelColor: AppColors.muted,
            indicatorColor: AppColors.accent,
            tabs: [
              Tab(icon: Icon(Icons.insights), text: 'Overview'),
              Tab(icon: Icon(Icons.phone_callback), text: 'Calls'),
              Tab(icon: Icon(Icons.warning_amber_rounded), text: 'Attention'),
              Tab(icon: Icon(Icons.people_alt_outlined), text: 'Farmers'),
              Tab(icon: Icon(Icons.photo_library_outlined), text: 'Scans'),
              Tab(icon: Icon(Icons.tune), text: 'Manage'),
            ],
          ),
        ),
        body: const TabBarView(children: [
          _Overview(),
          _Calls(),
          _Attention(),
          _Farmers(),
          _Scans(),
          _Manage(),
        ]),
      ),
    );
  }
}

// ---------------------------------------------------------------- overview
class _Overview extends StatefulWidget {
  const _Overview();

  @override
  State<_Overview> createState() => _OverviewState();
}

class _OverviewState extends State<_Overview> {
  int _days = 30;

  @override
  Widget build(BuildContext context) {
    return _ApiView(
      key: ValueKey(_days),
      load: () => Api.instance.get('/api/admin/stats?days=$_days'),
      header: [
        Wrap(spacing: 8, crossAxisAlignment: WrapCrossAlignment.center, children: [
          const Text('Last', style: TextStyle(color: AppColors.muted)),
          for (final d in const [7, 30, 90, 365])
            ChoiceChip(label: Text('$d days'), selected: _days == d, onSelected: (_) => setState(() => _days = d)),
        ]),
        const SizedBox(height: 12),
      ],
      build: (context, data, reload) {
        final s = Map<String, dynamic>.from(data['summary'] as Map);
        final model = Map<String, dynamic>.from((data['model'] as Map?) ?? {});
        final byDisease = (data['byDisease'] as List? ?? []);
        final maxCount = byDisease.fold<int>(1, (m, e) => ((e as Map)['count'] as num).toInt() > m ? (e['count'] as num).toInt() : m);
        final byDistrict = (data['byDistrict'] as List? ?? []);
        Widget tile(IconData icon, Object? value, String label, {Color color = AppColors.accent}) => Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.line),
              ),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Icon(icon, color: color, size: 20),
                const SizedBox(height: 8),
                Text('${value ?? 0}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
                Text(label, maxLines: 2, style: const TextStyle(color: AppColors.muted, fontSize: 12)),
              ]),
            );
        return [
          Pill('Model: ${model['mode'] ?? '?'} · ${(model['classes'] as List?)?.length ?? 0} classes',
              color: model['mode'] == 'demo' ? AppColors.gold : AppColors.accent, icon: Icons.memory),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 1.55,
            children: [
              tile(Icons.people_alt_outlined, s['farmers'], 'Farmers (${s['newFarmers']} new)'),
              tile(Icons.camera_alt_outlined, s['scans'], 'Scans'),
              tile(Icons.coronavirus_outlined, s['diseasedScans'], 'Scans with disease', color: AppColors.danger),
              tile(Icons.event_note_outlined, s['activePlans'], 'Active treatment plans'),
              tile(Icons.alarm, s['overdueSteps'], 'Late treatment steps', color: AppColors.gold),
              tile(Icons.trending_down, s['worseReports'], 'Crops getting worse', color: AppColors.danger),
            ],
          ),
          _title('Scans by disease'),
          if (byDisease.isEmpty) _empty('No scans in this period.'),
          for (final e in byDisease)
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Row(children: [
                DiseaseAvatar(e['label'] as String, size: 34),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Row(children: [
                      Expanded(child: Text(diseaseName(e['label'] as String), overflow: TextOverflow.ellipsis)),
                      Text('${e['count']}', style: const TextStyle(fontWeight: FontWeight.w800)),
                    ]),
                    const SizedBox(height: 4),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: (e['count'] as num) / maxCount,
                        minHeight: 7,
                        backgroundColor: AppColors.surface2,
                        color: e['label'] == 'healthy' ? AppColors.accent : AppColors.danger,
                      ),
                    ),
                  ]),
                ),
              ]),
            ),
          _title('Diseases by district'),
          if (byDistrict.isEmpty) _empty('No disease reports in this period.'),
          for (final d in byDistrict) _districtRow(Map<String, dynamic>.from(d as Map)),
        ];
      },
    );
  }

  Widget _districtRow(Map<String, dynamic> d) {
    final diseases = Map<String, dynamic>.from(d['diseases'] as Map);
    String? top;
    var topN = 0;
    diseases.forEach((k, v) {
      if ((v as num) > topN) {
        topN = v.toInt();
        top = k;
      }
    });
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Panel(
        padding: const EdgeInsets.all(12),
        child: Row(children: [
          const Icon(Icons.place_outlined, color: AppColors.accent),
          const SizedBox(width: 10),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('${d['district']}', style: const TextStyle(fontWeight: FontWeight.w700)),
              if (top != null)
                Text('Most common: ${diseaseName(top!)}', style: const TextStyle(color: AppColors.muted, fontSize: 12.5)),
            ]),
          ),
          Pill('${d['total']} reports', color: AppColors.danger),
        ]),
      ),
    );
  }
}

// ---------------------------------------------------------------- calls
class _Calls extends StatefulWidget {
  const _Calls();

  @override
  State<_Calls> createState() => _CallsState();
}

class _CallsState extends State<_Calls> {
  String _status = 'new';

  @override
  Widget build(BuildContext context) {
    return _ApiView(
      key: ValueKey(_status),
      load: () => Api.instance.get('/api/admin/contact-requests?status=$_status'),
      header: [
        const Text('Farmers asking for a call', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
        const SizedBox(height: 8),
        Wrap(spacing: 8, children: [
          ChoiceChip(label: const Text('Waiting'), selected: _status == 'new', onSelected: (_) => setState(() => _status = 'new')),
          ChoiceChip(label: const Text('Done'), selected: _status == 'done', onSelected: (_) => setState(() => _status = 'done')),
        ]),
        const SizedBox(height: 12),
      ],
      build: (context, data, reload) {
        final list = data['requests'] as List? ?? [];
        if (list.isEmpty) return [_empty(_status == 'new' ? 'No one is waiting for a call.' : 'No finished calls yet.')];
        return [
          for (final r in list)
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Panel(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    const Icon(Icons.person_outline, color: AppColors.accent),
                    const SizedBox(width: 8),
                    Expanded(child: Text('${r['name']}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16))),
                    Text('${r['language'] ?? ''}'.toUpperCase(), style: const TextStyle(color: AppColors.muted, fontSize: 12)),
                  ]),
                  const SizedBox(height: 4),
                  Text('${r['phone']}  ·  ${r['district'] ?? ''}  ·  ${_date(r['created_at'] as String?)}',
                      style: const TextStyle(color: AppColors.muted, fontSize: 13)),
                  if ('${r['message'] ?? ''}'.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text('"${r['message']}"', style: const TextStyle(height: 1.4)),
                  ],
                  const SizedBox(height: 10),
                  Row(children: [
                    Expanded(
                      child: FilledButton.icon(
                        onPressed: () => _call(context, '${r['phone']}'),
                        icon: const Icon(Icons.call),
                        label: const Text('Call'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () async {
                          try {
                            await Api.instance.patch('/api/admin/contact-requests/${r['id']}',
                                {'status': _status == 'new' ? 'done' : 'new'});
                            reload();
                          } catch (e) {
                            if (context.mounted) showMessage(context, e.toString());
                          }
                        },
                        icon: Icon(_status == 'new' ? Icons.check : Icons.undo),
                        label: Text(_status == 'new' ? 'Mark done' : 'Move back'),
                      ),
                    ),
                  ]),
                ]),
              ),
            ),
        ];
      },
    );
  }
}

// ---------------------------------------------------------------- attention
class _Attention extends StatelessWidget {
  const _Attention();

  Widget _row(BuildContext context, Map r, {required bool worse}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Panel(
        color: (worse ? AppColors.danger : AppColors.gold).withValues(alpha: 0.07),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            DiseaseAvatar('${r['disease']}', size: 38),
            const SizedBox(width: 10),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('${r['name']}  ·  ${r['district'] ?? ''}', style: const TextStyle(fontWeight: FontWeight.w800)),
                Text('${diseaseName('${r['disease']}')}${'${r['field_name'] ?? ''}'.isNotEmpty ? ' · ${r['field_name']}' : ''}',
                    style: const TextStyle(color: AppColors.muted, fontSize: 13)),
              ]),
            ),
          ]),
          const SizedBox(height: 8),
          Text('${tr('day')} ${(r['day'] as num? ?? 0).toInt() + 1}: ${r['step'] ?? ''}', style: const TextStyle(height: 1.4)),
          const SizedBox(height: 4),
          Text(worse ? 'Reported worse: ${_date(r['done_at'] as String?)}' : 'Was due: ${_date(r['due_at'] as String?)}',
              style: TextStyle(color: worse ? AppColors.danger : AppColors.gold, fontSize: 12.5, fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          OutlinedButton.icon(
            onPressed: () => _call(context, '${r['phone']}'),
            icon: const Icon(Icons.call),
            label: Text('Call ${r['phone']}'),
          ),
        ]),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return _ApiView(
      load: () => Api.instance.get('/api/admin/overdue'),
      build: (context, data, reload) {
        final worse = data['worse'] as List? ?? [];
        final late = data['overdue'] as List? ?? [];
        return [
          const Text('Needs attention', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
          const Text('Farmers who may need a call or a field visit.', style: TextStyle(color: AppColors.muted)),
          _title('Crop getting worse (${worse.length})'),
          if (worse.isEmpty) _empty('No crops reported as getting worse.'),
          for (final r in worse) _row(context, r as Map, worse: true),
          _title('Late treatment steps (${late.length})'),
          if (late.isEmpty) _empty('No late steps.'),
          for (final r in late) _row(context, r as Map, worse: false),
        ];
      },
    );
  }
}

// ---------------------------------------------------------------- farmers
class _Farmers extends StatefulWidget {
  const _Farmers();

  @override
  State<_Farmers> createState() => _FarmersState();
}

class _FarmersState extends State<_Farmers> {
  final _q = TextEditingController();
  String _search = '';

  @override
  Widget build(BuildContext context) {
    return _ApiView(
      key: ValueKey(_search),
      load: () => Api.instance.get('/api/admin/farmers?q=${Uri.encodeComponent(_search)}'),
      header: [
        TextField(
          controller: _q,
          textInputAction: TextInputAction.search,
          onSubmitted: (v) => setState(() => _search = v.trim()),
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.search),
            hintText: 'Search name, phone or district',
            suffixIcon: IconButton(icon: const Icon(Icons.arrow_forward), onPressed: () => setState(() => _search = _q.text.trim())),
          ),
        ),
        const SizedBox(height: 12),
      ],
      build: (context, data, reload) {
        final list = data['farmers'] as List? ?? [];
        if (list.isEmpty) return [_empty('No farmers found.')];
        return [
          Text('${list.length} farmers', style: const TextStyle(color: AppColors.muted)),
          const SizedBox(height: 8),
          for (final f in list)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Panel(
                padding: const EdgeInsets.all(12),
                onTap: () => Navigator.of(context)
                    .push(MaterialPageRoute(builder: (_) => FarmerDetailScreen(id: (f['id'] as num).toInt(), name: '${f['name']}'))),
                child: Row(children: [
                  CircleAvatar(
                    backgroundColor: AppColors.accent.withValues(alpha: 0.18),
                    child: Text('${f['name']}'.isEmpty ? '?' : '${f['name']}'[0].toUpperCase(),
                        style: const TextStyle(color: AppColors.accent, fontWeight: FontWeight.w800)),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text('${f['name']}', style: const TextStyle(fontWeight: FontWeight.w800)),
                      Text('${f['phone']}  ·  ${f['district'] ?? ''}', style: const TextStyle(color: AppColors.muted, fontSize: 13)),
                      Text(
                        '${f['scans']} scans · ${f['active_plans']} plans'
                        '${f['last_label'] != null ? ' · last: ${diseaseName('${f['last_label']}')}' : ''}',
                        style: const TextStyle(color: AppColors.muted, fontSize: 12),
                      ),
                      Text('Last login: ${f['last_login_at'] == null ? '–' : _date(f['last_login_at'] as String?)}',
                          style: const TextStyle(color: AppColors.muted, fontSize: 12)),
                    ]),
                  ),
                  if (((f['overdue'] as num?) ?? 0) > 0) Pill('${f['overdue']} late', color: AppColors.gold),
                  const Icon(Icons.chevron_right, color: AppColors.muted),
                ]),
              ),
            ),
        ];
      },
    );
  }
}

class FarmerDetailScreen extends StatelessWidget {
  final int id;
  final String name;
  const FarmerDetailScreen({super.key, required this.id, required this.name});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(name)),
      body: _ApiView(
        load: () => Api.instance.get('/api/admin/farmers/$id'),
        build: (context, data, reload) {
          final f = Map<String, dynamic>.from(data['farmer'] as Map);
          final scans = data['scans'] as List? ?? [];
          final plans = data['plans'] as List? ?? [];
          return [
            Panel(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('${f['name']}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
                const SizedBox(height: 4),
                Text('${f['phone']}  ·  ${f['district'] ?? ''}  ·  ${'${f['language'] ?? ''}'.toUpperCase()}',
                    style: const TextStyle(color: AppColors.muted)),
                Text('Joined ${_date(f['created_at'] as String?)}', style: const TextStyle(color: AppColors.muted, fontSize: 12.5)),
                const SizedBox(height: 10),
                FilledButton.icon(onPressed: () => _call(context, '${f['phone']}'), icon: const Icon(Icons.call), label: const Text('Call')),
              ]),
            ),
            _title('Treatment plans (${plans.length})'),
            if (plans.isEmpty) _empty('No treatment plans.'),
            for (final p in plans) _plan(Map<String, dynamic>.from(p as Map)),
            _title('Scans (${scans.length})'),
            if (scans.isEmpty) _empty('No scans.'),
            for (final s in scans) ...[ScanTile(scan: Map<String, dynamic>.from(s as Map)), const SizedBox(height: 8)],
          ];
        },
      ),
    );
  }

  Widget _plan(Map<String, dynamic> p) {
    final tasks = p['tasks'] as List? ?? [];
    final done = tasks.where((t) => (t as Map)['done'] == true).length;
    final worse = tasks.any((t) => (t as Map)['condition'] == 'worse');
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Panel(
        padding: const EdgeInsets.all(12),
        child: Row(children: [
          DiseaseAvatar('${p['disease']}', size: 40),
          const SizedBox(width: 10),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(diseaseName('${p['disease']}'), style: const TextStyle(fontWeight: FontWeight.w700)),
              Text('${p['field'] ?? ''}  ·  from ${p['startDate']}', style: const TextStyle(color: AppColors.muted, fontSize: 12.5)),
              const SizedBox(height: 6),
              LinearProgressIndicator(value: tasks.isEmpty ? 0 : done / tasks.length, backgroundColor: AppColors.surface2),
            ]),
          ),
          const SizedBox(width: 10),
          Column(children: [
            Text('$done/${tasks.length}', style: const TextStyle(fontWeight: FontWeight.w800)),
            if (worse) const Icon(Icons.trending_down, color: AppColors.danger, size: 18),
          ]),
        ]),
      ),
    );
  }
}

// ---------------------------------------------------------------- latest scans
class _Scans extends StatelessWidget {
  const _Scans();

  @override
  Widget build(BuildContext context) {
    return _ApiView(
      load: () => Api.instance.get('/api/admin/scans?limit=60'),
      build: (context, data, reload) {
        final list = data['scans'] as List? ?? [];
        if (list.isEmpty) return [_empty('No scans yet.')];
        return [
          const Text('Latest scans from all farmers', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
          const SizedBox(height: 10),
          for (final s in list) ...[
            ScanTile(scan: Map<String, dynamic>.from(s as Map)),
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 4, 8, 12),
              child: Text(
                '👤 ${s['farmer']} · ${s['farmerPhone']}${s['district'] != null ? ' · ${s['district']}' : ''}${s['demo'] == true ? ' · SAMPLE' : ''}',
                style: const TextStyle(color: AppColors.muted, fontSize: 12.5),
              ),
            ),
          ],
        ];
      },
    );
  }
}

// ---------------------------------------------------------------- manage
class _Manage extends StatelessWidget {
  const _Manage();

  @override
  Widget build(BuildContext context) {
    Widget item(IconData icon, String title, String text, Widget page) => Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: Panel(
            onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => page)),
            child: Row(children: [
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(color: AppColors.accent.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(14)),
                child: Icon(icon, color: AppColors.accent),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                  Text(text, style: const TextStyle(color: AppColors.muted, fontSize: 13, height: 1.35)),
                ]),
              ),
              const Icon(Icons.chevron_right, color: AppColors.muted),
            ]),
          ),
        );
    return ListView(padding: const EdgeInsets.all(16), children: [
      item(Icons.menu_book_outlined, 'Disease information', 'Edit names, symptoms, treatment and safe doses in English, Sinhala and Tamil.',
          const DiseaseEditorList()),
      item(Icons.storefront_outlined, 'Verified shops', 'Add agro shops and Agrarian Service Centres you have checked.', const ShopsAdminScreen()),
    ]);
  }
}

class DiseaseEditorList extends StatefulWidget {
  const DiseaseEditorList({super.key});

  @override
  State<DiseaseEditorList> createState() => _DiseaseEditorListState();
}

class _DiseaseEditorListState extends State<DiseaseEditorList> {
  @override
  Widget build(BuildContext context) {
    final list = Api.instance.diseases.values.toList()
      ..sort((a, b) => '${a['name_en']}'.compareTo('${b['name_en']}'));
    return Scaffold(
      appBar: AppBar(title: const Text('Disease information')),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        if (list.isEmpty) _empty('Diseases are loading. Go back and open this again.'),
        for (final d in list)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Panel(
              padding: const EdgeInsets.all(12),
              onTap: () async {
                await Navigator.of(context).push(MaterialPageRoute(builder: (_) => DiseaseEditScreen(disease: d)));
                if (mounted) setState(() {});
              },
              child: Row(children: [
                DiseaseAvatar('${d['id']}', size: 44),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('${d['name_en']}', style: const TextStyle(fontWeight: FontWeight.w800)),
                    Text(
                      '${d['chemical'] ?? '–'}${d['dose_per_10l'] != null ? ' · ${d['dose_per_10l']} ml/10 L' : ''}',
                      style: const TextStyle(color: AppColors.muted, fontSize: 12.5),
                    ),
                    if (d['updated_at'] != null)
                      Text('Updated ${_date(d['updated_at'] as String?)}', style: const TextStyle(color: AppColors.muted, fontSize: 11.5)),
                  ]),
                ),
                const Icon(Icons.edit_outlined, color: AppColors.accent),
              ]),
            ),
          ),
      ]),
    );
  }
}

class DiseaseEditScreen extends StatefulWidget {
  final Map<String, dynamic> disease;
  const DiseaseEditScreen({super.key, required this.disease});

  @override
  State<DiseaseEditScreen> createState() => _DiseaseEditScreenState();
}

class _DiseaseEditScreenState extends State<DiseaseEditScreen> {
  static const _text = [
    'name_en', 'name_si', 'name_ta', 'symptoms_en', 'symptoms_si', 'symptoms_ta',
    'treatment_en', 'treatment_si', 'treatment_ta', 'chemical',
  ];
  static const _dose = ['dose_per_10l', 'max_dose_per_10l'];
  late final Map<String, TextEditingController> _c = {
    for (final f in [..._text, ..._dose]) f: TextEditingController(text: '${widget.disease[f] ?? ''}'),
  };
  bool _busy = false;

  static String _label(String f) => const {
        'name_en': 'Name (English)', 'name_si': 'Name (සිංහල)', 'name_ta': 'Name (தமிழ்)',
        'symptoms_en': 'Symptoms (English)', 'symptoms_si': 'Symptoms (සිංහල)', 'symptoms_ta': 'Symptoms (தமிழ்)',
        'treatment_en': 'Treatment (English)', 'treatment_si': 'Treatment (සිංහල)', 'treatment_ta': 'Treatment (தமிழ்)',
        'chemical': 'Chemical (active ingredient)', 'dose_per_10l': 'Dose (ml per 10 L)', 'max_dose_per_10l': 'Maximum dose (ml per 10 L)',
      }[f]!;

  Future<void> _save() async {
    setState(() => _busy = true);
    try {
      final body = <String, dynamic>{for (final f in _text) f: _c[f]!.text};
      for (final f in _dose) {
        final t = _c[f]!.text.trim();
        body[f] = t.isEmpty ? null : t;
      }
      final r = await Api.instance.put('/api/diseases/${widget.disease['id']}', body);
      final updated = Map<String, dynamic>.from(r['disease'] as Map);
      Api.instance.diseases[updated['id'] as String] = updated;
      widget.disease
        ..clear()
        ..addAll(updated);
      dataVersion.value++;
      if (!mounted) return;
      showMessage(context, 'Saved. Farmers see the new information now.');
      Navigator.of(context).pop();
    } catch (e) {
      if (mounted) showMessage(context, e.toString());
    }
    if (mounted) setState(() => _busy = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('${widget.disease['name_en'] ?? prettyLabel('${widget.disease['id']}')}')),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        for (final f in [..._text, ..._dose])
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: TextField(
              controller: _c[f],
              minLines: f.startsWith('symptoms') || f.startsWith('treatment') ? 3 : 1,
              maxLines: f.startsWith('symptoms') || f.startsWith('treatment') ? 8 : 1,
              keyboardType: _dose.contains(f) ? const TextInputType.numberWithOptions(decimal: true) : TextInputType.multiline,
              decoration: InputDecoration(labelText: _label(f), alignLabelWithHint: true),
            ),
          ),
        const Text('One item per line for symptoms and treatment. The dose cannot be more than the maximum dose.',
            style: TextStyle(color: AppColors.muted, fontSize: 12.5)),
        const SizedBox(height: 14),
        FilledButton.icon(
          onPressed: _busy ? null : _save,
          icon: const Icon(Icons.save_outlined),
          label: Text(_busy ? '...' : tr('save')),
        ),
      ]),
    );
  }
}

class ShopsAdminScreen extends StatefulWidget {
  const ShopsAdminScreen({super.key});

  @override
  State<ShopsAdminScreen> createState() => _ShopsAdminScreenState();
}

class _ShopsAdminScreenState extends State<ShopsAdminScreen> {
  int _version = 0;

  Future<void> _add() async {
    final name = TextEditingController(), lat = TextEditingController(), lng = TextEditingController();
    final phone = TextEditingController(), address = TextEditingController(), hours = TextEditingController();
    String type = 'agro';
    String district = districtCoords.keys.first;
    final ok = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (c) => StatefulBuilder(
        builder: (c, setD) => Padding(
          padding: EdgeInsets.fromLTRB(20, 20, 20, 20 + MediaQuery.of(c).viewInsets.bottom),
          child: SingleChildScrollView(
            child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              const Text('Add a shop', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
              const SizedBox(height: 12),
              TextField(controller: name, decoration: const InputDecoration(labelText: 'Shop name')),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                initialValue: type,
                dropdownColor: AppColors.surface2,
                decoration: const InputDecoration(labelText: 'Type'),
                items: const [
                  DropdownMenuItem(value: 'agro', child: Text('Agro-chemical shop')),
                  DropdownMenuItem(value: 'asc', child: Text('Agrarian Service Centre')),
                  DropdownMenuItem(value: 'garden', child: Text('Garden & farm supplies')),
                ],
                onChanged: (v) => setD(() => type = v ?? type),
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                initialValue: district,
                dropdownColor: AppColors.surface2,
                decoration: InputDecoration(labelText: tr('district')),
                items: [for (final d in districtCoords.keys) DropdownMenuItem(value: d, child: Text(d))],
                onChanged: (v) => setD(() => district = v ?? district),
              ),
              const SizedBox(height: 8),
              Row(children: [
                Expanded(
                  child: TextField(
                    controller: lat,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true, signed: true),
                    decoration: const InputDecoration(labelText: 'Latitude', hintText: '7.2083'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: lng,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true, signed: true),
                    decoration: const InputDecoration(labelText: 'Longitude', hintText: '79.8358'),
                  ),
                ),
              ]),
              const Text('Tip: in Google Maps, press and hold on the shop to see its latitude and longitude.',
                  style: TextStyle(color: AppColors.muted, fontSize: 12)),
              const SizedBox(height: 8),
              TextField(controller: phone, keyboardType: TextInputType.phone, decoration: const InputDecoration(labelText: 'Phone')),
              const SizedBox(height: 8),
              TextField(controller: address, decoration: const InputDecoration(labelText: 'Address')),
              const SizedBox(height: 8),
              TextField(controller: hours, decoration: const InputDecoration(labelText: 'Opening hours')),
              const SizedBox(height: 14),
              FilledButton(onPressed: () => Navigator.pop(c, true), child: Text(tr('save'))),
            ]),
          ),
        ),
      ),
    );
    if (ok != true) return;
    try {
      await Api.instance.post('/api/shops', {
        'name': name.text.trim(), 'type': type, 'district': district,
        'lat': lat.text.trim(), 'lng': lng.text.trim(),
        'phone': phone.text.trim(), 'address': address.text.trim(), 'hours': hours.text.trim(),
      });
      if (mounted) {
        showMessage(context, 'Shop added.');
        setState(() => _version++);
      }
    } catch (e) {
      if (mounted) showMessage(context, e.toString());
    }
  }

  Future<void> _remove(Map s) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        backgroundColor: AppColors.surface2,
        title: const Text('Remove this shop?'),
        content: Text('${s['name']}'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(c, false), child: Text(tr('cancel'))),
          TextButton(onPressed: () => Navigator.pop(c, true), child: const Text('Remove', style: TextStyle(color: AppColors.danger))),
        ],
      ),
    );
    if (ok != true) return;
    try {
      await Api.instance.delete('/api/shops/${s['id']}', {});
      if (mounted) setState(() => _version++);
    } catch (e) {
      if (mounted) showMessage(context, e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Verified shops')),
      floatingActionButton: FloatingActionButton.extended(onPressed: _add, icon: const Icon(Icons.add), label: const Text('Add shop')),
      body: _ApiView(
        key: ValueKey(_version),
        load: () => Api.instance.get('/api/shops'),
        build: (context, data, reload) {
          final list = data['shops'] as List? ?? [];
          if (list.isEmpty) return [_empty('No verified shops yet. Tap "Add shop".')];
          return [
            for (final s in list)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Panel(
                  padding: const EdgeInsets.all(12),
                  child: Row(children: [
                    const Icon(Icons.storefront, color: AppColors.accent),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text('${s['name']}', style: const TextStyle(fontWeight: FontWeight.w800)),
                        Text('${s['district'] ?? ''} · ${s['phone'] ?? ''}', style: const TextStyle(color: AppColors.muted, fontSize: 12.5)),
                        if ('${s['address'] ?? ''}'.isNotEmpty)
                          Text('${s['address']}', style: const TextStyle(color: AppColors.muted, fontSize: 12.5)),
                      ]),
                    ),
                    IconButton(onPressed: () => _remove(s as Map), icon: const Icon(Icons.delete_outline, color: AppColors.danger)),
                  ]),
                ),
              ),
            const SizedBox(height: 70),
          ];
        },
      ),
    );
  }
}
