import 'package:flutter/material.dart';
import 'package:convex_bottom_bar/convex_bottom_bar.dart';
import 'package:lbapoa/pages/home.dart';

class BottomNav extends StatefulWidget {
  final int initialIndex;
  const BottomNav({super.key, this.initialIndex = 0});

  @override
  State<BottomNav> createState() => _BottomNavState();
}

class _BottomNavState extends State<BottomNav> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
            bottomNavigationBar: ConvexAppBar(
              backgroundColor: Colors.black.withValues(alpha: 0.8),
              color: Colors.white,
              initialActiveIndex: widget.initialIndex,
              items: const [
                TabItem(icon: Icons.home, title: 'Home'),
                TabItem(icon: Icons.map, title: 'Discovery'),
                TabItem(icon: Icons.add, title: 'Add'),
                TabItem(icon: Icons.message, title: 'Message'),
              ],
              onTap: (int index) {
                switch (index) {
                  case 0:
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const HomePage()),
                    );
                    break;
                  case 1:
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const HomePage()),
                    );
                    break;
                  default:
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const HomePage()),
                    );
                  break;
                }
              },
            )
          );
  }
}