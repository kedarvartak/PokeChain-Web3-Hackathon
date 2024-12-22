import React from 'react';
import { motion } from 'framer-motion';

const Documentation = () => {
  const sections = [
    {
      title: "Getting Started",
      content: [
        "1. Connect your wallet using MetaMask",
        "2. Choose your starter Pokemon (Bulbasaur, Charmander, or Squirtle)",
        "3. Your Pokemon will appear in your profile"
      ]
    },
    {
      title: "Training Your Pokemon",
      content: [
        "1. Visit the Training Grounds",
        "2. Select a Pokemon from your team",
        "3. Choose a training ground that matches your Pokemon's type for bonus XP",
        "4. Wait for the training period to complete",
        "5. Claim your XP and potential level ups"
      ]
    },
    {
      title: "Marketplace",
      content: [
        "1. Visit the Marketplace to buy Pokeballs",
        "2. Different Pokeballs have different catch rates",
        "3. Use your Pokeballs to catch new Pokemon (coming soon)",
        "4. Trade Pokemon with other trainers (coming soon)"
      ]
    },
    {
      title: "Pokemon Types",
      content: [
        "• Grass type: Best trained in Grass Garden",
        "• Fire type: Best trained in Fire Dojo",
        "• Water type: Best trained in Water Temple",
        "Training in matching type grounds gives 2x XP bonus!"
      ]
    }
  ];

  return (
    <div className="py-20 max-w-7xl mx-auto pt-36 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black inline-block bg-[#FFD93D] border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          GAME DOCUMENTATION
        </h1>
      </div>

      {/* Documentation Sections */}
      <div className="space-y-8">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <h2 className="text-2xl font-black mb-4 inline-block bg-[#4ECDC4] border-4 border-black p-2">
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.content.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index * 0.1) + (i * 0.05) }}
                  className="font-bold text-lg"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Additional Notes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-xl font-bold">
          More features coming soon! Stay tuned for updates.
        </p>
      </motion.div>
    </div>
  );
};

export default Documentation; 