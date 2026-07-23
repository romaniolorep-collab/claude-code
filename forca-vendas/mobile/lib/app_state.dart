// Orquestrador central do app (offline-first).
// Regras importantes:
//  - Toda operacao funciona a partir do cache local; a rede e um "bonus".
//  - Pedidos vao para uma fila local e sao empurrados quando ha conexao.
//  - O preco mostrado offline e uma PREVIA; o valor oficial vem do servidor.
import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import 'api.dart';
import 'store.dart';
import 'models.dart';

class AppState extends ChangeNotifier {
  final ApiClient api;
  final LocalStore store;
  final _uuid = const Uuid();

  AppState(this.api, this.store);

  bool get isLoggedIn => store.token != null;
  String get repName => store.user?['name'] ?? 'Representante';
  double get maxDiscount => (store.user?['max_discount'] as num?)?.toDouble() ?? 0;

  List<Product> get products => store.products;
  List<Customer> get customers => store.customers;
  List<PendingOrder> get queue => store.queue;
  int get pendingCount => store.queue.where((o) => o.status == 'pending' || o.status == 'error').length;

  bool syncing = false;
  String? lastMessage;

  Future<void> boot() async {
    if (store.token != null) api.setToken(store.token);
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

  // Baixa catalogo/clientes e empurra a fila de pedidos.
  Future<void> sync() async {
    syncing = true;
    lastMessage = null;
    notifyListeners();
    try {
      final data = await api.pull(since: store.since);
      await store.saveCatalog(
        products: (data['products'] as List).map((e) => Product.fromJson(e)).toList(),
        customers: (data['customers'] as List).map((e) => Customer.fromJson(e)).toList(),
        rules: (data['price_rules'] as List).map((e) => PriceRule.fromJson(e)).toList(),
      );
      await store.setSince(data['server_time']);
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
    final q = store.queue;
    final toSend = q.where((o) => o.status == 'pending' || o.status == 'error').toList();
    if (toSend.isEmpty) return;

    final results = await api.push(toSend.map((o) => o.toWire()).toList());
    for (final r in results) {
      final order = q.firstWhere((o) => o.clientUuid == r['client_uuid']);
      final status = r['status'];
      order.status = (status == 'created' || status == 'duplicate') ? 'sent' : 'error';
    }
    await store.saveQueue(q);
    notifyListeners();
  }

  // Previa de preco offline (nao substitui o calculo do servidor).
  double previewUnitPrice(Customer customer, Product p, int qty) {
    final rules = store.rules.where((r) =>
        r.productId == p.id && r.priceTableId == customer.priceTableId && r.minQty <= qty);
    if (rules.isEmpty) return p.basePrice;
    rules.toList().sort((a, b) => b.minQty.compareTo(a.minQty));
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
      items.add({'product_id': l.product.id, 'qty': l.qty});
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

    final q = store.queue..add(order);
    await store.saveQueue(q);
    notifyListeners();

    // Tenta enviar na hora; se falhar, fica na fila para o proximo sync.
    try {
      await flushQueue();
    } catch (_) {/* segue offline */}
    return order;
  }
}
