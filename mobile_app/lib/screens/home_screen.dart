// Main screen: 5 tabs (Home, Scan, Diseases, Weather, Treatment) and a side menu for the other features.
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../api.dart';
import '../content.dart';
import '../i18n.dart';
import '../main.dart';
import '../voice.dart';
import '../widgets.dart';
import 'crop_screen.dart';
import 'dashboard_screen.dart';
import 'diseases_screen.dart';
import 'history_screen.dart';
import 'learning_screen.dart';
import 'login_screen.dart';
import 'more_screens.dart';
import 'officer_screen.dart';
import 'pests_screen.dart';
import 'plans_screen.dart';
import 'scan_screen.dart';
import 'varieties_screen.dart';
import 'weather_screen.dart';
import 'weeds_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _tab = 0;
  final Set<int> _opened = {0};   // tabs are built the first time they are opened (faster start)

  @override
  void initState() {
    super.initState();
    Api.instance.loadDiseases().then((_) {
      dataVersion.value++;
    }).catchError((_) {});
  }

  void _goTo(int i) {
    Voice.instance.stop();
    setState(() {
      _tab = i;
      _opened.add(i);
    });
  }

  Future<void> _logout() async {
    await Voice.instance.stop();
    await Api.instance.logout();
    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (_) => const LoginScreen()), (_) => false);
  }

  void _open(Widget page) {
    Navigator.of(context).pop();
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => page));
  }

  Future<void> _openWebsite() async {
    Navigator.of(context).pop();
    final ok = await launchUrl(Uri.parse('${Api.instance.baseUrl}/'), mode: LaunchMode.externalApplication);
    if (!ok && mounted) showMessage(context, 'Cannot open the website.');
  }

  @override
  Widget build(BuildContext context) {
    final user = Api.instance.user ?? {};
    final titles = [tr('tab_home'), tr('tab_scan'), tr('tab_diseases'), tr('tab_weather'), tr('tab_plans')];
    return Scaffold(
      appBar: AppBar(
        title: Row(children: [
          const Icon(Icons.eco, color: AppColors.accent),
          const SizedBox(width: 8),
          Text(_tab == 0 ? 'AgriCare' : titles[_tab], style: const TextStyle(fontWeight: FontWeight.w800)),
        ]),
        actions: const [LanguageMenu()],
      ),
      drawer: Drawer(
        backgroundColor: AppColors.surface,
        child: SafeArea(
          child: ListView(children: [
            ListTile(
              leading: const AppLogo(size: 44),
              title: Text('${user['name'] ?? ''}', style: const TextStyle(fontWeight: FontWeight.w700)),
              subtitle: Text('${user['phone'] ?? ''}  ·  ${user['district'] ?? ''}',
                  style: const TextStyle(color: AppColors.muted)),
            ),
            const Divider(),
            if (Api.instance.isOfficer)
              _item(Icons.admin_panel_settings_outlined, 'Officer dashboard', () => _open(const OfficerScreen())),
            _item(Icons.history, tr('all_scans'), () => _open(const HistoryScreen(standalone: true))),
            _item(Icons.chat_bubble_outline, tr('ask_title'), () => _open(const ChatScreen())),
            const Divider(),
            _item(Icons.calendar_month, wt('nav_crop'), () => _open(const CropScreen())),
            _item(Icons.bug_report_outlined, wt('nav_pests'), () => _open(const PestsScreen())),
            _item(Icons.grass, wt('nav_weeds'), () => _open(const WeedsScreen())),
            _item(Icons.spa_outlined, wt('nav_varieties'), () => _open(const VarietiesScreen())),
            _item(Icons.menu_book_outlined, wt('nav_solutions'), () => _open(const LearningScreen())),
            const Divider(),
            _item(Icons.support_agent, tr('contact_title'), () => _open(const ContactScreen())),
            _item(Icons.storefront_outlined, tr('shops_title'), () => _open(const ShopsScreen())),
            _item(Icons.public, tr('open_website'), _openWebsite),
            const Divider(),
            _item(Icons.privacy_tip_outlined, tr('account_title'), () => _open(const AccountScreen())),
            _item(Icons.logout, tr('logout'), _logout),
          ]),
        ),
      ),
      body: IndexedStack(
        index: _tab,
        children: [
          DashboardScreen(goTo: _goTo),
          _opened.contains(1) ? ScanScreen(onPlanStarted: () => _goTo(4)) : const SizedBox.shrink(),
          _opened.contains(2) ? const DiseasesScreen() : const SizedBox.shrink(),
          _opened.contains(3) ? const WeatherScreen() : const SizedBox.shrink(),
          _opened.contains(4) ? const PlansScreen() : const SizedBox.shrink(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: _goTo,
        destinations: [
          NavigationDestination(icon: const Icon(Icons.home_outlined), selectedIcon: const Icon(Icons.home), label: titles[0]),
          NavigationDestination(
              icon: const Icon(Icons.camera_alt_outlined), selectedIcon: const Icon(Icons.camera_alt), label: titles[1]),
          NavigationDestination(
              icon: const Icon(Icons.menu_book_outlined), selectedIcon: const Icon(Icons.menu_book), label: titles[2]),
          NavigationDestination(
              icon: const Icon(Icons.cloud_outlined), selectedIcon: const Icon(Icons.cloud), label: titles[3]),
          NavigationDestination(
              icon: const Icon(Icons.event_note_outlined), selectedIcon: const Icon(Icons.event_note), label: titles[4]),
        ],
      ),
    );
  }

  Widget _item(IconData icon, String text, VoidCallback onTap) => ListTile(
        leading: Icon(icon, color: AppColors.accent),
        title: Text(text),
        onTap: onTap,
      );
}
