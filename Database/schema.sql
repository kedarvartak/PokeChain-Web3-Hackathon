-- POSTGRESQL DATABASE

CREATE TABLE pokemons (
    pokemon_id SERIAL PRIMARY KEY,            
    pokemon_name TEXT NOT NULL,             
    pokemon_type TEXT NOT NULL                 -- Type of the Pokémon (e.g., Fire, Water)
);


CREATE TABLE users (
    wallet_address VARCHAR(42) PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    hash TEXT NOT NULL
    CONSTRAINT chk_wallet_address_length CHECK (LENGTH(wallet_address) = 42) -- Enforce Ethereum wallet address length  
);

CREATE TABLE nfts (
    uuid UUID PRIMARY KEY,                     -- Unique identifier for NFTs
    wallet_address VARCHAR(42) NOT NULL,       -- Ethereum wallet address
    pokemon_id INT,                            -- Foreign key referencing pokemons table
    nft_image_location TEXT,                   -- URL or path to NFT image
    FOREIGN KEY (pokemon_id) REFERENCES pokemons(pokemon_id) ON DELETE NO ACTION,
    FOREIGN KEY (wallet_address) REFERENCES users(wallet_address) ON DELETE NO ACTION,
);

-- Inserting starter pokemons
INSERT INTO pokemons (pokemon_id, pokemon_name, pokemon_type) 
VALUES 
    (1, 'Bulbasaur', 'Grass'), 
    (4, 'Charmander', 'Fire'), 
    (7, 'Squirtle', 'Water');

