// src/contracts/PokemonContract.js
import { ethers } from 'ethers';

// Dummy Pokemon data
const STARTER_POKEMON = {
  1: { id: 1, name: 'Bulbasaur', type: 'Grass', level: 5, xp: 0, image: '/images/bulbasaur.png' },
  4: { id: 4, name: 'Charmander', type: 'Fire', level: 5, xp: 0, image: '/images/charmander.png' },
  7: { id: 7, name: 'Squirtle', type: 'Water', level: 5, xp: 0, image: '/images/squirtle.png' }
};

// Mock storage using localStorage
class PokemonContract {
  constructor() {
    this.storage = window.localStorage;
  }

  // Check if user has any Pokemon
  async hasStarterPokemon(address) {
    const userPokemon = this.storage.getItem(`pokemon_${address}`);
    return !!userPokemon;
  }

  // Get user's Pokemon
  async getUserPokemon(address) {
    const userPokemon = this.storage.getItem(`pokemon_${address}`);
    return userPokemon ? JSON.parse(userPokemon) : [];
  }

  // Mint starter Pokemon
  async mintStarterPokemon(address, pokemonId) {
    if (!STARTER_POKEMON[pokemonId]) {
      throw new Error('Invalid Pokemon ID');
    }

    const hasStarter = await this.hasStarterPokemon(address);
    if (hasStarter) {
      throw new Error('User already has a starter Pokemon');
    }

    const newPokemon = { ...STARTER_POKEMON[pokemonId] };
    this.storage.setItem(`pokemon_${address}`, JSON.stringify([newPokemon]));
    return newPokemon;
  }
}

export default PokemonContract;