import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/solid';

const TrainingRewards = ({ show, xpGained, onComplete }) => {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: -100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-[#FFD93D] border-4 border-black p-4 rounded-lg flex items-center gap-2"
          >
            <SparklesIcon className="w-6 h-6" />
            <span className="font-black text-2xl">+{xpGained} XP</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrainingRewards; 