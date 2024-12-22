// src/services/wallet.js
import { ethers, BrowserProvider } from 'ethers';
import { InjectedConnector } from '@web3-react/injected-connector';

// Configure the connector
export const injected = new InjectedConnector({
  supportedChainIds: [59491], // 1 is mainnet, 5 is goerli testnet
});

export const walletService = {
  // Connect wallet
  connect: async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        return {
          provider,
          signer,
          address,
        };
      } catch (error) {
        console.error('User rejected connection:', error);
        throw error;
      }
    } else {
      throw new Error('Please install MetaMask!');
    }
  },

  // Get current wallet status
  getWalletStatus: async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      return accounts.length > 0;
    }
    return false;
  },

  // Get current chain ID
  getChainId: async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      return network.chainId;
    }
    return null;
  }
};