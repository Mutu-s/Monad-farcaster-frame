import { defineChain } from "viem"

// Define the Monad Testnet chain
export const monadTestnet = defineChain({
  id: 10_243,
  name: "Monad Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Monad",
    symbol: "MONAD",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.monad.xyz/"],
    },
    public: {
      http: ["https://rpc.testnet.monad.xyz/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://explorer.testnet.monad.xyz",
    },
  },
  testnet: true,
})

// Define the Ethereum Mainnet chain
export const mainnet = defineChain({
  id: 1,
  name: "Ethereum",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://eth.llamarpc.com"],
    },
    public: {
      http: ["https://eth.llamarpc.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://etherscan.io",
    },
  },
})
