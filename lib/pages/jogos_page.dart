// lib/pages/jogos.dart
import 'package:flutter/material.dart';
import 'package:lbapoa/models/team.dart';
import 'package:lbapoa/services/team_service.dart';
import 'package:lbapoa/widgets/games_calendar.dart';
import '../models/match.dart';
import '../services/match_service.dart';
import '../widgets/app_bar.dart';
import '../widgets/games_list.dart';

class JogosPage extends StatefulWidget {
  const JogosPage({super.key});

  @override
  State<JogosPage> createState() => _JogosPageState();
}

class _JogosPageState extends State<JogosPage> {
  final _matchService = MatchService();
  final _teamService = TeamService();
  late Future<List<MatchModel>> _futureMatches;
  late Future<List<TeamModel>> _futureTeams;
  DateTime _selectedDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    _futureMatches = _matchService.fetchAll();
    _futureTeams = _teamService.fetchAll();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          GamesWeekCalendar(onDateSelected: (date) {
            setState(() => _selectedDate = date);
          }),
          Expanded(
            child: FutureBuilder<List<dynamic>>(
              future: Future.wait([_futureMatches, _futureTeams]),
              builder: (context, snap) {
                if (snap.connectionState != ConnectionState.done) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snap.hasError) {
                  return Center(child: Text('Erro: ${snap.error}'));
                }
                final matches = snap.data![0] as List<MatchModel>;
                final teams = snap.data![1] as List<TeamModel>;
                return GamesListWidget(
                  matches: matches,
                  teams: teams,
                  selectedDate: _selectedDate,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
