import 'package:flutter/material.dart';
import '../models/pokemon.dart';

class PokemonCardWidget extends StatelessWidget {
  final Pokemon pokemon;

  PokemonCardWidget({required this.pokemon});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 8,
      margin: EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.black, width: 2),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Pokemon Image
            Center(
              child: Image.network(
                pokemon.imageUrl,
                height: 120,
                fit: BoxFit.contain,
              ),
            ),
            SizedBox(height: 16),

            // Pokemon Name
            Text(
              pokemon.name,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 8),

            // Pokemon Details (Type and Level)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildInfoBadge('Type: ${pokemon.type}', Colors.orange),
                _buildInfoBadge('LVL ${pokemon.level}', Colors.green),
              ],
            ),
            SizedBox(height: 16),

            // XP Progress Bar
            Row(
              children: [
                Expanded(
                  child: LinearProgressIndicator(
                    value: 0.14, // Placeholder value
                    backgroundColor: Colors.grey[300],
                    color: Colors.blue,
                  ),
                ),
                SizedBox(width: 8),
                Text(
                  '14/100', // Placeholder value
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),

            // Buttons for Train and Battle
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildActionButton('TRAIN', Colors.yellow),
                _buildActionButton('BATTLE', Colors.teal),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Helper method to create badges
  Widget _buildInfoBadge(String text, Color color) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 4, horizontal: 8),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.black, width: 1.5),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
          color: Colors.black,
        ),
      ),
    );
  }

  // Helper method to create buttons
  Widget _buildActionButton(String text, Color color) {
    return ElevatedButton(
      onPressed: () {},
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        foregroundColor: Colors.black,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        padding: EdgeInsets.symmetric(vertical: 12, horizontal: 24),
        side: BorderSide(color: Colors.black, width: 1.5),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
