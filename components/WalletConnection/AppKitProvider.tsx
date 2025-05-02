"use client"

import { createConfig, http, WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { monadTestnet } from "wagmi/chains"
import { type ReactNode, useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { sdk } from "@farcaster/frame-sdk"
import { farcasterFrame } from "@farcaster/frame-wagmi-connector"

// WalletConnect proje kimliği
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

// Wagmi yapılandırması
const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  connectors: [farcasterFrame()],
})

// React Query istemcisi
const queryClient = new QueryClient()

// AppKitProvider bileşeni
function AppKitProvider({ children }: { children: ReactNode }) {
  const { isMobile } = useMobile()
  const [isFarcasterWallet, setIsFarcasterWallet] = useState(false)

  // Farcaster cüzdan tespiti
  useEffect(() => {
    const checkFarcasterWallet = async () => {
      try {
        if (typeof window !== "undefined") {
          // Farcaster Frame SDK'dan cüzdan bilgisini kontrol et
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
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {isFarcasterWallet && (
          <div className="bg-purple-900/20 text-white p-2 text-sm rounded-md mb-4 text-center">
            Warpcast cüzdanı tespit edildi. Warpcast cüzdanınızla işlem yapabilirsiniz.
          </div>
        )}
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// useAppKitAccount hook'u
export function useAppKitAccount() {
  const [state, setState] = useState({
    isConnected: false,
    address: "",
    isPending: false,
    isCorrectNetwork: false,
    networkSwitchError: "",
    connect: () => {},
    disconnect: () => {},
    switchToMonad: async () => {},
    addMonadNetwork: async () => {},
  })

  return state
}

// Varsayılan dışa aktarım olarak AppKitProvider'ı ekleyelim
export default AppKitProvider
