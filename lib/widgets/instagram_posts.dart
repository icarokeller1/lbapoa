import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_social_embeds/flutter_social_embeds.dart';

class InstagramPostsWidget extends StatefulWidget {
  const InstagramPostsWidget({super.key});

  @override
  State<InstagramPostsWidget> createState() => _InstagramPostsWidgetState();
}

class _InstagramPostsWidgetState extends State<InstagramPostsWidget> {
  static const _assetPath = 'assets/posts.json';
  List<String> _links = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadLinks();
  }

  Future<void> _loadLinks() async {
    try {
      final jsonStr = await rootBundle.loadString(_assetPath);
      final List<dynamic> decoded = jsonDecode(jsonStr);
      setState(() {
        _links = List<String>.from(decoded);
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao ler $_assetPath: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_links.isEmpty) {
      return const Center(child: Text('Nenhum post encontrado.'));
    }

    return ListView.separated(
      padding: EdgeInsets.zero,
      itemCount: _links.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (_, i) {
        final link = _links[i];
        final html = '''
          <blockquote class="instagram-media"
            data-instgrm-permalink="$link"
            data-instgrm-version="14"></blockquote>
          <script async src="//www.instagram.com/embed.js"></script>
        ''';

        return SocialEmbed(htmlBody: html);
      },
    );
  }
}
