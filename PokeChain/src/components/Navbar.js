// components/Navbar.js
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon, 
  HomeIcon, 
  ShoppingBagIcon, 
  UserIcon, 
  DocumentTextIcon,
  SparklesIcon,
  ComputerDesktopIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/solid';
import { useWallet } from '../context/WalletContext'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected, address, connectWallet, error } = useWallet(); 

  const menuItems = [
    { 
      name: 'HOME', 
      icon: <HomeIcon className="w-5 h-5" />, 
      to: '/',
      color: 'hover:bg-yellow-200'
    },
    { 
      name: 'MARKETPLACE', 
      icon: <ShoppingBagIcon className="w-5 h-5" />, 
      to: '/marketplace',
      color: 'hover:bg-pink-200'
    },
    { 
      name: 'TRAINING', 
      icon: <SparklesIcon className="w-5 h-5" />, 
      to: '/training',
      color: 'hover:bg-purple-200'
    },
    { 
      name: 'EMULATOR', 
      icon: <ComputerDesktopIcon className="w-5 h-5" />, 
      to: '/game',
      color: 'bg-[#4ECDC4] hover:bg-[#45b8b0]'
    },
    { 
      name: 'TRADING', 
      icon: <ArrowsRightLeftIcon className="w-5 h-5" />, 
      to: '/trading',
      color: 'hover:bg-green-200'
    },
    { 
      name: 'PROFILE', 
      icon: <UserIcon className="w-5 h-5" />, 
      to: '/profile',
      color: 'hover:bg-blue-200'
    },
    
  ];

  // Format address for display
  const formatAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };


  return (
    <nav className="fixed w-full z-50 top-0 left-0">
      {/* Desktop Navbar */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] m-4">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            
            {/* Logo */}
            <Link 
              to="/" 
              className="text-2xl font-black bg-black text-white px-4 py-2 
                        border-4 border-black transform hover:-translate-y-1 
                        transition-transform duration-200"
            >
              POKECHAIN
            </Link>

            {/* Desktop Menu Items */}
            <div className="hidden lg:flex items-center gap-2">
              {menuItems.map((item) => (
                <motion.div key={item.name}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-2 font-black px-3 py-2 
                              ${item.color}
                              border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                              hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                              transition-all duration-200 text-xs`}
                  >
                    <div className="bg-white p-1 border-2 border-black rounded-sm">
                      {item.icon}
                    </div>
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Wallet Section */}
            <div className="hidden lg:flex items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                className="px-4 py-2 bg-[#4ECDC4] text-black font-black 
                          border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                          hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                          transition-all duration-200 min-w-[160px]"
              >
                {isConnected ? formatAddress(address) : 'CONNECT WALLET'}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 ${isOpen ? 'bg-[#FF6B6B]' : 'bg-[#4ECDC4]'} 
                          border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                          hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]`}
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="lg:hidden bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
                  m-4 mt-0 overflow-hidden"
      >
        <div className="px-4 py-4 space-y-3">
          {menuItems.map((item) => (
            <motion.div key={item.name}>
              <Link
                to={item.to}
                className={`flex items-center space-x-3 font-black p-3 
                          ${item.color} border-4 border-black 
                          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                          hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                          transition-all duration-200`}
                onClick={() => setIsOpen(false)}
              >
                <div className="bg-white p-2 border-2 border-black rounded-sm">
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </Link>
            </motion.div>
          ))}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={connectWallet}
            className="w-full px-6 py-4 bg-[#4ECDC4] text-black font-black 
                      border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                      hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                      transition-all duration-200"
          >
            {isConnected ? formatAddress(address) : 'CONNECT WALLET'}
          </motion.button>
        </div>
      </motion.div>

      {/* Error Toast */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-[#FF6B6B] text-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <p className="font-bold">{error}</p>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;