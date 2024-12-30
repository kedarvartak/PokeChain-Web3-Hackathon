import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTraining } from '../context/TrainingContext';
import { useState, useEffect } from 'react';
import { pokemonService } from '../services/PokeService';
import { toast } from 'react-hot-toast';
import asset from '../assets/POKEIMG.png';

const PokemonCard = ({ pokemon }) => {
  const { trainingPokemon, completeTraining } = useTraining();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('');
  const [currentXP, setCurrentXP] = useState(pokemon.xp);
  
  const isTraining = trainingPokemon[pokemon.id]?.isTraining;
  const trainingStartTime = trainingPokemon[pokemon.id]?.startTime;
  
  const [prevXP, setPrevXP] = useState(pokemon.xp);
  const [showXPGain, setShowXPGain] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  // Effect for updating XP in real-time during training
  useEffect(() => {
    let interval;
    
    const updateTrainingProgress = async () => {
      if (isTraining) {
        try {
          // Get current XP from contract
          const currentXP = await pokemonService.getCurrentTrainingXP(pokemon.id);
          setCurrentXP(Number(currentXP));
          
          // Calculate and show XP gained
          const gained = Number(currentXP) - prevXP;
          if (gained > 0) {
            setXpGained(gained);
            setShowXPGain(true);
            setTimeout(() => setShowXPGain(false), 2000);
          }
        } catch (error) {
          console.error('Error updating training progress:', error);
        }
      } else {
        setCurrentXP(pokemon.xp);
      }
    };

    if (isTraining) {
      // Update immediately
      updateTrainingProgress();
      // Then update every 10 seconds
      interval = setInterval(updateTrainingProgress, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTraining, pokemon.id, pokemon.xp, prevXP]);

  // Effect for updating timer
  useEffect(() => {
    let interval;
    if (isTraining && trainingStartTime) {
      interval = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const timeElapsed = now - trainingStartTime;
        const duration = 3600; // 1 hour training duration
        const remaining = Math.max(0, duration - timeElapsed);
        
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTraining, trainingStartTime]);

  // Handle training button click
  const handleTrainClick = async () => {
    if (isTraining) {
      try {
        console.log('Attempting to complete training for Pokemon:', pokemon.id);
        
        // Get final XP before completing training
        const finalXP = await pokemonService.getCurrentTrainingXP(pokemon.id);
        console.log('Final XP before completion:', finalXP);
        
        // Complete the training
        await completeTraining(pokemon.id);
        
        // Get updated Pokemon data
        const updatedPokemon = await pokemonService.getPokemonData(pokemon.id);
        console.log('Updated Pokemon data:', updatedPokemon);
        
        // Update the UI
        setCurrentXP(updatedPokemon.xp);
        setPrevXP(updatedPokemon.xp);
        
        toast.success('Training completed successfully!');
      } catch (error) {
        console.error('Training completion error:', error);
        toast.error(error.message);
      }
    } else {
      navigate('/training', { state: { preSelectedPokemon: pokemon.id } });
    }
  };

  // Add this effect to sync with contract data when training status changes
  useEffect(() => {
    const syncWithContract = async () => {
      if (!isTraining && pokemon.uuid) {
        try {
          const data = await pokemonService.getPokemonData(pokemon.uuid);
          setCurrentXP(data.xp);
          setPrevXP(data.xp);
        } catch (error) {
          console.error('Error syncing with contract:', error);
        }
      }
    };

    syncWithContract();
  }, [isTraining, pokemon.uuid]);

  const handleStartTraining = async (groundId) => {
    try {
      await pokemonService.startTraining(pokemon.uuid, groundId);
      // ... rest of the code
    } catch (error) {
      console.error('Error starting training:', error);
    }
  };

  return (
    <motion.div
      whileHover={{ rotate: -2, scale: 1.05 }}
      className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
    >
      {/* Training Status Badge */}
      {isTraining && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-4 -right-4 bg-[#FF6B6B] text-white font-black py-2 px-4 
                   border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                   flex items-center gap-2"
        >
          <span className="animate-pulse">●</span>
          TRAINING
        </motion.div>
      )}

      {/* Pokemon Image Container */}
      <div className="bg-[#FFE5E5] border-4 border-black p-4 mb-4 relative overflow-hidden">
        <motion.img
          src={asset}
          alt={pokemon.name}
          className="w-full h-48 object-contain relative z-10"
          animate={isTraining ? {
            y: [0, -10, 0],
            transition: {
              duration: 2,
              repeat: Infinity,
            }
          } : {}}
        />
        {isTraining && (
          <motion.div
            className="absolute inset-0 bg-[#4ECDC4] opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </div>
  
      {/* Pokemon Info */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black">{pokemon.name}</h3>
          <span className="bg-[#4ECDC4] px-3 py-1 font-black border-2 border-black">
            LVL {pokemon.level}
          </span>
        </div>
  
        {/* Stats */}
        <div className="space-y-2">
          {/* Type Badge */}
          <div className="flex items-center gap-2">
            <span className="font-bold">Type:</span>
            <span className={`px-3 py-1 font-black border-2 border-black 
              ${pokemon.type === 'Fire' ? 'bg-[#FF6B6B]' : 
                pokemon.type === 'Water' ? 'bg-[#4ECDC4]' : 
                'bg-[#FFD93D]'}`}>
              {pokemon.type}
            </span>
          </div>
  
          {/* XP Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold">XP:</span>
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {showXPGain && (
                    <motion.span
                      initial={{ y: 0, opacity: 0 }}
                      animate={{ y: -20, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[#4ECDC4] font-black"
                    >
                      +{xpGained}XP!
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="font-bold">{Math.floor(currentXP)}/100</span>
              </div>
            </div>
            <div className="w-full h-4 border-2 border-black bg-white overflow-hidden">
              <motion.div 
                className="h-full bg-[#4ECDC4]"
                initial={{ width: `${prevXP}%` }}
                animate={{ width: `${Math.min(currentXP, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Training Timer */}
          {isTraining && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="bg-[#FFD93D] border-2 border-black p-2 mt-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-black">Training Time:</span>
                <span className="font-black font-mono">{timeLeft}</span>
              </div>
              <div className="w-full h-2 bg-white border-2 border-black mt-2">
                <motion.div
                  className="h-full bg-[#FF6B6B]"
                  animate={{
                    width: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 3600,
                    ease: "linear",
                  }}
                />
              </div>
            </motion.div>
          )}
  
          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTrainClick}
              className={`flex-1 px-4 py-2 font-black border-2 border-black 
                ${isTraining ? 'bg-[#FF6B6B]' : 'bg-[#FFD93D]'}
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                transition-all duration-200`}
            >
              {isTraining ? 'COMPLETE TRAINING' : 'TRAIN'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-4 py-2 bg-[#4ECDC4] font-black border-2 border-black 
                       shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                       hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                       transition-all duration-200"
            >
              BATTLE
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PokemonCard;