// Extra features from the website: Ask AgriCare (chat), contact an officer, agro shops, account & privacy.
import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';

import '../agri_brain.dart';
import '../api.dart';
import '../content.dart';
import '../i18n.dart';
import '../main.dart';
import '../widgets.dart';
import 'login_screen.dart';
import 'pages.dart';

Future<void> _launch(BuildContext context, String url) async {
  final ok = await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
  if (!ok && context.mounted) showMessage(context, url);
}

String _intlPhone(String phone) {
  final d = phone.replaceAll(RegExp(r'\D'), '');
  return d.startsWith('0') ? '94${d.substring(1)}' : d;
}

// ---------------------------------------------------------------- Ask AgriCare
class _Msg {
  final String text;
  final bool user;
  final List<BrainLink> links;
  final bool ai;
  const _Msg(this.text, {this.user = false, this.links = const [], this.ai = false});
}

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _text = TextEditingController();
  final _scroll = ScrollController();
  final List<_Msg> _messages = [];
  bool _busy = false;

  /// Same as the website: a sure answer from the farm notes is shown at once; other questions go to the
  /// AI on the server (when it has a key), with the farm notes as a hint. With no AI, the farm notes answer.
  Future<void> _send([String? preset]) async {
    final q = (preset ?? _text.text).trim();
    if (q.isEmpty || _busy) return;
    _text.clear();
    setState(() {
      _messages.add(_Msg(q, user: true));
      _busy = true;
    });
    _toBottom();
    final brain = AgriBrain.instance.answer(q);
    _Msg reply = _Msg(brain.text, links: brain.links);
    if (!brain.confident && Api.instance.baseUrl.isNotEmpty) {
      try {
        final history = [
          for (final m in _messages.take(_messages.length - 1).toList().reversed.take(8).toList().reversed)
            {'role': m.user ? 'user' : 'assistant', 'content': m.text},
        ];
        final r = await Api.instance.post('/api/chat', {
          'message': q,
          'lang': AgriBrain.instance.detectLang(q),
          'history': history,
          if (brain.source != 'none') 'hint': brain.text,
        });
        final a = r['answer'];
        if (a is String && a.trim().isNotEmpty) reply = _Msg(a.trim(), links: brain.links, ai: true);
      } catch (_) {
        // no server or no AI key: keep the farm-notes answer
      }
    }
    if (!mounted) return;
    setState(() {
      _messages.add(reply);
      _busy = false;
    });
    _toBottom();
  }

  Future<void> _toBottom() async {
    await Future.delayed(const Duration(milliseconds: 80));
    if (_scroll.hasClients) {
      _scroll.animateTo(_scroll.position.maxScrollExtent, duration: const Duration(milliseconds: 250), curve: Curves.easeOut);
    }
  }

  Widget _bubble(_Msg m) {
    final w = MediaQuery.of(context).size.width * 0.82;
    return Align(
      alignment: m.user ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        constraints: BoxConstraints(maxWidth: w),
        child: Column(crossAxisAlignment: m.user ? CrossAxisAlignment.end : CrossAxisAlignment.start, children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: m.user ? AppColors.accent : AppColors.surface2,
              borderRadius: BorderRadius.only(
                topLeft: const Radius.circular(18),
                topRight: const Radius.circular(18),
                bottomLeft: Radius.circular(m.user ? 18 : 4),
                bottomRight: Radius.circular(m.user ? 4 : 18),
              ),
            ),
            child: SelectableText(m.text, style: TextStyle(color: m.user ? AppColors.accentInk : AppColors.fg, height: 1.45)),
          ),
          if (!m.user) ...[
            const SizedBox(height: 4),
            Text(m.ai ? wt('chat_ai') : wt('chat_offline'), style: const TextStyle(color: AppColors.muted, fontSize: 11)),
          ],
          if (m.links.isNotEmpty) ...[
            const SizedBox(height: 6),
            Wrap(spacing: 6, runSpacing: 6, children: [
              for (final l in m.links)
                ActionChip(
                  avatar: const Icon(Icons.arrow_forward, size: 16, color: AppColors.accent),
                  label: Text(l.label),
                  onPressed: () => openAppPage(context, l.page),
                ),
            ]),
          ],
        ]),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final sugg = AgriBrain.instance.suggestions();
    return Scaffold(
      appBar: AppBar(
        title: Row(children: [
          const AppLogo(size: 34),
          const SizedBox(width: 10),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(wt('chat_header'), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
              Text(wt('chat_online'), style: const TextStyle(color: AppColors.muted, fontSize: 11)),
            ]),
          ),
        ]),
        actions: [
          if (_messages.isNotEmpty)
            IconButton(tooltip: wt('chat_clear'), onPressed: () => setState(_messages.clear), icon: const Icon(Icons.delete_outline)),
          const LanguageMenu(),
        ],
      ),
      body: Column(children: [
        Expanded(
          child: ListView(
            controller: _scroll,
            padding: const EdgeInsets.all(16),
            children: [
              _bubble(_Msg(wt('chat_welcome'))),
              if (_messages.isEmpty) ...[
                const SizedBox(height: 6),
                Text(wt('chat_try'), style: const TextStyle(color: AppColors.muted, fontSize: 13)),
                const SizedBox(height: 8),
                Wrap(spacing: 8, runSpacing: 8, children: [
                  for (final s in sugg) ActionChip(label: Text(s), onPressed: () => _send(s)),
                ]),
              ],
              for (final m in _messages) _bubble(m),
              if (_busy)
                Align(
                  alignment: Alignment.centerLeft,
                  child: Padding(
                    padding: const EdgeInsets.all(8),
                    child: Text(wt('chat_thinking'), style: const TextStyle(color: AppColors.muted)),
                  ),
                ),
            ],
          ),
        ),
        SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(12, 4, 12, 12),
            child: Row(children: [
              Expanded(
                child: TextField(
                  controller: _text,
                  minLines: 1,
                  maxLines: 4,
                  textInputAction: TextInputAction.send,
                  onSubmitted: (_) => _send(),
                  decoration: InputDecoration(hintText: wt('chat_placeholder')),
                ),
              ),
              const SizedBox(width: 8),
              IconButton.filled(onPressed: () => _send(), icon: const Icon(Icons.send)),
            ]),
          ),
        ),
      ]),
    );
  }
}

