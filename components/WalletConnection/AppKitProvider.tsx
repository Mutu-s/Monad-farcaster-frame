"use client"

import { createConfig, http, WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { monadTestnet } from "wagmi/chains"
import { type ReactNode, useEffect, useState, createContext, useContext } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { sdk } from "@farcaster/frame-sdk"
import { farcasterFrame } from "@farcaster/frame-wagmi-connector"
import { injected } from "wagmi/connectors"

// WalletConnect project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

// Wagmi configuration
const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  connectors: [
    farcasterFrame(),
    injected(), // For MetaMask and other injected wallets
  ],
})

// React Query client
const queryClient = new QueryClient()

// AppKit Context
const AppKitContext = createContext<ReturnType<typeof useAppKitState> | undefined>(undefined)

// AppKit state hook
function useAppKitState() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [networkSwitchError, setNetworkSwitchError] = useState("")

  return {
    isConnected,
    setIsConnected,
    address,
    setAddress,
    isPending,
    setIsPending,
    isCorrectNetwork,
    setIsCorrectNetwork,
    networkSwitchError,
    setNetworkSwitchError,
  }
}

// AppKitProvider component
function AppKitProvider({ children }: { children: ReactNode }) {
  const { isMobile } = useMobile()
  const [isFarcasterWallet, setIsFarcasterWallet] = useState(false)
  const appKitState = useAppKitState()

  // Farcaster wallet detection
  useEffect(() => {
    const checkFarcasterWallet = async () => {
      try {
        if (typeof window !== "undefined") {
          // Check wallet info from Farcaster Frame SDK
          const isFrameContext = await sdk.isFrameContext()
          if (isFrameContext) {
            const ethProvider = await sdk.wallet.ethProvider()
            if (ethProvider) {
              console.log("Farcaster wallet detected")
              setIsFarcasterWallet(true)
            }
          }
        }
      } catch (error) {
        console.error("Error checking Farcaster wallet:", error)
      }
    }

    checkFarcasterWallet()
  }, [])

  return (
    <AppKitContext.Provider value={appKitState}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {isFarcasterWallet && (
            <div className="bg-purple-900/20 text-white p-2 text-sm rounded-md mb-4 text-center">
              Warpcast wallet detected. You can transact with your Warpcast wallet.
            </div>
          )}
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </AppKitContext.Provider>
  )
}

// useAppKitAccount hook
export function useAppKitAccount() {
  const context = useContext(AppKitContext)
  if (!context) {
    throw new Error("useAppKitAccount must be used within an AppKitProvider")
  }
  return {
    isConnected: context.isConnected,
    address: context.address,
    isPending: context.isPending,
    isCorrectNetwork: context.isCorrectNetwork,
    networkSwitchError: context.networkSwitchError,
    connect: () => {},
    disconnect: () => {},
    switchToMonad: async () => {},
    addMonadNetwork: async () => {},
  }
}

// Export AppKitProvider as default
export default AppKitProvider
