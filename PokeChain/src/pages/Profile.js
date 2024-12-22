import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { usePokemon, starterPokemon } from '../context/PokemonContext';
import { useMarketplace } from '../context/MarketplaceContext';

import PokemonCard from '../components/PokemonCard';
import TrainingProgress from '../components/TrainingProgress';
import { useTraining } from '../context/TrainingContext';
import { toast } from 'react-hot-toast';
import { pokemonService } from '../services/PokeService';
import LoadingSpinner from '../components/LoadingSpinner';

const ITEM_IMAGES = {
  1: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
  2: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',
  3: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',
  4: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png'
};

const cardVariants = {
  hover: {
    scale: 1.05,
    rotate: [0, -1, 1, -1, 0],
    transition: {
      rotate: {
        repeat: Infinity,
        duration: 0.5
      }
    }
  },
  tap: {
    scale: 0.95,
    rotate: 0
  }
};

const Profile = () => {
  const { isConnected } = useWallet();
  const { isNewUser, loading, userPokemon, refreshPokemon } = usePokemon();
  const { userItems = [] } = useMarketplace();
  const { trainingPokemon } = useTraining();
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    const calculateTotalXP = async () => {
      if (!userPokemon || !Array.isArray(userPokemon)) return;

      let total = 0;
      for (const pokemon of userPokemon) {
        try {
          if (trainingPokemon[pokemon.id]?.isTraining) {
            const currentXP = await pokemonService.getCurrentTrainingXP(pokemon.id);
            total += Number(currentXP) || 0;
          } else {
            total += Number(pokemon.xp) || 0;
          }
        } catch (error) {
          console.error(`Error calculating XP for pokemon ${pokemon.id}:`, error);
          total += Number(pokemon.xp) || 0;
        }
      }
      setTotalXP(total);
    };

    calculateTotalXP();
    
    const interval = setInterval(calculateTotalXP, 10000);
    return () => clearInterval(interval);
  }, [userPokemon, trainingPokemon]);

  const handleSelectStarter = async (pokemonId) => {
    try {
      console.log('Attempting to mint starter Pokemon:', pokemonId);
      await pokemonService.mintStarterPokemon(pokemonId);
      console.log('Minting successful, refreshing Pokemon list');
      await refreshPokemon(); // Refresh Pokemon list after minting
      toast.success('Starter Pokemon claimed successfully!');
    } catch (error) {
      console.error('Error minting starter:', error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="LOADING PROFILE" />
      </div>
    );
  }

  if (!isConnected) {
    return <Navigate to="/" />;
  }

  if (isNewUser) {
    return (
      <div className="min-h-screen py-20 max-w-7xl mx-auto pt-36 px-4 relative overflow-hidden">
        {/* Decorative background elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFD93D] rounded-full opacity-50" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FF6B6B] rounded-full opacity-50" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-[#4ECDC4] rounded-full opacity-50" />
        </motion.div>

        <div className="relative z-10">
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black inline-block bg-[#FFD93D] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              CHOOSE YOUR STARTER!
            </h2>
            <p className="mt-6 text-xl font-bold text-gray-700">
              Select your first Pokémon companion to begin your adventure!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {starterPokemon.map((pokemon, index) => (
              <motion.div
                key={pokemon.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="relative group"
                onClick={() => handleSelectStarter(pokemon.id)}
              >
                <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
                             hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] 
                             transition-shadow duration-200 cursor-pointer
                             hover:bg-gray-50">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-[#FFD93D] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                    <motion.img
                      src={pokemon.image}
                      alt={pokemon.name}
                      className="w-48 h-48 mx-auto mb-6 drop-shadow-xl"
                      whileHover={{ y: -5 }}
                    />
                  </div>
                  
                  <h3 className="text-3xl font-black text-center mb-4">{pokemon.name}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <span className={`px-4 py-2 rounded-full font-bold text-sm
                                   ${pokemon.type === 'Fire' ? 'bg-red-500' : 
                                     pokemon.type === 'Water' ? 'bg-blue-500' : 
                                     'bg-green-500'} text-white`}>
                        {pokemon.type}
                      </span>
                    </div>
                    <p className="text-center text-gray-600 font-medium">Level 5</p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 w-full bg-[#4ECDC4] text-black font-black py-3 px-6 
                             border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                             hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                             active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                             transition-all duration-200"
                  >
                    I CHOOSE YOU!
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userPokemon || !Array.isArray(userPokemon)) {
    return (
      <div className="text-center py-20 pt-36">
        <h2 className="text-4xl font-black mb-4 bg-[#FF6B6B] inline-block border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          NO POKEMON FOUND
        </h2>
        <p className="text-xl font-bold mt-4">Something went wrong loading your Pokemon team.</p>
      </div>
    );
  }

  return (
    <div className="py-20 max-w-7xl mx-auto pt-36 px-4">
      {/* Team Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black inline-block bg-[#FFD93D] border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          YOUR POKEMON TEAM
        </h2>
      </div>

       {/* Team Stats */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { 
            label: "TOTAL POKEMON", 
            value: userPokemon.length 
          },
          { 
            label: "HIGHEST LEVEL", 
            value: userPokemon.length ? Math.max(...userPokemon.map(p => p?.level || 0)) : 0 
          },
          { 
            label: "TOTAL XP", 
            value: totalXP 
          },
          { 
            label: "BATTLES WON", 
            value: "0" 
          }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="bg-white border-4 border-black p-4 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <h4 className="font-black text-lg mb-2">{stat.label}</h4>
            <p className="text-3xl font-black text-[#FF6B6B]">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      

      {/* Pokemon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {userPokemon.map((pokemon, idx) => (
          <PokemonCard key={idx} pokemon={pokemon} />
        ))}
      </div>

      {/* Items Inventory Section */}
      <div className="mt-16">
       

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {(userItems || []).map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <img
                src={ITEM_IMAGES[item.id]}
                alt={item.name}
                className="w-24 h-24 mx-auto mb-4 object-contain"
              />
              <h3 className="text-xl font-black text-center mb-2">{item.name}</h3>
              <p className="text-center font-bold">Amount: {item.amount}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile; 