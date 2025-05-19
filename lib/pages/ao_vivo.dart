// lib/pages/ao_vivo.dart
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class AoVivo extends StatelessWidget {
  const AoVivo({super.key});

  // URL fixa da página “ao vivo” do canal Record News
  static const _liveUrl =
      'https://m.youtube.com/channel/UCuiLR4p6wQ3xLEm15pEn1Xw/live';

  @override
  Widget build(BuildContext context) {
    final controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..loadRequest(Uri.parse(_liveUrl));

    return Scaffold(
      body: Center(
        // mantém o player em 16:9 mesmo no modo retrato
        child: AspectRatio(
          aspectRatio: 16 / 9,
          child: WebViewWidget(controller: controller),
        ),
      ),
    );
  }
}
