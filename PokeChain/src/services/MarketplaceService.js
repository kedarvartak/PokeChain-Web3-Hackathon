import { ethers } from 'ethers';
import PokemonItemsJson from '../artifacts/contracts/PokemonItems.sol/PokemonItems.json';

const PokemonItemsAbi = PokemonItemsJson.abi;
const ITEMS_CONTRACT_ADDRESS = '0xE2b5bDE7e80f89975f7229d78aD9259b2723d11F';

export const marketplaceService = {
  async getContract(withSigner = false) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      if (withSigner) {
        const signer = await provider.getSigner();
        return new ethers.Contract(ITEMS_CONTRACT_ADDRESS, PokemonItemsAbi, signer);
      }
      return new ethers.Contract(ITEMS_CONTRACT_ADDRESS, PokemonItemsAbi, provider);
    } catch (error) {
      console.error('Error getting items contract:', error);
      throw new Error('Failed to connect to the marketplace');
    }
  },

  async getItems() {
    try {
      const contract = await this.getContract();
      const items = [];
      
      for (let i = 1; i <= 4; i++) {
        const item = await contract.items(i);
        items.push({
          id: i,
          name: item.name,
          type: item.itemType,
          price: ethers.formatEther(item.price),
          isAvailable: item.isAvailable
        });
      }
      
      return items;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw new Error('Failed to fetch marketplace items');
    }
  },

  async purchaseItem(itemId, amount) {
    try {
      const contract = await this.getContract(true);
      const item = await contract.items(itemId);
      const totalPrice = item.price * ethers.getBigInt(amount);
      
      const tx = await contract.mintItem(itemId, amount, {
        value: totalPrice
      });
      
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error purchasing item:', error);
      throw new Error('Failed to purchase item');
    }
  },

  async getUserItems(address) {
    try {
      const contract = await this.getContract();
      const items = [];
      
      for (let i = 1; i <= 4; i++) {
        const balance = await contract.balanceOf(address, i);
        if (balance > 0) {
          const itemData = await contract.items(i);
          items.push({
            id: i,
            name: itemData.name,
            type: itemData.itemType,
            amount: Number(balance)
          });
        }
      }
      
      return items;
    } catch (error) {
      console.error('Error fetching user items:', error);
      throw new Error('Failed to fetch your items');
    }
  }
}; 