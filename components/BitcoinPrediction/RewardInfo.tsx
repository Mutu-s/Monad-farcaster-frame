import { Award, Trophy, Medal } from "lucide-react"

export default function RewardInfo() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-orange-500 mb-2">Rewards & Prizes</h2>
        <p className="text-orange-200">Make accurate Bitcoin price predictions and win rewards!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-orange-500/30 flex flex-col items-center">
          <div className="bg-orange-500/20 p-3 rounded-full mb-3">
            <Trophy className="h-8 w-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-orange-400 mb-2">Daily Predictions</h3>
          <p className="text-center text-orange-200">
            Predict Bitcoin's price 24 hours from now. Most accurate prediction wins 1 MONAD.
          </p>
        </div>

        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-orange-500/30 flex flex-col items-center">
          <div className="bg-orange-500/20 p-3 rounded-full mb-3">
            <Award className="h-8 w-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-orange-400 mb-2">Weekly Predictions</h3>
          <p className="text-center text-orange-200">
            Predict Bitcoin's price 7 days from now. Most accurate prediction wins 5 MONAD.
          </p>
        </div>

        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-orange-500/30 flex flex-col items-center">
          <div className="bg-orange-500/20 p-3 rounded-full mb-3">
            <Medal className="h-8 w-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-orange-400 mb-2">Monthly Predictions</h3>
          <p className="text-center text-orange-200">
            Predict Bitcoin's price 30 days from now. Most accurate prediction wins 10 MONAD.
          </p>
        </div>
      </div>

      <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-orange-500/30">
        <h3 className="text-lg font-semibold text-orange-400 mb-2">How It Works</h3>
        <ol className="list-decimal list-inside space-y-2 text-orange-200">
          <li>Pay the 0.1 MONAD entry fee to participate</li>
          <li>Submit your Bitcoin price prediction for your chosen timeframe</li>
          <li>Winners are determined by the closest prediction to the actual price</li>
          <li>Rewards are distributed automatically to winners' wallets</li>
        </ol>
      </div>
    </div>
  )
}
