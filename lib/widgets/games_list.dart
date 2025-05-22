// lib/widgets/games_list.dart
import 'package:flutter/material.dart';
import '../models/match.dart';
import '../models/team.dart';

/// Widget que exibe uma lista de partidas para a data selecionada,
/// mostrando também o logo de cada time com busca case-insensitive.
class GamesListWidget extends StatelessWidget {
  final List<MatchModel> matches;
  final List<TeamModel> teams;
  final DateTime selectedDate;

  const GamesListWidget({
    Key? key,
    required this.matches,
    required this.teams,
    required this.selectedDate,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final todayMatches = matches
        .where((m) => DateUtils.isSameDay(m.dataHora, selectedDate))
        .toList();

    if (todayMatches.isEmpty) {
      return const Center(
        child: Text('Nenhum jogo para esta data.'),
      );
    }

    final now = DateTime.now();

    /// Encontra equipe por nome (case-insensitive)
    TeamModel? findTeam(String name) {
      final lower = name.toLowerCase();
      try {
        return teams.firstWhere(
          (t) => t.nome.toLowerCase() == lower,
        );
      } catch (_) {
        return null;
      }
    }

    Widget logoWidget(TeamModel? team) {
      if (team?.logoData != null) {
        return Image.memory(
          team!.logoData!,
          width: 40,
          height: 40,
          fit: BoxFit.contain,
        );
      }
      return const SizedBox(width: 40, height: 40);
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: todayMatches.length,
      itemBuilder: (context, index) {
        final m = todayMatches[index];
        String status;
        if (m.pontuacaoA != null && m.pontuacaoB != null) {
          status = '${m.pontuacaoA} x ${m.pontuacaoB}';
        } else if (now.isBefore(m.dataHora)) {
          status = _formatTime(m.dataHora);
        } else if (now.isBefore(m.dataHora.add(const Duration(hours: 2)))) {
          status = 'Ao Vivo';
        } else {
          status = 'Aguardando resultados';
        }

        final teamA = findTeam(m.timeA);
        final teamB = findTeam(m.timeB);

        return Container(
          margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 16),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(8),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    logoWidget(teamA),
                    const SizedBox(height: 4),
                    Text(
                      m.timeA,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 14),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Text(
                  status,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: status == 'Ao Vivo' ? Colors.red : null,
                    fontSize: 16,
                  ),
                ),
              ),
              Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    logoWidget(teamB),
                    const SizedBox(height: 4),
                    Text(
                      m.timeB,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 14),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  String _formatTime(DateTime dt) {
    final h = dt.hour.toString().padLeft(2, '0');
    final min = dt.minute.toString().padLeft(2, '0');
    return '$h:$min';
  }
}
