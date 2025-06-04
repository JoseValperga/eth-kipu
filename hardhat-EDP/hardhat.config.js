
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_API_KEY = "https://eth-sepolia.g.alchemy.com/v2/QBY4IyvKeKsNSwCz6VLf1";
const SEPOLIA_PRIVATE_KEY = "73850337be51cf2a75cf6afa2627d93ebe8b6d476b8a513272803b866434bcfc";
const ETHERSCAN_API_KEY = "KRZ4RZYSQZINTGN7QTZ1I866HQPMWX3UU5";

const config = {
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
  }
}

export default config;
