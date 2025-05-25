import 'package:flutter/material.dart';

/// Modelo de ícone do Hall of Fame
class HallOfFamer {
  final String name;
  final String role; // 'Campeão Ouro', 'Campeão Prata', 'Campeão Bronze'
  final String imageUrl;
  final int year;

  const HallOfFamer({
    required this.name,
    required this.role,
    required this.imageUrl,
    required this.year,
  });
}

// Exemplos estáticos; preencha com dados reais conforme necessário
const List<HallOfFamer> _hallOfFamers = [
  // 2024
  HallOfFamer(
    name: 'Equipe Ouro 2024',
    role: 'Campeão Ouro',
    imageUrl: 'https://placehold.co/600x400',
    year: 2024,
  ),
  HallOfFamer(
    name: 'Equipe Prata 2024',
    role: 'Campeão Prata',
    imageUrl: 'https://placehold.co/600x400',
    year: 2024,
  ),
  HallOfFamer(
    name: 'Equipe Bronze 2024',
    role: 'Campeão Bronze',
    imageUrl: 'https://placehold.co/600x400',
    year: 2024,
  ),

  // 2023
  HallOfFamer(
    name: 'Equipe Ouro 2023',
    role: 'Campeão Ouro',
    imageUrl: 'https://placehold.co/600x400',
    year: 2023,
  ),
  HallOfFamer(
    name: 'Equipe Prata 2023',
    role: 'Campeão Prata',
    imageUrl: 'https://placehold.co/600x400',
    year: 2023,
  ),
  HallOfFamer(
    name: 'Equipe Bronze 2023',
    role: 'Campeão Bronze',
    imageUrl: 'https://placehold.co/600x400',
    year: 2023,
  ),

  // 2022
  HallOfFamer(
    name: 'Equipe Ouro 2022',
    role: 'Campeão Ouro',
    imageUrl: 'https://placehold.co/600x400',
    year: 2022,
  ),
  HallOfFamer(
    name: 'Equipe Prata 2022',
    role: 'Campeão Prata',
    imageUrl: 'https://placehold.co/600x400',
    year: 2022,
  ),
  HallOfFamer(
    name: 'Equipe Bronze 2022',
    role: 'Campeão Bronze',
    imageUrl: 'https://placehold.co/600x400',
    year: 2022,
  ),

  // 2019
  HallOfFamer(
    name: 'Equipe Ouro 2019',
    role: 'Campeão Ouro',
    imageUrl: 'https://placehold.co/600x400',
    year: 2019,
  )
];

/// Página "Hall of Fame" com destaque especial para a série Ouro
class HallOfFamePage extends StatelessWidget {
  const HallOfFamePage({super.key});

  @override
  Widget build(BuildContext context) {
    // Estrutura fixa de anos
    const years = [2024, 2023, 2022, 2019];

    return Scaffold(
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Hall of Fame',
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 24),

          for (var year in years) ...[
            // Seção de ano
            Text(
              year.toString(),
              style: Theme.of(context)
                  .textTheme
                  .titleLarge
                  ?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Descrição das conquistas de $year. (Preencha aqui.)',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),

            // Filtra campeões
            Builder(builder: (context) {
              final winners = _hallOfFamers.where((h) => h.year == year).toList();
              final gold = winners.firstWhere(
                  (h) => h.role.toLowerCase().contains('ouro'),
                  orElse: () => winners.first);
              final others = winners
                  .where((h) => !h.role.toLowerCase().contains('ouro'))
                  .toList();

              return Column(
                children: [
                  // Card grande para Ouro
                  _LargeFameCard(hall: gold),
                  const SizedBox(height: 12),
                  Row(
                    children: others.map((h) {
                      return Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          child: _SmallFameCard(hall: h),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              );
            }),

            const SizedBox(height: 32),
          ],
        ],
      ),
    );
  }
}

/// Card grande para campeão Ouro
class _LargeFameCard extends StatelessWidget {
  final HallOfFamer hall;
  const _LargeFameCard({required this.hall});

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 6,
      child: Column(
        children: [
          // Imagem maior
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: Image.network(
              hall.imageUrl,
              height: 200,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Text(
                  hall.role,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 8),
                Text(
                  hall.name,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Card menor para Prata e Bronze
class _SmallFameCard extends StatelessWidget {
  final HallOfFamer hall;
  const _SmallFameCard({required this.hall});

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 4,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircleAvatar(
            radius: 40,
            backgroundImage: NetworkImage(hall.imageUrl),
            backgroundColor: Colors.grey.shade200,
          ),
          const SizedBox(height: 12),
          Text(
            hall.role,
            style: Theme.of(context).textTheme.titleSmall,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            hall.name,
            style: Theme.of(context).textTheme.bodyMedium,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
