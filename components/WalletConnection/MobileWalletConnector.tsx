"use client"

import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { monadTestnet } from "wagmi/chains"
import { useToast } from "@/components/ui/use-toast"
import { farcasterFrame } from "@farcaster/frame-wagmi-connector"

export function MobileWalletConnector() {
  const { isMobile } = useMobile()
  const { isConnected, address, chainId } = useAccount()
  const { connect, isPending: isConnectPending, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitchPending } = useSwitchChain()
  const { toast } = useToast()
  const [isWrongNetwork, setIsWrongNetwork] = useState(false)
  const isPending = isConnectPending || isSwitchPending

  // Network check
  useEffect(() => {
    if (isConnected && chainId !== monadTestnet.id) {
      setIsWrongNetwork(true)
    } else {
      setIsWrongNetwork(false)
    }
  }, [isConnected, chainId])

  // Switch to Monad network
  const handleSwitchToMonad = async () => {
    try {
      await switchChain({ chainId: monadTestnet.id })
      toast({
        title: "Network Changed",
        description: "Successfully switched to Monad Testnet.",
      })
      setIsWrongNetwork(false)
    } catch (error) {
      console.error("Network switching error:", error)
      toast({
        variant: "destructive",
        title: "Failed to Switch Network",
        description: "Please manually switch to Monad Testnet in your wallet app.",
      })
    }
  }

  // Connect to wallet - Mobil cihazlarda sadece Farcaster Frame connector kullan
  const handleConnect = async () => {
    try {
      // Mobil cihazlarda sadece Farcaster Frame connector kullan
      await connect({ connector: farcasterFrame() })
    } catch (error) {
      console.error("Connection error:", error)
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Please open this app in Warpcast to connect your wallet.",
      })
    }
  }

  if (!isMobile) return null

  return (
    <div className="w-full mb-4">
      {isConnected && isWrongNetwork && (
        <div className="bg-amber-600/20 border border-amber-600/50 rounded-lg p-3 mb-4">
          <p className="text-amber-200 text-sm mb-2">You are on the wrong network. Please switch to Monad Testnet.</p>
          <button
            onClick={handleSwitchToMonad}
            disabled={isPending}
            className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md text-sm w-full disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Switch to Monad Testnet"}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {!isConnected ? (
          <button
            onClick={handleConnect}
            disabled={isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {isPending ? "Connecting..." : "Connect with Warpcast"}
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Connected Wallet</p>
              <p className="text-white text-sm font-mono break-all">{address}</p>
            </div>
            <button
              onClick={() => disconnect()}
              disabled={isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {isPending ? "Processing..." : "Disconnect"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
