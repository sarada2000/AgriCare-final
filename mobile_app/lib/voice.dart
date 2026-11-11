// Plays the recorded Sinhala / Tamil / English voice clips that the website uses
// (made with tools/make_voices.py, served by the backend at /voice/<lang>/<id>.mp3).
import 'dart:async';

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import 'api.dart';
import 'i18n.dart';

class Voice {
  Voice._();
  static final Voice instance = Voice._();

  final AudioPlayer _player = AudioPlayer();
  final ValueNotifier<bool> speaking = ValueNotifier<bool>(false);
  int _session = 0;

  /// Plays clips one after another, e.g. ['name_blast', 'conf_87', 'sum_blast'].
  /// Clips that do not exist are skipped. Returns how many clips were played.
  Future<int> play(List<String> clipIds) async {
    await stop();
    final my = ++_session;
    speaking.value = true;
    var played = 0;
    for (final id in clipIds) {
      if (my != _session) break;
      try {
        final url = Api.instance.voiceUrl(appLanguage.value, id);
        final head = await http.head(Uri.parse(url)).timeout(const Duration(seconds: 8));
        if (head.statusCode != 200 || my != _session) continue;      // no recording for this part
        final done = _player.onPlayerComplete.first;
        await _player.play(UrlSource(url));
        await done.timeout(const Duration(seconds: 40));
        played++;
      } catch (_) {
        // clip missing or could not play: go on with the next one
      }
    }
    if (my == _session) speaking.value = false;
    return played;
  }

  Future<void> stop() async {
    _session++;
    speaking.value = false;
    try {
      await _player.stop();
    } catch (_) {}
  }

  /// The clips for a scan result: disease name, confidence and short summary.
  static List<String> resultClips(String label, double confidence) {
    final pct = (confidence * 100).round();
    return ['name_$label', if (pct >= 50) 'conf_$pct', 'sum_$label'];
  }
}
