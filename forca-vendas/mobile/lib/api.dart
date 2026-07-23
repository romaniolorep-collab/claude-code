// Cliente HTTP da API. Fino de proposito: a orquestracao (offline, fila)
// fica no AppState, nao aqui.
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  ApiException(this.message, [this.statusCode]);
  @override
  String toString() => message;
}

class ApiClient {
  // No emulador Android, localhost do host e 10.0.2.2.
  // Troque para a URL do seu backend em producao.
  final String baseUrl;
  String? _token;

  ApiClient({this.baseUrl = 'http://10.0.2.2:3000'});

  void setToken(String? token) => _token = token;

  Map<String, String> get _headers => {
        'content-type': 'application/json',
        if (_token != null) 'authorization': 'Bearer $_token',
      };

  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: _headers,
      body: jsonEncode({'email': email, 'password': password}),
    );
    if (res.statusCode != 200) {
      throw ApiException('Falha no login', res.statusCode);
    }
    return jsonDecode(res.body) as Map<String, dynamic>;
  }

  // Baixa tudo que mudou desde [since] (ISO 8601) para operar offline.
  Future<Map<String, dynamic>> pull({String? since}) async {
    final uri = Uri.parse('$baseUrl/sync/pull')
        .replace(queryParameters: since != null ? {'since': since} : null);
    final res = await http.get(uri, headers: _headers);
    if (res.statusCode != 200) {
      throw ApiException('Falha ao sincronizar', res.statusCode);
    }
    return jsonDecode(res.body) as Map<String, dynamic>;
  }

  // Envia a fila de pedidos. Idempotente por client_uuid no servidor.
  Future<List<Map<String, dynamic>>> push(List<Map<String, dynamic>> orders) async {
    final res = await http.post(
      Uri.parse('$baseUrl/sync/push'),
      headers: _headers,
      body: jsonEncode({'orders': orders}),
    );
    if (res.statusCode != 200) {
      throw ApiException('Falha ao enviar pedidos', res.statusCode);
    }
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    return (body['results'] as List).cast<Map<String, dynamic>>();
  }
}
