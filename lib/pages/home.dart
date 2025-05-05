import 'package:flutter/material.dart';
import 'package:lbapoa/widgets/bottom_nav.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      bottomNavigationBar: BottomNav(initialIndex: 0),
    );
  } 
}