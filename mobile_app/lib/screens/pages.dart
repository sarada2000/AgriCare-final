// Opens a page of the app by name (used by the chat answers and the home screen tools).
import 'package:flutter/material.dart';

import '../content.dart';
import '../i18n.dart';
import 'crop_screen.dart';
import 'diseases_screen.dart';
import 'learning_screen.dart';
import 'more_screens.dart';
import 'pests_screen.dart';
import 'plans_screen.dart';
import 'scan_screen.dart';
import 'varieties_screen.dart';
import 'weather_screen.dart';
import 'weeds_screen.dart';

Widget _withBar(String title, Widget body) => Scaffold(appBar: AppBar(title: Text(title)), body: body);

Widget? appPage(String page) {
  switch (page) {
    case 'diseases':
      return _withBar(tr('tab_diseases'), const DiseasesScreen());
    case 'scan':
      return _withBar(tr('tab_scan'), ScanScreen(onPlanStarted: () {}));
    case 'weather':
      return _withBar(tr('tab_weather'), const WeatherScreen());
    case 'plans':
      return _withBar(tr('tab_plans'), const PlansScreen());
    case 'pests':
      return const PestsScreen();
    case 'weeds':
      return const WeedsScreen();
    case 'varieties':
      return const VarietiesScreen();
    case 'crop':
      return const CropScreen();
    case 'learning':
      return const LearningScreen();
    case 'shops':
      return const ShopsScreen();
    case 'contact':
      return const ContactScreen();
    case 'chat':
      return const ChatScreen();
  }
  return null;
}

void openAppPage(BuildContext context, String page) {
  final w = appPage(page);
  if (w != null) Navigator.of(context).push(MaterialPageRoute(builder: (_) => w));
}

/// The tools grid on the home screen: every website section, inside the app.
class ToolsGrid extends StatelessWidget {
  const ToolsGrid({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<String>(valueListenable: appLanguage, builder: (context, _, __) => _grid(context));
  }

  Widget _grid(BuildContext context) {
    final items = <List<Object>>[
      ['pests', Icons.bug_report_outlined, wt('nav_pests'), const Color(0xFFE7BD52)],
      ['weeds', Icons.grass, wt('nav_weeds'), const Color(0xFF8FD646)],
      ['varieties', Icons.spa_outlined, wt('nav_varieties'), const Color(0xFF6BB8FF)],
      ['crop', Icons.calendar_month, wt('nav_crop'), const Color(0xFF4CAF50)],
      ['learning', Icons.menu_book_outlined, wt('nav_solutions'), const Color(0xFFC792EA)],
      ['chat', Icons.chat_bubble_outline, tr('ask_title'), const Color(0xFFFF9F5E)],
      ['shops', Icons.storefront_outlined, tr('shops_title'), const Color(0xFF6BD6C4)],
      ['contact', Icons.support_agent, tr('contact_title'), const Color(0xFFFF6B5E)],
    ];
    return GridView.count(
      crossAxisCount: 4,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 10,
      crossAxisSpacing: 10,
      childAspectRatio: 0.78,
      children: [
        for (final it in items)
          Material(
            color: const Color(0xFF141C15),
            borderRadius: BorderRadius.circular(16),
            child: InkWell(
              borderRadius: BorderRadius.circular(16),
              onTap: () => openAppPage(context, it[0] as String),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 10),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF2A372B)),
                ),
                child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: (it[3] as Color).withValues(alpha: 0.16),
                      borderRadius: BorderRadius.circular(13),
                    ),
                    child: Icon(it[1] as IconData, color: it[3] as Color),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    it[2] as String,
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, height: 1.2),
                  ),
                ]),
              ),
            ),
          ),
      ],
    );
  }
}
