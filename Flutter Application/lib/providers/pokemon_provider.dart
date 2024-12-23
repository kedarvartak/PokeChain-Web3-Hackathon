import 'package:flutter/material.dart';
import '../models/pokemon.dart';

class PokemonProvider with ChangeNotifier {
  List<Pokemon> _pokemonCards = [
    Pokemon(
      name: 'Bulbasaur',
      type: 'Grass',
      level: 5,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    ),
    Pokemon(
      name: 'Charmander',
      type: 'Fire',
      level: 5,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    ),
    Pokemon(
      name: 'Squirtle',
      type: 'Water',
      level: 5,
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    ),
  ];

  List<Pokemon> get pokemonCards => _pokemonCards;
}
