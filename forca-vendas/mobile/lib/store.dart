// Persistencia local (offline).
//
// Para o scaffold usamos shared_preferences (JSON) por simplicidade e para
// rodar em qualquer plataforma sem configuracao. Em producao, troque por
// SQLite (drift/sqflite) — o catalogo pode ter milhares de itens e voce vai
// querer consultas relacionais no dispositivo. As chaves e a forma dos dados
// ja estao desenhadas pensando nessa migracao.
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'models.dart';

class LocalStore {
  static const _kToken = 'token';
  static const _kUser = 'user';
  static const _kProducts = 'products';
  static const _kCustomers = 'customers';
  static const _kRules = 'price_rules';
  static const _kQueue = 'order_queue';
  static const _kSince = 'sync_since';

  late SharedPreferences _p;
  Future<void> init() async => _p = await SharedPreferences.getInstance();

  // ---- sessao ----
  String? get token => _p.getString(_kToken);
  Future<void> setToken(String? t) async =>
      t == null ? _p.remove(_kToken) : _p.setString(_kToken, t);

  Map<String, dynamic>? get user {
    final s = _p.getString(_kUser);
    return s == null ? null : jsonDecode(s) as Map<String, dynamic>;
  }

  Future<void> setUser(Map<String, dynamic>? u) async =>
      u == null ? _p.remove(_kUser) : _p.setString(_kUser, jsonEncode(u));

  // ---- cursor de sincronizacao ----
  String? get since => _p.getString(_kSince);
  Future<void> setSince(String v) async => _p.setString(_kSince, v);

  // ---- cache de catalogo ----
  Future<void> saveCatalog({
    required List<Product> products,
    required List<Customer> customers,
    required List<PriceRule> rules,
  }) async {
    await _p.setString(_kProducts, jsonEncode(products.map((e) => e.toJson()).toList()));
    await _p.setString(_kCustomers, jsonEncode(customers.map((e) => e.toJson()).toList()));
    await _p.setString(_kRules, jsonEncode(rules.map((e) => e.toJson()).toList()));
  }

  List<Product> get products => _list(_kProducts, Product.fromJson);
  List<Customer> get customers => _list(_kCustomers, Customer.fromJson);
  List<PriceRule> get rules => _list(_kRules, PriceRule.fromJson);

  List<T> _list<T>(String key, T Function(Map<String, dynamic>) f) {
    final s = _p.getString(key);
    if (s == null) return [];
    return (jsonDecode(s) as List).map((e) => f(e as Map<String, dynamic>)).toList();
  }

  // ---- fila de pedidos (offline) ----
  List<PendingOrder> get queue => _list(_kQueue, PendingOrder.fromJson);

  Future<void> saveQueue(List<PendingOrder> q) async =>
      _p.setString(_kQueue, jsonEncode(q.map((e) => e.toJson()).toList()));

  Future<void> clearSession() async {
    await _p.remove(_kToken);
    await _p.remove(_kUser);
  }
}
