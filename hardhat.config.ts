import * as dotenv from 'dotenv';
import networks from './hardhat.networks'

import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
import 'hardhat-abi-exporter'
import 'hardhat-docgen'
import 'hardhat-contract-sizer'

dotenv.config();

const multisig = '0xD033fAC764fDB548542fe4c6897562a9114BdBb7' // Account 1

const config = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 800
      }
    }
  },
  networks,
  gasReporter: {
    currency: 'USD',
    gasPrice: 30,
    enabled: process.env.REPORT_GAS ? true : false
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    admin: {
      default: multisig,
      31337: 1
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      avalanche: process.env.AVALANCHE_API_KEY || "",
      avalancheFujiTestnet: process.env.AVALANCHE_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISM_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "",
    }
  },
  mocha: {
    timeout: 30000
  },
  abiExporter: {
    path: './abis',
    runOnCompile: true,
    only: ['AllianceBlockToken', 'BatchTransfer', 'Vesting'],
    clear: true,
    flat: true,
  }
}

export default config
