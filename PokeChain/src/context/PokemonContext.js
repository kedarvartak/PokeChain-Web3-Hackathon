// src/context/PokemonContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { pokemonService } from '../services/PokeService';

const PokemonContext = createContext();

export const starterPokemon = [
  { 
    id: 1, 
    name: 'Bulbasaur', 
    type: 'Grass', 
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' 
  },
  { 
    id: 4, 
    name: 'Charmander', 
    type: 'Fire', 
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' 
  },
  { 
    id: 7, 
    name: 'Squirtle', 
    type: 'Water', 
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' 
  }
];

export function PokemonProvider({ children }) {
  const [userPokemon, setUserPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const { isConnected, address } = useWallet();

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!isConnected || !address) {
        setUserPokemon([]);
        setIsNewUser(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // First check if user is new
        const newUserStatus = await pokemonService.isNewUser(address);
        setIsNewUser(newUserStatus);

        // If not a new user, fetch their Pokemon
        if (!newUserStatus) {
          const pokemon = await pokemonService.getUserPokemon(address);
          setUserPokemon(pokemon);
        } else {
          setUserPokemon([]);
        }
      } catch (error) {
        console.error('Error fetching user status:', error);
        setUserPokemon([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();
  }, [isConnected, address]);

  const refreshPokemon = async () => {
    if (address) {
      const pokemon = await pokemonService.getUserPokemon(address);
      setUserPokemon(pokemon);
    }
  
  };

  return (
    <PokemonContext.Provider value={{ 
      userPokemon, 
      loading, 
      isNewUser,
      refreshPokemon
    }}>
      {children}
    </PokemonContext.Provider>
  );
}

export const usePokemon = () => useContext(PokemonContext);