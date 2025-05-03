"use client"

import { useState } from "react"
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { monadTestnet } from "wagmi/chains"
import { farcasterFrame } from "@farcaster/frame-wagmi-connector"
import { useMobile } from "@/hooks/use-mobile"

interface AppKitButtonProps {
  onConnect?: () => void
}

export function AppKitButton({ onConnect }: AppKitButtonProps) {
  const { isConnected, address, chainId } = useAccount()
  const { connect, isPending: isConnectPending, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitchPending } = useSwitchChain()
  const [error, setError] = useState<string | null>(null)
  const isPending = isConnectPending || isSwitchPending
  const isCorrectNetwork = chainId === monadTestnet.id
  const { isMobile } = useMobile()

  // Switch to Monad network
  const switchToMonad = async () => {
    try {
      setError(null)
      await switchChain({ chainId: monadTestnet.id })
    } catch (err) {
      console.error("Network switching error:", err)
      setError("Failed to switch network. Please manually switch to Monad Testnet.")
    }
  }

  // Connect to wallet
  const handleConnect = async () => {
    try {
      setError(null)

      // Mobil cihazlarda sadece Farcaster Frame connector kullan
      if (isMobile) {
        await connect({ connector: farcasterFrame() })
      } else {
        // Masaüstünde önce Farcaster Frame connector ile bağlanmayı dene
        try {
          await connect({ connector: farcasterFrame() })
        } catch (farcasterError) {
          console.log("Farcaster connection failed, trying injected wallet:", farcasterError)

          // Farcaster bağlantısı başarısız olursa, injected connector (MetaMask) ile dene
          const injectedConnector = connectors.find((c) => c.id === "injected")
          if (injectedConnector) {
            try {
              console.log("Trying to connect with injected connector:", injectedConnector)
              await connect({ connector: injectedConnector })
            } catch (injectedError) {
              console.error("Injected connector error:", injectedError)
              throw new Error("Failed to connect with MetaMask. Please make sure MetaMask is installed and unlocked.")
            }
          } else {
            throw new Error("MetaMask not found. Please install MetaMask extension.")
          }
        }
      }

      if (onConnect) onConnect()
    } catch (err) {
      console.error("Connection error:", err)
      if (isMobile) {
        setError("Please open this app in Warpcast to connect your wallet.")
      } else {
        setError(err instanceof Error ? err.message : "An error occurred while connecting to wallet. Please try again.")
      }
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
          {isPending ? "Connecting..." : isMobile ? "Connect with Warpcast" : "Connect Wallet"}
        </button>
      )}

      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded-md border border-red-500/30">{error}</div>
      )}
    </div>
  )
}

export default AppKitButton
