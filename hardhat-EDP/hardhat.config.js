
require("@nomicfoundation/hardhat-toolbox");

const ALCHEMY_API_KEY = "";
const SEPOLIA_PRIVATE_KEY = "";
const ETHERSCAN_API_KEY = "";

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
};