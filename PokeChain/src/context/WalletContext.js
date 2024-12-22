// src/context/WalletContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [address, setAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            
            setProvider(provider);
            setSigner(signer);
            setAddress(address);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        setProvider(provider);
        setSigner(signer);
        setAddress(address);
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        throw error;
      }
    } else {
      throw new Error('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAddress('');
    setSigner(null);
    setProvider(null);
    setIsConnected(false);
  };

  return (
    <WalletContext.Provider 
      value={{
        address,
        isConnected,
        signer,
        provider,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}