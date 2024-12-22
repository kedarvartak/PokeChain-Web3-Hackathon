import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTraining } from '../context/TrainingContext';
import { ClockIcon } from '@heroicons/react/24/solid';
import TrainingRewards from './TrainingRewards';
import { toast } from 'react-hot-toast';

const TrainingProgress = ({ pokemon, groundId }) => {
  const { trainingPokemon, completeTraining } = useTraining();
  const trainingStartTime = trainingPokemon[pokemon.id]?.startTime;
  const [showRewards, setShowRewards] = useState(false);
  const [rewardXP, setRewardXP] = useState(0);
  
  const getTimeRemaining = () => {
    if (!trainingStartTime) return null;
    const now = Math.floor(Date.now() / 1000);
    const minTrainingTime = trainingStartTime + (60 * 60); // 1 hour in seconds
    const remaining = Math.max(0, minTrainingTime - now);
    
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const canComplete = trainingStartTime && 
    (Math.floor(Date.now() / 1000) >= trainingStartTime + (60 * 60));

  const handleComplete = async () => {
    try {
      const result = await completeTraining(pokemon.id, groundId);
      setRewardXP(result.xpGained);
      setShowRewards(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRewardsComplete = () => {
    setShowRewards(false);
    setRewardXP(0);
  };

  return (
    <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black">{pokemon.name}</h3>
        <div className="flex items-center gap-2">
          <ClockIcon className="w-5 h-5" />
          <span className="font-bold">{getTimeRemaining()}</span>
        </div>
      </div>
      
      {canComplete ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleComplete}
          className="w-full px-4 py-2 bg-[#4ECDC4] font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
        >
          COMPLETE TRAINING
        </motion.button>
      ) : (
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <motion.div
            className="h-full bg-[#4ECDC4] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3600, ease: "linear" }}
          />
        </div>
      )}
      <TrainingRewards 
        show={showRewards}
        xpGained={rewardXP}
        onComplete={handleRewardsComplete}
      />
    </div>
  );
};

export default TrainingProgress; 