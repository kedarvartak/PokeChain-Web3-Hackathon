import React from 'react';
import { usePokeCoin } from '../context/PokeCoinContext';
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';

const CoinBalance = () => {
  const { balance } = usePokeCoin();

  return (
    <div className="flex items-center gap-2 bg-[#FFD93D] border-4 border-black px-4 py-2 
                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none 
                    hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
      <CurrencyDollarIcon className="w-6 h-6" />
      <span className="font-black">{parseFloat(balance).toFixed(0)} PKC</span>
    </div>
  );
};

export default CoinBalance; 