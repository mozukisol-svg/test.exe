require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("hardhat-contract-sizer");
require("dotenv").config();

const PRIVATE_KEY    = process.env.PRIVATE_KEY    || "0x" + "0".repeat(64);
const ALCHEMY_MAINNET = process.env.ALCHEMY_MAINNET || "";
const ALCHEMY_SEPOLIA = process.env.ALCHEMY_SEPOLIA || "";
const ETHERSCAN_KEY  = process.env.ETHERSCAN_KEY  || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    hardhat: {},            // local node

    sepolia: {
      url:      `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_SEPOLIA}`,
      accounts: [PRIVATE_KEY],
      chainId:  11155111,
    },

    mainnet: {
      url:      `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_MAINNET}`,
      accounts: [PRIVATE_KEY],
      chainId:  1,
    },
  },

  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },

  contractSizer: {
    alphaSort:       true,
    disambiguatePaths: false,
    runOnCompile:    true,
    strict:          true,
  },

  gasReporter: {
    enabled:  true,
    currency: "USD",
  },
};
