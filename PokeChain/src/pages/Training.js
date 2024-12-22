import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { usePokemon } from '../context/PokemonContext';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { pokemonService as PokeService } from '../services/PokeService';
import { StarIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePokeCoin } from '../context/PokeCoinContext';
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { pokeCoinService } from '../services/PokeCoinService';

const TRAINING_GROUNDS = {
  1: { 
    name: "Basic Training",
    description: "A simple training ground suitable for all Pokemon types.",
    color: "bg-[#4ECDC4]",
    minLevel: 1,
    image: "https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/129.png",
    requiredType: null
  },
  2: {
    name: "Fire Dojo",
    description: "Intense training ground. Fire-type Pokemon gain bonus XP.",
    color: "bg-[#FF6B6B]",
    minLevel: 5,
    image: "https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/006.png",
    requiredType: "fire"
  },
  3: {
    name: "Water Temple",
    description: "Specialized training ground. Water-type Pokemon gain bonus XP.",
    color: "bg-[#4ECDC4]",
    minLevel: 5,
    image: "https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/009.png",
    requiredType: "water"
  },
  4: {
    name: "Grass Garden",
    description: "Nature-focused training ground. Grass-type Pokemon gain bonus XP.",
    color: "bg-[#95D44A]",
    minLevel: 5,
    image: "https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/003.png",
    requiredType: "grass"
  }
};

const getTypeBonus = (groundId, pokemonType) => {
  const typeMatchings = {
    2: "Fire",    // Fire Dojo
    3: "Water",   // Water Temple
    4: "Grass"    // Grass Garden
  };
  
  return typeMatchings[groundId] === pokemonType;
};

