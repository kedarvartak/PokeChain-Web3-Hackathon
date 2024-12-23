import 'package:flutter/material.dart';
import '../widgets/stats_widget.dart';

class StatsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('User Stats'),
      ),
      body: Center(
        child: StatsWidget(),
      ),
    );
  }
}
