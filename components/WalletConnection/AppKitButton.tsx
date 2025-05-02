"use client"

import { useState } from "react"
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { monadTestnet } from "wagmi/chains"
import { farcasterFrame } from "@farcaster/frame-wagmi-connector"

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
  const isCorrectNetwork = chainId === monadTestnet.id

  // Monad ağına geçiş
  const switchToMonad = async () => {
    try {
      setError(null)
      await switchChain({ chainId: monadTestnet.id })
    } catch (err) {
      console.error("Ağ değiştirme hatası:", err)
      setError("Ağ değiştirilemedi. Lütfen manuel olarak Monad Test Ağına geçiş yapın.")
    }
  }

  // Cüzdana bağlanma
  const handleConnect = async () => {
    try {
      setError(null)
      await connect({ connector: farcasterFrame() })
      if (onConnect) onConnect()
    } catch (err) {
      console.error("Bağlantı hatası:", err)
      setError("Cüzdana bağlanırken bir hata oluştu. Lütfen tekrar deneyin.")
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
              {isPending ? "İşlem yapılıyor..." : "Monad Ağına Geç"}
            </button>
          )}
          <button
            onClick={() => disconnect()}
            disabled={isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {isPending ? "İşlem yapılıyor..." : "Bağlantıyı Kes"}
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isPending}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {isPending ? "Bağlanıyor..." : "Cüzdana Bağlan"}
        </button>
      )}

      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded-md border border-red-500/30">{error}</div>
      )}
    </div>
  )
}

export default AppKitButton
