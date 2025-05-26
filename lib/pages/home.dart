import 'package:flutter/material.dart';
import 'package:lbapoa/widgets/unified_feed.dart'; // ou o que quiser

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const UnifiedFeedWidget(); // ou qualquer widget que era o body
  }
}