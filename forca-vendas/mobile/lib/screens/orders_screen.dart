import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../app_state.dart';

// Fila de pedidos com status de sincronizacao — a tela honesta de
// "pendente de envio" que evita o representante achar que perdeu o pedido.
class OrdersScreen extends StatelessWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final queue = app.queue.reversed.toList();

    if (queue.isEmpty) {
      return const Center(child: Text('Nenhum pedido ainda.'));
    }

    return RefreshIndicator(
      onRefresh: () => app.sync(),
      child: ListView.separated(
        itemCount: queue.length,
        separatorBuilder: (_, __) => const Divider(height: 1),
        itemBuilder: (_, i) {
          final o = queue[i];
          final (color, label, icon) = switch (o.status) {
            'sent' => (Colors.green, 'Enviado', Icons.cloud_done),
            'error' => (Colors.red, 'Erro', Icons.error_outline),
            _ => (Colors.orange, 'Pendente', Icons.cloud_upload),
          };
          return ListTile(
            leading: Icon(icon, color: color),
            title: Text(o.customerName),
            subtitle: Text('${o.items.length} itens · R\$ ${o.previewTotal.toStringAsFixed(2)}'),
            trailing: Chip(
              label: Text(label, style: TextStyle(color: color, fontSize: 12)),
              side: BorderSide(color: color),
              backgroundColor: color.withValues(alpha: 0.08),
            ),
          );
        },
      ),
    );
  }
}
