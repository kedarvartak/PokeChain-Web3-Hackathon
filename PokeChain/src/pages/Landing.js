
import { motion } from 'framer-motion';
import { SparklesIcon, BoltIcon, CubeIcon } from '@heroicons/react/24/solid';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { WalletProvider } from '../context/WalletContext';

const FEATURED_POKEMON = [
  {
    id: 3,
    name: "Venusaur",
    
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png"
  },
  {
    id: 6,
    name: "Charizard",
    
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
  },
  {
    id: 9,
    name: "Blastoise",
    
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png"
  }
];

function Landing() {
  return (
    <WalletProvider>
    <div className="min-h-screen bg-[#FFF3E4]">
      <Navbar />
      {/* Hero Section */}
      <div className="relative pt-36 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Hero Content */}
          <div className="text-center space-y-8 mb-16">
            <h1 className="text-7xl md:text-8xl font-black text-black tracking-tight relative">
              <span className="relative inline-block">
                TRAIN.
                <div className="absolute inset-0 bg-[#FF6B6B] -rotate-2 -z-10"></div>
              </span>{' '}
              <span className="relative inline-block">
                STAKE.
                <div className="absolute inset-0 bg-[#4ECDC4] rotate-1 -z-10"></div>
              </span>{' '}
              <span className="relative inline-block">
                EARN.
                <div className="absolute inset-0 bg-[#FFD93D] -rotate-1 -z-10"></div>
              </span>
            </h1>
            <p className="text-2xl font-bold text-black max-w-3xl mx-auto">
              The first idle Pokemon game on the blockchain where you can actually make money while sleeping! 
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button 
                whileHover={{ scale: 1.02, rotate: -1 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-[#FF6B6B] text-white text-xl font-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
              >
                START PLAYING NOW
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, rotate: 1 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-[#4ECDC4] text-white text-xl font-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
              >
                LEARN MORE
              </motion.button>
            </div>
          </div>

          
          {/* Featured Pokemon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {FEATURED_POKEMON.map((pokemon, index) => (
          <motion.div
            key={pokemon.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <img 
              src={pokemon.image} 
              alt={pokemon.name}
              className="w-48 h-48 mx-auto mb-4 object-contain"
            />
            <h2 className="text-2xl font-black text-center mb-2">{pokemon.name}</h2>
            
          </motion.div>
        ))}
      </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-[#4ECDC4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-black text-center mb-16 text-white">
            HOW IT WORKS
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <SparklesIcon className="w-12 h-12" />,
                title: "TRAIN POKEMON",
                desc: "Stake your Pokemon in training grounds to earn experience and tokens automatically!"
              },
              {
                icon: <BoltIcon className="w-12 h-12" />,
                title: "BATTLE & EARN",
                desc: "Challenge other trainers in battles to earn additional rewards and climb the ranks!"
              },
              {
                icon: <CubeIcon className="w-12 h-12" />,
                title: "COLLECT & TRADE",
                desc: "Use your earned tokens to collect rare Pokemon and trade with other players!"
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ rotate: idx % 2 === 0 ? -2 : 2 }}
                className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="bg-[#FFD93D] border-4 border-black p-4 w-fit mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                <p className="text-lg font-bold">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#FF6B6B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "100K+", label: "ACTIVE TRAINERS" },
              { number: "1M+", label: "POKEMON TRAINED" },
              { number: "500K", label: "DAILY BATTLES" },
              { number: "10M+", label: "TOKENS EARNED" }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ rotate: -2, scale: 1.05 }}
                className="bg-white border-4 border-black p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              >
                <h3 className="text-4xl font-black mb-2">{stat.number}</h3>
                <p className="font-bold text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#FFD93D]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white border-4 border-black p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-4xl font-black mb-6">READY TO START YOUR JOURNEY?</h2>
            <p className="text-xl font-bold mb-8">
              Join thousands of trainers already earning tokens in the Pokechain universe!
            </p>
            <motion.button 
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-[#FF6B6B] text-white text-2xl font-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
            >
              LAUNCH APP →
            </motion.button>
          </div>
        </div>
      </section>
      
    </div>
    </WalletProvider>
  );
}

export default Landing;