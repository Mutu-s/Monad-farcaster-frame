import { Award, Calendar, Coins, TrendingUp } from "lucide-react"

export default function RewardInfo() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <Award className="h-6 w-6 text-[#9B6DFF]" />
        <h2 className="text-2xl font-bold gradient-text">Reward Information</h2>
      </div>

      <div className="space-y-4">
        {/* Entry Fee */}
        <div className="bg-[#231F36]/80 p-4 rounded-lg border border-[#3D3A50]/30">
          <h4 className="text-[#9B6DFF] font-medium mb-2 flex items-center gap-2">
            <Coins className="h-4 w-4" /> Entry Fee
          </h4>
          <div className="flex items-center justify-between">
            <p className="text-[#B8A8FF]">One-time payment to participate</p>
            <p className="text-[#E9E8FF] font-bold">0.1 MONAD</p>
          </div>
        </div>

        {/* Daily Predictions */}
        <div className="bg-[#231F36]/80 p-4 rounded-lg border border-[#3D3A50]/30">
          <h4 className="text-[#9B6DFF] font-medium mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Daily Predictions
          </h4>
          <div className="flex items-center justify-between">
            <p className="text-[#B8A8FF]">Correct prediction within 1% margin</p>
            <p className="text-[#E9E8FF] font-bold">1 MONAD</p>
          </div>
        </div>

        {/* Weekly Predictions */}
        <div className="bg-[#231F36]/80 p-4 rounded-lg border border-[#3D3A50]/30">
          <h4 className="text-[#9B6DFF] font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Weekly Predictions
          </h4>
          <div className="flex items-center justify-between">
            <p className="text-[#B8A8FF]">Correct prediction within 1% margin</p>
            <p className="text-[#E9E8FF] font-bold">10 MONAD</p>
          </div>
        </div>

        {/* Monthly Predictions */}
        <div className="bg-[#231F36]/80 p-4 rounded-lg border border-[#3D3A50]/30">
          <h4 className="text-[#9B6DFF] font-medium mb-2 flex items-center gap-2">
            <Award className="h-4 w-4" /> Monthly Predictions
          </h4>
          <div className="flex items-center justify-between">
            <p className="text-[#B8A8FF]">Correct prediction within 1% margin</p>
            <p className="text-[#E9E8FF] font-bold">Special Prize</p>
          </div>
        </div>
      </div>

      <p className="text-[#8F8BA8] text-sm mt-4 text-center">
        Winners are selected from users who correctly predict the Bitcoin price within a 1% margin. Rewards are
        distributed after the prediction timeframe ends. The 0.1 MONAD entry fee contributes to the prize pool.
      </p>
    </div>
  )
}
