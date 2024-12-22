// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract PokemonTrading {
    // Structure for a trade offer
    struct TradeOffer {
        address creator;
        uint256 pokemonId;
        address requestedPokemonOwner;
        uint256 requestedPokemonId;
        bool isActive;
    }

    // Pokemon NFT contract address
    IERC721 public pokemonContract;
    
    // Array to store all trade offers
    TradeOffer[] public tradeOffers;
    
    // Events
    event TradeOfferCreated(uint256 indexed offerId, address indexed creator, uint256 pokemonId, address requestedOwner, uint256 requestedPokemonId);
    event TradeOfferAccepted(uint256 indexed offerId);
    event TradeOfferCancelled(uint256 indexed offerId);

    constructor(address _pokemonContract) {
        pokemonContract = IERC721(_pokemonContract);
    }

    function createTradeOffer(
        uint256 _pokemonId,
        address _requestedPokemonOwner,
        uint256 _requestedPokemonId
    ) external {
        require(pokemonContract.ownerOf(_pokemonId) == msg.sender, "You don't own this Pokemon");
        require(pokemonContract.ownerOf(_requestedPokemonId) == _requestedPokemonOwner, "Requested Pokemon owner is incorrect");
        
        // Ensure the contract has approval to transfer the Pokemon
        require(pokemonContract.isApprovedForAll(msg.sender, address(this)), "Contract needs approval to transfer Pokemon");

        tradeOffers.push(TradeOffer({
            creator: msg.sender,
            pokemonId: _pokemonId,
            requestedPokemonOwner: _requestedPokemonOwner,
            requestedPokemonId: _requestedPokemonId,
            isActive: true
        }));

        emit TradeOfferCreated(tradeOffers.length - 1, msg.sender, _pokemonId, _requestedPokemonOwner, _requestedPokemonId);
    }

    function acceptTradeOffer(uint256 _offerId) external {
        require(_offerId < tradeOffers.length, "Trade offer doesn't exist");
        TradeOffer storage offer = tradeOffers[_offerId];
        
        require(offer.isActive, "Trade offer is not active");
        require(msg.sender == offer.requestedPokemonOwner, "You're not the requested Pokemon owner");
        require(pokemonContract.isApprovedForAll(msg.sender, address(this)), "Contract needs approval to transfer Pokemon");

        // Perform the trade
        address creator = offer.creator;
        uint256 creatorPokemonId = offer.pokemonId;
        uint256 requestedPokemonId = offer.requestedPokemonId;

        // Transfer both Pokemon
        pokemonContract.transferFrom(creator, msg.sender, creatorPokemonId);
        pokemonContract.transferFrom(msg.sender, creator, requestedPokemonId);

        // Mark offer as inactive
        offer.isActive = false;

        emit TradeOfferAccepted(_offerId);
    }

    function cancelTradeOffer(uint256 _offerId) external {
        require(_offerId < tradeOffers.length, "Trade offer doesn't exist");
        TradeOffer storage offer = tradeOffers[_offerId];
        
        require(offer.isActive, "Trade offer is not active");
        require(msg.sender == offer.creator, "Only creator can cancel the offer");

        offer.isActive = false;
        emit TradeOfferCancelled(_offerId);
    }

    function getTradeOffer(uint256 _offerId) external view returns (TradeOffer memory) {
        require(_offerId < tradeOffers.length, "Trade offer doesn't exist");
        return tradeOffers[_offerId];
    }

    function getActiveTradeOffers() external view returns (TradeOffer[] memory) {
        uint256 activeCount = 0;
        
        // Count active offers
        for (uint256 i = 0; i < tradeOffers.length; i++) {
            if (tradeOffers[i].isActive) {
                activeCount++;
            }
        }

        // Create array of active offers
        TradeOffer[] memory activeOffers = new TradeOffer[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < tradeOffers.length; i++) {
            if (tradeOffers[i].isActive) {
                activeOffers[currentIndex] = tradeOffers[i];
                currentIndex++;
            }
        }

        return activeOffers;
    }
}