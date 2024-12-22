import React from 'react';
import { motion } from 'framer-motion';
import { useMarketplace } from '../context/MarketplaceContext';
import { useWallet } from '../context/WalletContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ITEM_IMAGES = {
  1: 'https://th.bing.com/th/id/R.e13a75441ac5cafa8958df98b468aa33?rik=PONwbAhfjp2z4w&riu=http%3a%2f%2fi.imgur.com%2fyE9HXfi.png&ehk=GE9Gfl3TOKrHnK3Qx91TcNIjIOfoBqg4PkAB6MXyTuQ%3d&risl=&pid=ImgRaw&r=0',
  2: 'https://th.bing.com/th/id/R.e13a75441ac5cafa8958df98b468aa33?rik=PONwbAhfjp2z4w&riu=http%3a%2f%2fi.imgur.com%2fyE9HXfi.png&ehk=GE9Gfl3TOKrHnK3Qx91TcNIjIOfoBqg4PkAB6MXyTuQ%3d&risl=&pid=ImgRaw&r=0',
  3: 'https://th.bing.com/th/id/R.e13a75441ac5cafa8958df98b468aa33?rik=PONwbAhfjp2z4w&riu=http%3a%2f%2fi.imgur.com%2fyE9HXfi.png&ehk=GE9Gfl3TOKrHnK3Qx91TcNIjIOfoBqg4PkAB6MXyTuQ%3d&risl=&pid=ImgRaw&r=0',
  4: 'https://th.bing.com/th/id/R.e13a75441ac5cafa8958df98b468aa33?rik=PONwbAhfjp2z4w&riu=http%3a%2f%2fi.imgur.com%2fyE9HXfi.png&ehk=GE9Gfl3TOKrHnK3Qx91TcNIjIOfoBqg4PkAB6MXyTuQ%3d&risl=&pid=ImgRaw&r=0',
  coin: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/coin-case.png'
};

const POKECOINS = [
  { id: 5, name: "100 PokéCoins", amount: 100, price: "0.001", type: "currency" },
  { id: 6, name: "500 PokéCoins", amount: 500, price: "0.004", type: "currency" },
  { id: 7, name: "1000 PokéCoins", amount: 1000, price: "0.007", type: "currency" },
  { id: 8, name: "5000 PokéCoins", amount: 5000, price: "0.03", type: "currency" }
];

const Marketplace = () => {
  const { items, loading, error, purchaseItem } = useMarketplace();
  const { isConnected } = useWallet();

  // Combine contract items with POKECOINS
  const pokeCoins = POKECOINS.map(coin => {
    // Find matching item from contract state
    const contractItem = items.find(item => item.id === coin.id);
    return {
      ...coin,
      // Use contract availability if available, otherwise default to true
      isAvailable: contractItem ? contractItem.isAvailable : true
    };
  });

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-36 py-12 text-center">
        <h2 className="text-2xl font-black mb-4">Please connect your wallet to access the marketplace</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
        <LoadingSpinner text="PROCESSING TRANSACTION" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-36 py-12 text-center">
        <h2 className="text-2xl font-black mb-4 text-red-500">Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-black bg-yellow-400 inline-block px-8 py-4 
                      border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            POKÉ MART
          </h1>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-black bg-blue-400 inline-block px-6 py-3 
                       border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
            POKÉ COINS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.slice(0, 4).map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              >
                <img
                  src={ITEM_IMAGES[item.id]}
                  alt={item.name}
                  className="w-32 h-32 mx-auto mb-4 object-contain"
                />
                <h3 className="text-xl font-black text-center mb-2">PokeCoins</h3>
                
                <p className="text-center font-bold mb-4">{item.price} ETH</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => purchaseItem(item.id, 1)}
                  disabled={!item.isAvailable || loading}
                  className="w-full px-4 py-2 bg-[#4ECDC4] text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:opacity-50"
                >
                  {loading ? 'PURCHASING...' : 'BUY NOW'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 
                      flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-8 rounded-lg 
                        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full">
            <LoadingSpinner text="PROCESSING TRANSACTION" />
            <p className="text-center mt-4 font-bold text-gray-600">
              Please confirm in your wallet
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace; 