"use client"

import { useState } from "react"
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { farcasterFrame } from "@farcaster/frame-wagmi-connector"
import type { Chain } from "wagmi"

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

interface AppKitButtonProps {
  onConnect?: () => void
}

export function AppKitButton({ onConnect }: AppKitButtonProps) {
  const { isConnected, address, chainId } = useAccount()
  const { connect, isPending: isConnectPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitchPending } = useSwitchChain()
  const [error, setError] = useState<string | null>(null)
  const isPending = isConnectPending || isSwitchPending
  const isCorrectNetwork = chainId === monadTestnetUpdated.id

  // Switch to Monad network
  const switchToMonad = async () => {
    try {
      setError(null)
      await switchChain({ chainId: monadTestnetUpdated.id })
    } catch (err) {
      console.error("Network switching error:", err)
      setError("Failed to switch network. Please manually switch to Monad Test Network.")
    }
  }

  // Connect to wallet
  const handleConnect = async () => {
    try {
      setError(null)
      await connect({ connector: farcasterFrame() })
      if (onConnect) onConnect()
    } catch (err) {
      console.error("Connection error:", err)
      setError("Failed to connect to wallet. Please try again.")
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {isConnected ? (
        <div className="flex flex-col items-center gap-2">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
          {!isCorrectNetwork && (
            <button
              onClick={switchToMonad}
              disabled={isPending}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors mb-2 disabled:opacity-50"
            >
              {isPending ? "Processing..." : "Switch to Monad Network"}
            </button>
          )}
          <button
            onClick={() => disconnect()}
            disabled={isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Disconnect"}
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isPending}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {isPending ? "Connecting..." : "Connect Wallet"}
        </button>
      )}

      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded-md border border-red-500/30">{error}</div>
      )}
    </div>
  )
}

export default AppKitButton
