// Log in or create an account. Same accounts as the website.
import 'package:flutter/material.dart';

import '../api.dart';
import '../i18n.dart';
import '../main.dart';
import '../widgets.dart';
import 'home_screen.dart';
import 'setup_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _name = TextEditingController();
  final _phone = TextEditingController();
  final _password = TextEditingController();
  bool _register = false;
  bool _busy = false;
  bool _hide = true;
  String? _error;

  Future<void> _submit() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    final api = Api.instance;
    try {
      if (_register) {
        await api.register(_name.text.trim(), _phone.text.trim(), _password.text, appLanguage.value);
      } else {
        await api.login(_phone.text.trim(), _password.text);
      }
      final lang = api.user?['language'];
      if (lang is String && !_register) appLanguage.value = lang;
      if (!mounted) return;
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const HomeScreen()));
    } catch (e) {
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
          padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
          children: [
            const Center(child: AppLogo(size: 84)),
            const SizedBox(height: 14),
            Text(_register ? tr('register') : tr('login'),
                textAlign: TextAlign.center, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
            const SizedBox(height: 4),
            Text(tr('app_sub'), textAlign: TextAlign.center, style: const TextStyle(color: AppColors.muted)),
            const SizedBox(height: 28),
            Panel(
              padding: const EdgeInsets.all(18),
              child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                if (_register) ...[
                  TextField(
                      controller: _name,
                      decoration: InputDecoration(labelText: tr('name'), prefixIcon: const Icon(Icons.person_outline))),
                  const SizedBox(height: 12),
                ],
                TextField(
                  controller: _phone,
                  keyboardType: TextInputType.phone,
                  decoration: InputDecoration(
                      labelText: tr('phone'), hintText: '07X XXX XXXX', prefixIcon: const Icon(Icons.phone_outlined)),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _password,
                  obscureText: _hide,
                  decoration: InputDecoration(
                    labelText: tr('password'),
                    prefixIcon: const Icon(Icons.lock_outline),
                    suffixIcon: IconButton(
                      icon: Icon(_hide ? Icons.visibility_outlined : Icons.visibility_off_outlined),
                      onPressed: () => setState(() => _hide = !_hide),
                    ),
                  ),
                ),
                if (_error != null) ...[
                  const SizedBox(height: 12),
                  Text(_error!, style: const TextStyle(color: AppColors.danger)),
                ],
                const SizedBox(height: 18),
                FilledButton(
                  onPressed: _busy ? null : _submit,
                  child: _busy
                      ? const SizedBox(height: 22, width: 22, child: CircularProgressIndicator(strokeWidth: 2.4))
                      : Text(_register ? tr('register') : tr('login')),
                ),
              ]),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => setState(() {
                _register = !_register;
                _error = null;
              }),
              child: Text(_register ? tr('have_account') : tr('no_account'),
                  style: const TextStyle(color: AppColors.accent, fontWeight: FontWeight.w600)),
            ),
            TextButton(
              onPressed: () =>
                  Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const SetupScreen())),
              child: Text('${tr('change_server')}  ·  ${Api.instance.baseUrl}',
                  style: const TextStyle(color: AppColors.muted, fontSize: 12)),
            ),
          ],
        ),
      ),
    );
  }
}
