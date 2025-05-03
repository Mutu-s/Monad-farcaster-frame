import { Suspense } from "react"
import BitcoinPredictionLoader from "@/components/BitcoinPrediction/BitcoinPredictionLoader"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Suspense fallback={<div className="p-8 text-center">Loading Bitcoin Prediction App...</div>}>
        <BitcoinPredictionLoader />
      </Suspense>
    </main>
  )
}
