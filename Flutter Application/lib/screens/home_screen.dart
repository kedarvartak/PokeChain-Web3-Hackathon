import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'POKECHAIN',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        foregroundColor: Colors.black,
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pushNamed(context, '/connect_wallet');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.teal,
              foregroundColor: Colors.white,
              side: BorderSide(color: Colors.black, width: 2),
            ),
            child: Text('FETCH DETAILS '),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(height: 20),
              Text(
                'TRAIN. STAKE. EARN.',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 16),
              Text(
                'The first idle Pokemon game on the blockchain where you can actually make money while sleeping!',
                style: TextStyle(fontSize: 16),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 32),
              LayoutBuilder(
                builder: (context, constraints) {
                  if (constraints.maxWidth > 360) {
                    // Horizontal layout for larger screens
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildActionButton(
                          context,
                          'GAME GUIDE',
                          Colors.redAccent,
                          () => Navigator.pushNamed(context, '/guide'),
                        ),
                        _buildActionButton(
                          context,
                          'VIEW CARDS',
                          Colors.teal,
                          () => Navigator.pushNamed(context, '/pokemon_cards'),
                        ),
                      ],
                    );
                  } else {
                    // Vertical layout for smaller screens
                    return Column(
                      children: [
                        _buildActionButton(
                          context,
                          'GAME GUIDE',
                          Colors.redAccent,
                          () => Navigator.pushNamed(context, '/guide'),
                        ),
                        SizedBox(height: 8),
                        _buildActionButton(
                          context,
                          'VIEW CARDS',
                          Colors.teal,
                          () => Navigator.pushNamed(context, '/pokemon_cards'),
                        ),
                      ],
                    );
                  }
                },
              ),
              SizedBox(height: 32),
              Text(
                'STARTER POKEMON',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildPokemonPreview(
                      'Bulbasaur',
                      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'),
                  _buildPokemonPreview(
                      'Charmander',
                      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'),
                  _buildPokemonPreview(
                      'Squirtle',
                      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png'),
                ],
              ),
              SizedBox(height: 32),
              // Add Connect Wallet Button
              ElevatedButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/wallet');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.teal,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  side: BorderSide(color: Colors.black, width: 2),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'CONNECT WALLET',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              SizedBox(height: 16), // Add spacing between buttons
              // Add Contact Us Button
              ElevatedButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/contact_us');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  side: BorderSide(color: Colors.black, width: 2),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'CONTACT US',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionButton(BuildContext context, String label, Color color,
      VoidCallback onPressed) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        foregroundColor: Colors.white,
        side: BorderSide(color: Colors.black, width: 2),
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
      child: Text(
        label,
        style: TextStyle(fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildPokemonPreview(String name, String imageUrl) {
    return Column(
      children: [
        Image.network(imageUrl, height: 80),
        SizedBox(height: 8),
        Text(
          name,
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ],
    );
  }
}