// ---------------------------------------------------------------- Contact an officer
class ContactScreen extends StatefulWidget {
  const ContactScreen({super.key});

  @override
  State<ContactScreen> createState() => _ContactScreenState();
}

class _ContactScreenState extends State<ContactScreen> {
  Map<String, dynamic> _contacts = {};
  late String _district = (Api.instance.user?['district'] as String?) ?? '';
  final _message = TextEditingController();
  bool _sending = false;

  @override
  void initState() {
    super.initState();
    Api.instance.get('/api/contacts').then((d) {
      if (mounted) setState(() => _contacts = Map<String, dynamic>.from(d['contacts'] as Map? ?? {}));
    }).catchError((_) {});
  }

  Future<void> _request() async {
    final u = Api.instance.user ?? {};
    setState(() => _sending = true);
    try {
      await Api.instance.post('/api/contact-requests', {
        'name': u['name'],
        'phone': u['phone'],
        'district': _district.isEmpty ? null : _district,
        'message': _message.text.trim(),
        'language': appLanguage.value,
      });
      _message.clear();
      if (mounted) showMessage(context, tr('contact_sent'));
    } catch (e) {
      if (mounted) showMessage(context, e.toString());
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = Map<String, dynamic>.from((_contacts[_district] ?? _contacts['_main'] ?? {}) as Map);
    final phone = (c['phone'] ?? '').toString();
    final whatsapp = (c['whatsapp'] ?? '').toString();
    return Scaffold(
      appBar: AppBar(title: Text(tr('contact_title'))),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        DropdownButtonFormField<String>(
          initialValue: districtCoords.containsKey(_district) ? _district : null,
          dropdownColor: AppColors.surface2,
          decoration: InputDecoration(labelText: tr('district'), prefixIcon: const Icon(Icons.place_outlined)),
          items: [for (final d in districtCoords.keys) DropdownMenuItem(value: d, child: Text(d))],
          onChanged: (v) => setState(() => _district = v ?? ''),
        ),
        const SizedBox(height: 14),
        Panel(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              const Icon(Icons.support_agent, color: AppColors.accent, size: 30),
              const SizedBox(width: 12),
              Expanded(
                child: Text((c['name'] ?? '').toString().isEmpty ? tr('contact_title') : '${c['name']}',
                    style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
              ),
            ]),
            if ((c['hours'] ?? '').toString().isNotEmpty) ...[
              const SizedBox(height: 6),
              Text('🕑 ${c['hours']}', style: const TextStyle(color: AppColors.muted)),
            ],
            const SizedBox(height: 14),
            if (phone.isEmpty)
              Text(tr('contact_none'), style: const TextStyle(color: AppColors.muted))
            else
              Row(children: [
                Expanded(
                  child: FilledButton.icon(
                      onPressed: () => _launch(context, 'tel:$phone'), icon: const Icon(Icons.call), label: Text(phone)),
                ),
                if (whatsapp.isNotEmpty) ...[
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _launch(context, 'https://wa.me/${_intlPhone(whatsapp)}'),
                      icon: const Icon(Icons.chat),
                      label: const Text('WhatsApp'),
                    ),
                  ),
                ],
              ]),
          ]),
        ),
        const SizedBox(height: 20),
        Text(tr('contact_request'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
        const SizedBox(height: 10),
        TextField(controller: _message, minLines: 3, maxLines: 5, decoration: InputDecoration(hintText: tr('contact_message'))),
        const SizedBox(height: 12),
        FilledButton.icon(
          onPressed: _sending ? null : _request,
          icon: const Icon(Icons.phone_callback_outlined),
          label: Text(tr('contact_call_me')),
        ),
      ]),
    );
  }
}

