import { Suspense } from "react"
import BitcoinPredictionLoader from "@/components/BitcoinPrediction/BitcoinPredictionLoader"
import MobileCheck from "@/components/MobileCheck"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <MobileCheck />
      </div>
      <Suspense fallback={<div className="p-8 text-center">Loading Bitcoin Prediction App...</div>}>
        <BitcoinPredictionLoader />
      </Suspense>
    </main>
  )
}
