// src/services/PokeService.js
import { ethers } from 'ethers';
import PokemonNFT from '../artifacts/contracts/PokeContract.sol/PokemonNFT.json';
import  asset  from '../assets/POKEIMG.png';

// Add hardcoded starter Pokemon data
const STARTER_POKEMON = {
  1: {
    id: 1,
    name: 'Bulbasaur',
    type: 'Grass',
    level: 5,
    xp: 0,
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
  },
  4: {
    id: 4,
    name: 'Charmander',
    type: 'Fire',
    level: 5,
    xp: 0,
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'
  },
  7: {
    id: 7,
    name: 'Squirtle',
    type: 'Water',
    level: 5,
    xp: 0,
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png'
  }
};

class PokeService {
  constructor(provider) {
    this.provider = provider;
    this.contractAddress = '0xAe2563b4315469bF6bdD41A6ea26157dE57Ed94e'; // Your PokemonNFT address
  }

  async getContract(needSigner = false) {
    try {
      console.log('Getting contract with address:', this.contractAddress);
      
      const provider = new ethers.BrowserProvider(this.provider);
      let signer = null;
      
      if (needSigner) {
        signer = await provider.getSigner();
        console.log('Got signer:', await signer.getAddress());
      }
      
      const contract = new ethers.Contract(
        this.contractAddress,
        PokemonNFT.abi,
        needSigner ? signer : provider
      );

      // Basic contract validation
      if (!contract.interface) {
        throw new Error('Invalid contract interface');
      }

      return { contract, signer };
    } catch (error) {
      console.error('Error getting contract:', error);
      throw new Error('Failed to initialize contract: ' + error.message);
    }
  }


  async isNewUser(address) {
    try {
      const { contract } = await this.getContract();
      const result = !(await contract.hasStarterPokemon(address));
      console.log("isNewUser check for", address, ":", result);
      return result;
    } catch (error) {
      console.error('Error checking if new user:', error);
      throw error;
    }
  }

  async getPokemonData(pokemonId) {
    try {
      const { contract } = await this.getContract();
      console.log(`Getting data for Pokemon ${pokemonId}`);
      
      const data = await contract.getPokemonData(ethers.getBigInt(pokemonId));
      console.log('Pokemon data:', data);
      
      return {
        name: data.name,
        type: data.pokemonType,
        level: Number(data.level),
        xp: Number(data.xp),
        isTraining: data.isTraining || false,
        trainingStartTime: Number(data.trainingStartTime) || 0,
        trainingGroundId: Number(data.trainingGroundId) || 0
      };
    } catch (error) {
      console.error(`Error getting Pokemon ${pokemonId} data:`, error);
      throw error;
    }
  }

