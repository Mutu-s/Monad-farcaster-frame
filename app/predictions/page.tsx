import PredictionsList from "@/components/BitcoinPrediction/PredictionsList"

export default function PredictionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">All Predictions</h1>
      <PredictionsList />
    </div>
  )
}
