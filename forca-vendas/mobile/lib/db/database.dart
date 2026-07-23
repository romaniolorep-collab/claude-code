// Banco local em SQLite via drift — substitui o shared_preferences para o
// catalogo e a fila de pedidos. Catalogos reais tem milhares de itens e
// pedem consultas relacionais no dispositivo.
//
// As tabelas usam sufixo "Rows" para as classes geradas (ProductRow, etc.)
// nao colidirem com os modelos de dominio em models.dart.
import 'dart:convert';
import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import '../models.dart' as m;

part 'database.g.dart';

class ProductRows extends Table {
  IntColumn get id => integer()();
  TextColumn get sku => text()();
  TextColumn get name => text()();
  TextColumn get unit => text().withDefault(const Constant('UN'))();
  TextColumn get category => text().nullable()();
  RealColumn get basePrice => real()();
  IntColumn get stock => integer().withDefault(const Constant(0))();
  @override
  Set<Column> get primaryKey => {id};
}

class CustomerRows extends Table {
  IntColumn get id => integer()();
  TextColumn get name => text()();
  TextColumn get city => text().nullable()();
  IntColumn get priceTableId => integer().nullable()();
  RealColumn get creditLimit => real().withDefault(const Constant(0))();
  @override
  Set<Column> get primaryKey => {id};
}

class PriceRuleRows extends Table {
  IntColumn get priceTableId => integer()();
  IntColumn get productId => integer()();
  IntColumn get minQty => integer().withDefault(const Constant(1))();
  RealColumn get price => real()();
}

class OrderQueueRows extends Table {
  TextColumn get clientUuid => text()();
  IntColumn get customerId => integer()();
  TextColumn get customerName => text()();
  RealColumn get discountPct => real().withDefault(const Constant(0))();
  TextColumn get note => text().nullable()();
  TextColumn get itemsJson => text()();
  RealColumn get previewTotal => real()();
  TextColumn get status => text().withDefault(const Constant('pending'))();
  @override
  Set<Column> get primaryKey => {clientUuid};
}

@DriftDatabase(tables: [ProductRows, CustomerRows, PriceRuleRows, OrderQueueRows])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_open());
  AppDatabase.forTesting(super.executor);

  @override
  int get schemaVersion => 1;

  // ---- Catalogo ----
  // Produtos/clientes vem como delta (por updated_at): upsert por id.
  // Regras de preco vem completas a cada sync: substitui tudo.
  Future<void> saveCatalog({
    required List<m.Product> products,
    required List<m.Customer> customers,
    required List<m.PriceRule> rules,
  }) async {
    await batch((b) {
      b.insertAllOnConflictUpdate(
        productRows,
        products.map((x) => ProductRowsCompanion.insert(
              id: Value(x.id),
              sku: x.sku,
              name: x.name,
              unit: Value(x.unit),
              category: Value(x.category),
              basePrice: x.basePrice,
              stock: Value(x.stock),
            )),
      );
      b.insertAllOnConflictUpdate(
        customerRows,
        customers.map((x) => CustomerRowsCompanion.insert(
              id: Value(x.id),
              name: x.name,
              city: Value(x.city),
              priceTableId: Value(x.priceTableId),
              creditLimit: Value(x.creditLimit),
            )),
      );
    });
    await delete(priceRuleRows).go();
    await batch((b) {
      b.insertAll(
        priceRuleRows,
        rules.map((x) => PriceRuleRowsCompanion.insert(
              priceTableId: x.priceTableId,
              productId: x.productId,
              minQty: Value(x.minQty),
              price: x.price,
            )),
      );
    });
  }

  Future<List<m.Product>> getProducts() async {
    final rows = await (select(productRows)
          ..orderBy([(t) => OrderingTerm(expression: t.name)]))
        .get();
    return rows
        .map((r) => m.Product(
              id: r.id, sku: r.sku, name: r.name, unit: r.unit,
              category: r.category, basePrice: r.basePrice, stock: r.stock,
            ))
        .toList();
  }

  Future<List<m.Customer>> getCustomers() async {
    final rows = await (select(customerRows)
          ..orderBy([(t) => OrderingTerm(expression: t.name)]))
        .get();
    return rows
        .map((r) => m.Customer(
              id: r.id, name: r.name, city: r.city,
              priceTableId: r.priceTableId, creditLimit: r.creditLimit,
            ))
        .toList();
  }

  Future<List<m.PriceRule>> getRules() async {
    final rows = await select(priceRuleRows).get();
    return rows
        .map((r) => m.PriceRule(
              priceTableId: r.priceTableId, productId: r.productId,
              minQty: r.minQty, price: r.price,
            ))
        .toList();
  }

  // ---- Fila de pedidos offline ----
  Future<void> enqueue(m.PendingOrder o) => into(orderQueueRows).insertOnConflictUpdate(
        OrderQueueRowsCompanion.insert(
          clientUuid: o.clientUuid,
          customerId: o.customerId,
          customerName: o.customerName,
          discountPct: Value(o.discountPct),
          note: Value(o.note),
          itemsJson: jsonEncode(o.items),
          previewTotal: o.previewTotal,
          status: Value(o.status),
        ),
      );

  Future<List<m.PendingOrder>> getQueue() async {
    final rows = await select(orderQueueRows).get();
    return rows
        .map((r) => m.PendingOrder(
              clientUuid: r.clientUuid,
              customerId: r.customerId,
              customerName: r.customerName,
              discountPct: r.discountPct,
              note: r.note,
              items: (jsonDecode(r.itemsJson) as List).cast<Map<String, dynamic>>(),
              previewTotal: r.previewTotal,
              status: r.status,
            ))
        .toList();
  }

  Future<void> setOrderStatus(String clientUuid, String status) =>
      (update(orderQueueRows)..where((t) => t.clientUuid.equals(clientUuid)))
          .write(OrderQueueRowsCompanion(status: Value(status)));
}

LazyDatabase _open() {
  return LazyDatabase(() async {
    final dir = await getApplicationDocumentsDirectory();
    final file = File(p.join(dir.path, 'forca_vendas.sqlite'));
    return NativeDatabase.createInBackground(file);
  });
}
