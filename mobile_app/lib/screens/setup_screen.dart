// First screen: enter the address of the AgriCare server (the laptop running python app.py).
import 'package:flutter/material.dart';

import '../api.dart';
import '../i18n.dart';
import '../main.dart';
import '../widgets.dart';
import 'login_screen.dart';

class SetupScreen extends StatefulWidget {
  const SetupScreen({super.key});

  @override
  State<SetupScreen> createState() => _SetupScreenState();
}

class _SetupScreenState extends State<SetupScreen> {
  final _url = TextEditingController(text: Api.instance.baseUrl.isEmpty ? 'http://' : Api.instance.baseUrl);
  bool _busy = false;
  String? _error;

  Future<void> _connect() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    final api = Api.instance;
    final old = api.baseUrl;
    try {
      await api.setServer(_url.text);
      await api.checkServer();
      if (!mounted) return;
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const LoginScreen()));
    } catch (e) {
      await api.setServer(old.isEmpty ? _url.text : old);
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(actions: const [LanguageMenu()]),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
          children: [
            const Center(child: AppLogo(size: 96)),
            const SizedBox(height: 16),
            const Text('AgriCare', textAlign: TextAlign.center, style: TextStyle(fontSize: 32, fontWeight: FontWeight.w800)),
            const SizedBox(height: 4),
            Text(tr('app_sub'), textAlign: TextAlign.center, style: const TextStyle(color: AppColors.muted, fontSize: 15)),
            const SizedBox(height: 36),
            Panel(
              padding: const EdgeInsets.all(18),
              child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                TextField(
                  controller: _url,
                  keyboardType: TextInputType.url,
                  decoration: InputDecoration(labelText: tr('server'), prefixIcon: const Icon(Icons.dns_outlined)),
                ),
                const SizedBox(height: 10),
                Text(tr('server_hint'), style: const TextStyle(color: AppColors.muted, fontSize: 12.5, height: 1.4)),
                if (_error != null) ...[
                  const SizedBox(height: 12),
                  Text(_error!, style: const TextStyle(color: AppColors.danger)),
                ],
                const SizedBox(height: 18),
                FilledButton(
                  onPressed: _busy ? null : _connect,
                  child: _busy
                      ? const SizedBox(height: 22, width: 22, child: CircularProgressIndicator(strokeWidth: 2.4))
                      : Text(tr('connect')),
                ),
              ]),
            ),
          ],
        ),
      ),
    );
  }
}
