// lib/services/team_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/team.dart';

class TeamService {
  final _baseUrl = 'https://lbapoa-api.onrender.com/teams';

  Future<List<TeamModel>> fetchAll() async {
    final res = await http.get(Uri.parse(_baseUrl));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar times');
    }
    final List<dynamic> list = jsonDecode(res.body);
    return list.map((e) => TeamModel.fromJson(e)).toList();
  }
}
