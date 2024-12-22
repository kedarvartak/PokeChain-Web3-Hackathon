import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { pokeCoinService } from '../services/PokeCoinService';

const PokeCoinContext = createContext();

export function PokeCoinProvider({ children }) {
    const [balance, setBalance] = useState(0);
    const { address, isConnected } = useWallet();

    const updateBalance = async () => {
        if (isConnected && address) {
            try {
                const newBalance = await pokeCoinService.getBalance(address);
                setBalance(newBalance);
            } catch (error) {
                console.error('Error updating PokeCoin balance:', error);
            }
        }
    };

    useEffect(() => {
        updateBalance();
    }, [address, isConnected]);

    return (
        <PokeCoinContext.Provider value={{ balance, updateBalance }}>
            {children}
        </PokeCoinContext.Provider>
    );
}

export function usePokeCoin() {
    return useContext(PokeCoinContext);
} 