// Colours and small building blocks shared by all screens (same colours as the website, css/style.css).
import 'package:flutter/material.dart';

import 'pictures.dart';

class AppColors {
  static const bg = Color(0xFF0C120D);
  static const surface = Color(0xFF141C15);
  static const surface2 = Color(0xFF1B251C);
  static const line = Color(0xFF2A372B);
  static const fg = Color(0xFFEEF3E8);
  static const muted = Color(0xFFA3B09C);
  static const accent = Color(0xFF8FD646);
  static const accentInk = Color(0xFF0C120D);
  static const gold = Color(0xFFE7BD52);
  static const danger = Color(0xFFFF6B5E);
}

/// Goes up by one whenever a scan or plan is saved, so other tabs know to reload.
final ValueNotifier<int> dataVersion = ValueNotifier<int>(0);

ThemeData buildTheme() {
  final scheme = ColorScheme.fromSeed(
    seedColor: AppColors.accent,
    brightness: Brightness.dark,
    primary: AppColors.accent,
    onPrimary: AppColors.accentInk,
    surface: AppColors.bg,
    onSurface: AppColors.fg,
    error: AppColors.danger,
  );
  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: scheme,
    scaffoldBackgroundColor: AppColors.bg,
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.bg,
      foregroundColor: AppColors.fg,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: false,
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: AppColors.surface,
      indicatorColor: AppColors.accent.withValues(alpha: 0.18),
      iconTheme: WidgetStateProperty.resolveWith((states) => IconThemeData(
            color: states.contains(WidgetState.selected) ? AppColors.accent : AppColors.muted,
          )),
      labelTextStyle: WidgetStateProperty.resolveWith((states) => TextStyle(
            fontSize: 12,
            fontWeight: states.contains(WidgetState.selected) ? FontWeight.w700 : FontWeight.w500,
            color: states.contains(WidgetState.selected) ? AppColors.accent : AppColors.muted,
          )),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.surface,
      labelStyle: const TextStyle(color: AppColors.muted),
      hintStyle: const TextStyle(color: AppColors.muted),
      prefixIconColor: AppColors.muted,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.line)),
      enabledBorder:
          OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.line)),
      focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.accent, width: 1.6)),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: AppColors.accent,
        foregroundColor: AppColors.accentInk,
        minimumSize: const Size.fromHeight(52),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: AppColors.fg,
        minimumSize: const Size.fromHeight(50),
        side: const BorderSide(color: AppColors.line),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
      ),
    ),
    snackBarTheme: const SnackBarThemeData(behavior: SnackBarBehavior.floating),
    dividerColor: AppColors.line,
  );
}

/// A rounded panel like the cards on the website.
class Panel extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;
  final Color? color;
  const Panel({super.key, required this.child, this.padding = const EdgeInsets.all(16), this.onTap, this.color});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: color ?? AppColors.surface,
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppColors.line),
          ),
          padding: padding,
          child: child,
        ),
      ),
    );
  }
}

/// Small coloured label, e.g. "Healthy" or "Active".
class Pill extends StatelessWidget {
  final String text;
  final Color color;
  final IconData? icon;
  const Pill(this.text, {super.key, this.color = AppColors.accent, this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(99),
        border: Border.all(color: color.withValues(alpha: 0.45)),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        if (icon != null) ...[Icon(icon, size: 14, color: color), const SizedBox(width: 5)],
        Text(text, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.w700)),
      ]),
    );
  }
}

/// Big screen title with an optional small line above it.
class ScreenTitle extends StatelessWidget {
  final String title;
  final String? eyebrow;
  final String? subtitle;
  const ScreenTitle(this.title, {super.key, this.eyebrow, this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (eyebrow != null)
        Text(eyebrow!.toUpperCase(),
            style: const TextStyle(color: AppColors.accent, fontSize: 12, fontWeight: FontWeight.w800, letterSpacing: 1.2)),
      if (eyebrow != null) const SizedBox(height: 4),
      Text(title, style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, height: 1.15)),
      if (subtitle != null) ...[
        const SizedBox(height: 6),
        Text(subtitle!, style: const TextStyle(color: AppColors.muted, fontSize: 14, height: 1.4)),
      ],
    ]);
  }
}

/// Shown when a list has nothing in it yet.
class EmptyState extends StatelessWidget {
  final IconData icon;
  final String text;
  final String? buttonText;
  final VoidCallback? onPressed;
  const EmptyState({super.key, required this.icon, required this.text, this.buttonText, this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 24),
      child: Column(children: [
        Container(
          width: 84,
          height: 84,
          decoration: BoxDecoration(color: AppColors.accent.withValues(alpha: 0.12), shape: BoxShape.circle),
          child: Icon(icon, size: 40, color: AppColors.accent),
        ),
        const SizedBox(height: 16),
        Text(text, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.muted, fontSize: 15, height: 1.4)),
        if (buttonText != null) ...[
          const SizedBox(height: 18),
          SizedBox(width: 220, child: FilledButton(onPressed: onPressed, child: Text(buttonText!))),
        ],
      ]),
    );
  }
}

/// Small picture of a disease, so the lists are easy to scan by eye.
class DiseaseAvatar extends StatelessWidget {
  final String id;
  final double size;
  const DiseaseAvatar(this.id, {super.key, this.size = 46});

  static Color colorFor(String id) {
    if (id == 'healthy') return AppColors.accent;
    if (id.startsWith('bacterial')) return const Color(0xFF6BB8FF);
    if (id == 'tungro') return const Color(0xFFC792EA);
    if (id == 'hispa' || id == 'dead_heart') return AppColors.gold;
    return const Color(0xFFFF9F5E);
  }

  @override
  Widget build(BuildContext context) {
    // a small picture of the disease (real photo from the server, else the drawing)
    return SizedBox(width: size, height: size, child: DiseasePicture(id, height: size, radius: size / 3.2));
  }
}
