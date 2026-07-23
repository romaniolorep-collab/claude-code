import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../app_state.dart';
import '../models.dart';

// Revisao do pedido: mostra previa de preco, aplica desconto (respeitando a
// alcada) e confirma. O pedido vai para a fila local e o app tenta enviar.
class CartScreen extends StatefulWidget {
  final Customer customer;
  final List<CartLine> lines;
  const CartScreen({super.key, required this.customer, required this.lines});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  double _discount = 0;
  final _note = TextEditingController();
  bool _saving = false;

  @override
  Widget build(BuildContext context) {
    final app = context.read<AppState>();
    double subtotal = 0;
    for (final l in widget.lines) {
      subtotal += app.previewUnitPrice(widget.customer, l.product, l.qty) * l.qty;
    }
    final total = subtotal * (1 - _discount / 100);

    return Scaffold(
      appBar: AppBar(title: const Text('Revisar pedido')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(widget.customer.name, style: Theme.of(context).textTheme.titleMedium),
          if (widget.customer.city != null)
            Text(widget.customer.city!, style: Theme.of(context).textTheme.bodySmall),
          const Divider(height: 24),
          ...widget.lines.map((l) {
            final unit = app.previewUnitPrice(widget.customer, l.product, l.qty);
            return ListTile(
              dense: true,
              contentPadding: EdgeInsets.zero,
              title: Text(l.product.name),
              subtitle: Text('${l.qty} × R\$ ${unit.toStringAsFixed(2)}'),
              trailing: Text('R\$ ${(unit * l.qty).toStringAsFixed(2)}'),
            );
          }),
          const Divider(height: 24),
          Row(
            children: [
              const Text('Desconto (%)'),
              Expanded(
                child: Slider(
                  value: _discount,
                  max: app.maxDiscount,
                  divisions: app.maxDiscount > 0 ? app.maxDiscount.round() : null,
                  label: '${_discount.round()}%',
                  onChanged: (v) => setState(() => _discount = v),
                ),
              ),
              Text('${_discount.round()}%'),
            ],
          ),
          Text('Alcada maxima: ${app.maxDiscount.round()}%',
              style: Theme.of(context).textTheme.bodySmall),
          const SizedBox(height: 12),
          TextField(
            controller: _note,
            decoration: const InputDecoration(
              labelText: 'Observacao (opcional)',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: ListTile(
              title: const Text('Total (previa)'),
              subtitle: const Text('O valor oficial e confirmado pelo servidor'),
              trailing: Text('R\$ ${total.toStringAsFixed(2)}',
                  style: Theme.of(context).textTheme.titleLarge),
            ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: FilledButton(
            onPressed: _saving ? null : () async {
              setState(() => _saving = true);
              await app.placeOrder(
                customer: widget.customer,
                lines: widget.lines,
                discountPct: _discount,
                note: _note.text.isEmpty ? null : _note.text,
              );
              if (!context.mounted) return;
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Pedido salvo. Sera enviado quando houver conexao.')),
              );
              Navigator.of(context).pop(true);
            },
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(50)),
            child: _saving
                ? const SizedBox(height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2))
                : const Text('Confirmar pedido'),
          ),
        ),
      ),
    );
  }
}
