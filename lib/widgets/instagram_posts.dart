// lib/widgets/instagram_posts.dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:webview_flutter/webview_flutter.dart';

/// Modelo de notícia com link do Instagram e texto
class NewsItem {
  final String titulo;
  final String descricao;
  final String linkinstagram;
  final DateTime data;

  NewsItem({
    required this.titulo,
    required this.descricao,
    required this.linkinstagram,
    required this.data,
  });

  factory NewsItem.fromJson(Map<String, dynamic> json) {
    return NewsItem(
      titulo: json['titulo'] as String? ?? '',
      descricao: json['descricao'] as String? ?? '',
      linkinstagram: json['linkinstagram'] as String? ?? '',
      data: DateTime.parse(json['data'] as String),
    );
  }
}

/// Widget que carrega notícias e exibe título, descrição e embed do Instagram
class InstagramPostsWidget extends StatelessWidget {
  const InstagramPostsWidget({Key? key}) : super(key: key);

  static const _apiUrl = 'https://lbapoa-api.onrender.com/news';

  Future<List<NewsItem>> _fetchNews() async {
    final res = await http.get(Uri.parse(_apiUrl));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar notícias: ${res.statusCode}');
    }
    final List<dynamic> list = jsonDecode(res.body);
    final items = list
        .map((e) => NewsItem.fromJson(e as Map<String, dynamic>))
        .where((item) => item.linkinstagram.isNotEmpty)
        .toList();
    // Ordena por data, mais recentes primeiro
    items.sort((a, b) => b.data.compareTo(a.data));
    return items;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<NewsItem>>(
      future: _fetchNews(),
      builder: (context, snap) {
        if (snap.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snap.hasError) {
          return Center(child: Text('Erro: ${snap.error}'));
        }
        final items = snap.data!;
        if (items.isEmpty) {
          return const Center(child: Text('Nenhum post encontrado.'));
        }
        return ListView.builder(
          padding: const EdgeInsets.symmetric(vertical: 8),
          itemCount: items.length,
          itemBuilder: (context, index) {
            final item = items[index];
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    item.titulo,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item.descricao,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
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
                                      style="width:100%">
                                    </blockquote>
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
          },
        );
      },
    );
  }
}
