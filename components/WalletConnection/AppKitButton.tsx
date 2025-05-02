"use client"

import { useAppKitAccount } from "./AppKitProvider"

export function AppKitButton() {
  const { isConnected, address, connect, disconnect, isPending, isCorrectNetwork, switchToMonad } = useAppKitAccount()

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
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors mb-2"
            >
              Switch to Monad Network
            </button>
          )}
          <button
            onClick={disconnect}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          disabled={isPending}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {isPending ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  )
}

export default AppKitButton
