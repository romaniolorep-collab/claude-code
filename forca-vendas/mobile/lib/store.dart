// Sessao e cursor de sincronizacao (dados leves) continuam em
// shared_preferences. O catalogo e a fila de pedidos agora vivem no
// SQLite (ver db/database.dart).
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class LocalStore {
  static const _kToken = 'token';
  static const _kUser = 'user';
  static const _kSince = 'sync_since';

  late SharedPreferences _p;
  Future<void> init() async => _p = await SharedPreferences.getInstance();

  String? get token => _p.getString(_kToken);
  Future<void> setToken(String? t) async =>
      t == null ? _p.remove(_kToken) : _p.setString(_kToken, t);

  Map<String, dynamic>? get user {
    final s = _p.getString(_kUser);
    return s == null ? null : jsonDecode(s) as Map<String, dynamic>;
  }

  Future<void> setUser(Map<String, dynamic>? u) async =>
      u == null ? _p.remove(_kUser) : _p.setString(_kUser, jsonEncode(u));

  String? get since => _p.getString(_kSince);
  Future<void> setSince(String v) async => _p.setString(_kSince, v);

  Future<void> clearSession() async {
    await _p.remove(_kToken);
    await _p.remove(_kUser);
  }
}
