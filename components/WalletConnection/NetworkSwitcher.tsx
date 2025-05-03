"use client"

import { useAppKitAccount } from "./AppKitProvider"

export default function NetworkSwitcher() {
  const { isConnected, isCorrectNetwork, switchToMonad, addMonadNetwork, isPending, networkSwitchError } =
    useAppKitAccount()

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
