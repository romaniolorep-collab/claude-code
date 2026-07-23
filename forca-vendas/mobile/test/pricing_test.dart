import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:drift/native.dart';
import 'package:forca_vendas/api.dart';
import 'package:forca_vendas/store.dart';
import 'package:forca_vendas/db/database.dart';
import 'package:forca_vendas/app_state.dart';
import 'package:forca_vendas/models.dart';

void main() {
  late AppState app;
  late AppDatabase db;

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    final store = LocalStore();
    await store.init();

    db = AppDatabase.forTesting(NativeDatabase.memory());
    await db.saveCatalog(
      products: [
        Product(id: 1, sku: 'CAM-001', name: 'Camiseta Dry Fit',
            unit: 'UN', basePrice: 39.90, stock: 500),
      ],
      customers: [
        Customer(id: 1, name: 'Loja Central', creditLimit: 15000, priceTableId: 1),
      ],
      // Mesmas regras do seed do backend: base + quebra -10% a partir de 12 un.
      rules: [
        PriceRule(priceTableId: 1, productId: 1, minQty: 1, price: 39.90),
        PriceRule(priceTableId: 1, productId: 1, minQty: 12, price: 35.91),
      ],
    );

    app = AppState(ApiClient(baseUrl: 'http://127.0.0.1:1'), store, db); // porta morta = offline
    await app.boot(); // carrega o catalogo do SQLite para memoria
  });

  tearDown(() async => db.close());

  test('previa de preco usa o preco base abaixo da quebra', () {
    final c = app.customers.first;
    final p = app.products.first;
    expect(app.previewUnitPrice(c, p, 1), 39.90);
    expect(app.previewUnitPrice(c, p, 11), 39.90);
  });

  test('previa de preco aplica a quebra por quantidade (>= 12)', () {
    final c = app.customers.first;
    final p = app.products.first;
    expect(app.previewUnitPrice(c, p, 12), 35.91);
    expect(app.previewUnitPrice(c, p, 50), 35.91);
  });

  test('pedido criado offline e persistido no SQLite como pendente', () async {
    final c = app.customers.first;
    final p = app.products.first;
    // Sem servidor, o envio falha e o pedido PERMANECE na fila (offline-first).
    await app.placeOrder(customer: c, lines: [CartLine(p, 12)], discountPct: 5);

    expect(app.queue.length, 1);
    expect(app.pendingCount, 1);
    // Previa: 12 * 35.91 = 430.92, menos 5% = 409.37.
    expect(app.queue.first.previewTotal, closeTo(409.37, 0.01));
    expect(app.queue.first.status, 'pending');

    // Confirma que sobreviveu no banco: recarrega da tabela.
    final persisted = await db.getQueue();
    expect(persisted.length, 1);
    expect(persisted.first.clientUuid, app.queue.first.clientUuid);
  });
}