const Training = () => {
  const { isConnected } = useWallet();
  const { userPokemon, loading } = usePokemon();
  const [selectedGround, setSelectedGround] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const { balance } = usePokeCoin();
  const { address } = useWallet();
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    if (location.state?.preSelectedPokemon) {
      setSelectedPokemon(location.state.preSelectedPokemon);
    }
  }, [location]);

  const handleStartTraining = async (pokemonId, groundId) => {
    if (!pokemonId || !groundId || !address) return;
    
    try {
      setIsProcessing(true);
      const cost = TRAINING_COSTS[groundId];
      
      const pokemonNFTAddress = '0x4DAf17c8142A483B2E2348f56ae0F2cFDAe22ceE';
      
      // Check balance first
      if (parseFloat(balance) < cost) {
        toast.error('Insufficient PokeCoin balance');
        return;
      }
      
      // Check allowance first
      const allowance = await pokeCoinService.getAllowance(
        address,
        pokemonNFTAddress
      );

      // If allowance is less than cost, request approval
      if (parseFloat(allowance) < cost) {
        setIsApproving(true);
        try {
          await pokeCoinService.approve(pokemonNFTAddress, cost);
          toast.success('Approval successful');
        } catch (error) {
          console.error('Approval error:', error);
          toast.error('Failed to approve PokeCoin spend');
          return;
        } finally {
          setIsApproving(false);
        }
      }

      // Start training
      await PokeService.startTraining(pokemonId, groundId);
      toast.success('Training started successfully!');
    } catch (error) {
      console.error('Error starting training:', error);
      toast.error(error.message || 'Failed to start training');
    } finally {
      setIsProcessing(false);
      setIsApproving(false);
    }
  };

  const hasTypeBonus = (groundId, pokemon) => {
    if (!pokemon || groundId === 1) return false; // No bonus for basic training
    return getTypeBonus(groundId, pokemon.type);
  };

  const TRAINING_COSTS = {
    1: 5,  // Basic Training
    2: 10, // Fire Dojo
    3: 10, // Water Temple
    4: 10  // Grass Garden
  };

  const TrainingGroundCard = ({ ground, id }) => {
    const cost = TRAINING_COSTS[id];
    const hasEnoughCoins = parseFloat(balance) >= cost;

    return (
      <motion.div
        key={id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedGround(id)}
        className={`bg-white border-4 cursor-pointer transition-all duration-200
                  ${selectedGround === id 
                    ? `border-[${ground.color.slice(3)}] bg-[${ground.color.slice(3)}]/10 
                       shadow-none translate-x-[4px] translate-y-[4px]` 
                    : 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
      >
        <div className="flex items-center gap-4 p-4">
          <div className={`relative ${selectedGround === id ? 'after:content-["✓"] after:absolute after:-top-2 after:-right-2 after:bg-[#4ECDC4] after:w-6 after:h-6 after:flex after:items-center after:justify-center after:border-2 after:border-black after:font-bold' : ''}`}>
            <img 
              src={ground.image}
              alt={ground.name}
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-black">{ground.name}</h3>
              {hasTypeBonus(id, userPokemon.find(p => p.id === selectedPokemon)?.type) && (
                <span className="text-sm px-2 py-1 bg-[#FFD93D] border-2 border-black font-bold flex items-center gap-1">
                  <StarIcon className="w-4 h-4" />
                  1.5x XP
                </span>
              )}
            </div>
            <p className="text-sm mt-1">{ground.description}</p>
            <span className="text-sm mt-2 inline-block px-2 py-1 bg-black text-white font-bold">
              Min Level {ground.minLevel}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5" />
            <span className={`font-bold ${hasEnoughCoins ? 'text-black' : 'text-red-500'}`}>
              {cost} PKC
            </span>
          </div>
          {!hasEnoughCoins && (
            <span className="text-sm text-red-500 font-bold">
              Insufficient balance
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  if (!isConnected) return <Navigate to="/" />;
  if (loading) return <LoadingSpinner text="LOADING TRAINING GROUNDS" />;

  return (
    <div className="min-h-screen bg-[#F7F9FC] p-8 pt-36">
      {/* Simple Header */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-black bg-yellow-400 inline-block px-8 py-4 
                    border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          TRAINING GROUNDS
        </h1>
      </div>

      <div className="max-w-6xl mx-auto mb-8 flex justify-end">
        <div className="flex items-center gap-2 bg-white border-4 border-black p-4 
                      shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <span className="font-bold">Your Balance:</span>
          <div className="flex items-center gap-2 bg-[#FFD93D] px-3 py-1 border-2 border-black">
            <CurrencyDollarIcon className="w-5 h-5" />
            <span className="font-black">{parseFloat(balance).toFixed(0)} PKC</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Pokemon Selection */}
          <div>
            <h2 className="font-black text-xl mb-4 flex items-center gap-2">
              SELECT POKEMON
              {selectedPokemon && (
                <span className="text-sm px-3 py-1 bg-[#FFD93D] border-2 border-black">
                  ✓ {selectedPokemon.name} selected
                </span>
              )}
            </h2>
            <div className="space-y-4">
              {userPokemon.map((pokemon) => (
                <motion.div
                  key={pokemon.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPokemon(pokemon)}
                  className={`bg-white border-4 cursor-pointer transition-all duration-200
                            ${selectedPokemon?.id === pokemon.id 
                              ? 'border-[#FFD93D] bg-[#FFD93D]/10 shadow-none translate-x-[4px] translate-y-[4px]' 
                              : 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className={`relative ${selectedPokemon?.id === pokemon.id ? 'after:content-["✓"] after:absolute after:-top-2 after:-right-2 after:bg-[#FFD93D] after:w-6 after:h-6 after:flex after:items-center after:justify-center after:border-2 after:border-black after:font-bold' : ''}`}>
                      <img
                        src={`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${String(pokemon.id).padStart(3, '0')}.png`}
                        alt={pokemon.name}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-black">{pokemon.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-sm px-2 py-1 bg-[#4ECDC4] border-2 border-black font-bold">
                          Lvl {pokemon.level}
                        </span>
                        <span className="text-sm px-2 py-1 bg-[#FF6B6B] border-2 border-black font-bold">
                          {pokemon.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Training Grounds */}
          <div>
            <h2 className="font-black text-xl mb-4 flex items-center gap-2">
              SELECT TRAINING GROUND
              {selectedGround && (
                <span className="text-sm px-3 py-1 bg-[#4ECDC4] border-2 border-black">
                  ✓ {TRAINING_GROUNDS[selectedGround].name} selected
                </span>
              )}
            </h2>
            <div className="space-y-4">
              {Object.entries(TRAINING_GROUNDS).map(([id, ground]) => (
                <TrainingGroundCard key={id} ground={ground} id={id} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-8 bg-white border-4 border-black p-4 
                     shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${selectedPokemon ? 'bg-[#FFD93D]' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${selectedGround ? 'bg-[#4ECDC4]' : 'bg-gray-300'}`} />
              <p className="font-bold">
                {!selectedPokemon 
                  ? "Select a Pokemon" 
                  : !selectedGround 
                    ? "Choose a training ground" 
                    : "Ready to start training!"}
              </p>
              {selectedGround && (
                <span className="font-bold">
                  Cost: {TRAINING_COSTS[selectedGround]} PKC
                </span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStartTraining(selectedPokemon?.id, selectedGround)}
              disabled={!selectedGround || !selectedPokemon || isProcessing || isApproving || 
                       parseFloat(balance) < TRAINING_COSTS[selectedGround]}
              className="px-6 py-3 bg-[#FFD93D] font-black border-4 border-black 
                       shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]
                       transition-all duration-200"
            >
              {isProcessing ? <LoadingSpinner /> :
               isApproving ? 'APPROVING...' :
               parseFloat(balance) < TRAINING_COSTS[selectedGround] ? 
               'INSUFFICIENT BALANCE' : 'START TRAINING'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 
                     flex items-center justify-center">
          <div className="bg-white border-4 border-black p-6 max-w-sm w-full
                       shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col items-center gap-4">
              <LoadingSpinner />
              <p className="font-bold">Starting Training...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training; 