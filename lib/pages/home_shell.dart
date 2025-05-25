import 'package:flutter/material.dart';
import 'package:lbapoa/pages/ao_vivo.dart';
import 'package:lbapoa/pages/home.dart';
import 'package:lbapoa/widgets/app_bar.dart';
import 'package:lbapoa/widgets/bottom_nav.dart';
import 'package:lbapoa/pages/jogos_page.dart';
import 'package:lbapoa/pages/hall_of_fame.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _index = 0;

  final _pages = const [
    HomePage(),
    AoVivo(),
    JogosPage(),
    HallOfFamePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const MinhaAppBar(),
      body: IndexedStack(
        index: _index,
        children: _pages,
      ),
      bottomNavigationBar: BottomNav(
        initialIndex: _index,
        onIndexChanged: (i) => setState(() => _index = i),
      ),
    );
  }
}
