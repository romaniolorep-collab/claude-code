// Modelos de dominio do app.

class Product {
  final int id;
  final String sku;
  final String name;
  final String unit;
  final String? category;
  final double basePrice;
  final int stock;

  Product({
    required this.id,
    required this.sku,
    required this.name,
    required this.unit,
    required this.basePrice,
    required this.stock,
    this.category,
  });

  factory Product.fromJson(Map<String, dynamic> j) => Product(
        id: j['id'],
        sku: j['sku'],
        name: j['name'],
        unit: j['unit'] ?? 'UN',
        category: j['category'],
        basePrice: (j['base_price'] as num).toDouble(),
        stock: j['stock'] ?? 0,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'sku': sku,
        'name': name,
        'unit': unit,
        'category': category,
        'base_price': basePrice,
        'stock': stock,
      };
}

class Customer {
  final int id;
  final String name;
  final String? city;
  final int? priceTableId;
  final double creditLimit;

  Customer({
    required this.id,
    required this.name,
    required this.creditLimit,
    this.city,
    this.priceTableId,
  });

  factory Customer.fromJson(Map<String, dynamic> j) => Customer(
        id: j['id'],
        name: j['name'],
        city: j['city'],
        priceTableId: j['price_table_id'],
        creditLimit: (j['credit_limit'] as num?)?.toDouble() ?? 0,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'city': city,
        'price_table_id': priceTableId,
        'credit_limit': creditLimit,
      };
}

// Grade do produto (tamanho/cor) com estoque proprio.
class Variant {
  final int id;
  final int productId;
  final String label;
  final int stock;

  Variant({required this.id, required this.productId, required this.label, required this.stock});

  factory Variant.fromJson(Map<String, dynamic> j) => Variant(
        id: j['id'],
        productId: j['product_id'],
        label: j['label'],
        stock: j['stock'] ?? 0,
      );

  Map<String, dynamic> toJson() =>
      {'id': id, 'product_id': productId, 'label': label, 'stock': stock};
}

// Regra de preco baixada na sincronizacao. Usada para MOSTRAR uma previa
// de preco offline — mas o valor oficial e sempre o que o servidor devolve.
class PriceRule {
  final int priceTableId;
  final int productId;
  final int minQty;
  final double price;

  PriceRule({
    required this.priceTableId,
    required this.productId,
    required this.minQty,
    required this.price,
  });

  factory PriceRule.fromJson(Map<String, dynamic> j) => PriceRule(
        priceTableId: j['price_table_id'],
        productId: j['product_id'],
        minQty: j['min_qty'] ?? 1,
        price: (j['price'] as num).toDouble(),
      );

  Map<String, dynamic> toJson() => {
        'price_table_id': priceTableId,
        'product_id': productId,
        'min_qty': minQty,
        'price': price,
      };
}

// Item do carrinho em edicao. `variant` e o tamanho/cor (grade), quando houver.
class CartLine {
  final Product product;
  int qty;
  final String? variant;
  CartLine(this.product, this.qty, {this.variant});
}

// Pedido pendente na fila de sincronizacao (criado offline).
class PendingOrder {
  final String clientUuid; // idempotencia — gerado no dispositivo
  final int customerId;
  final String customerName;
  final double discountPct;
  final String? note;
  final List<Map<String, dynamic>> items; // [{product_id, qty}]
  final double previewTotal;
  String status; // pending | sent | error | duplicate

  PendingOrder({
    required this.clientUuid,
    required this.customerId,
    required this.customerName,
    required this.items,
    required this.previewTotal,
    this.discountPct = 0,
    this.note,
    this.status = 'pending',
  });

  Map<String, dynamic> toWire() => {
        'client_uuid': clientUuid,
        'customer_id': customerId,
        'discount_pct': discountPct,
        'note': note,
        'items': items,
      };

  Map<String, dynamic> toJson() => {
        ...toWire(),
        'customer_name': customerName,
        'preview_total': previewTotal,
        'status': status,
      };

  factory PendingOrder.fromJson(Map<String, dynamic> j) => PendingOrder(
        clientUuid: j['client_uuid'],
        customerId: j['customer_id'],
        customerName: j['customer_name'] ?? '',
        discountPct: (j['discount_pct'] as num?)?.toDouble() ?? 0,
        note: j['note'],
        items: (j['items'] as List).cast<Map<String, dynamic>>(),
        previewTotal: (j['preview_total'] as num?)?.toDouble() ?? 0,
        status: j['status'] ?? 'pending',
      );
}
