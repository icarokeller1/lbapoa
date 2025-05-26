// lib/widgets/unified_feed.dart

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:webview_flutter/webview_flutter.dart';

import '../models/news_item.dart';
import '../models/match.dart';
import '../models/team.dart';
import '../services/match_service.dart';
import '../services/team_service.dart';

enum _FeedType { news, match }

class _FeedEntry {
  final DateTime date;
  final _FeedType type;
  final NewsItem? news;
  final MatchModel? match;

  _FeedEntry.news(this.news)
      : date = news!.data,
        type = _FeedType.news,
        match = null;

  _FeedEntry.match(this.match)
      : date = match!.dataHora,
        type = _FeedType.match,
        news = null;
}

/// Widget que exibe feed unificado de notícias e resultados de partidas
/// ordenado pelos mais recentes primeiro.
class UnifiedFeedWidget extends StatelessWidget {
  const UnifiedFeedWidget({super.key});

  static const _newsUrl = 'https://lbapoa-api.onrender.com/news';

  Future<List<_FeedEntry>> _fetchEntries() async {
    final newsRes = await http.get(Uri.parse(_newsUrl));
    if (newsRes.statusCode != 200) throw Exception('Erro ao carregar notícias');
    final rawNews = jsonDecode(newsRes.body) as List<dynamic>;
    final newsItems = rawNews
        .map((e) => NewsItem.fromJson(e as Map<String, dynamic>))
        .where((n) => n.linkinstagram.isNotEmpty)
        .toList();

    final matches = await MatchService().fetchAll();
    final finished = matches.where((m) => m.pontuacaoA != null && m.pontuacaoB != null).toList();

    final entries = <_FeedEntry>[];
    for (var n in newsItems) {
      entries.add(_FeedEntry.news(n));
    }
    for (var m in finished) {
      entries.add(_FeedEntry.match(m));
    }

    entries.sort((a, b) => b.date.compareTo(a.date));
    return entries;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<_FeedEntry>>(
      future: _fetchEntries(),
      builder: (context, snap) {
        if (snap.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snap.hasError) {
          return Center(child: Text('Erro: ${snap.error}'));
        }
        final entries = snap.data!;
        if (entries.isEmpty) {
          return const Center(child: Text('Nenhum item para exibir.'));
        }

        return FutureBuilder<List<TeamModel>>(
          future: TeamService().fetchAll(),
          builder: (context, teamSnap) {
            if (teamSnap.connectionState != ConnectionState.done) {
              return const Center(child: CircularProgressIndicator());
            }
            final teams = teamSnap.data!;
            // Mapear times por ID para lookup direto
            final Map<int, TeamModel> teamMapById = {
              for (var t in teams) t.id: t,
            };

            return ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: entries.length,
              itemBuilder: (context, index) {
                final entry = entries[index];

                if (entry.type == _FeedType.news) {
                  final item = entry.news!;
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(item.titulo, style: Theme.of(context).textTheme.titleMedium),
                        const SizedBox(height: 4),
                        Text(item.descricao, style: Theme.of(context).textTheme.bodyMedium),
                        const SizedBox(height: 8),
                        FractionallySizedBox(
                          widthFactor: 0.9,
                          child: AspectRatio(
                            aspectRatio: 3 / 4,
                            child: ClipRect(
                              child: Transform.translate(
                                offset: const Offset(0, -60),
                                child: WebViewWidget(
                                  controller: WebViewController()
                                    ..setJavaScriptMode(JavaScriptMode.unrestricted)
                                    ..loadHtmlString('''
<!doctype html>
<html>
  <body style="margin:0">
    <blockquote class="instagram-media"
      data-instgrm-permalink="${item.linkinstagram}"
      data-instgrm-version="14"
      style="width:100%"></blockquote>
    <script async src="https://www.instagram.com/embed.js"></script>
  </body>
</html>
'''),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                } else {
                  final m = entry.match!;
                  final teamA = teamMapById[m.teamAId];
                  final teamB = teamMapById[m.teamBId];
                  final isAwin = m.pontuacaoA! > m.pontuacaoB!;
                  final winnerName = isAwin ? m.teamA : m.teamB;
                  final winnerLogo = isAwin ? teamA : teamB;

                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                    child: AspectRatio(
                      aspectRatio: 1,
                      child: Card(
                        clipBehavior: Clip.hardEdge,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: Stack(
                          children: [
                            if (winnerLogo?.logoData != null)
                              Positioned.fill(
                                child: Opacity(
                                  opacity: 0.1,
                                  child: Image.memory(
                                    winnerLogo!.logoData!,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                            Positioned.fill(
                              child: DecoratedBox(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topCenter,
                                    end: Alignment.bottomCenter,
                                    colors: [Colors.transparent, Theme.of(context).cardColor],
                                  ),
                                ),
                              )),
                            Padding(
                              padding: const EdgeInsets.all(12),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  Text(
                                    'VITÓRIA DO ${winnerName.toUpperCase()}',
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleMedium
                                        ?.copyWith(fontWeight: FontWeight.bold),
                                  ),
                                  const Spacer(),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      if (teamA?.logoData != null)
                                        Image.memory(teamA!.logoData!, width: 40, height: 40),
                                      const SizedBox(width: 8),
                                      Text(
                                        '${m.pontuacaoA} x ${m.pontuacaoB}',
                                        style: const TextStyle(
                                          fontSize: 24,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      if (teamB?.logoData != null)
                                        Image.memory(teamB!.logoData!, width: 40, height: 40),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }
              },
            );
          },
        );
      },
    );
  }
}
