// lib/models/match.dart

class MatchModel {
  final int id;
  final String timeA;
  final String timeB;
  final int? pontuacaoA;
  final int? pontuacaoB;
  final DateTime dataHora;
  final String torneio;

  MatchModel({
    required this.id,
    required this.timeA,
    required this.timeB,
    required this.dataHora,
    this.pontuacaoA,
    this.pontuacaoB,
    required this.torneio,
  });

  factory MatchModel.fromJson(Map<String, dynamic> json) {
    return MatchModel(
      id: json['id'] as int,
      timeA: json['timeA'] as String,
      timeB: json['timeB'] as String,
      pontuacaoA: json['pontuacaoA'] as int?,
      pontuacaoB: json['pontuacaoB'] as int?,
      dataHora: DateTime.parse(json['dataHora'] as String),
      torneio: json['torneio'] as String,
    );
  }
}
