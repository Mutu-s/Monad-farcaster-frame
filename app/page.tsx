"use client"

import { Suspense } from "react"
import BitcoinPredictionLoader from "@/components/BitcoinPrediction/BitcoinPredictionLoader"
import { MobileWalletConnector } from "@/components/WalletConnection/MobileWalletConnector"
import NetworkSwitcher from "@/components/WalletConnection/NetworkSwitcher"
import MetaMaskConnector from "@/components/WalletConnection/MetaMaskConnector"
import { useMobile } from "@/hooks/use-mobile"

// Client component to conditionally render based on mobile status
function WalletConnectors() {
  const { isMobile } = useMobile()

  return (
    <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm p-4">
      {isMobile ? (
        <MobileWalletConnector />
      ) : (
        <div className="space-y-4">
          <MetaMaskConnector />
          <NetworkSwitcher />
        </div>
      )}
    </div>
  )
}

// Make WalletConnectors a client component
const ClientWalletConnectors = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading wallet connectors...</div>}>
      <WalletConnectors />
    </Suspense>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ClientWalletConnectors />
      <Suspense fallback={<div className="p-8 text-center">Loading Bitcoin Prediction App...</div>}>
        <BitcoinPredictionLoader />
      </Suspense>
    </main>
  )
}
