"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { farcasterFrame } from "@farcaster/frame-wagmi-connector"
import { createConfig, http, WagmiProvider } from "wagmi"
import type { Chain } from "wagmi"

// Add this constant to define the correct Monad testnet chain
const monadTestnetUpdated: Chain = {
  id: 10143,
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "MONAD",
    symbol: "MON",
  },
  rpcUrls: {
    public: { http: ["https://testnet-rpc.monad.xyz/"] },
    default: { http: ["https://testnet-rpc.monad.xyz/"] },
  },
  blockExplorers: {
    default: { name: "MonadExplorer", url: "https://testnet.monadexplorer.com/" },
  },
}

export const config = createConfig({
  chains: [monadTestnetUpdated],
  transports: {
    [monadTestnetUpdated.id]: http(),
  },
  connectors: [farcasterFrame()],
})

const queryClient = new QueryClient()

export default function FrameWalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
