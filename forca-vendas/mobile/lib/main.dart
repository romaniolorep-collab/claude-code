import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'api.dart';
import 'store.dart';
import 'app_state.dart';
import 'db/database.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final store = LocalStore();
  await store.init();
  final db = AppDatabase();
  // Aponte para o seu backend. No emulador Android, o host e 10.0.2.2.
  final api = ApiClient(baseUrl: const String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://10.0.2.2:3000',
  ));
  final app = AppState(api, store, db);
  await app.boot();
  runApp(ChangeNotifierProvider.value(value: app, child: const ForcaVendasApp()));
}

class ForcaVendasApp extends StatelessWidget {
  const ForcaVendasApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Forca de Vendas',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFBC5F27)),
        useMaterial3: true,
      ),
      home: Consumer<AppState>(
        builder: (_, app, __) => app.isLoggedIn ? const HomeScreen() : const LoginScreen(),
      ),
    );
  }
}
