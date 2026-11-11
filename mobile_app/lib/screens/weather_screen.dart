// Weather tab: forecast for the farmer's district from GET /api/weather, with spraying advice.
import 'package:flutter/material.dart';

import '../api.dart';
import '../i18n.dart';
import '../widgets.dart';

class WeatherScreen extends StatefulWidget {
  const WeatherScreen({super.key});

  @override
  State<WeatherScreen> createState() => _WeatherScreenState();
}

class _WeatherScreenState extends State<WeatherScreen> {
  late String _district = (Api.instance.user?['district'] as String?) ?? 'Polonnaruwa';
  Map<String, dynamic>? _data;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    if (!districtCoords.containsKey(_district)) _district = 'Polonnaruwa';
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      _data = await Api.instance.weather(_district);
    } catch (e) {
      _error = e.toString();
    }
    if (mounted) setState(() => _loading = false);
  }

  /// WMO weather code -> icon and a short word in the chosen language.
  static (IconData, String) describe(int code) {
    String t(String en, String si, String ta) => {'en': en, 'si': si, 'ta': ta}[appLanguage.value] ?? en;
    if (code == 0) return (Icons.wb_sunny_outlined, t('Clear', 'පැහැදිලි', 'தெளிவு'));
    if (code <= 3) return (Icons.wb_cloudy_outlined, t('Cloudy', 'වලාකුළු', 'மேகமூட்டம்'));
    if (code <= 48) return (Icons.foggy, t('Fog', 'මීදුම', 'மூடுபனி'));
    if (code <= 67 || (code >= 80 && code <= 82)) return (Icons.water_drop_outlined, t('Rain', 'වැසි', 'மழை'));
    if (code >= 95) return (Icons.thunderstorm_outlined, t('Storm', 'ගිගුරුම් සහිත වැසි', 'இடியுடன் மழை'));
    return (Icons.cloud_outlined, t('Cloudy', 'වලාකුළු', 'மேகமூட்டம்'));
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
        children: [
          ScreenTitle(tr('tab_weather')),
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
          const SizedBox(height: 16),
          if (_loading) const LinearProgressIndicator(),
          if (_error != null) Text(_error!, style: const TextStyle(color: AppColors.danger)),
          if (_data != null && !_loading) ..._content(),
        ],
      ),
    );
  }

  List<Widget> _content() {
    final cur = Map<String, dynamic>.from(_data!['current'] as Map? ?? {});
    final daily = Map<String, dynamic>.from(_data!['daily'] as Map? ?? {});
    final days = (daily['time'] as List? ?? []);
    num at(String k, int i) => ((daily[k] as List?)?[i] as num?) ?? 0;
    final (icon, word) = describe((cur['weather_code'] as num? ?? 0).toInt());
    final rainChance = days.isEmpty ? 0 : at('precipitation_probability_max', 0);
    final wind = (cur['wind_speed_10m'] as num? ?? 0);
    final humidity = (cur['relative_humidity_2m'] as num? ?? 0);
    final adviceKey = rainChance >= 60 ? 'spray_rain' : (wind >= 20 ? 'spray_wind' : 'spray_ok');
    final adviceColor = adviceKey == 'spray_ok' ? AppColors.accent : AppColors.gold;
    return [
      Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(22),
          gradient: const LinearGradient(
              colors: [Color(0xFF1F3B4D), Color(0xFF141C15)], begin: Alignment.topLeft, end: Alignment.bottomRight),
          border: Border.all(color: AppColors.line),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('${tr('now')} · $_district', style: const TextStyle(color: AppColors.muted)),
          const SizedBox(height: 8),
          Row(children: [
            Icon(icon, size: 54, color: const Color(0xFF8CC8FF)),
            const SizedBox(width: 14),
            Text('${(cur['temperature_2m'] as num? ?? 0).round()}°C',
                style: const TextStyle(fontSize: 44, fontWeight: FontWeight.w800)),
            const SizedBox(width: 12),
            Expanded(child: Text(word, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600))),
          ]),
          const SizedBox(height: 14),
          Wrap(spacing: 8, runSpacing: 8, children: [
            Pill('${tr('humidity')} ${humidity.round()}%', color: const Color(0xFF8CC8FF), icon: Icons.water_drop_outlined),
            Pill('${tr('wind')} ${wind.round()} km/h', color: AppColors.muted, icon: Icons.air),
            Pill('${tr('rain')} ${rainChance.round()}%', color: AppColors.gold, icon: Icons.umbrella_outlined),
          ]),
        ]),
      ),
      const SizedBox(height: 12),
      Panel(
        child: Row(children: [
          Icon(adviceKey == 'spray_ok' ? Icons.check_circle_outline : Icons.block, color: adviceColor),
          const SizedBox(width: 12),
          Expanded(child: Text(tr(adviceKey), style: TextStyle(color: adviceColor, height: 1.4, fontWeight: FontWeight.w600))),
        ]),
      ),
      if (humidity >= 85) ...[
        const SizedBox(height: 8),
        Panel(
          child: Row(children: [
            const Icon(Icons.warning_amber_rounded, color: AppColors.gold),
            const SizedBox(width: 12),
            Expanded(child: Text(tr('blast_risk'), style: const TextStyle(height: 1.4))),
          ]),
        ),
      ],
      const SizedBox(height: 20),
      Text(tr('next_7_days'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
      const SizedBox(height: 10),
      for (var i = 0; i < days.length; i++) ...[
        Panel(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          child: Row(children: [
            SizedBox(width: 92, child: Text(_dayName('${days[i]}', i), style: const TextStyle(fontWeight: FontWeight.w700))),
            Icon(describe(at('weather_code', i).toInt()).$1, color: const Color(0xFF8CC8FF)),
            const SizedBox(width: 10),
            Expanded(
              child: Text('☔ ${at('precipitation_probability_max', i).round()}%  ·  ${at('precipitation_sum', i).toStringAsFixed(1)} mm',
                  style: const TextStyle(color: AppColors.muted, fontSize: 13)),
            ),
            Text('${at('temperature_2m_min', i).round()}° / ${at('temperature_2m_max', i).round()}°',
                style: const TextStyle(fontWeight: FontWeight.w700)),
          ]),
        ),
        const SizedBox(height: 8),
      ],
    ];
  }

  String _dayName(String iso, int i) {
    if (i == 0) return tr('today');
    final d = DateTime.tryParse(iso);
    if (d == null) return iso;
    const en = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const si = ['සඳු', 'අඟහ', 'බදා', 'බ්‍රහ', 'සිකු', 'සෙන', 'ඉරි'];
    const ta = ['திங்', 'செவ்', 'புத', 'வியா', 'வெள்', 'சனி', 'ஞாயி'];
    final names = {'si': si, 'ta': ta}[appLanguage.value] ?? en;
    return '${names[d.weekday - 1]} ${d.day}';
  }
}
