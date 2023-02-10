import * as dotenv from "dotenv";
import networks from "./hardhat.networks";

import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-abi-exporter";
import "hardhat-docgen";
import "hardhat-contract-sizer";

import {
  ARBISCAN_API_KEY,
  AVALANCHE_API_KEY,
  BSCSCAN_API_KEY,
  ETHERSCAN_API_KEY,
  GNOSIS_API_KEY,
  MULTISIG_ADDRESS,
  OPTIMISM_API_KEY,
  POLYGONSCAN_API_KEY
} from "./utils/constants";

dotenv.config();

const multisig = MULTISIG_ADDRESS; // Account 1

const config = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 6000,
      },
    },
  },
  networks,
  gasReporter: {
    currency: "USD",
    gasPrice: 30,
    enabled: true,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    admin: {
      default: multisig,
      31337: 1,
    },
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
      sepolia: ETHERSCAN_API_KEY,
      avalanche: AVALANCHE_API_KEY,
      avalancheFujiTestnet: AVALANCHE_API_KEY,
      optimisticEthereum: OPTIMISM_API_KEY,
      optimisticGoerli: OPTIMISM_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
      arbitrumOne: ARBISCAN_API_KEY,
      arbitrumGoerli: ARBISCAN_API_KEY,
      bsc: BSCSCAN_API_KEY,
      bscTestnet: BSCSCAN_API_KEY,
      gnosis: GNOSIS_API_KEY,
    },
  },
  mocha: {
    timeout: 30000,
  },
  abiExporter: {
    path: "./abis",
    runOnCompile: true,
    only: ["AllianceBlockToken"],
    clear: true,
    flat: true,
  },
};

export default config;
