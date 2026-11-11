// Talks to the AgriCare Flask backend (the same server the website uses).
import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// An error message from the server, e.g. {"error": "...", "field": "not_leaf"}.
class ApiError implements Exception {
  final String message;
  final int status;
  final String? field;
  ApiError(this.message, {this.status = 0, this.field});
  @override
  String toString() => message;
}

class Api {
  Api._();
  static final Api instance = Api._();

  String baseUrl = '';            // e.g. http://192.168.1.5:8000
  String? token;
  Map<String, dynamic>? user;
  Map<String, Map<String, dynamic>> diseases = {};   // id -> row of the diseases table
  Set<String> planDiseases = {};                     // diseases that have a treatment plan

  bool get loggedIn => token != null;
  bool get isOfficer => user?['role'] == 'officer';

  // ---------- saved settings ----------
  Future<void> load() async {
    final p = await SharedPreferences.getInstance();
    baseUrl = p.getString('baseUrl') ?? '';
    token = p.getString('token');
    final u = p.getString('user');
    user = u == null ? null : jsonDecode(u) as Map<String, dynamic>;
  }

  Future<void> _save() async {
    final p = await SharedPreferences.getInstance();
    await p.setString('baseUrl', baseUrl);
    if (token == null) {
      await p.remove('token');
      await p.remove('user');
    } else {
      await p.setString('token', token!);
      await p.setString('user', jsonEncode(user));
    }
  }

  Future<void> setServer(String url) async {
    var u = url.trim();
    if (!u.startsWith('http')) u = 'http://$u';
    baseUrl = u.replaceAll(RegExp(r'/+$'), '');
    await _save();
  }

  String fileUrl(String path) => path.startsWith('http') ? path : '$baseUrl$path';

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      };

  // ---------- requests ----------
  Future<Map<String, dynamic>> _handle(http.Response r) async {
    Map<String, dynamic> data = {};
    try {
      data = jsonDecode(utf8.decode(r.bodyBytes)) as Map<String, dynamic>;
    } catch (_) {}
    if (r.statusCode == 401 && token != null) await logout();
    if (r.statusCode >= 300) {
      throw ApiError(data['error']?.toString() ?? 'Server error ${r.statusCode}',
          status: r.statusCode, field: data['field']?.toString());
    }
    return data;
  }

  Future<Map<String, dynamic>> _send(Future<http.Response> Function() call) async {
    if (baseUrl.isEmpty) throw ApiError('Set the server address first.');
    try {
      return await _handle(await call().timeout(const Duration(seconds: 60)));
    } on ApiError {
      rethrow;
    } catch (_) {
      throw ApiError('Cannot reach the AgriCare server. Check the address and that the phone is on the same Wi-Fi.');
    }
  }

  Future<Map<String, dynamic>> get(String path) =>
      _send(() => http.get(Uri.parse('$baseUrl$path'), headers: _headers));

  Future<Map<String, dynamic>> post(String path, Map<String, dynamic> body) =>
      _send(() => http.post(Uri.parse('$baseUrl$path'), headers: _headers, body: jsonEncode(body)));

  Future<Map<String, dynamic>> put(String path, Map<String, dynamic> body) =>
      _send(() => http.put(Uri.parse('$baseUrl$path'), headers: _headers, body: jsonEncode(body)));

  Future<Map<String, dynamic>> patch(String path, Map<String, dynamic> body) =>
      _send(() => http.patch(Uri.parse('$baseUrl$path'), headers: _headers, body: jsonEncode(body)));

  Future<Map<String, dynamic>> delete(String path, Map<String, dynamic> body) =>
      _send(() => http.delete(Uri.parse('$baseUrl$path'), headers: _headers, body: jsonEncode(body)));

  // ---------- features ----------
  Future<bool> checkServer() async {
    final d = await get('/api/health');
    return d['ok'] == true;
  }

  Future<void> login(String phone, String password) async {
    final d = await post('/api/auth/login', {'phone': phone, 'password': password});
    token = d['token'];
    user = d['user'];
    await _save();
  }

  Future<void> register(String name, String phone, String password, String language) async {
    final d = await post('/api/auth/register',
        {'name': name, 'phone': phone, 'password': password, 'language': language});
    token = d['token'];
    user = d['user'];
    await _save();
  }

  Future<void> logout() async {
    token = null;
    user = null;
    await _save();
  }

  /// Loads the disease library (your diseases table) and which diseases have plans.
  Future<void> loadDiseases() async {
    final d = await get('/api/diseases');
    diseases = {for (final x in (d['diseases'] as List)) x['id'] as String: Map<String, dynamic>.from(x)};
    try {
      final p = await get('/api/plans/diseases');
      planDiseases = Set<String>.from(p['diseases'] as List);
    } catch (_) {
      planDiseases = diseases.keys.toSet();   // older server: let the server decide when a plan is started
    }
  }

  /// Weather for a district (the server asks Open-Meteo and caches it).
  Future<Map<String, dynamic>> weather(String district) {
    final c = districtCoords[district] ?? districtCoords['Colombo']!;
    return get('/api/weather?lat=${c[0]}&lng=${c[1]}');
  }

  /// Address of a recorded voice clip on the server, e.g. /voice/si/name_blast.mp3
  String voiceUrl(String lang, String id) => '$baseUrl/voice/$lang/$id.mp3';

  /// Sends a leaf photo to the ResNet50 model on the server.
  /// Works on phones and in Chrome: the photo is sent as bytes.
  Future<Map<String, dynamic>> predict(XFile photo) {
    return _send(() async {
      final req = http.MultipartRequest('POST', Uri.parse('$baseUrl/api/predict'));
      if (token != null) req.headers['Authorization'] = 'Bearer $token';
      final bytes = await photo.readAsBytes();
      final name = photo.name.isEmpty ? 'leaf.jpg' : photo.name;
      req.files.add(http.MultipartFile.fromBytes('file', bytes, filename: name));
      return http.Response.fromStream(await req.send());
    });
  }
}

/// Centre of each district (latitude, longitude), used for the weather forecast.
const Map<String, List<double>> districtCoords = {
  'Ampara': [7.30, 81.67], 'Anuradhapura': [8.31, 80.40], 'Badulla': [6.99, 81.06], 'Batticaloa': [7.71, 81.70],
  'Colombo': [6.93, 79.86], 'Galle': [6.05, 80.22], 'Gampaha': [7.09, 79.99], 'Hambantota': [6.12, 81.12],
  'Jaffna': [9.66, 80.01], 'Kalutara': [6.58, 79.96], 'Kandy': [7.29, 80.63], 'Kegalle': [7.25, 80.35],
  'Kilinochchi': [9.39, 80.40], 'Kurunegala': [7.49, 80.36], 'Mannar': [8.98, 79.90], 'Matale': [7.47, 80.62],
  'Matara': [5.95, 80.54], 'Monaragala': [6.87, 81.35], 'Mullaitivu': [9.27, 80.81], 'Nuwara Eliya': [6.97, 80.78],
  'Polonnaruwa': [7.94, 81.00], 'Puttalam': [8.04, 79.83], 'Ratnapura': [6.68, 80.40], 'Trincomalee': [8.59, 81.21],
  'Vavuniya': [8.75, 80.50],
};
