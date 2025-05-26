// lib/models/match.dart

class MatchModel {
  final int id;
  final String teamA;
  final String teamB;
  final int teamAId;
  final int teamBId;
  final int? pontuacaoA;
  final int? pontuacaoB;
  final DateTime dataHora;
  final String torneio;

  MatchModel({
    required this.id,
    required this.teamA,
    required this.teamB,
    required this.teamAId,
    required this.teamBId,
    required this.dataHora,
    this.pontuacaoA,
    this.pontuacaoB,
    required this.torneio,
  });

  factory MatchModel.fromJson(Map<String, dynamic> json) {
    return MatchModel(
      id: json['id'] as int,
      teamAId: json['teamAId']  as int,
      teamBId: json['teamBId']  as int,
      teamA:   json['teamA']    as String,
      teamB:   json['teamB']    as String,
      pontuacaoA: json['pontuacaoA'] as int?,
      pontuacaoB: json['pontuacaoB'] as int?,
      dataHora: DateTime.parse(json['dataHora'] as String),
      torneio: json['torneio'] as String,
    );
  }
}
