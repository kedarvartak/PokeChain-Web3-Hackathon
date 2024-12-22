import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { useWallet } from './WalletContext';
import PokemonItemsJson from '../artifacts/contracts/PokemonItems.sol/PokemonItems.json';

const ITEMS_CONTRACT_ADDRESS = '0x04F339eC4D75Cf2833069e6e61b60eF56461CD7C';

export const POKECOINS = [
    { id: 5, name: "100 PokéCoins", amount: 100, price: "0.001", type: "currency", isAvailable: true },
    { id: 6, name: "500 PokéCoins", amount: 500, price: "0.004", type: "currency", isAvailable: true },
    { id: 7, name: "1000 PokéCoins", amount: 1000, price: "0.007", type: "currency", isAvailable: true },
    { id: 8, name: "5000 PokéCoins", amount: 5000, price: "0.03", type: "currency", isAvailable: true }
];

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { provider, isConnected, address } = useWallet();

    // Get contract instance
    const getContract = async (withSigner = false) => {
        if (!window.ethereum) throw new Error('Please install MetaMask');
        if (!isConnected) throw new Error('Please connect your wallet');

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(
                ITEMS_CONTRACT_ADDRESS,
                PokemonItemsJson.abi,
                provider
            );

            if (withSigner) {
                const signer = await provider.getSigner();
                return contract.connect(signer);
            }

            return contract;
        } catch (error) {
            console.error('Error getting contract:', error);
            throw new Error('Failed to connect to contract');
        }
    };

    // Fetch available items
    const fetchItems = async () => {
        try {
            if (!isConnected) return;

            const contract = await getContract();
            const itemCount = 8; // Include both Pokeballs and PokéCoins
            const itemsData = [];

            for (let i = 1; i <= itemCount; i++) {
                try {
                    const item = await contract.items(i);
                    const isPokeCoins = i >= 5; // IDs 5-8 are PokéCoins
                    
                    itemsData.push({
                        id: i,
                        name: item.name,
                        type: item.itemType,
                        price: ethers.formatEther(item.price),
                        isAvailable: item.isAvailable,
                        amount: isPokeCoins ? item.amount : 1
                    });
                } catch (error) {
                    console.warn(`Failed to fetch item ${i}:`, error);
                }
            }

            setItems(itemsData);
        } catch (error) {
            console.error('Error fetching items:', error);
            setError('Failed to fetch items');
        }
    };

    // Purchase item function
    const purchaseItem = async (itemId, amount) => {
        try {
            setLoading(true);
            
            if (!isConnected) {
                throw new Error('Please connect your wallet first');
            }

            const contract = await getContract(true);
            
            // Get item details and check availability
            const itemOnChain = await contract.items(itemId);
            if (!itemOnChain.isAvailable) {
                throw new Error('This item is currently not available');
            }

            // Get item price and details
            const item = items.find(i => i.id === itemId) || POKECOINS.find(c => c.id === itemId);
            if (!item) throw new Error('Item not found');

            // Calculate total price using ethers.parseEther and ethers.getBigInt
            const pricePerItem = ethers.parseEther(item.price.toString());
            const totalPrice = pricePerItem * ethers.getBigInt(amount);
            
            console.log('Purchase details:', {
                itemId,
                amount,
                price: totalPrice.toString(),
                isAvailable: itemOnChain.isAvailable
            });

            // Purchase the item with the calculated total price
            const tx = await contract.mintItem(itemId, amount, {
                value: totalPrice
            });

            await tx.wait();
            
            toast.success(`Successfully purchased ${item.name}!`);
            await fetchItems();
        } catch (error) {
            console.error('Error purchasing item:', error);
            const errorMessage = error.reason || error.message || 'Failed to purchase item';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch when wallet is connected
    useEffect(() => {
        if (isConnected) {
            fetchItems();
        }
    }, [isConnected]);

    return (
        <MarketplaceContext.Provider value={{
            items,
            loading,
            error,
            purchaseItem,
            POKECOINS
        }}>
            {children}
        </MarketplaceContext.Provider>
    );
};

export const useMarketplace = () => {
    const context = useContext(MarketplaceContext);
    if (!context) {
        throw new Error('useMarketplace must be used within a MarketplaceProvider');
    }
    return context;
}; 