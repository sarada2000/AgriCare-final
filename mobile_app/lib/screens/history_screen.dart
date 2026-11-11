// The farmer's scan history, from GET /api/scans.
import 'package:flutter/material.dart';

import '../api.dart';
import '../i18n.dart';
import '../widgets.dart';
import 'dashboard_screen.dart';

class HistoryScreen extends StatefulWidget {
  final bool standalone;
  const HistoryScreen({super.key, this.standalone = false});

  @override
  State<HistoryScreen> createState() => HistoryScreenState();
}

class HistoryScreenState extends State<HistoryScreen> {
  List<dynamic> _scans = [];
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
      final d = await Api.instance.get('/api/scans');
      _scans = d['scans'] as List? ?? [];
    } catch (e) {
      _error = e.toString();
    }
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    final list = RefreshIndicator(
      onRefresh: reload,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
        children: [
          if (_loading) const LinearProgressIndicator(),
          if (_error != null) Text(_error!, style: const TextStyle(color: AppColors.danger)),
          if (!_loading && _scans.isEmpty && _error == null)
            EmptyState(icon: Icons.history, text: tr('no_scans')),
          for (final s in _scans) ...[ScanTile(scan: s as Map<String, dynamic>), const SizedBox(height: 8)],
        ],
      ),
    );
    if (!widget.standalone) return list;
    return Scaffold(appBar: AppBar(title: Text(tr('all_scans'))), body: list);
  }
}
