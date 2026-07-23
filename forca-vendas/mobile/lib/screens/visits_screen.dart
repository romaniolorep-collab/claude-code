import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../app_state.dart';

// Agenda de visitas do CRM de campo. Busca online (o gestor planeja as
// visitas); o representante marca como realizada durante a rota.
class VisitsScreen extends StatefulWidget {
  const VisitsScreen({super.key});
  @override
  State<VisitsScreen> createState() => _VisitsScreenState();
}

class _VisitsScreenState extends State<VisitsScreen> {
  late Future<List<Map<String, dynamic>>> _future;

  @override
  void initState() {
    super.initState();
    _load();
  }

  void _load() {
    _future = context.read<AppState>().api.visits();
  }

  Future<void> _mark(int id, String status) async {
    final api = context.read<AppState>().api;
    try {
      await api.updateVisit(id, status);
      setState(_load);
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Sem conexão — tente novamente.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Map<String, dynamic>>>(
      future: _future,
      builder: (context, snap) {
        if (snap.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snap.hasError) {
          return const Center(child: Text('Não foi possível carregar a agenda (offline).'));
        }
        final visits = snap.data ?? [];
        if (visits.isEmpty) {
          return const Center(child: Text('Nenhuma visita agendada.'));
        }
        return RefreshIndicator(
          onRefresh: () async => setState(_load),
          child: ListView.separated(
            itemCount: visits.length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (_, i) {
              final v = visits[i];
              final status = v['status'] as String;
              final (color, label) = switch (status) {
                'done' => (Colors.green, 'realizada'),
                'canceled' => (Colors.grey, 'cancelada'),
                _ => (Colors.orange, 'planejada'),
              };
              final date = DateTime.tryParse(v['scheduled_at'] ?? '');
              final dateStr = date != null
                  ? '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}'
                  : '';
              return ListTile(
                leading: CircleAvatar(
                  backgroundColor: color.withValues(alpha: 0.15),
                  child: Text(dateStr, style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.bold)),
                ),
                title: Text(v['customer_name'] ?? ''),
                subtitle: Text([
                  if (v['city'] != null) v['city'],
                  if (v['note'] != null) v['note'],
                ].join(' · ')),
                trailing: status == 'planned'
                    ? TextButton(
                        onPressed: () => _mark(v['id'], 'done'),
                        child: const Text('Concluir'),
                      )
                    : Chip(
                        label: Text(label, style: TextStyle(color: color, fontSize: 12)),
                        side: BorderSide(color: color),
                        backgroundColor: color.withValues(alpha: 0.08),
                      ),
              );
            },
          ),
        );
      },
    );
  }
}
