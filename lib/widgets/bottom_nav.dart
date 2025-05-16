import 'package:flutter/material.dart';
import 'package:convex_bottom_bar/convex_bottom_bar.dart';
import 'package:lbapoa/pages/ao_vivo.dart';
import 'package:lbapoa/pages/home.dart';

class BottomNav extends StatefulWidget {
  const BottomNav({super.key, required this.onIndexChanged, this.initialIndex = 0});
  final int initialIndex;
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
        TabItem(icon: Icons.home,       title: 'Home'),
        TabItem(icon: Icons.play_arrow, title: 'Ao Vivo'),
        TabItem(icon: Icons.add,        title: 'Add'),
        TabItem(icon: Icons.message,    title: 'Msg'),
      ],
      onTap: (i) {
        setState(() => _current = i);
        widget.onIndexChanged(i);
      },
    );
  }
}
