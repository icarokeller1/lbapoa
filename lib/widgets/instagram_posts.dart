// lib/widgets/instagram_posts.dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:webview_flutter/webview_flutter.dart';

/// Widget que carrega links de posts do Instagram via API e exibe embeds.
class InstagramPostsWidget extends StatelessWidget {
  const InstagramPostsWidget({super.key});

  static const _apiUrl = 'https://lbapoa-api.onrender.com/news';

  Future<List<String>> _fetchLinks() async {
    final res = await http.get(Uri.parse(_apiUrl));
    if (res.statusCode != 200) {
      throw Exception('Falha ao carregar notícias: \${res.statusCode}');
    }
    final List<dynamic> list = jsonDecode(res.body);
    // Cada item esperado ter campo 'linkinstagram'
    return list
        .map((e) => e['linkinstagram'] as String?)
        .whereType<String>()
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<String>>(
      future: _fetchLinks(),
      builder: (context, snap) {
        if (snap.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snap.hasError) {
          return Center(child: Text('Erro: \${snap.error}'));
        }
        final links = snap.data!;
        if (links.isEmpty) {
          return const Center(child: Text('Nenhum post encontrado.'));
        }
        return ListView.builder(
          padding: const EdgeInsets.symmetric(vertical: 8),
          itemCount: links.length,
          itemBuilder: (context, i) {
            final permalink = links[i];
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: FractionallySizedBox(
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
                    <!doctype html><html><body style="margin:0">
                      <blockquote class="instagram-media"
                        data-instgrm-permalink="$permalink"
                        data-instgrm-version="14" style="width:100%"></blockquote>
                      <script async src="https://www.instagram.com/embed.js"></script>
                    </body></html>
                    '''),
                      ),
                    ),
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }
}
