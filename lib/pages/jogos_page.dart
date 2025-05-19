import 'package:flutter/material.dart';
import 'package:lbapoa/widgets/games_calendar.dart';

class JogosPage extends StatelessWidget {
  const JogosPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GamesWeekCalendar(
          onDateSelected: (date) {
            // aqui você filtra sua lista de jogos pelo `date`
            debugPrint('Data selecionada: $date');
          },
        ),
      ),
    );
  }
}
