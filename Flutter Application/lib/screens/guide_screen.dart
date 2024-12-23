import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/guide_provider.dart';
import '../widgets/guide_widget.dart';

class GuideScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final guides = Provider.of<GuideProvider>(context).guides;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Game Guide',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.teal,
      ),
      body: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.teal.shade100, Colors.teal.shade50],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: ListView.builder(
          itemCount: guides.length,
          itemBuilder: (context, index) {
            return GuideWidget(guide: guides[index]);
          },
        ),
      ),
    );
  }
}
