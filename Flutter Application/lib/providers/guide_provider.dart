import 'package:flutter/material.dart';
import '../models/guide_section.dart';

class GuideProvider with ChangeNotifier {
  List<GuideSection> _guides = [
    GuideSection(
      title: 'Getting Started',
      description: 'Connect your wallet, choose a starter Pokemon, and start your journey.',
    ),
    GuideSection(
      title: 'Training Your Pokemon',
      description: 'Visit training grounds to level up your Pokemon.',
    ),
    GuideSection(
      title: 'Using the Marketplace',
      description: 'Purchase items and trade Pokemon with other players.',
    ),
  ];

  List<GuideSection> get guides => _guides;
}
