import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { pokemonService as PokeService } from '../services/PokeService';
import { toast } from 'react-hot-toast';
import { useNotification } from './NotificationContext';
import { usePokemon } from './PokemonContext';

const TrainingContext = createContext();

export function TrainingProvider({ children }) {
  const { address } = useWallet();
  const { userPokemon } = usePokemon();
  const [trainingPokemon, setTrainingPokemon] = useState({});
  const [completionModal, setCompletionModal] = useState({
    isOpen: false,
    pokemon: null,
    xpGained: 0,
    newLevel: 0
  });
  const { addNotification } = useNotification();

  // Check training status periodically
  useEffect(() => {
    if (!address) return;

    // Inside checkTrainingStatus function
const checkTrainingStatus = async () => {
  try {
    const { contract } = await PokeService.getContract(); // Destructure to get contract
    
    const trainingStatus = {};
    for (const pokemon of userPokemon) {
      const pokemonData = await contract.getPokemonData(pokemon.id);
      if (pokemonData.isTraining) {
        trainingStatus[pokemon.id] = {
          startTime: Number(pokemonData.trainingStartTime),
          isTraining: true,
          groundId: Number(pokemonData.trainingGroundId)
        };
      }
    }
    setTrainingPokemon(trainingStatus);
  } catch (error) {
    console.error('Error checking training status:', error);
  }
};

    const interval = setInterval(checkTrainingStatus, 30000);
    checkTrainingStatus(); // Initial check

    return () => clearInterval(interval);
  }, [address, userPokemon]);

  useEffect(() => {
    Object.entries(trainingPokemon).forEach(([pokemonId, data]) => {
      const now = Math.floor(Date.now() / 1000);
      const completionTime = data.startTime + (60 * 60);
      
      if (now >= completionTime && !data.notified) {
        addNotification({
          title: 'Training Complete!',
          message: 'Your Pokemon has finished training and is ready to collect rewards!',
          type: 'success'
        });
        
        setTrainingPokemon(prev => ({
          ...prev,
          [pokemonId]: { ...prev[pokemonId], notified: true }
        }));
      }
    });
  }, [trainingPokemon]);

  const completeTraining = async (pokemonId, groundId) => {
    try {
      const result = await PokeService.endTraining(pokemonId, groundId);
      const pokemon = userPokemon.find(p => p.id === pokemonId);
      
      setCompletionModal({
        isOpen: true,
        pokemon,
        xpGained: result.xpGained,
        newLevel: result.newLevel
      });
      
      // Remove from training state
      setTrainingPokemon(prev => {
        const updated = { ...prev };
        delete updated[pokemonId];
        return updated;
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <TrainingContext.Provider value={{ trainingPokemon, completeTraining }}>
      {children}
    </TrainingContext.Provider>
  );
}

export const useTraining = () => useContext(TrainingContext); 