import { ethers } from 'ethers';
import PokeCoin from '../artifacts/contracts/PokeCoin.sol/PokeCoin.json';

class PokeCoinService {
    constructor(provider) {
        this.provider = provider;
    }

    async initializeContract() {
        if (this.provider) {
            const provider = new ethers.BrowserProvider(this.provider);
            const signer = await provider.getSigner();
            this.contract = new ethers.Contract(
                '0x2498e8059929e18e2a2cED4e32ef145fa2F4a744',
                PokeCoin.abi,
                signer
            );
        }
    }

    async getBalance(address) {
        try {
            await this.initializeContract();
            const balance = await this.contract.balanceOf(address);
            return ethers.formatUnits(balance, 18);
        } catch (error) {
            console.error('Error getting PokeCoin balance:', error);
            throw error;
        }
    }

    async approve(spenderAddress, amount) {
        try {
            await this.initializeContract();
            const amountInWei = ethers.parseUnits(amount.toString(), 18);
            if (!ethers.isAddress(spenderAddress)) {
                throw new Error('Invalid spender address');
            }
            const tx = await this.contract.approve(spenderAddress, amountInWei, {
                gasLimit: 100000
            });
            await tx.wait();
            return true;
        } catch (error) {
            console.error('Error approving PokeCoin spend:', error);
            throw error;
        }
    }

    async getAllowance(ownerAddress, spenderAddress) {
        try {
            await this.initializeContract();
            if (!ethers.isAddress(ownerAddress) || !ethers.isAddress(spenderAddress)) {
                throw new Error('Invalid address');
            }
            const allowance = await this.contract.allowance(ownerAddress, spenderAddress);
            return ethers.formatUnits(allowance, 18);
        } catch (error) {
            console.error('Error getting allowance:', error);
            throw error;
        }
    }
}

export const pokeCoinService = new PokeCoinService(window.ethereum); 