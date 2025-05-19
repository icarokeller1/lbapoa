import 'package:flutter/material.dart';
import 'package:convex_bottom_bar/convex_bottom_bar.dart';

class BottomNav extends StatefulWidget {
  const BottomNav({super.key, required this.onIndexChanged, this.initialIndex = 0});

  /// Índice inicial selecionado na barra
  final int initialIndex;

  /// Callback para notificar troca de índice
  final ValueChanged<int> onIndexChanged;

  @override
  State<BottomNav> createState() => _BottomNavState();
}

class _BottomNavState extends State<BottomNav> {
  late int _current = widget.initialIndex;

  @override
  Widget build(BuildContext context) {
    return ConvexAppBar(
      backgroundColor: Colors.black.withValues(alpha: 0.8),
      color: Colors.white,
      initialActiveIndex: _current,
      items: const [
        TabItem(icon: Icons.home,            title: 'Home'),
        TabItem(icon: Icons.play_arrow,      title: 'Ao Vivo'),
        TabItem(icon: Icons.sports_basketball,   title: 'Jogos'),
        TabItem(icon: Icons.history,         title: 'Hall of Fame'),
      ],
      onTap: (int index) {
        setState(() => _current = index);
        widget.onIndexChanged(index);
      },
    );
  }
}
