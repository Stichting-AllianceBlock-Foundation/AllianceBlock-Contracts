import { accounts, INFURA_API_KEY } from "./utils/constants";
import * as dotenv from "dotenv";

dotenv.config();

const networks: any = {
  coverage: {
    url: "http://127.0.0.1:8555",
    blockGasLimit: 200000000,
  },
  localhost: {
    chainId: 31337,
    url: "http://127.0.0.1:8545",
  },
};


if (accounts) {
  networks.polygon = {
    live: true,
    chainId: 137,
    url: `https://rpc.ankr.com/polygon`,
    accounts,
    tags: ["prod"],
  };

  networks.polygonMumbai = {
    live: true,
    chainId: 80001,
    url: "https://rpc-mumbai.maticvigil.com",
    accounts,
    tags: ["staging"],
  };

  networks.bsc = {
    live: true,
    chainId: 56,
    url: "https://bsc-dataseed.binance.org",
    accounts,
    tags: ["prod"],
  };

  networks.bscTestnet = {
    live: true,
    chainId: 97,
    url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    accounts,
    tags: ["staging"],
  };

  networks.avalache = {
    live: true,
    chainId: 43114,
    url: "https://api.avax.network/ext/bc/C/rpc",
    accounts,
    tags: ["prod"],
  };

  networks.avalancheFujiTestnet = {
    live: true,
    chainId: 43113,
    url: "https://api.avax-test.network/ext/bc/C/rpc",
    accounts,
    gas: 2100000,
    gasPrice: 50000000000,
    maxPriorityFeePerGas: 2000000000,
    maxFeePerGas: 51500000000,
    tags: ["staging"],
  };

  networks.optimisticEthereum = {
    live: true,
    chainId: 10,
    url: "https://mainnet.optimism.io",
    accounts,
    tags: ["prod"],
  };

  networks.optimisticGoerli = {
    live: true,
    chainId: 420,
    url: "https://goerli.optimism.io",
    accounts,
    tags: ["staging"],
  };

  networks.arbitrumOne = {
    live: true,
    chainId: 42161,
    url: "https://arb1.arbitrum.io/rpc",
    accounts,
    tags: ["prod"],
  };

  networks.arbitrumGoerli = {
    live: true,
    chainId: 421613,
    url: "https://goerli-rollup.arbitrum.io/rpc",
    accounts,
    tags: ["staging"],
  };

  networks.aurora = {
    live: true,
    chainId: 1313161554,
    url: "https://mainnet.aurora.dev",
    accounts,
    tags: ["prod"],
  };

  networks.auroraTestnet = {
    live: true,
    chainId: 1313161555,
    url: "https://testnet.aurora.dev",
    accounts,
    tags: ["staging"],
  };

  networks.moonbeam = {
    live: true,
    chainId: 1284,
    url: "https://moonbeam.public.blastapi.io",
    accounts,
    tags: ["prod"],
  };

  networks.moonbaseAlpha = {
    live: true,
    chainId: 1287,
    url: "https://moonbase-alpha.public.blastapi.io",
    accounts,
    tags: ["staging"],
  };

  networks.harmony = {
    live: true,
    chainId: 1666600000,
    url: "https://api.harmony.one",
    accounts,
    tags: ["prod"],
  };

  networks.harmonyTest = {
    live: true,
    chainId: 1666700000,
    url: "https://api.s0.b.hmny.io",
    accounts,
    tags: ["staging"],
  };

  networks.opera = {
    live: true,
    chainId: 250,
    url: "https://fantom-mainnet.public.blastapi.io",
    accounts,
    tags: ["prod"],
  };

  networks.ftmTestnet = {
    live: true,
    chainId: 4002,
    url: "https://endpoints.omniatech.io/v1/fantom/testnet/public",
    accounts,
    tags: ["staging"],
  };

  networks.gnosis = {
    live: true,
    chainId: 100,
    url: "https://rpc.gnosischain.com",
    accounts,
    tags: ["prod"],
  };

  networks.energyWeb = {
    live: true,
    chainId: 246,
    url: "https://rpc.energyweb.org",
    accounts,
    tags: ["prod"],
  };

  networks.energyWebVoltaTestnet = {
    live: true,
    chainId: 73799,
    url: "https://volta-rpc.energyweb.org",
    accounts,
    tags: ["staging"],
  };

  if (INFURA_API_KEY) {
    networks.mainnet = {
      live: true,
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts,
      tags: ["prod"],
    };

    networks.goerli = {
      live: true,
      chainId: 5,
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts,
      gas: 2100000,
      gasPrice: 50000000000,
      maxPriorityFeePerGas: 2000000000,
      maxFeePerGas: 51500000000,
      tags: ["staging"],
    };

    networks.sepolia = {
      live: true,
      chainId: 11155111,
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts,
      gas: 2100000,
      gasPrice: 50000000000,
      maxPriorityFeePerGas: 2000000000,
      maxFeePerGas: 51500000000,
      tags: ["staging"],
    };
  } else {
    console.warn("No infura key available");
  }
} else {
  console.warn("No accounts (private key or mnemonic) available");
}

export default networks;
