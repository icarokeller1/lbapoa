// lib/models/team.dart
import 'dart:convert';
import 'dart:typed_data';

/// Modelo de time, decodifica corretamente o logo vindo da API como data URL.
class TeamModel {
  final int id;
  final String nome;
  final String? apelido;
  final Uint8List? logoData;
  final String? logoMime;
  final String instagram;
  final bool indPodeUsarMidia;

  TeamModel({
    required this.id,
    required this.nome,
    this.apelido,
    this.logoData,
    this.logoMime,
    required this.instagram,
    required this.indPodeUsarMidia,
  });

  factory TeamModel.fromJson(Map<String, dynamic> json) {
    Uint8List? data;
    String? mime;
    final rawLogo = json['logo'] as String?;
    if (rawLogo != null && rawLogo.startsWith('data:')) {
      // Formato data URL: data:[<mime>];base64,<data>
      final parts = rawLogo.split(',');
      if (parts.length == 2) {
        final meta = parts[0]; // "data:image/jpeg;base64"
        final b64 = parts[1];
        data = base64Decode(b64);
        final metaParts = meta.split(';');
        if (metaParts.isNotEmpty) {
          mime = metaParts[0].replaceFirst('data:', '');
        }
      }
    }
    return TeamModel(
      id: json['id'] as int,
      nome: json['nome'] as String,
      apelido: json['apelido'] as String,
      logoData: data,
      logoMime: mime,
      instagram: json['instagram'] as String,
      indPodeUsarMidia: json['indPodeUsarMidia'] as bool,
    );
  }

  /// URL de logo caso queira usar Image.memory ou Image.network com data URI
  String? get logoUrl => logoData != null && logoMime != null
      ? 'data:$logoMime;base64,\${base64Encode(logoData!)}'
      : null;
}
