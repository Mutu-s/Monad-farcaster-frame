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
      console.error("Ağ değiştirme hatası:", error)
      setNetworkSwitchError("Ağ değiştirilemedi. Lütfen manuel olarak Monad Test Ağına geçiş yapın.")
    }
  }

  const addMonadNetwork = async () => {
    try {
      setNetworkSwitchError("")
      // Ethereum provider'a erişim
      const ethereum = (window as any).ethereum
      if (!ethereum) {
        setNetworkSwitchError("MetaMask veya uyumlu bir cüzdan bulunamadı.")
        return
      }

      // Monad Testnet ağını ekle
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
      console.error("Ağ ekleme hatası:", error)
      setNetworkSwitchError("Ağ eklenemedi. Lütfen manuel olarak Monad Test Ağını ekleyin.")
    }
  }

  if (!isConnected) {
    return null
  }

  if (isCorrectNetwork) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
        <span className="block sm:inline">✅ Monad ağına bağlısınız</span>
      </div>
    )
  }

  return (
    <div className="mb-4">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-2">
        <span className="block sm:inline">⚠️ Monad ağına bağlı değilsiniz. Lütfen ağı değiştirin.</span>
      </div>

      <div className="flex flex-col space-y-2">
        <button
          onClick={switchToMonad}
          disabled={isPending}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isPending ? "Ağ değiştiriliyor..." : "Monad Ağına Geç"}
        </button>

        <button
          onClick={addMonadNetwork}
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isPending ? "Ağ ekleniyor..." : "Monad Ağını Ekle"}
        </button>
      </div>

      {networkSwitchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2">
          <span className="block sm:inline">Hata: {networkSwitchError}</span>
        </div>
      )}
    </div>
  )
}