// ---------------------------------------------------------------- Agro shops
/// Same search as the website's shops page: shops added by officers (server) plus agro shops and
/// Agrarian Service Centres from OpenStreetMap near the district, sorted by distance.
class ShopsScreen extends StatefulWidget {
  const ShopsScreen({super.key});

  @override
  State<ShopsScreen> createState() => _ShopsScreenState();
}

class _ShopsScreenState extends State<ShopsScreen> {
  late String _district = districtCoords.containsKey(Api.instance.user?['district'])
      ? Api.instance.user!['district'] as String
      : 'Colombo';
  int _radius = 20;
  List<Map<String, dynamic>> _shops = [];
  bool _loading = true;
  bool _mapFailed = false;
  int _run = 0;

  static const _overpass = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];

  @override
  void initState() {
    super.initState();
    _load();
  }

  static double _km(double lat1, double lng1, double lat2, double lng2) {
    double rad(double x) => x * math.pi / 180;
    final dLat = rad(lat2 - lat1), dLng = rad(lng2 - lng1);
    final a = math.pow(math.sin(dLat / 2), 2) + math.cos(rad(lat1)) * math.cos(rad(lat2)) * math.pow(math.sin(dLng / 2), 2);
    return 2 * 6371 * math.asin(math.sqrt(a));
  }

  static String _type(Map tags) {
    final name = '${tags['name'] ?? tags['name:en'] ?? ''}'.toLowerCase();
    if (RegExp('agrarian|ගොවිජන|கமநல').hasMatch(name)) return 'asc';
    if (tags['shop'] == 'agrarian' || RegExp('agro|agri|fertili|chemical|ගොවි|පොහොර|உரம்').hasMatch(name)) return 'agro';
    return 'garden';
  }

  Future<List<Map<String, dynamic>>> _fromMap(double lat, double lng) async {
    final r = _radius * 1000;
    final q = '[out:json][timeout:25];('
        'nwr["shop"~"agrarian|farm|garden_centre"](around:$r,$lat,$lng);'
        'nwr["name"~"agro|agri|fertili|agrarian|ගොවි|පොහොර|கமநல|உரம்",i](around:$r,$lat,$lng);'
        ');out center tags 80;';
    Object? lastError;
    for (final server in _overpass) {
      try {
        final res = await http
            .post(Uri.parse(server), body: {'data': q})
            .timeout(const Duration(seconds: 30));
        if (res.statusCode != 200) throw Exception('HTTP ${res.statusCode}');
        final data = jsonDecode(utf8.decode(res.bodyBytes)) as Map<String, dynamic>;
        final seen = <String>{};
        final out = <Map<String, dynamic>>[];
        for (final e in (data['elements'] as List? ?? [])) {
          final tags = (e['tags'] as Map?) ?? {};
          final plat = (e['lat'] ?? e['center']?['lat']) as num?;
          final plng = (e['lon'] ?? e['center']?['lon']) as num?;
          final name = tags['name'] ?? tags['name:en'] ?? tags['name:si'] ?? tags['name:ta'];
          if (name == null || plat == null || plng == null) continue;
          final key = '${name.toString().toLowerCase()}${(plat * 1000).round()}';
          if (!seen.add(key)) continue;
          final addr = [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']].where((x) => x != null).join(', ');
          out.add({
            'name': name.toString(), 'lat': plat.toDouble(), 'lng': plng.toDouble(),
            'phone': '${tags['phone'] ?? tags['contact:phone'] ?? ''}', 'address': addr,
            'hours': '${tags['opening_hours'] ?? ''}', 'type': _type(tags), 'verified': false,
          });
        }
        return out;
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError ?? Exception('no map server');
  }

  Future<void> _load() async {
    final run = ++_run;
    setState(() {
      _loading = true;
      _mapFailed = false;
    });
    final c = districtCoords[_district]!;
    final all = <Map<String, dynamic>>[];
    try {
      final d = await Api.instance.get('/api/shops?district=${Uri.encodeComponent(_district)}');
      for (final s in (d['shops'] as List? ?? [])) {
        all.add({...Map<String, dynamic>.from(s as Map), 'verified': true});
      }
    } catch (_) {}
    try {
      all.addAll(await _fromMap(c[0], c[1]));
    } catch (_) {
      _mapFailed = true;
    }
    for (final s in all) {
      final lat = (s['lat'] as num?)?.toDouble(), lng = (s['lng'] as num?)?.toDouble();
      s['km'] = (lat == null || lng == null) ? 9999.0 : _km(c[0], c[1], lat, lng);
    }
    all.sort((a, b) {
      if (a['verified'] != b['verified']) return a['verified'] == true ? -1 : 1;
      return (a['km'] as double).compareTo(b['km'] as double);
    });
    if (!mounted || run != _run) return;
    setState(() {
      _shops = all;
      _loading = false;
    });
  }

  String _typeText(String? t) => t == 'asc' ? wt('shop_type_asc') : t == 'agro' ? wt('shop_type_agro') : wt('shop_type_garden');

  @override
  Widget build(BuildContext context) {
    final c = districtCoords[_district]!;
    return Scaffold(
      appBar: AppBar(title: Text(wt('shop_title')), actions: const [LanguageMenu()]),
      body: RefreshIndicator(
        onRefresh: _load,
        child: ListView(padding: const EdgeInsets.all(16), children: [
          Text(wt('shop_lead'), style: const TextStyle(color: AppColors.muted, height: 1.4)),
          const SizedBox(height: 14),
          DropdownButtonFormField<String>(
            initialValue: _district,
            dropdownColor: AppColors.surface2,
            decoration: InputDecoration(labelText: tr('district'), prefixIcon: const Icon(Icons.place_outlined)),
            items: [for (final d in districtCoords.keys) DropdownMenuItem(value: d, child: Text(d))],
            onChanged: (v) {
              if (v == null) return;
              setState(() => _district = v);
              _load();
            },
          ),
          const SizedBox(height: 10),
          Row(children: [
            Text('${wt('shop_radius')}: ', style: const TextStyle(color: AppColors.muted)),
            const SizedBox(width: 6),
            for (final r in const [10, 20, 40]) ...[
              ChoiceChip(
                label: Text('$r km'),
                selected: _radius == r,
                onSelected: (_) {
                  setState(() => _radius = r);
                  _load();
                },
              ),
              const SizedBox(width: 6),
            ],
          ]),
          const SizedBox(height: 10),
          FilledButton.icon(
            onPressed: () => _launch(context, 'https://www.google.com/maps/search/agro+chemical+shop/@${c[0]},${c[1]},13z'),
            icon: const Icon(Icons.travel_explore),
            label: Text(wt('shop_google').replaceAll('🔎 ', '')),
          ),
          const SizedBox(height: 14),
          if (_loading) ...[
            const LinearProgressIndicator(),
            const SizedBox(height: 8),
            Text(wt('shop_searching'), style: const TextStyle(color: AppColors.muted)),
          ],
          if (!_loading && _shops.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Text('${_shops.length} ${wt('shop_found')}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
            ),
          if (!_loading && _shops.isEmpty)
            EmptyState(icon: Icons.storefront_outlined, text: _mapFailed ? wt('shop_error') : wt('shop_none')),
          for (final s in _shops) ...[_shopCard(s), const SizedBox(height: 10)],
          if (!_loading) ...[
            const SizedBox(height: 6),
            Panel(
              color: AppColors.gold.withValues(alpha: 0.08),
              child: Text('💡 ${wt('shop_tip')}', style: const TextStyle(height: 1.4)),
            ),
            const SizedBox(height: 8),
            Text(wt('shop_source'), style: const TextStyle(color: AppColors.muted, fontSize: 12)),
          ],
        ]),
      ),
    );
  }

  Widget _shopCard(Map<String, dynamic> s) {
    final km = s['km'] as double;
    final type = s['type']?.toString();
    final color = type == 'asc' ? const Color(0xFF6BB8FF) : type == 'agro' ? AppColors.accent : AppColors.gold;
    return Panel(
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(color: color.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(12)),
            child: Icon(type == 'asc' ? Icons.account_balance_outlined : Icons.storefront, color: color),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('${s['name']}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
              const SizedBox(height: 2),
              Text(_typeText(type), style: TextStyle(color: color, fontSize: 12.5, fontWeight: FontWeight.w600)),
            ]),
          ),
          if (km < 9999) Pill('${km.toStringAsFixed(km < 10 ? 1 : 0)} km', color: AppColors.muted),
        ]),
        if (s['verified'] == true) ...[const SizedBox(height: 8), Pill(wt('shop_verified'), icon: Icons.verified_outlined)],
        if ('${s['address'] ?? ''}'.isNotEmpty) ...[
          const SizedBox(height: 8),
          Text('${s['address']}', style: const TextStyle(color: AppColors.muted)),
        ],
        if ('${s['hours'] ?? ''}'.isNotEmpty) Text('🕑 ${s['hours']}', style: const TextStyle(color: AppColors.muted)),
        const SizedBox(height: 10),
        Row(children: [
          if ('${s['phone'] ?? ''}'.isNotEmpty) ...[
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => _launch(context, 'tel:${s['phone']}'),
                icon: const Icon(Icons.call),
                label: Text(wt('shop_call')),
              ),
            ),
            const SizedBox(width: 10),
          ],
          Expanded(
            child: OutlinedButton.icon(
              onPressed: () => _launch(context, 'https://www.google.com/maps/dir/?api=1&destination=${s['lat']},${s['lng']}'),
              icon: const Icon(Icons.directions),
              label: Text(wt('shop_directions')),
            ),
          ),
        ]),
      ]),
    );
  }
}

