// AgriCare mobile app. Uses the same Flask backend, ResNet50 model and database as the website.
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'api.dart';
import 'content.dart';
import 'i18n.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'screens/setup_screen.dart';
import 'widgets.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Api.instance.load();
  await Content.instance.load();   // the website's farm content, bundled in the app
  final prefs = await SharedPreferences.getInstance();
  appLanguage.value = prefs.getString('lang') ?? (Api.instance.user?['language'] as String?) ?? 'en';
  appLanguage.addListener(() {
    prefs.setString('lang', appLanguage.value);
    _rebuildAll();
  });
  runApp(const AgriCareApp());
}

/// Redraws every open screen so a new language shows everywhere at once
/// (screens made with `const` would otherwise keep the old text).
void _rebuildAll() {
  void mark(Element e) {
    e.markNeedsBuild();
    e.visitChildren(mark);
  }

  WidgetsBinding.instance.rootElement?.visitChildren(mark);
}

class AgriCareApp extends StatelessWidget {
  const AgriCareApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<String>(
      valueListenable: appLanguage,
      builder: (context, lang, _) {
        final api = Api.instance;
        final Widget start = api.baseUrl.isEmpty
            ? const SetupScreen()
            : (api.loggedIn ? const HomeScreen() : const LoginScreen());
        return MaterialApp(
          title: 'AgriCare',
          debugShowCheckedModeBanner: false,
          theme: buildTheme(),
          home: start,
        );
      },
    );
  }
}

/// Language menu used in the app bars.
class LanguageMenu extends StatelessWidget {
  const LanguageMenu({super.key});

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<String>(
      icon: const Icon(Icons.translate),
      color: AppColors.surface2,
      onSelected: (v) => appLanguage.value = v,
      itemBuilder: (_) => const [
        PopupMenuItem(value: 'en', child: Text('English')),
        PopupMenuItem(value: 'si', child: Text('සිංහල')),
        PopupMenuItem(value: 'ta', child: Text('தமிழ்')),
      ],
    );
  }
}

void showMessage(BuildContext context, String text) {
  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));
}

/// The AgriCare logo: green leaf in a soft circle.
class AppLogo extends StatelessWidget {
  final double size;
  const AppLogo({super.key, this.size = 72});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          colors: [AppColors.accent.withValues(alpha: 0.35), AppColors.accent.withValues(alpha: 0.08)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Icon(Icons.eco, size: size * 0.55, color: AppColors.accent),
    );
  }
}
