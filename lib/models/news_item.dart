// lib/models/news_item.dart

class NewsItem {
  final String titulo;
  final String descricao;
  final String linkinstagram;
  final DateTime data;
  final List<String> times;
  final List<String> torneios;

  NewsItem({
    required this.titulo,
    required this.descricao,
    required this.linkinstagram,
    required this.data,
    required this.times,
    required this.torneios,
  });

  factory NewsItem.fromJson(Map<String, dynamic> json) {
    return NewsItem(
      titulo: json['titulo'] as String? ?? '',
      descricao: json['descricao'] as String? ?? '',
      linkinstagram: json['linkinstagram'] as String? ?? '',
      data: DateTime.parse(json['data'] as String),
      times: (json['times'] as String? ?? '').split(';'),
      torneios: (json['torneios'] as String? ?? '').split(';'),
    );
  }
}
