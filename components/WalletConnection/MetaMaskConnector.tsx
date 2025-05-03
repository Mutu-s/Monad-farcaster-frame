"use client"

import { useState, useEffect } from "react"
import { useConnect, useAccount, useDisconnect } from "wagmi"

export default function MetaMaskConnector() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean | null>(null)
  const { connect, connectors, isPending, error } = useConnect()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Check if MetaMask is installed
  useEffect(() => {
    if (typeof window !== "undefined") {
      const { ethereum } = window
      setIsMetaMaskInstalled(
        !!ethereum && (ethereum.isMetaMask || ethereum.providers?.some((provider: any) => provider.isMetaMask)),
      )
    }
  }, [])

  // Handle MetaMask connection
  const connectMetaMask = async () => {
    try {
      setConnectionError(null)
      const injectedConnector = connectors.find((c) => c.id === "injected")

      if (!injectedConnector) {
        setConnectionError("MetaMask connector not found")
        return
      }

      console.log("Connecting to MetaMask...")
      await connect({ connector: injectedConnector })
    } catch (err) {
      console.error("MetaMask connection error:", err)
      setConnectionError(err instanceof Error ? err.message : "Failed to connect to MetaMask")
    }
  }

  // If MetaMask status is still being checked
  if (isMetaMaskInstalled === null) {
    return <div className="text-gray-400 text-sm">Checking for MetaMask...</div>
  }

  // If MetaMask is not installed
  if (!isMetaMaskInstalled) {
    return (
      <div className="p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg text-yellow-300 text-sm">
        <p className="font-medium mb-2">MetaMask Not Detected</p>
        <p>Please install MetaMask to connect your wallet.</p>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md text-sm"
        >
          Install MetaMask
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {!isConnected ? (
        <button
          onClick={connectMetaMask}
          disabled={isPending}
          className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md text-sm disabled:opacity-50"
        >
          {isPending ? "Connecting..." : "Connect with MetaMask"}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Connected with MetaMask</p>
            <p className="text-white text-sm font-mono break-all">{address}</p>
          </div>
          <button
            onClick={() => disconnect()}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm"
          >
            Disconnect
          </button>
        </div>
      )}

      {(connectionError || error) && (
        <div className="p-3 bg-red-900/20 border border-red-700/30 rounded-lg text-red-300 text-sm">
          {connectionError || error.message}
        </div>
      )}
    </div>
  )
}
