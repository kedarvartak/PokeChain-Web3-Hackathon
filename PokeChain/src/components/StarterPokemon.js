// components/StarterPokemon.js
import { motion } from 'framer-motion';
import { usePokemon } from '../context/PokemonContext';

const StarterPokemon = () => {
  const { starterPokemon, selectStarterPokemon, loading } = usePokemon();

  return (
    <div className="max-w-4xl mx-auto px-4 mt-36 py-12">
      <h2 className="text-4xl font-black text-center mb-12">
        <span className="bg-[#4ECDC4] border-4 border-black p-4 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          CHOOSE YOUR STARTER POKEMON!
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {starterPokemon.map((pokemon) => (
          <motion.div
            key={pokemon.id}
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-full h-48 object-contain mb-4"
            />
            <h3 className="text-2xl font-black text-center mb-2">
              {pokemon.name}
            </h3>
            <p className="text-center font-bold mb-4">Type: {pokemon.type}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectStarterPokemon(pokemon.id)}
              disabled={loading}
              className="w-full px-4 py-2 bg-[#4ECDC4] text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:opacity-50"
            >
              {loading ? 'SELECTING...' : 'I CHOOSE YOU!'}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StarterPokemon;