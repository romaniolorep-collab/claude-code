// Orquestrador central do app (offline-first).
// Regras importantes:
//  - Toda operacao funciona a partir do banco local (SQLite/drift).
//  - Pedidos vao para uma fila local e sao empurrados quando ha conexao.
//  - O preco mostrado offline e uma PREVIA; o valor oficial vem do servidor.
import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import 'api.dart';
import 'store.dart';
import 'db/database.dart';
import 'models.dart';

class AppState extends ChangeNotifier {
  final ApiClient api;
  final LocalStore store;
  final AppDatabase db;
  final _uuid = const Uuid();

  AppState(this.api, this.store, this.db);

  // Caches em memoria, carregados do SQLite — mantem a UI sincrona.
  List<Product> _products = [];
  List<Customer> _customers = [];
  List<PriceRule> _rules = [];
  List<Variant> _variants = [];
  List<PendingOrder> _queue = [];

  List<Product> get products => _products;
  List<Customer> get customers => _customers;
  List<PendingOrder> get queue => _queue;

  // Grade (tamanhos) de um produto, ordenada.
  List<Variant> variantsOf(int productId) =>
      _variants.where((v) => v.productId == productId).toList();
  int get pendingCount =>
      _queue.where((o) => o.status == 'pending' || o.status == 'error').length;

  bool get isLoggedIn => store.token != null;
  String get repName => store.user?['name'] ?? 'Representante';
  double get maxDiscount => (store.user?['max_discount'] as num?)?.toDouble() ?? 0;

  bool syncing = false;
  String? lastMessage;

  Future<void> boot() async {
    if (store.token != null) api.setToken(store.token);
    await _reloadFromDb();
  }

  Future<void> _reloadFromDb() async {
    _products = await db.getProducts();
    _customers = await db.getCustomers();
    _rules = await db.getRules();
    _variants = await db.getVariants();
    _queue = await db.getQueue();
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    final data = await api.login(email, password);
    await store.setToken(data['token']);
    await store.setUser(data['user']);
    api.setToken(data['token']);
    notifyListeners();
    await sync();
    return true;
  }

  Future<void> logout() async {
    await store.clearSession();
    api.setToken(null);
    notifyListeners();
  }

  // Baixa catalogo/clientes para o SQLite e empurra a fila de pedidos.
  Future<void> sync() async {
    syncing = true;
    lastMessage = null;
    notifyListeners();
    try {
      final data = await api.pull(since: store.since);
      await db.saveCatalog(
        products: (data['products'] as List).map((e) => Product.fromJson(e)).toList(),
        customers: (data['customers'] as List).map((e) => Customer.fromJson(e)).toList(),
        rules: (data['price_rules'] as List).map((e) => PriceRule.fromJson(e)).toList(),
        variants: ((data['variants'] as List?) ?? []).map((e) => Variant.fromJson(e)).toList(),
      );
      await store.setSince(data['server_time']);
      await _reloadFromDb();
      await flushQueue();
      lastMessage = 'Sincronizado com sucesso.';
    } catch (e) {
      lastMessage = 'Offline — usando dados locais.';
    } finally {
      syncing = false;
      notifyListeners();
    }
  }

  // Envia os pedidos pendentes e concilia o resultado por client_uuid.
  Future<void> flushQueue() async {
    final toSend =
        _queue.where((o) => o.status == 'pending' || o.status == 'error').toList();
    if (toSend.isEmpty) return;

    final results = await api.push(toSend.map((o) => o.toWire()).toList());
    for (final r in results) {
      final status = r['status'];
      final newStatus = (status == 'created' || status == 'duplicate') ? 'sent' : 'error';
      await db.setOrderStatus(r['client_uuid'], newStatus);
    }
    _queue = await db.getQueue();
    notifyListeners();
  }

  // Previa de preco offline (nao substitui o calculo do servidor).
  double previewUnitPrice(Customer customer, Product p, int qty) {
    final rules = _rules.where((r) =>
        r.productId == p.id && r.priceTableId == customer.priceTableId && r.minQty <= qty);
    if (rules.isEmpty) return p.basePrice;
    return rules.reduce((a, b) => a.minQty >= b.minQty ? a : b).price;
  }

  // Cria um pedido offline e o coloca na fila. Retorna o pedido pendente.
  Future<PendingOrder> placeOrder({
    required Customer customer,
    required List<CartLine> lines,
    double discountPct = 0,
    String? note,
  }) async {
    double subtotal = 0;
    final items = <Map<String, dynamic>>[];
    for (final l in lines) {
      final unit = previewUnitPrice(customer, l.product, l.qty);
      subtotal += unit * l.qty;
      items.add({'product_id': l.product.id, 'qty': l.qty, if (l.variant != null) 'variant': l.variant});
    }
    final total = subtotal * (1 - discountPct / 100);

    final order = PendingOrder(
      clientUuid: _uuid.v4(),
      customerId: customer.id,
      customerName: customer.name,
      items: items,
      previewTotal: double.parse(total.toStringAsFixed(2)),
      discountPct: discountPct,
      note: note,
    );

    await db.enqueue(order);
    _queue = await db.getQueue();
    notifyListeners();

    // Tenta enviar na hora; se falhar, fica na fila para o proximo sync.
    try {
      await flushQueue();
    } catch (_) {/* segue offline */}
    return order;
  }
}
