import 'package:flutter/material.dart';

class StatsWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('Pokemon Trained: Placeholder', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        Text('Tokens Earned: Placeholder PKC', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ],
    );
  }
}
