import 'package:flutter/material.dart';
import 'package:lbapoa/widgets/bottom_nav.dart';
import 'package:lbapoa/widgets/app_bar.dart';
import 'package:lbapoa/widgets/instagram_posts.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      appBar: MinhaAppBar(),
      body: InstagramPostsWidget(),
      bottomNavigationBar: BottomNav(initialIndex: 0),
    );
  } 
}