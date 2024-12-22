// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PokeCoin is ERC20, Ownable {
    mapping(address => bool) public minters;

    constructor() ERC20("PokeCoin", "PKC") Ownable(msg.sender) {}

    modifier onlyMinter() {
        require(minters[msg.sender], "Not authorized to mint");
        _;
    }

    function addMinter(address minter) external onlyOwner {
        minters[minter] = true;
    }

    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
    }

    // Mint initial coins for new users
    function mintInitialCoins(address to) external onlyMinter {
        _mint(to, 100 * 10**decimals()); // 100 PokeCoins
    }

    // For development/testing
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount * 10**decimals());
    }
} 