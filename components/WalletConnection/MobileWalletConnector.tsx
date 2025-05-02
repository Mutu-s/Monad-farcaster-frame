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
  const { connect, isPending: isConnectPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitchPending } = useSwitchChain()
  const { toast } = useToast()
  const [isWrongNetwork, setIsWrongNetwork] = useState(false)
  const isPending = isConnectPending || isSwitchPending

  // Ağ kontrolü
  useEffect(() => {
    if (isConnected && chainId !== monadTestnet.id) {
      setIsWrongNetwork(true)
    } else {
      setIsWrongNetwork(false)
    }
  }, [isConnected, chainId])

  // Monad ağına geçiş
  const handleSwitchToMonad = async () => {
    try {
      await switchChain({ chainId: monadTestnet.id })
      toast({
        title: "Ağ değiştirildi",
        description: "Monad Test Ağına başarıyla geçiş yapıldı.",
      })
      setIsWrongNetwork(false)
    } catch (error) {
      console.error("Ağ değiştirme hatası:", error)
      toast({
        variant: "destructive",
        title: "Ağ değiştirilemedi",
        description: "Lütfen cüzdan uygulamanızda manuel olarak Monad Test Ağına geçiş yapın.",
      })
    }
  }

  // Cüzdana bağlanma
  const handleConnect = async () => {
    try {
      await connect({ connector: farcasterFrame() })
    } catch (error) {
      console.error("Bağlantı hatası:", error)
      toast({
        variant: "destructive",
        title: "Bağlantı hatası",
        description: "Cüzdana bağlanırken bir hata oluştu. Lütfen tekrar deneyin.",
      })
    }
  }

  if (!isMobile) return null

  return (
    <div className="w-full mb-4">
      {isConnected && isWrongNetwork && (
        <div className="bg-amber-600/20 border border-amber-600/50 rounded-lg p-3 mb-4">
          <p className="text-amber-200 text-sm mb-2">Yanlış ağdasınız. Lütfen Monad Test Ağına geçiş yapın.</p>
          <button
            onClick={handleSwitchToMonad}
            disabled={isPending}
            className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md text-sm w-full disabled:opacity-50"
          >
            {isPending ? "İşlem yapılıyor..." : "Monad Test Ağına Geç"}
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
            {isPending ? "Bağlanıyor..." : "Cüzdana Bağlan"}
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
              <p className="text-gray-400 text-xs mb-1">Bağlı Cüzdan</p>
              <p className="text-white text-sm font-mono break-all">{address}</p>
            </div>
            <button
              onClick={() => disconnect()}
              disabled={isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {isPending ? "İşlem yapılıyor..." : "Bağlantıyı Kes"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
