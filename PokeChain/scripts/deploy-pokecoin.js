const hre = require("hardhat");

async function main() {
  console.log("Deploying PokeCoin contract...");

  const PokeCoin = await hre.ethers.getContractFactory("PokeCoin");
  const pokeCoin = await PokeCoin.deploy();

  await pokeCoin.waitForDeployment();
  const address = await pokeCoin.getAddress();

  console.log("PokeCoin deployed to:", address);
  
  await pokeCoin.deploymentTransaction().wait(5);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 