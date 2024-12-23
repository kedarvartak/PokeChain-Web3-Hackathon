import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/pokemon_provider.dart';
import '../widgets/pokemon_card_widget.dart';

class PokemonCardsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final pokemonProvider = Provider.of<PokemonProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Pokemon Cards'),
        backgroundColor: Colors.orangeAccent,
        centerTitle: true,
      ),
      body: ListView.builder(
        padding: EdgeInsets.symmetric(vertical: 16, horizontal: 12),
        itemCount: pokemonProvider.pokemonCards.length,
        itemBuilder: (context, index) {
          return PokemonCardWidget(pokemon: pokemonProvider.pokemonCards[index]);
        },
      ),
    );
  }
}
