"use client"

import { useState, useEffect } from "react"
import { useSendTransaction } from "wagmi"
import { parseEther } from "viem"
import { Bitcoin, Coins, Shield, Zap, Award, Calendar, TrendingUp } from "lucide-react"
import { markUserAsPaid } from "@/lib/payments"
import { useAuth } from "@/context/auth-context"
import AppKitButton from "../WalletConnection/AppKitButton"
import { useAccount } from "wagmi"

interface AppKitPaymentRequirementProps {
  onPaymentSuccess: () => void
}

export default function AppKitPaymentRequirement({ onPaymentSuccess }: AppKitPaymentRequirementProps) {
  const { sendTransaction, isPending, isSuccess, isError, error } = useSendTransaction()
  const { isAuthenticated, user } = useAuth()
  const { isConnected, address } = useAccount()
  const [showConnectWallet, setShowConnectWallet] = useState(false)

  useEffect(() => {
    if (isSuccess) {
      // If user is authenticated, mark them as paid
      if (isAuthenticated && user) {
        markUserAsPaid(user.id)
      }

      // Call the success callback
      onPaymentSuccess()
    }
  }, [isSuccess, isAuthenticated, user, onPaymentSuccess])

  const handleSendTransaction = () => {
    sendTransaction({
      to: "0x9EF7b8dd1425B252d9468A53e6c9664da544D516",
      value: parseEther("0.1"),
    })
  }

  const handleConnectWallet = () => {
    setShowConnectWallet(true)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card rounded-xl p-8 border border-[#3D3A50]/50">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Bitcoin size={80} className="text-[#9B6DFF]" />
            <div className="absolute inset-0 rounded-full bg-[#9B6DFF]/20 animate-pulse"></div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-6 gradient-text">Bitcoin Prediction Entry</h2>

        {/* Reward Information Section */}
        <div className="bg-[#2D2B3B]/70 backdrop-blur-md p-6 rounded-xl mb-6 border border-[#3D3A50]/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-[#E9E8FF] flex items-center gap-2">
              <Award className="text-[#9B6DFF]" />
              Reward Information
            </h3>
          </div>

          <div className="space-y-4">
            {/* Entry Fee */}
            <div className="bg-[#231F36]/80 p-4 rounded-lg border border-[#3D3A50]/30">
              <h4 className="text-[#9B6DFF] font-medium mb-2 flex items-center gap-2">
                <Coins className="h-4 w-4" /> Entry Fee
              </h4>
              <div className="flex items-center justify-between">
                <p className="text-[#B8A8FF] text-sm">One-time payment to participate</p>
                <p className="text-[#E9E8FF] font-bold">0.1 MONAD</p>
              </div>
            </div>

            {/* Daily Predictions */}
            <div className="bg-[#231F36]/80 p-4 rounded-lg border border-[#3D3A50]/30">
              <h4 className="text-[#9B6DFF] font-medium mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Daily Predictions
              </h4>
              <div className="flex items-center justify-between">
                <p className="text-[#B8A8FF] text-sm">Correct prediction within 1% margin</p>
                <p className="text-[#E9E8FF] font-bold">1 MONAD</p>
              </div>
            </div>

            {/* Weekly Predictions */}
            <div className="bg-[#231F36]/80 p-4 rounded-lg border border-[#3D3A50]/30">
              <h4 className="text-[#9B6DFF] font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Weekly Predictions
              </h4>
              <div className="flex items-center justify-between">
                <p className="text-[#B8A8FF] text-sm">Correct prediction within 1% margin</p>
                <p className="text-[#E9E8FF] font-bold">10 MONAD</p>
              </div>
            </div>

            {/* Monthly Predictions */}
            <div className="bg-[#231F36]/80 p-4 rounded-lg border border-[#3D3A50]/30">
              <h4 className="text-[#9B6DFF] font-medium mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" /> Monthly Predictions
              </h4>
              <div className="flex items-center justify-between">
                <p className="text-[#B8A8FF] text-sm">Correct prediction within 1% margin</p>
                <p className="text-[#E9E8FF] font-bold">Special Prize</p>
              </div>
            </div>
          </div>

          <p className="text-[#8F8BA8] text-sm mt-4 text-center">
            Winners are selected from users who correctly predict the Bitcoin price within a 1% margin. Rewards are
            distributed after the prediction timeframe ends. The 0.1 MONAD entry fee contributes to the prize pool.
          </p>
        </div>

        {/* Payment Section */}
        <div className="bg-[#2D2B3B]/70 backdrop-blur-md p-6 rounded-xl mb-6 border border-[#3D3A50]/50">
          <div className="flex items-start gap-4 mb-6">
            <Shield className="text-[#9B6DFF] h-10 w-10 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-[#E9E8FF] mb-1">Entry Fee Required</h3>
              <p className="text-[#B8A8FF]">
                To participate in Bitcoin price predictions, a one-time payment of 0.1 MON is required. This gives you
                unlimited access to make predictions and compete for rewards.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 bg-[#231F36]/80 p-5 rounded-xl mb-6 border border-[#3D3A50]/30">
            <Coins className="h-8 w-8 text-[#9B6DFF]" />
            <span className="text-3xl font-bold text-[#E9E8FF]">0.1 MON</span>
            <span className="text-sm text-[#B8A8FF] bg-[#3D3A50]/30 px-3 py-1 rounded-full">Entry Fee</span>
          </div>

          <div className="flex items-start gap-3 bg-[#1A1626]/70 p-4 rounded-xl">
            <Zap className="h-6 w-6 text-[#9B6DFF] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium text-[#E9E8FF] mb-1">Benefits Include:</h4>
              <ul className="text-[#B8A8FF] text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#9B6DFF] rounded-full"></span>
                  Unlimited Bitcoin price predictions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#9B6DFF] rounded-full"></span>
                  Compete for MON token rewards
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#9B6DFF] rounded-full"></span>
                  Access to prediction history and statistics
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#9B6DFF] rounded-full"></span>
                  Leaderboard placement opportunities
                </li>
              </ul>
            </div>
          </div>
        </div>

        {!isConnected ? (
          <div className="w-full space-y-4">
            <p className="text-center text-[#B8A8FF] mb-2">Connect your wallet to pay the entry fee</p>
            <AppKitButton onConnect={handleConnectWallet} />
          </div>
        ) : (
          <button
            onClick={handleSendTransaction}
            disabled={isPending}
            className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-3 button-glow ${
              isPending
                ? "bg-[#9B6DFF]/50 cursor-not-allowed"
                : "bg-[#9B6DFF] hover:bg-[#8A5CF7] hover:shadow-lg hover:shadow-[#9B6DFF]/20 hover:-translate-y-0.5"
            }`}
          >
            <Bitcoin size={24} />
            {isPending ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Processing...
              </>
            ) : (
              "Pay 0.1 MON Entry Fee"
            )}
          </button>
        )}

        {isError && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-red-300 text-sm">
            <p className="font-medium mb-1">Transaction Error:</p>
            <p>{error?.message}</p>
          </div>
        )}

        <p className="text-center text-[#8F8BA8] text-sm mt-6">Payment is processed securely on the Monad blockchain</p>
      </div>
    </div>
  )
}
