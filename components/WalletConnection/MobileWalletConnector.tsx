"use client"

import { useState, useEffect } from "react"
import { useAppKitAccount } from "./AppKitProvider"
import useMobile from "@/hooks/use-mobile"
import { sdk } from "@farcaster/frame-sdk"

export default function MobileWalletConnector() {
  const {
    connect,
    disconnect,
    isConnected,
    address,
    isPending,
    isCorrectNetwork,
    switchToMonad,
    networkSwitchError,
    isWarpcastWallet,
  } = useAppKitAccount()
  const { isMobile } = useMobile()
  const [showMobileOptions, setShowMobileOptions] = useState(false)

  useEffect(() => {
    // Notify Frame SDK that we're ready
    sdk.actions.ready()
  }, [])

  // Only show this component on mobile devices
  if (!isMobile) {
    return null
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-900 rounded-lg border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-4 text-center">
        {isWarpcastWallet ? "Warpcast Cüzdan" : "Mobil Cüzdan Bağlantısı"}
      </h2>

      {isConnected ? (
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="bg-gray-800 text-white px-4 py-3 rounded-md text-sm w-full text-center">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>

          {!isCorrectNetwork && (
            <div className="w-full">
              <button
                onClick={switchToMonad}
                disabled={isPending}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-md transition-colors w-full mb-3"
              >
                {isPending ? "İşlem Yapılıyor..." : "Monad Ağına Geç"}
              </button>

              {networkSwitchError && (
                <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md text-sm mb-3">
                  <p className="font-medium">Ağ değiştirme hatası:</p>
                  <p>{networkSwitchError}</p>
                  <p className="mt-2 text-xs">
                    Cüzdan uygulamanızda manuel olarak Monad Testnet ağına geçiş yapmanız gerekebilir.
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={disconnect}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors w-full"
          >
            Cüzdanı Ayır
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => {
              if (isWarpcastWallet) {
                connect()
              } else {
                setShowMobileOptions(!showMobileOptions)
              }
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors w-full"
          >
            {isPending ? "Bağlanıyor..." : isWarpcastWallet ? "Warpcast ile Bağlan" : "Cüzdan Bağla"}
          </button>

          {showMobileOptions && !isWarpcastWallet && (
            <div className="flex flex-col gap-2 mt-2 w-full">
              <button
                onClick={() => {
                  connect()
                  setShowMobileOptions(false)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors w-full"
              >
                WalletConnect ile Bağlan
              </button>
              <p className="text-xs text-gray-400 text-center mt-1">
                Metamask, Trust Wallet veya diğer mobil cüzdanlar desteklenir
              </p>
            </div>
          )}
        </div>
      )}

      {isWarpcastWallet && (
        <div className="mt-3 bg-purple-900/30 border border-purple-700 text-purple-300 p-3 rounded-md text-sm">
          <p>Warpcast cüzdan entegrasyonu aktif.</p>
        </div>
      )}
    </div>
  )
}