// ---------------------------------------------------------------- Account & privacy
class AccountScreen extends StatefulWidget {
  const AccountScreen({super.key});

  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> {
  final _password = TextEditingController();
  bool _busy = false;

  Future<void> _delete() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        backgroundColor: AppColors.surface2,
        title: Text(tr('delete_account')),
        content: Text(tr('delete_confirm')),
        actions: [
          TextButton(onPressed: () => Navigator.pop(c, false), child: Text(tr('cancel'))),
          TextButton(
              onPressed: () => Navigator.pop(c, true),
              child: Text(tr('delete_account'), style: const TextStyle(color: AppColors.danger))),
        ],
      ),
    );
    if (ok != true) return;
    setState(() => _busy = true);
    try {
      await Api.instance.delete('/api/auth/me', {'password': _password.text});
      await Api.instance.logout();
      if (!mounted) return;
      Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (_) => const LoginScreen()), (_) => false);
    } catch (e) {
      if (mounted) showMessage(context, e.toString());
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final u = Api.instance.user ?? {};
    return Scaffold(
      appBar: AppBar(title: Text(tr('account_title'))),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        Panel(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('${u['name'] ?? ''}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            Text('📱 ${u['phone'] ?? ''}', style: const TextStyle(color: AppColors.muted)),
            if (u['district'] != null) Text('📍 ${u['district']}', style: const TextStyle(color: AppColors.muted)),
          ]),
        ),
        const SizedBox(height: 16),
        Panel(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              const Icon(Icons.privacy_tip_outlined, color: AppColors.accent),
              const SizedBox(width: 10),
              Text(tr('privacy_title'), style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
            ]),
            const SizedBox(height: 10),
            Text(tr('privacy_text'), style: const TextStyle(color: AppColors.muted, height: 1.45)),
          ]),
        ),
        const SizedBox(height: 16),
        if (u['role'] != 'officer')
          Panel(
            color: const Color(0xFF1E1312),
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Text(tr('delete_account'), style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: AppColors.danger)),
              const SizedBox(height: 8),
              Text(tr('delete_text'), style: const TextStyle(color: AppColors.muted, height: 1.45)),
              const SizedBox(height: 12),
              TextField(
                  controller: _password,
                  obscureText: true,
                  decoration: InputDecoration(labelText: tr('password'), prefixIcon: const Icon(Icons.lock_outline))),
              const SizedBox(height: 12),
              FilledButton(
                style: FilledButton.styleFrom(backgroundColor: AppColors.danger, foregroundColor: Colors.white),
                onPressed: _busy ? null : _delete,
                child: Text(tr('delete_account')),
              ),
            ]),
          ),
      ]),
    );
  }
}
