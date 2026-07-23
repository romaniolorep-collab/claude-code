import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../app_state.dart';
import 'catalog_screen.dart';
import 'orders_screen.dart';
import 'visits_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _tab = 0;

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    return Scaffold(
      appBar: AppBar(
        title: Text(switch (_tab) { 0 => 'Catalogo', 1 => 'Visitas', _ => 'Meus Pedidos' }),
        actions: [
          IconButton(
            tooltip: 'Sincronizar',
            onPressed: app.syncing ? null : () => app.sync(),
            icon: app.syncing
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                : const Icon(Icons.sync),
          ),
          PopupMenuButton<String>(
            onSelected: (v) { if (v == 'logout') app.logout(); },
            itemBuilder: (_) => [
              PopupMenuItem(value: 'me', enabled: false, child: Text(app.repName)),
              const PopupMenuItem(value: 'logout', child: Text('Sair')),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          if (app.lastMessage != null)
            Container(
              width: double.infinity,
              color: Theme.of(context).colorScheme.surfaceContainerHighest,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: Text(app.lastMessage!, style: Theme.of(context).textTheme.bodySmall),
            ),
          Expanded(child: switch (_tab) {
            0 => const CatalogScreen(),
            1 => const VisitsScreen(),
            _ => const OrdersScreen(),
          }),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: [
          const NavigationDestination(icon: Icon(Icons.grid_view), label: 'Catalogo'),
          const NavigationDestination(icon: Icon(Icons.event_note), label: 'Visitas'),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: app.pendingCount > 0,
              label: Text('${app.pendingCount}'),
              child: const Icon(Icons.receipt_long),
            ),
            label: 'Pedidos',
          ),
        ],
      ),
    );
  }
}
