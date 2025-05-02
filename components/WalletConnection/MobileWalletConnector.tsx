"use client"

import { useState } from "react"
import { useAppKitAccount } from "./AppKitProvider"
import useMobile from "@/hooks/use-mobile"

export default function MobileWalletConnector() {
  const { connect, disconnect, isConnected, address, isPending } = useAppKitAccount()
  const { isMobile } = useMobile()
  const [showMobileOptions, setShowMobileOptions] = useState(false)

  // Only show this component on mobile devices
  if (!isMobile) {
    return null
  }

  return (
    <div className="w-full">
      {isConnected ? (
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm w-full text-center">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
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
              setShowMobileOptions(!showMobileOptions)
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors w-full"
          >
            {isPending ? "Bağlanıyor..." : "Cüzdan Bağla"}
          </button>

          {showMobileOptions && (
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
    </div>
  )
}
