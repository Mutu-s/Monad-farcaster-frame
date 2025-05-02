import WinnersList from "@/components/BitcoinPrediction/WinnersList"

export default function WinnersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Winners</h1>
      <WinnersList />
    </div>
  )
}
