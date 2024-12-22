// contracts/PokemonNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./PokeCoin.sol";

contract PokemonNFT is ERC1155, Ownable {
    using Strings for uint256;
    
    struct Pokemon {
        string name;
        string pokemonType;
        uint256 level;
        uint256 xp;
        uint256 trainingStartTime;
        bool isTraining;
        uint256 trainingGroundId;
    }
    
    struct TrainingGround {
        string name;
        string requiredType;
        uint256 cost;
    }
    
    mapping(uint256 => Pokemon) public pokemonData;
    mapping(address => bool) public hasStarterPokemon;
    mapping(uint256 => TrainingGround) public trainingGrounds;
    
    uint256 public constant BASIC_TRAINING = 1;
    uint256 public constant FIRE_DOJO = 2;
    uint256 public constant WATER_TEMPLE = 3;
    uint256 public constant GRASS_GARDEN = 4;
    
    uint256 public constant MIN_TRAINING_TIME = 1 minutes;
    uint256 public constant TYPE_BONUS_MULTIPLIER = 150;
    uint256 public constant XP_PER_MINUTE = 1;
    
    uint256 public constant BASIC_TRAINING_COST = 5;
    uint256 public constant SPECIALIZED_TRAINING_COST = 10;
    
    string private baseURI;
    
    PokeCoin public pokeCoin;
    
    event TrainingStarted(uint256 indexed pokemonId, uint256 groundId);
    event TrainingCompleted(uint256 indexed pokemonId, uint256 groundId, uint256 xpGained);
    
    constructor() ERC1155("") Ownable(msg.sender) {
        pokemonData[1] = Pokemon("Bulbasaur", "Grass", 5, 0, 0, false, 0);
        pokemonData[4] = Pokemon("Charmander", "Fire", 5, 0, 0, false, 0);
        pokemonData[7] = Pokemon("Squirtle", "Water", 5, 0, 0, false, 0);
        
        trainingGrounds[BASIC_TRAINING] = TrainingGround("Basic Training", "", 0);
        trainingGrounds[FIRE_DOJO] = TrainingGround("Fire Dojo", "Fire", 10 ether);
        trainingGrounds[WATER_TEMPLE] = TrainingGround("Water Temple", "Water", 10 ether);
        trainingGrounds[GRASS_GARDEN] = TrainingGround("Grass Garden", "Grass", 10 ether);
    }
    
    function setPokeCoinContract(address _pokeCoinContract) external onlyOwner {
        pokeCoin = PokeCoin(_pokeCoinContract);
    }
    
    function mintStarterPokemon(uint256 pokemonId) external {
        require(pokemonId == 1 || pokemonId == 4 || pokemonId == 7, "Invalid starter Pokemon");
        require(!hasStarterPokemon[msg.sender], "Already has starter Pokemon");
        
        _mint(msg.sender, pokemonId, 1, "");
        hasStarterPokemon[msg.sender] = true;
        
        pokeCoin.mintInitialCoins(msg.sender);
    }
    
    function startTraining(uint256 pokemonId, uint256 groundId) external {
        require(balanceOf(msg.sender, pokemonId) > 0, "Not your Pokemon");
        require(groundId > 0 && groundId <= 4, "Invalid training ground");
        require(!pokemonData[pokemonId].isTraining, "Already training");
        
        uint256 cost = trainingGrounds[groundId].cost;
        
        require(
            pokeCoin.allowance(msg.sender, address(this)) >= cost,
            "Insufficient PokeCoin allowance"
        );
        
        require(
            pokeCoin.transferFrom(msg.sender, address(this), cost),
            "PokeCoin transfer failed"
        );
        
        pokemonData[pokemonId].isTraining = true;
        pokemonData[pokemonId].trainingStartTime = block.timestamp;
        pokemonData[pokemonId].trainingGroundId = groundId;
        
        emit TrainingStarted(pokemonId, groundId);
    }
    
    function canCompleteTraining(uint256 pokemonId) public view returns (bool, string memory) {
        if (balanceOf(msg.sender, pokemonId) == 0) {
            return (false, "Not your Pokemon");
        }
        if (!pokemonData[pokemonId].isTraining) {
            return (false, "Pokemon is not training");
        }
        if (block.timestamp < pokemonData[pokemonId].trainingStartTime + MIN_TRAINING_TIME) {
            return (false, "Training time not complete");
        }
        return (true, "");
    }
    
    function completeTraining(uint256 pokemonId) external {
        (bool canComplete, string memory reason) = canCompleteTraining(pokemonId);
        require(canComplete, reason);
        
        uint256 groundId = pokemonData[pokemonId].trainingGroundId;
        uint256 trainingTime = block.timestamp - pokemonData[pokemonId].trainingStartTime;
        uint256 minutesSpent = trainingTime / 1 minutes;
        
        uint256 baseXP = minutesSpent * XP_PER_MINUTE;
        
        if (keccak256(bytes(pokemonData[pokemonId].pokemonType)) == 
            keccak256(bytes(trainingGrounds[groundId].requiredType))) {
            baseXP = (baseXP * TYPE_BONUS_MULTIPLIER) / 100;
        }
        
        pokemonData[pokemonId].xp += baseXP;
        
        while (pokemonData[pokemonId].xp >= 100) {
            pokemonData[pokemonId].level += 1;
            pokemonData[pokemonId].xp -= 100;
        }
        
        pokemonData[pokemonId].isTraining = false;
        pokemonData[pokemonId].trainingStartTime = 0;
        pokemonData[pokemonId].trainingGroundId = 0;
        
        emit TrainingCompleted(pokemonId, groundId, baseXP);
    }
    
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
    }
    
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }
    
    function getPokemonData(uint256 tokenId) external view returns (Pokemon memory) {
        return pokemonData[tokenId];
    }
    
    function getTrainingGround(uint256 groundId) external view returns (TrainingGround memory) {
        return trainingGrounds[groundId];
    }
}