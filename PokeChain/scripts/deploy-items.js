const hre = require("hardhat");

async function main() {
  console.log("Deploying PokemonItems contract...");

  // Deploy PokemonItems contract
  const PokemonItems = await hre.ethers.getContractFactory("PokemonItems");
  const pokemonItems = await PokemonItems.deploy();

  await pokemonItems.waitForDeployment();
  const address = await pokemonItems.getAddress();

  console.log("PokemonItems deployed to:", address);
  
  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await pokemonItems.deploymentTransaction().wait(5);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 