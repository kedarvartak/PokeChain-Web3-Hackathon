import { ethers } from 'ethers';
import PokemonTradingJson from '../artifacts/contracts/PokemonContract.sol/PokemonTrading.json';
class TradingService {
   constructor(provider) {
       this.provider = provider;
       this.contractAddress = '0x44863F234b137A395e5c98359d16057A9A1fAc55';
       this.abi = PokemonTradingJson.abi;
   }
    async getContract(needSigner = false) {
       try {
           const provider = new ethers.BrowserProvider(this.provider);
           
           let signer = null;
           if (needSigner) {
               signer = await provider.getSigner();
           }
           
           const contract = new ethers.Contract(
               this.contractAddress,
               this.abi,
               needSigner ? signer : provider
           );
           
           // Verify contract setup
           const pokemonContractAddress = await contract.pokemonContract();
           console.log('Contract setup:', {
               tradingContract: this.contractAddress,
               pokemonContract: pokemonContractAddress,
               signer: signer ? await signer.getAddress() : null
           });
           
           // Verify the Pokemon contract address is correct
           if (pokemonContractAddress === ethers.ZeroAddress) {
               throw new Error('Pokemon contract not properly initialized');
           }
           
           return { contract, signer };
       } catch (error) {
           console.error('Error getting contract:', error);
           throw new Error(`Failed to initialize trading contract: ${error.message}`);
       }
   }

   

   async createTradeOffer(pokemonId, recipientAddress, requestedPokemonId) {
    try {
        const { contract, signer } = await this.getContract(true);
        
        if (!signer) {
            throw new Error('No signer available');
        }
        
        const signerAddress = await signer.getAddress();
        console.log('Verifying ownership for:', {
            pokemonId,
            signerAddress
        });
        
        // Get Pokemon contract address
        const pokemonContract = await contract.pokemonContract();
        console.log('Pokemon contract address:', pokemonContract);

        // Create Pokemon contract instance with ERC721 ABI
        const pokemonContractInstance = new ethers.Contract(
            pokemonContract,
            [
                'function ownerOf(uint256 tokenId) view returns (address)',
                'function isApprovedForAll(address owner, address operator) view returns (bool)',
                'function tokenURI(uint256 tokenId) view returns (string)'
            ],
            signer
        );

        // Check ownership using ownerOf
        try {
            const owner = await pokemonContractInstance.ownerOf(pokemonId);
            console.log('Pokemon ownership:', {
                pokemonId,
                owner,
                signerAddress,
                matches: owner.toLowerCase() === signerAddress.toLowerCase()
            });

            if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
                throw new Error(`You do not own Pokemon #${pokemonId}`);
            }
        } catch (error) {
            console.error('Ownership verification failed:', error);
            throw new Error(`Failed to verify ownership of Pokemon #${pokemonId}: ${error.message}`);
        }
        
        // Check if trading contract is approved
        try {
            const isApproved = await pokemonContractInstance.isApprovedForAll(
                signerAddress,
                this.contractAddress
            );
            if (!isApproved) {
                throw new Error('Trading contract not approved to handle your Pokemon');
            }
        } catch (error) {
            throw new Error('Failed to check trading approval');
        }
        
        console.log("Creating trade offer with params:", {
            pokemonId,
            recipientAddress,
            requestedPokemonId,
            sender: signerAddress
        });
        
        // Add gas limit to avoid estimation issues
        const tx = await contract.createTradeOffer(
            pokemonId,
            recipientAddress,
            requestedPokemonId,
            {
                gasLimit: 300000
            }
        );
        
        console.log("Trade offer transaction:", tx.hash);
        return tx;
    } catch (error) {
        console.error("Error creating trade offer:", error);
        throw error;
    }
}
    async getActiveTradeOffers() {
       try {
           const { contract } = await this.getContract();
           
           // Try to get the length of tradeOffers array first
           try {
               const firstOffer = await contract.tradeOffers(0);
               console.log('First trade offer exists:', firstOffer);
           } catch (error) {
               console.log('No trade offers exist yet');
           }
            console.log('Calling getActiveTradeOffers...');
           const offers = await contract.getActiveTradeOffers();
           console.log('Received offers:', offers);
           return offers;
       } catch (error) {
           console.error('Error fetching trade offers:', error);
           // Return empty array instead of throwing
           return [];
       }
   }
}

export const tradingService = new TradingService(window.ethereum);