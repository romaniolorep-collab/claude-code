import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../app_state.dart';
import '../models.dart';
import 'cart_screen.dart';

// Tela de catalogo + montagem do pedido. Fluxo:
//  1. escolher cliente  2. adicionar itens  3. revisar/enviar (CartScreen)
class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});
  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  Customer? _customer;
  final Map<int, CartLine> _cart = {};
  String _query = '';

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
              labelText: 'Cliente',
              border: OutlineInputBorder(),
              prefixIcon: Icon(Icons.store),
            ),
            items: app.customers
                .map((c) => DropdownMenuItem(value: c, child: Text(c.name)))
                .toList(),
            onChanged: (c) => setState(() => _customer = c),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: TextField(
            decoration: const InputDecoration(
              hintText: 'Buscar produto ou SKU',
              prefixIcon: Icon(Icons.search),
              border: OutlineInputBorder(),
              isDense: true,
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
                  itemBuilder: (_, i) => _ProductTile(
                    product: products[i],
                    customer: _customer,
                    line: _cart[products[i].id],
                    onChanged: (qty) => setState(() {
                      if (qty <= 0) {
                        _cart.remove(products[i].id);
                      } else {
                        _cart[products[i].id] = CartLine(products[i], qty);
                      }
                    }),
                  ),
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
                      builder: (_) => CartScreen(
                        customer: _customer!,
                        lines: _cart.values.toList(),
                      ),
                    ),
                  );
                  if (sent == true) setState(() => _cart.clear());
                },
                icon: const Icon(Icons.shopping_cart_checkout),
                label: Text('Revisar pedido (${_cart.length} itens)'),
                style: FilledButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                ),
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
  final CartLine? line;
  final ValueChanged<int> onChanged;

  const _ProductTile({
    required this.product,
    required this.customer,
    required this.line,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final app = context.read<AppState>();
    final qty = line?.qty ?? 0;
    final unit = customer != null
        ? app.previewUnitPrice(customer!, product, qty == 0 ? 1 : qty)
        : product.basePrice;

    return ListTile(
      title: Text(product.name),
      subtitle: Text('${product.sku} · ${product.unit} · R\$ ${unit.toStringAsFixed(2)}'),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            icon: const Icon(Icons.remove_circle_outline),
            onPressed: qty > 0 ? () => onChanged(qty - 1) : null,
          ),
          SizedBox(width: 24, child: Text('$qty', textAlign: TextAlign.center)),
          IconButton(
            icon: const Icon(Icons.add_circle_outline),
            onPressed: customer == null ? null : () => onChanged(qty + 1),
          ),
        ],
      ),
    );
  }
}
