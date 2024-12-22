import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';

const TrainingModal = ({ isOpen, onClose, pokemon, xpGained, newLevel }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white border-4 border-black p-8 max-w-md w-full mx-4 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-black mb-6 text-center">Training Complete!</h2>
          
          <div className="text-center mb-6">
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-32 h-32 object-contain mx-auto mb-4"
            />
            <h3 className="text-xl font-black">{pokemon.name}</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-[#4ECDC4] border-2 border-black p-4">
              <p className="font-black text-center">XP Gained: {xpGained}</p>
            </div>
            
            {newLevel > pokemon.level && (
              <div className="bg-[#FFD93D] border-2 border-black p-4">
                <p className="font-black text-center">
                  Level Up! {pokemon.level} → {newLevel}
                </p>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full mt-8 px-4 py-2 bg-[#FF6B6B] font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
          >
            CLOSE
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TrainingModal; 