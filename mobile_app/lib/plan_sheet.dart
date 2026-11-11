// "Start treatment plan" bottom sheet, used by the Pests page (the Scan page has its own).
import 'package:flutter/material.dart';

import 'api.dart';
import 'i18n.dart';
import 'main.dart';
import 'widgets.dart';

String _two(int n) => n.toString().padLeft(2, '0');
String ymd(DateTime d) => '${d.year}-${_two(d.month)}-${_two(d.day)}';
String hm(TimeOfDay t) => '${_two(t.hour)}:${_two(t.minute)}';

/// Asks for field name, start date and reminder time, then saves the plan on the server.
/// Returns true when the plan was created.
Future<bool> startPlanFlow(BuildContext context, String id, String title) async {
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
          Text(title, style: const TextStyle(color: AppColors.muted)),
          const SizedBox(height: 16),
          TextField(
            controller: field,
            decoration: InputDecoration(labelText: tr('field_name'), prefixIcon: const Icon(Icons.landscape_outlined)),
          ),
          const SizedBox(height: 8),
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.calendar_today, color: AppColors.accent),
            title: Text(tr('start_date')),
            trailing: Text(ymd(date), style: const TextStyle(fontWeight: FontWeight.w700)),
            onTap: () async {
              final d = await showDatePicker(context: c, initialDate: date, firstDate: DateTime(2024), lastDate: DateTime(2030));
              if (d != null) setD(() => date = d);
            },
          ),
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.alarm, color: AppColors.accent),
            title: Text(tr('alarm_time')),
            trailing: Text(hm(time), style: const TextStyle(fontWeight: FontWeight.w700)),
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
  if (ok != true) return false;
  try {
    await Api.instance.post('/api/plans', {
      'disease': id,
      'field': field.text.trim(),
      'startDate': ymd(date),
      'alarmTime': hm(time),
      'confidence': null,
    });
    dataVersion.value++;
    if (context.mounted) showMessage(context, tr('plan_started'));
    return true;
  } catch (e) {
    if (context.mounted) showMessage(context, e.toString());
    return false;
  }
}
