"use client"

import { User } from "./User"
import { FarcasterActions } from "./FarcasterActions"
import { WalletActions } from "./WalletActions"
import Image from "next/image"
import { useMiniAppContext } from "@/hooks/use-miniapp-context"

// Home bileşenini dışa aktaralım
export function Home() {
  const { context } = useMiniAppContext()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <Image src="/images/mutu-logo.png" alt="mutu Logo" width={120} height={120} className="mb-4" />
          <h1 className="text-3xl font-bold text-center text-orange-800">Bitcoin Price Prediction</h1>
          <p className="text-center text-orange-700 mt-2">Predict the future price of Bitcoin and win rewards!</p>

          {context?.user && (
            <div className="flex items-center mt-4 bg-orange-200 p-3 rounded-lg">
              {context.user.pfpUrl && (
                <Image
                  src={context.user.pfpUrl || "/placeholder.svg"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
              )}
              <div>
                <p className="font-medium text-orange-900">
                  Welcome, {context.user.displayName || context.user.username}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <User />
          <FarcasterActions />
          <WalletActions />
        </div>
      </div>
    </div>
  )
}

// Demo bileşenini de dışa aktaralım (önceki kodda vardı)
export function Demo() {
  const { context } = useMiniAppContext()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <Image src="/images/mutu-logo.png" alt="mutu Logo" width={120} height={120} className="mb-4" />
          <h1 className="text-3xl font-bold text-center text-orange-800">Bitcoin Price Prediction</h1>
          <p className="text-center text-orange-700 mt-2">Predict the future price of Bitcoin and win rewards!</p>

          {context?.user && (
            <div className="flex items-center mt-4 bg-orange-200 p-3 rounded-lg">
              {context.user.pfpUrl && (
                <Image
                  src={context.user.pfpUrl || "/placeholder.svg"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
              )}
              <div>
                <p className="font-medium text-orange-900">
                  Welcome, {context.user.displayName || context.user.username}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <User />
          <FarcasterActions />
          <WalletActions />
        </div>
      </div>
    </div>
  )
}
