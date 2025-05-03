"use client"

import { useAccount, useSwitchChain } from "wagmi"
import { monadTestnet } from "wagmi/chains"
import { useState } from "react"

export default function NetworkSwitcher() {
  const { isConnected, chainId } = useAccount()
  const { switchChain, isPending } = useSwitchChain()
  const [networkSwitchError, setNetworkSwitchError] = useState("")
  const isCorrectNetwork = chainId === monadTestnet.id

  const switchToMonad = async () => {
    try {
      setNetworkSwitchError("")
      await switchChain({ chainId: monadTestnet.id })
    } catch (error) {
      console.error("Network switching error:", error)
      setNetworkSwitchError("Failed to switch network. Please manually switch to Monad Testnet.")
    }
  }

  const addMonadNetwork = async () => {
    try {
      setNetworkSwitchError("")
      // Access to Ethereum provider
      const ethereum = (window as any).ethereum
      if (!ethereum) {
        setNetworkSwitchError("MetaMask or compatible wallet not found.")
        return
      }

      // Add Monad Testnet network
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${monadTestnet.id.toString(16)}`,
            chainName: "Monad Testnet",
            nativeCurrency: {
              name: "Monad",
              symbol: "MON",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.testnet.monad.xyz/"],
            blockExplorerUrls: ["https://testnet.monadexplorer.com/"],
          },
        ],
      })
    } catch (error) {
      console.error("Network adding error:", error)
      setNetworkSwitchError("Failed to add network. Please manually add Monad Testnet.")
    }
  }

  if (!isConnected) {
    return null
  }

  if (isCorrectNetwork) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
        <span className="block sm:inline">✅ You are connected to the Monad network</span>
      </div>
    )
  }

  return (
    <div className="mb-4">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-2">
        <span className="block sm:inline">⚠️ You are not connected to the Monad network. Please switch networks.</span>
      </div>

      <div className="flex flex-col space-y-2">
        <button
          onClick={switchToMonad}
          disabled={isPending}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isPending ? "Switching network..." : "Switch to Monad Network"}
        </button>

        <button
          onClick={addMonadNetwork}
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isPending ? "Adding network..." : "Add Monad Network"}
        </button>
      </div>

      {networkSwitchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2">
          <span className="block sm:inline">Error: {networkSwitchError}</span>
        </div>
      )}
    </div>
  )
}