  async getUserPokemon() {
    try {
      const { contract, signer } = await this.getContract(true);
      if (!signer) {
        throw new Error('No signer available');
      }

      const address = await signer.getAddress();
      console.log("Getting Pokemon for address:", address);

      // Check if user is new
      const isNewUser = await this.isNewUser(address);
      
      if (isNewUser) {
        // Return hardcoded starter Pokemon data for new users
        return [STARTER_POKEMON[1], STARTER_POKEMON[4], STARTER_POKEMON[7]];
      }
      
      // For existing users, fetch from API
      let nftDetails = new Map();
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `http://192.168.218.68:8000/balance/${address}`,
          {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const apiData = await response.json();
          nftDetails = new Map(
            apiData.nfts.map(nft => [nft.pokemon_id, nft])
          );
          console.log("API Data fetched successfully:", apiData);
        } else {
          console.warn(`API request failed with status ${response.status}`);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn("API request timed out after 5 seconds");
        } else {
          console.warn("API request failed:", error.message);
        }
      }
      
      // Continue with contract data for existing users
      const pokemons = [];
      
      for (let i = 1; i <= 10; i++) {
        try {
          const checksumAddress = ethers.getAddress(address);
          const balance = await contract.balanceOf(checksumAddress, i);
          
          if (balance > 0) {
            const data = await contract.getPokemonData(i);
            const apiPokemonData = nftDetails.get(i);
            
            pokemons.push({
              id: i,
              name: apiPokemonData?.pokemon_name || data[0],
              type: apiPokemonData?.pokemon_type || data[1],
              level: parseInt(data[2]),
              xp: Number(data[3]) || 0,
              balance: parseInt(balance),
              imageUrl: apiPokemonData?.nft_image_location ? 
                      `http://192.168.218.68:8000${apiPokemonData.nft_image_location}` :
                      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`,
              uuid: apiPokemonData?.uuid || null
            });
          }
        } catch (error) {
          console.error(`Error checking Pokemon ${i}:`, error);
          continue;
        }
      }
      console.log("VARTAKKKKKKK ", pokemons);
      console.log("Final formatted Pokemon data:", pokemons);
      return pokemons;
    } catch (error) {
      console.error('Error getting user Pokemon:', error);
      throw error;
    }
  }

  async startTraining(pokemonId, groundId) {
    try {
      console.log('Starting training with params:', { pokemonId, groundId });
      
      const { contract, signer } = await this.getContract(true);
      const address = await signer.getAddress();
      
      console.log('Contract address:', this.contractAddress);
      console.log('Signer address:', address);
      
      // First check if Pokemon can start training
      const balance = await contract.balanceOf(address, ethers.getBigInt(pokemonId));
      console.log('Pokemon balance:', balance.toString());
      if (balance === 0) {
        throw new Error('You do not own this Pokemon');
      }

      // Check if Pokemon is already training
      const pokemonData = await contract.getPokemonData(ethers.getBigInt(pokemonId));
      console.log('Pokemon data:', pokemonData);
      if (pokemonData.isTraining) {
        throw new Error('Pokemon is already training');
      }

      // Get training ground cost
      const trainingGround = await contract.getTrainingGround(ethers.getBigInt(groundId));
      console.log('Training ground:', trainingGround);
      
      // Estimate gas with higher limit
      const gasEstimate = await contract.startTraining.estimateGas(
        ethers.getBigInt(pokemonId),
        ethers.getBigInt(groundId),
        { gasLimit: 500000 }
      );
      console.log('Gas estimate:', gasEstimate.toString());

      // Add 20% buffer to gas estimate
      const gasLimit = gasEstimate * 120n / 100n;

      // Send transaction with explicit parameters
      const tx = await contract.startTraining(
        ethers.getBigInt(pokemonId),
        ethers.getBigInt(groundId),
        {
          from: address,
          gasLimit: gasLimit,
        }
      );
      console.log('Transaction sent:', tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      if (receipt.status === 0) {
        throw new Error('Transaction failed');
      }

      return receipt;
    } catch (error) {
      console.error('Training error:', error);
      
      if (error.message.includes('insufficient funds')) {
        throw new Error('Insufficient PokeCoin balance for training');
      }
      if (error.message.includes('user rejected')) {
        throw new Error('Transaction was rejected');
      }
      
      throw new Error('Failed to start training: ' + error.message);
    }
  }

  async mintStarterPokemon(pokemonId) {
    try {
      console.log('Minting starter Pokemon with ID:', pokemonId);
      
      const { contract, signer } = await this.getContract(true);
      const address = await signer.getAddress();
      
      // Check if user already has a starter
      const hasStarter = await contract.hasStarterPokemon(address);
      if (hasStarter) {
        throw new Error('You already have a starter Pokemon');
      }

      // Fetch available Pokemon from API
      const response = await fetch(`http://192.168.218.68:8000/balance/${address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch available Pokemon');
      }
      const data = await response.json();
      
      // Extract available Pokemon IDs
      const availablePokemonIds = data.nfts.map(nft => nft.pokemon_id);
      
      // Verify valid starter Pokemon ID from available options
      if (!availablePokemonIds.includes(Number(pokemonId))) {
        throw new Error('Invalid starter Pokemon ID - not available for this address');
      }

      console.log('Sending mint transaction...');
      const tx = await contract.mintStarterPokemon(
        ethers.getBigInt(pokemonId),
        {
          gasLimit: 300000
        }
      );
      
      console.log('Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      
      if (receipt.status === 0) {
        throw new Error('Transaction failed');
      }

      console.log('Starter Pokemon minted successfully!');
      return receipt;
    } catch (error) {
      console.error('Error in mintStarterPokemon:', error);
      if (error.message.includes('You already have a starter')) {
        throw new Error('You already have a starter Pokemon');
      }
      if (error.message.includes('Invalid starter')) {
        throw new Error('Invalid starter Pokemon selection');
      }
      throw new Error('Failed to mint starter Pokemon: ' + error.message);
    }
  }

  async getCurrentTrainingXP(pokemonId) {
    try {
      const { contract } = await this.getContract();
      
      // Get Pokemon data from contract
      const pokemon = await contract.pokemonData(ethers.getBigInt(pokemonId));
      
      if (!pokemon.isTraining) {
        return pokemon.xp;
      }

      // Calculate current XP based on contract values
      const currentTime = Math.floor(Date.now() / 1000);
      const trainingTime = currentTime - Number(pokemon.trainingStartTime);
      const minutesSpent = Math.floor(trainingTime / 60);
      
      // Use contract constants for calculations
      const XP_PER_MINUTE = await contract.XP_PER_MINUTE();
      const TYPE_BONUS_MULTIPLIER = await contract.TYPE_BONUS_MULTIPLIER();
      
      let baseXP = Number(pokemon.xp) + (minutesSpent * Number(XP_PER_MINUTE));
      
      // Check if type bonus applies
      const groundId = Number(pokemon.trainingGroundId);
      if (groundId > 0) {
        const ground = await contract.trainingGrounds(groundId);
        if (pokemon.pokemonType === ground.requiredType) {
          baseXP = Math.floor((baseXP * Number(TYPE_BONUS_MULTIPLIER)) / 100);
        }
      }

      return baseXP;
    } catch (error) {
      console.error('Error getting current training XP:', error);
      throw error;
    }
  }

  async endTraining(pokemonId) {
    let contract;
    try {
      const { contract: contractInstance, signer } = await this.getContract(true);
      contract = contractInstance;
      
      console.log('Checking if training can be completed for Pokemon:', pokemonId);
      
      // Check if we can complete training
      const [canComplete, reason] = await contract.canCompleteTraining(ethers.getBigInt(pokemonId));
      console.log('Can complete training?', canComplete, reason);
      
      if (!canComplete) {
        throw new Error(reason);
      }

      // Call completeTraining
      const tx = await contract.completeTraining(
        ethers.getBigInt(pokemonId),
        {
          gasLimit: ethers.getBigInt(300000)
        }
      );

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);

      if (receipt.status === 0) {
        throw new Error('Transaction failed');
      }

      // Get the TrainingCompleted event from the receipt
      const event = receipt.logs
        .map(log => {
          try {
            return contract.interface.parseLog({
              topics: log.topics,
              data: log.data
            });
          } catch (e) {
            console.error('Failed to parse log:', e);
            return null;
          }
        })
        .find(event => event && event.name === 'TrainingCompleted');

      if (!event) {
        throw new Error('Training completion event not found');
      }

      return {
        xpGained: Number(event.args.xpGained)
      };
    } catch (error) {
      console.error('Error completing training:', error);
      throw error;
    }
  }

  async getAvailableStarterPokemon() {
    try {
        const { signer } = await this.getContract(true);
        const address = await signer.getAddress();
        
        // Fetch API data
        const response = await fetch(`http://localhost:8000/balance/${address}`);
        if (!response.ok) {
            throw new Error('Failed to fetch available Pokemon');
        }
        
        const data = await response.json();
        
        // Format the NFT data specifically for cards
        const starterPokemon = data.nfts.map(nft => ({
            id: nft.pokemon_id,
            name: nft.pokemon_name,
            type: nft.pokemon_type,
            imageUrl: nft.nft_image_location,
            uuid: nft.uuid
        }));
        
        console.log("Available starter Pokemon:", starterPokemon);
        return starterPokemon;
        
    } catch (error) {
        console.error('Error fetching available starter Pokemon:', error);
        throw error;
    }
  }
}

export const pokemonService = new PokeService(window.ethereum);