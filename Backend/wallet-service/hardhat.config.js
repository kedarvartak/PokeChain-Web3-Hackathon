require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    lineaSepolia: {
      url: "https://rpc.sepolia.linea.build",
      chainId: 59141,  
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 'auto'
    }
  },
  paths: {
    artifacts: "./src/artifacts",
  }
};
