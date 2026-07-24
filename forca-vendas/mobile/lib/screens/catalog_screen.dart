import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../app_state.dart';
import '../models.dart';
import 'cart_screen.dart';

// Catalogo + montagem do pedido. Produtos com grade (tamanho/cor) abrem um
// seletor de tamanhos; produtos sem grade usam um contador simples.
// O carrinho e indexado por 'produtoId|tamanho' para suportar varias linhas
// do mesmo produto (a curva de tamanhos).
class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});
  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  Customer? _customer;
  final Map<String, CartLine> _cart = {};
  String _query = '';

  String _key(int productId, String? variant) => '$productId|${variant ?? ''}';
  int _qtyOfProduct(int productId) => _cart.entries
      .where((e) => e.key.startsWith('$productId|'))
      .fold(0, (s, e) => s + e.value.qty);

  void _setQty(Product p, String? variant, int qty) {
    final k = _key(p.id, variant);
    setState(() {
      if (qty <= 0) {
        _cart.remove(k);
      } else {
        _cart[k] = CartLine(p, qty, variant: variant);
      }
    });
  }

  Future<void> _openGrade(Product p, List<Variant> variants) async {
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheet) => SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(p.name, style: Theme.of(ctx).textTheme.titleMedium),
                Text('Escolha a grade (tamanhos)', style: Theme.of(ctx).textTheme.bodySmall),
                const SizedBox(height: 8),
                Flexible(
                  child: ListView(
                    shrinkWrap: true,
                    children: variants.map((v) {
                      final k = _key(p.id, v.label);
                      final q = _cart[k]?.qty ?? 0;
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Row(
                          children: [
                            SizedBox(width: 64, child: Text('Tam ${v.label}', style: const TextStyle(fontWeight: FontWeight.w600))),
                            Text('estoque ${v.stock}', style: Theme.of(ctx).textTheme.bodySmall),
                            const Spacer(),
                            IconButton(
                              icon: const Icon(Icons.remove_circle_outline),
                              onPressed: q > 0 ? () { _setQty(p, v.label, q - 1); setSheet(() {}); } : null,
                            ),
                            SizedBox(width: 28, child: Text('$q', textAlign: TextAlign.center)),
                            IconButton(
                              icon: const Icon(Icons.add_circle_outline),
                              onPressed: () { _setQty(p, v.label, q + 1); setSheet(() {}); },
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 8),
                FilledButton(
                  onPressed: () => Navigator.pop(ctx),
                  style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(46)),
                  child: Text('Concluir (${_qtyOfProduct(p.id)} un)'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
    setState(() {}); // atualiza o total no card
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final products = app.products
        .where((p) => p.name.toLowerCase().contains(_query.toLowerCase()) ||
            p.sku.toLowerCase().contains(_query.toLowerCase()))
        .toList();

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(12),
          child: DropdownButtonFormField<Customer>(
            initialValue: _customer,
            isExpanded: true,
            decoration: const InputDecoration(
              labelText: 'Cliente', border: OutlineInputBorder(), prefixIcon: Icon(Icons.store),
            ),
            items: app.customers.map((c) => DropdownMenuItem(value: c, child: Text(c.name))).toList(),
            onChanged: (c) => setState(() => _customer = c),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: TextField(
            decoration: const InputDecoration(
              hintText: 'Buscar produto ou SKU', prefixIcon: Icon(Icons.search),
              border: OutlineInputBorder(), isDense: true,
            ),
            onChanged: (v) => setState(() => _query = v),
          ),
        ),
        Expanded(
          child: app.products.isEmpty
              ? const Center(child: Text('Sincronize para baixar o catalogo.'))
              : ListView.separated(
                  itemCount: products.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (_, i) {
                    final p = products[i];
                    final variants = app.variantsOf(p.id);
                    return _ProductTile(
                      product: p,
                      customer: _customer,
                      variants: variants,
                      qty: variants.isEmpty
                          ? (_cart[_key(p.id, null)]?.qty ?? 0)
                          : _qtyOfProduct(p.id),
                      onStep: variants.isEmpty
                          ? (d) => _setQty(p, null, (_cart[_key(p.id, null)]?.qty ?? 0) + d)
                          : null,
                      onGrade: variants.isEmpty ? null : () => _openGrade(p, variants),
                    );
                  },
                ),
        ),
        if (_cart.isNotEmpty && _customer != null)
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: FilledButton.icon(
                onPressed: () async {
                  final sent = await Navigator.of(context).push<bool>(
                    MaterialPageRoute(
                      builder: (_) => CartScreen(customer: _customer!, lines: _cart.values.toList()),
                    ),
                  );
                  if (sent == true) setState(() => _cart.clear());
                },
                icon: const Icon(Icons.shopping_cart_checkout),
                label: Text('Revisar pedido (${_cart.length} itens)'),
                style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48)),
              ),
            ),
          ),
      ],
    );
  }
}

class _ProductTile extends StatelessWidget {
  final Product product;
  final Customer? customer;
  final List<Variant> variants;
  final int qty;
  final void Function(int delta)? onStep; // produtos sem grade
  final VoidCallback? onGrade;            // produtos com grade

  const _ProductTile({
    required this.product,
    required this.customer,
    required this.variants,
    required this.qty,
    this.onStep,
    this.onGrade,
  });

  @override
  Widget build(BuildContext context) {
    final app = context.read<AppState>();
    final unit = customer != null
        ? app.previewUnitPrice(customer!, product, qty == 0 ? 1 : qty)
        : product.basePrice;

    Widget trailing;
    if (variants.isNotEmpty) {
      trailing = TextButton.icon(
        onPressed: customer == null ? null : onGrade,
        icon: const Icon(Icons.grid_view, size: 18),
        label: Text(qty > 0 ? 'Grade · $qty' : 'Grade'),
      );
    } else {
      trailing = Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(icon: const Icon(Icons.remove_circle_outline), onPressed: qty > 0 ? () => onStep!(-1) : null),
          SizedBox(width: 24, child: Text('$qty', textAlign: TextAlign.center)),
          IconButton(icon: const Icon(Icons.add_circle_outline), onPressed: customer == null ? null : () => onStep!(1)),
        ],
      );
    }

    return ListTile(
      title: Text(product.name),
      subtitle: Text([
        product.sku,
        product.unit,
        'R\$ ${unit.toStringAsFixed(2)}',
        if (variants.isNotEmpty) '${variants.length} tamanhos',
      ].join(' · ')),
      trailing: trailing,
    );
  }
}
