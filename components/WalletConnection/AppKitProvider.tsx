"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createConfig, http, WagmiConfig, useAccount, useConnect, useDisconnect } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { injected, walletConnect } from "wagmi/connectors"
import useMobile from "@/hooks/use-mobile"

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
}

const AppKitContext = createContext<AppKitContextType | undefined>(undefined)

function AppKitContextProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected, chainId } = useAccount()
  const { connect: wagmiConnect, connectors } = useConnect()
  const { disconnect: wagmiDisconnect } = useDisconnect()
  const [isPending, setIsPending] = useState(false)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [isSwitchPending, setIsSwitchPending] = useState(false)
  const [networkSwitchError, setNetworkSwitchError] = useState<string | null>(null)
  const { isMobile } = useMobile()

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

    setIsSwitchPending(true)
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
    } finally {
      setIsSwitchPending(false)
    }
  }

  // Function to switch to Monad network using window.ethereum directly
  const switchToMonad = async () => {
    if (!window.ethereum) {
      const errorMsg = "MetaMask is not installed"
      console.error(errorMsg)
      setNetworkSwitchError(errorMsg)
      return
    }

    setIsSwitchPending(true)
    setNetworkSwitchError(null)

    try {
      // Format chainId as hex string with 0x prefix
      const chainIdHex = `0x${monadTestnet.id.toString(16)}`
      console.log("Switching to Monad network with chainId:", chainIdHex)

      // Try to switch to the Monad network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      })
      console.log("Successfully switched to Monad network")
    } catch (switchError: any) {
      console.error("Error switching network:", switchError)

      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        console.log("Network not found, attempting to add it...")
        try {
          await addMonadNetwork()
        } catch (addError: any) {
          const errorMsg = `Failed to add network: ${addError.message || "Unknown error"}`
          console.error(errorMsg, addError)
          setNetworkSwitchError(errorMsg)
        }
      } else {
        const errorMsg = `Failed to switch network: ${switchError.message || "Unknown error"}`
        console.error(errorMsg)
        setNetworkSwitchError(errorMsg)
      }
    } finally {
      setIsSwitchPending(false)
    }
  }

  const connect = async () => {
    setIsPending(true)
    setNetworkSwitchError(null)
    try {
      // Connect to wallet
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

      // After connecting, ensure we're on the Monad network
      setTimeout(async () => {
        if (!isMobile) {
          await switchToMonad()
        }
      }, 500)
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
  }

  const value: AppKitContextType = {
    isConnected,
    address,
    connect,
    disconnect,
    isPending: isPending || isSwitchPending,
    isCorrectNetwork,
    switchToMonad,
    addMonadNetwork,
    networkSwitchError,
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
