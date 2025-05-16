import 'package:flutter/material.dart';
import 'package:lbapoa/widgets/instagram_posts.dart'; // ou o que quiser

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const InstagramPostsWidget(); // ou qualquer widget que era o body
  }
}