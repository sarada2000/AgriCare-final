// Scan a leaf: take or choose a photo, send it to the ResNet50 model on the server, show and speak the diagnosis.
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../api.dart';
import '../i18n.dart';
import '../main.dart';
import '../voice.dart';
import '../widgets.dart';
import 'dashboard_screen.dart';
import 'diseases_screen.dart';

class ScanScreen extends StatefulWidget {
  final VoidCallback onPlanStarted;
  const ScanScreen({super.key, required this.onPlanStarted});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  XFile? _photo;
  Uint8List? _bytes;
  bool _busy = false;
  String? _error;
  Map<String, dynamic>? _result;

  /// Same safety disclaimer as the website, shown once.
  Future<bool> _acceptDisclaimer() async {
    final prefs = await SharedPreferences.getInstance();
    if (prefs.getBool('disclaimer_ok') == true) return true;
    if (!mounted) return false;
    final ok = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (c) => AlertDialog(
        backgroundColor: AppColors.surface2,
        icon: const Icon(Icons.health_and_safety_outlined, color: AppColors.gold, size: 36),
        title: Text(tr('disclaimer_title')),
        content: Text(tr('disclaimer'), style: const TextStyle(height: 1.45)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(c, false), child: Text(tr('cancel'))),
          TextButton(
              onPressed: () => Navigator.pop(c, true),
              child: Text(tr('i_understand'), style: const TextStyle(color: AppColors.accent, fontWeight: FontWeight.w700))),
        ],
      ),
    );
    if (ok == true) await prefs.setBool('disclaimer_ok', true);
    return ok == true;
  }

  Future<void> _pick(ImageSource source) async {
    final x = await ImagePicker().pickImage(source: source, maxWidth: 1600, imageQuality: 90);
    if (x == null) return;
    final bytes = await x.readAsBytes();
    await Voice.instance.stop();
    setState(() {
      _photo = x;
      _bytes = bytes;
      _result = null;
      _error = null;
    });
  }

  Future<void> _analyse() async {
    if (_photo == null || !await _acceptDisclaimer()) return;
    setState(() {
      _busy = true;
      _error = null;
      _result = null;
    });
    try {
      final r = await Api.instance.predict(_photo!);
      if (Api.instance.diseases.isEmpty) await Api.instance.loadDiseases();
      setState(() => _result = r);
      dataVersion.value++;
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _speak() async {
    final r = _result!;
    if (Voice.instance.speaking.value) {
      await Voice.instance.stop();
      return;
    }
    final played = await Voice.instance.play(Voice.resultClips(r['label'] as String, (r['confidence'] as num).toDouble()));
    if (played == 0 && mounted) showMessage(context, tr('no_voice'));
  }

  Future<void> _startPlan() async {
    final r = _result!;
    final field = TextEditingController();
    DateTime date = DateTime.now();
    TimeOfDay time = const TimeOfDay(hour: 7, minute: 0);
    final ok = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (c) => StatefulBuilder(
        builder: (c, setD) => Padding(
          padding: EdgeInsets.fromLTRB(20, 20, 20, 20 + MediaQuery.of(c).viewInsets.bottom),
          child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Text(tr('start_plan'), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
            const SizedBox(height: 4),
            Text(diseaseName(r['label'] as String), style: const TextStyle(color: AppColors.muted)),
            const SizedBox(height: 16),
            TextField(controller: field, decoration: InputDecoration(labelText: tr('field_name'), prefixIcon: const Icon(Icons.landscape_outlined))),
            const SizedBox(height: 8),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.calendar_today, color: AppColors.accent),
              title: Text(tr('start_date')),
              trailing: Text(_ymd(date), style: const TextStyle(fontWeight: FontWeight.w700)),
              onTap: () async {
                final d = await showDatePicker(context: c, initialDate: date, firstDate: DateTime(2024), lastDate: DateTime(2030));
                if (d != null) setD(() => date = d);
              },
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.alarm, color: AppColors.accent),
              title: Text(tr('alarm_time')),
              trailing: Text(_hm(time), style: const TextStyle(fontWeight: FontWeight.w700)),
              onTap: () async {
                final t = await showTimePicker(context: c, initialTime: time);
                if (t != null) setD(() => time = t);
              },
            ),
            const SizedBox(height: 12),
            FilledButton(onPressed: () => Navigator.pop(c, true), child: Text(tr('save'))),
          ]),
        ),
      ),
    );
    if (ok != true) return;
    try {
      await Api.instance.post('/api/plans', {
        'disease': r['label'],
        'field': field.text.trim(),
        'startDate': _ymd(date),
        'alarmTime': _hm(time),
        'confidence': r['confidence'],
        'scanId': r['scan']?['id'],
      });
      dataVersion.value++;
      if (!mounted) return;
      showMessage(context, tr('plan_started'));
      widget.onPlanStarted();
    } catch (e) {
      if (mounted) showMessage(context, e.toString());
    }
  }

  static String _two(int n) => n.toString().padLeft(2, '0');
  static String _ymd(DateTime d) => '${d.year}-${_two(d.month)}-${_two(d.day)}';
  static String _hm(TimeOfDay t) => '${_two(t.hour)}:${_two(t.minute)}';

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
      children: [
        ScreenTitle(tr('scan_title'), subtitle: tr('scan_tip')),
        const SizedBox(height: 16),
        GestureDetector(
          onTap: _busy ? null : () => _pick(ImageSource.camera),
          child: AspectRatio(
            aspectRatio: 4 / 3,
            child: Container(
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: _photo == null ? AppColors.line : AppColors.accent.withValues(alpha: 0.5), width: 1.5),
              ),
              clipBehavior: Clip.antiAlias,
              child: _photo == null
                  ? Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                      Container(
                        width: 76,
                        height: 76,
                        decoration: BoxDecoration(color: AppColors.accent.withValues(alpha: 0.12), shape: BoxShape.circle),
                        child: const Icon(Icons.add_a_photo_outlined, color: AppColors.accent, size: 34),
                      ),
                      const SizedBox(height: 14),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Text(tr('add_photo'), textAlign: TextAlign.center, style: const TextStyle(color: AppColors.muted)),
                      ),
                    ])
                  : Stack(fit: StackFit.expand, children: [
                      Image.memory(_bytes!, fit: BoxFit.cover),
                      if (_busy)
                        Container(
                          color: Colors.black54,
                          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                            const CircularProgressIndicator(),
                            const SizedBox(height: 12),
                            Text(tr('analysing'), style: const TextStyle(fontWeight: FontWeight.w700)),
                          ]),
                        ),
                    ]),
            ),
          ),
        ),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(
            child: OutlinedButton.icon(
              onPressed: _busy ? null : () => _pick(ImageSource.camera),
              icon: const Icon(Icons.camera_alt_outlined),
              label: Text(tr('camera')),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: OutlinedButton.icon(
              onPressed: _busy ? null : () => _pick(ImageSource.gallery),
              icon: const Icon(Icons.photo_library_outlined),
              label: Text(tr('gallery')),
            ),
          ),
        ]),
        const SizedBox(height: 12),
        FilledButton.icon(
          onPressed: (_photo == null || _busy) ? null : _analyse,
          icon: const Icon(Icons.search),
          label: Text(_busy ? tr('analysing') : tr('analyse')),
        ),
        if (_error != null) ...[
          const SizedBox(height: 16),
          Panel(
            color: const Color(0xFF2A1513),
            child: Row(children: [
              const Icon(Icons.error_outline, color: AppColors.danger),
              const SizedBox(width: 12),
              Expanded(child: Text(_error!, style: const TextStyle(height: 1.4))),
            ]),
          ),
        ],
        if (_result != null) ...[const SizedBox(height: 16), _resultCard()],
      ],
    );
  }

  Widget _resultCard() {
    final r = _result!;
    final label = r['label'] as String;
    final conf = (r['confidence'] as num).toDouble();
    final uncertain = r['uncertain'] == true;
    final disease = Api.instance.diseases[label];
    final healthy = label == 'healthy';
    final statusColor = uncertain ? AppColors.gold : (healthy ? AppColors.accent : AppColors.danger);
    final others = (r['top'] as List? ?? []).skip(1).toList();
    return Panel(
      padding: const EdgeInsets.all(18),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Pill(
            uncertain ? tr('not_sure') : (healthy ? tr('healthy') : tr('disease_found')),
            color: statusColor,
            icon: uncertain ? Icons.help_outline : (healthy ? Icons.check_circle_outline : Icons.warning_amber_rounded),
          ),
          const Spacer(),
          ValueListenableBuilder<bool>(
            valueListenable: Voice.instance.speaking,
            builder: (_, speaking, __) => TextButton.icon(
              onPressed: _speak,
              icon: Icon(speaking ? Icons.stop_circle_outlined : Icons.volume_up_outlined, color: AppColors.accent),
              label: Text(speaking ? tr('stop') : tr('listen'), style: const TextStyle(color: AppColors.accent)),
            ),
          ),
        ]),
        if (r['demo'] == true) Text(tr('demo_result'), style: const TextStyle(color: AppColors.gold)),
        const SizedBox(height: 10),
        Row(children: [
          DiseaseAvatar(label, size: 52),
          const SizedBox(width: 14),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(diseaseName(label), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, height: 1.2)),
              if (appLanguage.value != 'en' && disease != null)
                Text('${disease['name_en']}', style: const TextStyle(color: AppColors.accent)),
            ]),
          ),
        ]),
        const SizedBox(height: 16),
        Row(children: [
          Text(tr('confidence'), style: const TextStyle(color: AppColors.muted)),
          const Spacer(),
          Text('${(conf * 100).round()}%', style: TextStyle(color: statusColor, fontWeight: FontWeight.w800, fontSize: 16)),
        ]),
        const SizedBox(height: 6),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(value: conf, minHeight: 10, color: statusColor, backgroundColor: AppColors.line),
        ),
        if (uncertain) ...[
          const SizedBox(height: 12),
          Text(tr('uncertain'), style: const TextStyle(color: AppColors.gold, height: 1.4)),
        ],
        if (others.isNotEmpty) ...[
          const SizedBox(height: 14),
          Text(tr('other_options'), style: const TextStyle(color: AppColors.muted, fontSize: 13)),
          const SizedBox(height: 6),
          Wrap(spacing: 8, runSpacing: 8, children: [
            for (final o in others)
              Pill('${diseaseName(o['label'] as String)}  ${(((o['confidence'] as num).toDouble()) * 100).round()}%',
                  color: AppColors.muted),
          ]),
        ],
        if (disease != null) ...[
          const Divider(height: 32),
          DiseaseInfo(disease: disease),
        ],
        if (Api.instance.planDiseases.contains(label) && !uncertain && !healthy) ...[
          const SizedBox(height: 16),
          FilledButton.icon(onPressed: _startPlan, icon: const Icon(Icons.alarm_add), label: Text(tr('start_plan'))),
        ],
      ]),
    );
  }
}
