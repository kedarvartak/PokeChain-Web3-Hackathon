const hre = require("hardhat");

async function main() {
  try {
    console.log("Starting deployment...");

    // First, make sure we have the Pokemon contract address
    const pokemonAddress = "0xF39827081951B1b8B989609252FDE203330cB0e1"; // Your Pokemon contract address

    // Deploy Trading contract with Pokemon contract address
    const PokemonTrading = await hre.ethers.getContractFactory("PokemonTrading");
    const trading = await PokemonTrading.deploy(pokemonAddress);
    await trading.waitForDeployment();

    console.log("Trading contract deployed to:", await trading.getAddress());
    
    // Verify the setup
    const pokemonContractAddress = await trading.pokemonContract();
    console.log("Verified Pokemon contract address:", pokemonContractAddress);
    
    if (pokemonContractAddress.toLowerCase() !== pokemonAddress.toLowerCase()) {
      throw new Error("Contract initialization failed");
    }
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });