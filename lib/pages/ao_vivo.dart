import 'package:flutter/material.dart';

class AoVivo extends StatelessWidget {
  const AoVivo({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Caso queira manter sua AppBar customizada,
      // basta trocar por const MinhaAppBar()
      appBar: AppBar(
        title: const Text('Ao Vivo'),
      ),
      body: const Center(
        child: Text(
          'Conteúdo ao vivo em breve 😉',
          style: TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}
