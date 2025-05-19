// instagram_posts.dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:webview_flutter/webview_flutter.dart';

class InstagramPostsWidget extends StatelessWidget {
  const InstagramPostsWidget({super.key});

  Future<List<String>> _loadLinks() async {
    final jsonStr = await rootBundle.loadString('assets/posts.json');
    return List<String>.from(jsonDecode(jsonStr));
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<String>>(
      future: _loadLinks(),
      builder: (context, snap) {
        if (!snap.hasData) {
          return const Center(child: CircularProgressIndicator());
        }
        final links = snap.data!;
        if (links.isEmpty) {
          return const Center(child: Text('Nenhum post encontrado.'));
        }

        return ListView.builder(
          itemCount: links.length,
          itemBuilder: (_, i) => Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: _InstagramPost(permalink: links[i]),
          ),
        );
      },
    );
  }
}

class _InstagramPost extends StatelessWidget {
  const _InstagramPost({required this.permalink});

  final String permalink;

  // Quantos pixels queremos ocultar
  static const double _cropTop = 20;   // cabeçalho do embed
  static const double _cropBottom = 10; // rodapé

  @override
  Widget build(BuildContext context) {
    final controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          // Impede qualquer navegação dentro do iframe/links
          onNavigationRequest: (NavigationRequest req) =>
              NavigationDecision.prevent,
        ),
      )
      ..loadHtmlString('''
<!doctype html><html><body style="margin:0">
  <blockquote class="instagram-media"
    data-instgrm-permalink="$permalink"
    data-instgrm-version="14" style="width:100%"></blockquote>
  <script async src="https://www.instagram.com/embed.js"></script>
</body></html>
''');

    return FractionallySizedBox(
      widthFactor: 0.9, // 5 % de margem horizontal
      child: LayoutBuilder(
        builder: (context, constraints) {
          // Mantemos a proporção 3:4 (w:h) do post do Instagram
          final double width = constraints.maxWidth;
          final double fullHeight = width * 4 / 3; // h = w / (3/4)
          final double visibleHeight = fullHeight - _cropBottom;

          return SizedBox(
            width: width,
            height: visibleHeight,
            child: ClipRect(
              child: Transform.translate(
                offset: const Offset(0, -_cropTop),
                child: SizedBox(
                  width: width,
                  height: fullHeight,
                  child: WebViewWidget(controller: controller),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
