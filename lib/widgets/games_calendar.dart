import 'package:flutter/material.dart';

/// Widget de calendário semanal, exibe apenas uma semana e permite 
/// navegar por semanas ao arrastar.
class GamesWeekCalendar extends StatefulWidget {
  /// Callback disparado ao selecionar uma data
  final ValueChanged<DateTime> onDateSelected;

  const GamesWeekCalendar({Key? key, required this.onDateSelected}) : super(key: key);

  @override
  _GamesWeekCalendarState createState() => _GamesWeekCalendarState();
}

class _GamesWeekCalendarState extends State<GamesWeekCalendar> {
  static const int _initialPage = 5000;
  late final DateTime _baseWeekStart;
  late final PageController _pageController;
  int _currentPage = _initialPage;
  DateTime? _selectedDate;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    final weekdayIndex = now.weekday % 7; // domingo=0
    _baseWeekStart = DateTime(now.year, now.month, now.day)
        .subtract(Duration(days: weekdayIndex));
    _pageController = PageController(initialPage: _initialPage);
    _selectedDate = now;
  }

  /// Calcula o domingo da semana para um dado índice de página
  DateTime _weekStartForPage(int page) {
    final offsetWeeks = page - _initialPage;
    return _baseWeekStart.add(Duration(days: offsetWeeks * 7));
  }

  @override
  Widget build(BuildContext context) {
    // para mostrar mês e ano sem intl
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    final currentWeekStart = _weekStartForPage(_currentPage);
    final monthLabel =
        '${monthNames[currentWeekStart.month - 1]} ${currentWeekStart.year}';

    // iniciais dos dias da semana
    const weekdayInitials = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Mês e ano
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Text(
            monthLabel,
            style: Theme.of(context).textTheme.titleMedium,
          ),
        ),
        // iniciais dos dias
        Row(
          children: weekdayInitials.map((initial) {
            return Expanded(
              child: Center(
                child: Text(
                  initial,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 4),
        // PageView com a semana
        SizedBox(
          height: 60,
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (page) {
              setState(() {
                _currentPage = page;
              });
            },
            itemBuilder: (_, page) {
              final weekStart = _weekStartForPage(page);
              final days = List<DateTime>.generate(
                7,
                (i) => weekStart.add(Duration(days: i)),
              );

              return Row(
                children: days.map((date) {
                  final isSelected = _selectedDate != null &&
                      DateUtils.isSameDay(_selectedDate, date);

                  return Expanded(
                    child: GestureDetector(
                      onTap: () {
                        setState(() => _selectedDate = date);
                        widget.onDateSelected(date);
                      },
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        decoration: isSelected
                            ? BoxDecoration(
                                color: Theme.of(context)
                                    .colorScheme
                                    .primary
                                    .withOpacity(0.2),
                                borderRadius: BorderRadius.circular(8),
                              )
                            : null,
                        alignment: Alignment.center,
                        child: Text(
                          '${date.day}',
                          style: TextStyle(
                            fontWeight: isSelected
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              );
            },
          ),
        ),
      ],
    );
  }
}
