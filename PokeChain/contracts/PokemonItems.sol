// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PokemonItems is ERC1155, Ownable {
    using Strings for uint256;
    
    struct Item {
        string name;
        string itemType;
        uint256 price;
        bool isAvailable;
        uint256 amount;  // Amount of coins per package
    }
    
    mapping(uint256 => Item) public items;
    mapping(address => uint256) public pokeCoins;
    
    // Item IDs
    uint256 public constant POKEBALL = 1;
    uint256 public constant GREAT_BALL = 2;
    uint256 public constant ULTRA_BALL = 3;
    uint256 public constant MASTER_BALL = 4;
    
    // PokéCoin Package IDs
    uint256 public constant COINS_100 = 5;
    uint256 public constant COINS_500 = 6;
    uint256 public constant COINS_1000 = 7;
    uint256 public constant COINS_5000 = 8;
    
    // Events
    event CoinsReceived(address indexed receiver, uint256 amount);
    event CoinsSpent(address indexed account, uint256 amount);
    
    constructor() ERC1155("") Ownable(msg.sender) {
        // Initialize Pokéballs
        items[POKEBALL] = Item("Poke Ball", "pokeball", 0.001 ether, true, 1);
        items[GREAT_BALL] = Item("Great Ball", "pokeball", 0.002 ether, true, 1);
        items[ULTRA_BALL] = Item("Ultra Ball", "pokeball", 0.003 ether, true, 1);
        items[MASTER_BALL] = Item("Master Ball", "pokeball", 0.01 ether, true, 1);
        
        // Initialize PokéCoin packages
        items[COINS_100] = Item("100 PokeCoins", "currency", 0.001 ether, true, 100);
        items[COINS_500] = Item("500 PokeCoins", "currency", 0.004 ether, true, 500);
        items[COINS_1000] = Item("1000 PokeCoins", "currency", 0.007 ether, true, 1000);
        items[COINS_5000] = Item("5000 PokeCoins", "currency", 0.03 ether, true, 5000);
    }
    
    function mintItem(uint256 itemId, uint256 amount) external payable {
        require(itemId > 0 && itemId <= 8, "Invalid item ID");
        require(items[itemId].isAvailable, "Item not available");
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 totalPrice = items[itemId].price * amount;
        require(msg.value >= totalPrice, "Insufficient payment");

        if (itemId >= 5) {  // PokeCoin packages
            uint256 coinAmount = items[itemId].amount * amount;
            pokeCoins[msg.sender] += coinAmount;
            emit CoinsReceived(msg.sender, coinAmount);
        } else {  // Pokeballs
            _mint(msg.sender, itemId, amount, "");
        }

        // Return excess payment
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
    }
    
    function getCoinBalance(address account) external view returns (uint256) {
        return pokeCoins[account];
    }
    
    function spendCoins(address account, uint256 amount) external {
        require(pokeCoins[account] >= amount, "Insufficient coin balance");
        pokeCoins[account] -= amount;
        emit CoinsSpent(account, amount);
    }
    
    function isPokeCoins(uint256 itemId) public pure returns (bool) {
        return itemId >= COINS_100 && itemId <= COINS_5000;
    }
    
    function setItemPrice(uint256 itemId, uint256 newPrice) external onlyOwner {
        items[itemId].price = newPrice;
    }
    
    function setItemAvailability(uint256 itemId, bool isAvailable) external onlyOwner {
        items[itemId].isAvailable = isAvailable;
    }
    
    function withdrawFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Optional: Batch transfer coins (for future features)
    function batchTransferCoins(address from, address to, uint256 amount) external {
        require(pokeCoins[from] >= amount, "Insufficient coin balance");
        require(from == msg.sender || isApprovedForAll(from, msg.sender), "Not authorized");
        
        pokeCoins[from] -= amount;
        pokeCoins[to] += amount;
        
        emit CoinsReceived(to, amount);
        emit CoinsSpent(from, amount);
    }
} 