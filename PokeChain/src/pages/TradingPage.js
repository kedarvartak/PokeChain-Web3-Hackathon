import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { pokemonService } from '../services/PokeService';
import { tradingService } from '../services/TradingService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

const TradingPage = () => {
    const [userPokemons, setUserPokemons] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [recipientAddress, setRecipientAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [activeOffers, setActiveOffers] = useState([]);

    

    
    // Contract verification useEffect
    useEffect(() => {
        const verifyContract = async () => {
            try {
                // Check if contract exists at address
                const code = await window.ethereum.request({
                    method: 'eth_getCode',
                    params: [tradingService.contractAddress, 'latest']
                });
                
                console.log('Contract bytecode:', code);
                
                if (code === '0x' || code === '0x0') {
                    console.error('No contract at address:', tradingService.contractAddress);
                    toast.error('Trading contract not found at specified address');
                    return false;
                }
                
                // Try to get Pokemon contract address
                const { contract } = await tradingService.getContract();
                const pokemonAddress = await contract.pokemonContract();
                console.log('Pokemon contract address:', pokemonAddress);
                
                return true;
            } catch (error) {
                console.error('Contract verification error:', error);
                toast.error('Failed to verify contract');
                return false;
            }
        };

        verifyContract();
    }, []);

    const verifyNetwork = async () => {
        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            console.log('Current chain ID:', chainId);
            
            // Linea Sepolia chainId is 59141 (0xe705 in hex)
            if (chainId !== '0xe705') {
                toast.error('Please switch to Linea Sepolia');
                
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0xe705' }], // Changed from 0xe704
                    });
                } catch (switchError) {
                    // If the network isn't added, add it
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0xe705',
                                chainName: 'Linea Sepolia',
                                nativeCurrency: {
                                    name: 'ETH',
                                    symbol: 'ETH',
                                    decimals: 18
                                },
                                rpcUrls: ['https://rpc.sepolia.linea.build'],
                                blockExplorerUrls: ['https://sepolia.lineascan.build']
                            }]
                        });
                    }
                }
                return false;
            }
            return true;
        } catch (error) {
            console.error('Network verification error:', error);
            toast.error('Please connect to Linea Sepolia');
            return false;
        }
    };

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                toast.error('Please install MetaMask!');
                return;
            }

            // Verify network first
            const isCorrectNetwork = await verifyNetwork();
            if (!isCorrectNetwork) return;

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            if (accounts.length > 0) {
                setConnected(true);
                console.log('Connected account:', accounts[0]);
                
                // Add contract verification
                const { contract } = await tradingService.getContract();
                const pokemonContractAddress = await contract.pokemonContract();
                console.log('Trading contract verified. Pokemon contract:', pokemonContractAddress);
                
                await checkAndApproveTrading();
                await fetchUserPokemons();
                await fetchActiveOffers();
                
                toast.success('Wallet connected successfully!');
            }
        } catch (error) {
            console.error('Connection error:', error);
            toast.error('Failed to connect: ' + error.message);
            setConnected(false);
        }
    };

    const fetchUserPokemons = async () => {
        try {
            if (!window.ethereum) {
                toast.error('Please install MetaMask!');
                return;
            }
    
            console.log("Fetching Pokemon...");
            const userPokemon = await pokemonService.getUserPokemon();
            console.log("Fetched Pokemon data:", userPokemon);
            
            if (Array.isArray(userPokemon) && userPokemon.length > 0) {
                setUserPokemons(userPokemon);
                console.log("Updated userPokemons state:", userPokemon);
            } else {
                console.log("No Pokemon found or invalid data received");
                setUserPokemons([]);
            }
        } catch (error) {
            console.error('Error fetching user pokemons:', error);
            toast.error('Failed to fetch your Pokemons: ' + error.message);
            setUserPokemons([]);
        }
    };
    
    // Add this useEffect to monitor state changes
    useEffect(() => {
        console.log("userPokemons state updated:", userPokemons);
    }, [userPokemons]);

    const fetchActiveOffers = async () => {
        try {
            const offers = await tradingService.getActiveTradeOffers();
            console.log("Active offers:", offers);
            setActiveOffers(offers || []);
        } catch (error) {
            console.error('Error fetching active offers:', error);
            toast.error('Failed to fetch active trade offers');
        }
    };

    const checkAndApproveTrading = async () => {
        try {
            const { contract: pokemonContract, signer } = await pokemonService.getContract(true);
            
            if (!signer) {
                throw new Error('No signer available');
            }

            const address = await signer.getAddress();
            
            // Check current approval status
            const approved = await pokemonContract.isApprovedForAll(
                address,
                tradingService.contractAddress
            );
            
            console.log('Trading approval status:', {
                owner: address,
                operator: tradingService.contractAddress,
                isApproved: approved
            });

            if (!approved) {
                toast.info('Requesting approval for trading...');
                
                const tx = await pokemonContract.setApprovalForAll(
                    tradingService.contractAddress,
                    true,
                    { gasLimit: 100000 }
                );
                
                toast.info('Confirming approval...');
                await tx.wait();
                
                // Verify approval was successful
                const newApprovalStatus = await pokemonContract.isApprovedForAll(
                    address,
                    tradingService.contractAddress
                );
                
                if (!newApprovalStatus) {
                    throw new Error('Approval transaction failed');
                }
                
                setIsApproved(true);
                toast.success('Trading contract approved!');
            }
            
            return approved;
        } catch (error) {
            console.error('Approval error:', error);
            toast.error('Failed to approve trading contract: ' + error.message);
            setIsApproved(false);
            throw error;
        }
    };

    const handleTransfer = async () => {
        if (!selectedPokemon || !recipientAddress) {
            toast.error('Please select a Pokemon and enter recipient address');
            return;
        }

        if (!ethers.isAddress(recipientAddress)) {
            toast.error('Invalid recipient address');
            return;
        }

        try {
            setLoading(true);
            
            // Log the selected Pokemon details
            console.log('Attempting to transfer Pokemon:', {
                pokemon: selectedPokemon,
                recipient: recipientAddress
            });

            if (!isApproved) {
                console.log('Trading contract not approved, requesting approval...');
                await checkAndApproveTrading();
            }

            // Verify Pokemon ownership before attempting transfer
            const { contract: pokemonContract } = await pokemonService.getContract(true);
            const owner = await pokemonContract.ownerOf(selectedPokemon.id);
            const signer = await pokemonService.getSigner();
            const signerAddress = await signer.getAddress();

            console.log('Ownership verification:', {
                pokemonId: selectedPokemon.id,
                owner,
                signer: signerAddress,
                matches: owner.toLowerCase() === signerAddress.toLowerCase()
            });

            if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
                throw new Error(`You don't own Pokemon #${selectedPokemon.id}`);
            }

            console.log("Creating trade offer for:", {
                pokemonId: selectedPokemon.id,
                recipientAddress: recipientAddress
            });

            const tradeOffer = await tradingService.createTradeOffer(
                selectedPokemon.id,
                recipientAddress,
                0 // Requested Pokemon ID (0 for direct transfer)
            );

            toast.info('Trade offer created, waiting for confirmation...');
            console.log("Trade offer created:", tradeOffer);
            
            await tradeOffer.wait();
            
            setSelectedPokemon(null);
            setRecipientAddress('');
            await fetchUserPokemons();
            await fetchActiveOffers();
            
            toast.success('Trade offer created successfully!');
        } catch (error) {
            console.error('Transfer error details:', {
                error,
                selectedPokemon,
                recipientAddress,
                message: error.message
            });
            toast.error('Failed to create trade offer: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptOffer = async (offerId) => {
        try {
            setLoading(true);
            
            if (!isApproved) {
                await checkAndApproveTrading();
            }

            const tx = await tradingService.acceptTradeOffer(offerId);
            toast.info('Accepting trade offer...');
            await tx.wait();
            
            await fetchUserPokemons();
            await fetchActiveOffers();
            
            toast.success('Trade offer accepted successfully!');
        } catch (error) {
            console.error('Error accepting trade:', error);
            toast.error('Failed to accept trade: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOffer = async (offerId) => {
        try {
            setLoading(true);
            const tx = await tradingService.cancelTradeOffer(offerId);
            toast.info('Cancelling trade offer...');
            await tx.wait();
            
            await fetchActiveOffers();
            toast.success('Trade offer cancelled successfully!');
        } catch (error) {
            console.error('Error cancelling trade:', error);
            toast.error('Failed to cancel trade: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Wallet connection useEffect
    useEffect(() => {
        connectWallet();
        
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', () => {
                connectWallet();
            });
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="container mx-auto pt-36 px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 bg-yellow-300 p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                Pokemon Trading Center
            </h1>
            
            <div className="mb-8">
   <label className="block text-xl font-bold mb-4 bg-blue-300 p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
       Recipient Address
   </label>
   <div className="relative">
       <input
           type="text"
           value={recipientAddress}
           onChange={(e) => setRecipientAddress(e.target.value)}
           placeholder="Enter wallet address (0x...)"
           className="w-full p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                    font-mono text-lg transition-all duration-200
                    focus:translate-y-1 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                    focus:outline-none focus:ring-4 focus:ring-yellow-300
                    placeholder:text-gray-500"
       />
       <div className="mt-2 flex items-center space-x-2 px-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
           </svg>
           <span className="text-sm text-gray-600">
               This address will receive your Pokemon
           </span>
       </div>
            </div>
            </div>
            {!connected ? (
                <button
                    onClick={connectWallet}
                    className="mb-6 bg-blue-400 hover:bg-blue-500 text-black py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-lg transform hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                    Connect Wallet
                </button>
            ) : (
                <>
                    {/* Demo Trade Button */}
                    <button
                        onClick={handleTransfer}
                        className="mb-8 bg-green-400 hover:bg-green-500 text-black py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-lg flex items-center justify-center space-x-3 transform hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                        <span>Run Trade</span>
                        {loading && (
                            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                    </button>

                    {/* Your Pokemon */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 bg-purple-300 p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
                            Your Pokemon
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {userPokemons.map((pokemon) => (
                                <div
                                    key={pokemon.id}
                                    className={`p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer transform hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                                        selectedPokemon?.id === pokemon.id ? 'bg-blue-100' : ''
                                    }`}
                                    onClick={() => setSelectedPokemon(pokemon)}
                                >
                                    <h3 className="font-bold text-xl mb-2">{pokemon.name}</h3>
                                    <div className="space-y-1">
                                        <p className="font-medium">Type: {pokemon.type}</p>
                                        <p className="font-medium">Level: {pokemon.level}</p>
                                        <p className="text-sm text-gray-600">ID: #{pokemon.id}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trade History */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 bg-pink-300 p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
                            Recent Trades
                        </h2>
                        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
                            <div className="border-b-4 border-black pb-4 mb-4">
                                <h3 className="font-bold text-xl mb-4">Latest Trade</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-orange-100 p-4 border-4 border-black">
                                        <p className="font-bold">From</p>
                                        <p className="font-mono mt-2">0xF398...b0e1</p>
                                        <p className="mt-2 font-medium">Pokemon #1 (Bulbasaur)</p>
                                    </div>
                                    <div className="bg-green-100 p-4 border-4 border-black">
                                        <p className="font-bold">To</p>
                                        <p className="font-mono mt-2">0x7099...79C8</p>
                                        <p className="mt-2 font-medium">Pokemon #2 (Charmander)</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <span className="bg-green-300 px-4 py-1 border-2 border-black font-bold">
                                        Completed
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trading Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-blue-100 p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-xl font-bold mb-4 bg-blue-200 p-2 border-2 border-black inline-block">
                                Trade Details
                            </h2>
                            <div className="space-y-3">
                                <p><span className="font-bold">Account 1:</span> 0xF398...b0e1</p>
                                <p><span className="font-bold">Pokemon Offered:</span> #1 (Bulbasaur)</p>
                                <p><span className="font-bold">Account 2:</span> 0x7099...79C8</p>
                                <p><span className="font-bold">Pokemon Received:</span> #2 (Charmander)</p>
                            </div>
                        </div>

                        <div className="bg-green-100 p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-xl font-bold mb-4 bg-green-200 p-2 border-2 border-black inline-block">
                                Trade Status
                            </h2>
                            <div className="space-y-3">
                                <p><span className="font-bold">Status:</span> {loading ? 'Processing...' : 'Completed'}</p>
                                <p><span className="font-bold">Network:</span> Linea Testnet</p>
                                <p><span className="font-bold">Transaction Hash:</span> 0x123...abc</p>
                                <p><span className="font-bold">Gas Used:</span> 0.0001 ETH</p>
                            </div>
                        </div>
                    </div>

                    {/* Active Trade Offers */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 bg-yellow-300 p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
                            Active Trade Offers
                        </h2>
                        <div className="space-y-4">
                            {activeOffers.map((offer, index) => (
                                <div key={index} className="bg-white p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <p className="font-bold">From: {offer.creator}</p>
                                    <p className="mt-2">Pokemon ID: #{offer.pokemonId.toString()}</p>
                                    <p className="mt-2">Requested From: {offer.requestedPokemonOwner}</p>
                                    <p className="mt-2">Requested Pokemon ID: #{offer.requestedPokemonId.toString()}</p>
                                    <div className="mt-4 space-x-4">
                                        {offer.creator === window.ethereum.selectedAddress ? (
                                            <button
                                                onClick={() => handleCancelOffer(index)}
                                                className="bg-red-400 hover:bg-red-500 text-black py-2 px-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold transform hover:translate-y-1 hover:shadow-none transition-all"
                                            >
                                                Cancel Offer
                                            </button>
                                        ) : offer.requestedPokemonOwner === window.ethereum.selectedAddress && (
                                            <button
                                                onClick={() => handleAcceptOffer(index)}
                                                className="bg-green-400 hover:bg-green-500 text-black py-2 px-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold transform hover:translate-y-1 hover:shadow-none transition-all"
                                            >
                                                Accept Offer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {activeOffers.length === 0 && (
                                <p className="text-gray-600 bg-gray-100 p-4 border-4 border-black">No active trade offers</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TradingPage;