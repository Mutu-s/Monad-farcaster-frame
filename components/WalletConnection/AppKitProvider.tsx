"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createConfig, http, WagmiConfig, useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { injected, walletConnect } from "wagmi/connectors"
import { farcasterFrame } from "@farcaster/frame-wagmi-connector"
import useMobile from "@/hooks/use-mobile"
import { sdk } from "@farcaster/frame-sdk"

// Define Monad Testnet chain with the correct information
const monadTestnet = {
  id: 10143, // Monad Testnet Chain ID
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Monad",
    symbol: "MON",
  },
  rpcUrls: {
    public: { http: ["https://testnet-rpc.monad.xyz"] },
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://testnet.monadexplorer.com" },
  },
}

// Get WalletConnect Project ID from environment variable
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "8541facf06433952d3f80698e20d5663"

// Create a query client for React Query
const queryClient = new QueryClient()

// Create a proper wagmi configuration with ONLY Monad Testnet
const config = createConfig({
  chains: [monadTestnet], // Only include Monad chain
  transports: {
    [monadTestnet.id]: http(),
  },
  connectors: [
    farcasterFrame(),
    injected(),
    walletConnect({
      projectId,
      showQrModal: true,
      metadata: {
        name: "Bitcoin Price Prediction",
        description: "Predict Bitcoin prices and earn MON tokens for correct guesses",
        url: "https://monad.0xhub.xyz",
        icons: ["https://monad.0xhub.xyz/images/mutu-logo-new.png"],
      },
    }),
  ],
  ssr: true,
})

interface AppKitContextType {
  isConnected: boolean
  address: string | undefined
  connect: () => Promise<void>
  disconnect: () => void
  isPending: boolean
  isCorrectNetwork: boolean
  switchToMonad: () => Promise<void>
  addMonadNetwork: () => Promise<void>
  networkSwitchError: string | null
  isWarpcastWallet: boolean
}

const AppKitContext = createContext<AppKitContextType | undefined>(undefined)

function AppKitContextProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected, chainId, connector } = useAccount()
  const { connect: wagmiConnect, connectors, isPending: isConnectPending } = useConnect()
  const { disconnect: wagmiDisconnect } = useDisconnect()
  const { switchChain, isPending: isSwitchPending, error: switchChainError } = useSwitchChain()
  const [isPending, setIsPending] = useState(false)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [networkSwitchError, setNetworkSwitchError] = useState<string | null>(null)
  const { isMobile } = useMobile()
  const [isWarpcastWallet, setIsWarpcastWallet] = useState(false)

  // Notify Frame SDK that we're ready and check for Warpcast wallet
  useEffect(() => {
    // Notify Frame SDK that we're ready
    sdk.actions.ready()

    // Check if we're using Warpcast wallet
    const checkWarpcastWallet = async () => {
      try {
        const ethProvider = sdk.wallet.ethProvider
        if (ethProvider) {
          console.log("Warpcast wallet detected")
          setIsWarpcastWallet(true)
        }
      } catch (error) {
        console.log("Not using Warpcast wallet", error)
        setIsWarpcastWallet(false)
      }
    }

    checkWarpcastWallet()
  }, [])

  // Check if connected to the correct network using chainId from useAccount
  useEffect(() => {
    if (isConnected && chainId) {
      setIsCorrectNetwork(chainId === monadTestnet.id)
      console.log("Current chainId:", chainId, "Expected chainId:", monadTestnet.id)
    } else {
      setIsCorrectNetwork(false)
    }
  }, [isConnected, chainId])

  // Function to add Monad network to MetaMask
  const addMonadNetwork = async () => {
    if (!window.ethereum) {
      const errorMsg = "MetaMask is not installed"
      console.error(errorMsg)
      setNetworkSwitchError(errorMsg)
      return
    }

    setNetworkSwitchError(null)

    try {
      console.log("Adding Monad network to MetaMask...")
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${monadTestnet.id.toString(16)}`,
            chainName: monadTestnet.name,
            nativeCurrency: monadTestnet.nativeCurrency,
            rpcUrls: monadTestnet.rpcUrls.default.http,
            blockExplorerUrls: [monadTestnet.blockExplorers.default.url],
          },
        ],
      })
      console.log("Monad network added successfully")
    } catch (error: any) {
      const errorMsg = `Failed to add Monad network: ${error.message || "Unknown error"}`
      console.error(errorMsg, error)
      setNetworkSwitchError(errorMsg)
    }
  }

  // Function to switch to Monad network using wagmi's useSwitchChain
  const switchToMonad = async () => {
    setNetworkSwitchError(null)

    try {
      console.log("Switching to Monad network...")

      // Use wagmi's switchChain for better mobile compatibility
      await switchChain({ chainId: monadTestnet.id })

      console.log("Successfully switched to Monad network")
    } catch (error: any) {
      console.error("Error switching network:", error)

      // If we're on mobile and using WalletConnect, show a more helpful message
      if (isMobile && connector?.id === "walletConnect") {
        const errorMsg = "Please manually switch to Monad Testnet in your wallet app"
        console.log(errorMsg)
        setNetworkSwitchError(errorMsg)
      } else if (window.ethereum) {
        // For desktop MetaMask, try the old method as fallback
        try {
          const chainIdHex = `0x${monadTestnet.id.toString(16)}`
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdHex }],
          })
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await addMonadNetwork()
            } catch (addError: any) {
              const errorMsg = `Failed to add network: ${addError.message || "Unknown error"}`
              setNetworkSwitchError(errorMsg)
            }
          } else {
            const errorMsg = `Failed to switch network: ${switchError.message || "Unknown error"}`
            setNetworkSwitchError(errorMsg)
          }
        }
      } else {
        const errorMsg = `Failed to switch network: ${error.message || "Unknown error"}`
        setNetworkSwitchError(errorMsg)
      }
    }
  }

  const connect = async () => {
    setIsPending(true)
    setNetworkSwitchError(null)

    try {
      // First check if we can use Warpcast wallet
      try {
        const ethProvider = sdk.wallet.ethProvider
        if (ethProvider) {
          console.log("Using Warpcast wallet")
          setIsWarpcastWallet(true)

          // Use Farcaster Frame connector
          const frameConnector = connectors.find((c) => c.id === "farcasterFrame")
          if (frameConnector) {
            await wagmiConnect({ connector: frameConnector })
            console.log("Connected with Farcaster Frame connector")
            setIsPending(false)
            return
          }
        }
      } catch (error) {
        console.log("Not using Warpcast wallet, continuing with regular flow")
      }

      // Regular wallet connection flow
      console.log("Connecting to wallet...", isMobile)

      if (isMobile) {
        // On mobile, prefer WalletConnect
        const wcConnector = connectors.find((c) => c.id === "walletConnect")
        if (wcConnector) {
          console.log("Using WalletConnect for mobile")
          await wagmiConnect({ connector: wcConnector })
        } else {
          console.log("WalletConnect not found, using injected")
          await wagmiConnect({ connector: injected() })
        }
      } else {
        // On desktop, use injected (MetaMask)
        console.log("Using injected connector for desktop")
        await wagmiConnect({ connector: injected() })
      }

      console.log("Wallet connected successfully")
    } catch (error: any) {
      const errorMsg = `Error connecting wallet: ${error.message || "Unknown error"}`
      console.error(errorMsg, error)
      setNetworkSwitchError(errorMsg)
    } finally {
      setIsPending(false)
    }
  }

  const disconnect = () => {
    wagmiDisconnect()
    setIsWarpcastWallet(false)
  }

  const value: AppKitContextType = {
    isConnected,
    address,
    connect,
    disconnect,
    isPending: isPending || isConnectPending || isSwitchPending,
    isCorrectNetwork,
    switchToMonad,
    addMonadNetwork,
    networkSwitchError,
    isWarpcastWallet,
  }

  return <AppKitContext.Provider value={value}>{children}</AppKitContext.Provider>
}

export default function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <AppKitContextProvider>{children}</AppKitContextProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}

export function useAppKitAccount() {
  const context = useContext(AppKitContext)
  if (!context) {
    throw new Error("useAppKitAccount must be used within a AppKitProvider")
  }
  return context
}
