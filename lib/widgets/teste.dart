import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;

class DebugJsonAssets extends StatelessWidget {
  const DebugJsonAssets({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: rootBundle.loadString('assets/posts.json'),
      builder: (context, snap) {
        if (snap.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snap.hasError) {
          return Center(child: Text('Erro: ${snap.error}'));
        }
        final list = jsonDecode(snap.data!) as List<dynamic>;
        return ListView(
          children: list.map((e) => ListTile(title: Text(e))).toList(),
        );
      },
    );
  }
}
