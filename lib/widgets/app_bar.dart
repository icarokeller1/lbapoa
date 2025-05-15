import 'package:flutter/material.dart';
import 'package:lbapoa/pages/home.dart';
import 'package:lbapoa/pages/ao_vivo.dart';

// Exemplo de logo: assets/images/logo.png
class MinhaAppBar extends StatelessWidget implements PreferredSizeWidget {
  const MinhaAppBar({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return Material(
      // se quiser cor/transparência diferentes, troque aqui
      
      color: Colors.black.withValues(alpha: 0.8),
      elevation: 4,
      child: SafeArea(
        bottom: false, // não precisa do padding inferior
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // ---------- Botão da esquerda (imagem) ----------
            InkWell(
              borderRadius: BorderRadius.circular(32),
              onTap: () {
                // Troque pushNamed se usar rotas nomeadas
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) => const HomePage()),
                );
              },
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Image.asset(
                  'assets/images/logo.png',
                  height: 32, // ajuste conforme sua arte
                ),
              ),
            ),

            // ---------- Botão da direita (ícone) ----------
            IconButton(
              icon: const Icon(Icons.person), // mude para o ícone desejado
              tooltip: 'Perfil',
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const AoVivo()),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
