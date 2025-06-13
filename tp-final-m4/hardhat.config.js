import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const {
  ALCHEMY_URL,
  SEPOLIA_PRIVATE_KEY_OWNER,
  TIPJAR_ADDRESS
} = process.env;

if (!ALCHEMY_URL || !SEPOLIA_PRIVATE_KEY_OWNER || !TIPJAR_ADDRESS) {
  console.error(
    "❌ Variables de entorno faltantes. Define ALCHEMY_URL, SEPOLIA_PRIVATE_KEY_OWNER, SEPOLIA_PRIVATE_KEY_USER y TIPJAR_ADDRESS."
  );
  process.exit(1);
}

const config = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      //url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      url: ALCHEMY_URL,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY_OWNER],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: true,
    excludeContracts: [],
    src: "./contracts",
  },
};

export default config;
