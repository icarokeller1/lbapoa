// lib/services/match_service.dart

import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/match.dart';

class MatchService {
  final _baseUrl = 'https://lbapoa-api.onrender.com/matches';

  Future<List<MatchModel>> fetchAll() async {
    final res = await http.get(Uri.parse(_baseUrl));
    if (res.statusCode != 200) {
      throw Exception('Erro ao buscar partidas');
    }
    final List list = jsonDecode(res.body);
    return list.map((e) => MatchModel.fromJson(e)).toList();
  }
}
