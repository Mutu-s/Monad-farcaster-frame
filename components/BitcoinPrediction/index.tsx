"use client"

import { useState, useEffect } from "react"
import { useMiniAppContext } from "@/hooks/use-miniapp-context"
import PredictionForm from "./PredictionForm"
import PredictionsList from "./PredictionsList"
import WinnersList from "./WinnersList"
import { getCurrentBitcoinPrice } from "@/lib/bitcoin"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Bitcoin, TrendingUp, Award, Users } from "lucide-react"
import RewardInfo from "./RewardInfo"
import { useAuth } from "@/context/auth-context"
import { hasAnyPaymentBeenMade, markPaymentMade } from "@/lib/payments"

interface BitcoinPredictionProps {
  initialHasPaid: boolean
}

export default function BitcoinPrediction({ initialHasPaid }: BitcoinPredictionProps) {
  const { actions } = useMiniAppContext()
  const { user } = useAuth()
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("predict")
  const [priceChange, setPriceChange] = useState<{ value: number; isPositive: boolean } | null>(null)
  const [hasPaid, setHasPaid] = useState(initialHasPaid)

  // Function to update payment status
  const handlePaymentSuccess = () => {
    setHasPaid(true)
    markPaymentMade()
  }

  // Add this function to reset payment status
  const resetPaymentStatus = () => {
    setHasPaid(false)
  }

  useEffect(() => {
    let lastPrice: number | null = null

    const fetchPrice = async () => {
      try {
        const price = await getCurrentBitcoinPrice()
        setCurrentPrice(price)

        if (lastPrice !== null) {
          const change = price - lastPrice
          setPriceChange({
            value: Math.abs(change),
            isPositive: change >= 0,
          })
        }

        lastPrice = price
      } catch (error) {
        console.error("Error fetching Bitcoin price:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrice()
    // Refresh price every minute
    const interval = setInterval(fetchPrice, 60000)
    return () => clearInterval(interval)
  }, [])

  // Check payment status periodically
  useEffect(() => {
    const checkPaymentStatus = () => {
      const paid = hasAnyPaymentBeenMade()
      if (paid && !hasPaid) {
        setHasPaid(true)
      }
    }

    const interval = setInterval(checkPaymentStatus, 2000)
    return () => clearInterval(interval)
  }, [hasPaid])

  const handleViewProfile = () => {
    if (actions) {
      // If in Farcaster app, use the SDK to open URL
      actions.openUrl("https://warpcast.com/0xmutu")
    } else {
      // Fallback for browser
      window.open("https://warpcast.com/0xmutu", "_blank")
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center p-4 space-y-6 w-full max-w-4xl mx-auto"
      style={{
        background: "linear-gradient(135deg, #1F1225 0%, #2D1A3B 100%)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-orange-600/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl"></div>
      </div>

      {/* Profile Button - Always visible at the top */}
      <div className="w-full flex justify-end mb-2">
        <Button
          variant="outline"
          className="flex items-center gap-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
          onClick={handleViewProfile}
        >
          <img src="/images/mutu-logo-new.png" alt="mutu logo" width={24} height={24} className="rounded-full" />
          <span>View Profile</span>
          <ExternalLink size={16} />
        </Button>
      </div>

      <Card className="w-full border-orange-500/30 bg-black/40 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="relative">
              <img
                src="/images/mutu-logo-new.png"
                alt="mutu logo"
                width={80}
                height={80}
                className="rounded-full border-2 border-orange-500"
              />
              <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-pulse"></div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-orange-500">Bitcoin Price Prediction</CardTitle>
          <CardDescription className="text-orange-200 text-lg">
            Predict the future price of Bitcoin and win rewards if you're right!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-8">
              <div className="inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-orange-200">Loading Bitcoin price...</p>
            </div>
          ) : (
            <div className="text-center p-8 mb-4 bg-black/50 backdrop-blur-md rounded-xl border border-orange-500/30">
              <p className="text-lg text-orange-200">Current Bitcoin Price:</p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-5xl font-bold text-orange-50">${currentPrice?.toLocaleString()}</p>
                {priceChange && (
                  <span
                    className={`text-sm px-2 py-1 rounded-md flex items-center ${priceChange.isPositive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}
                  >
                    {priceChange.isPositive ? "↑" : "↓"} ${priceChange.value.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex justify-center mt-4">
                <Bitcoin size={64} className="text-orange-500 drop-shadow-[0_0_8px_rgba(255,140,50,0.5)]" />
              </div>
              <div className="mt-4 text-sm text-orange-300/70">Last updated: {new Date().toLocaleTimeString()}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black/50 backdrop-blur-md border border-orange-500/30 p-1 rounded-xl">
          <TabsTrigger
            value="predict"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg flex items-center gap-2"
          >
            <TrendingUp size={16} />
            Predict
          </TabsTrigger>
          <TabsTrigger
            value="predictions"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg flex items-center gap-2"
          >
            <Users size={16} />
            Predictions
          </TabsTrigger>
          <TabsTrigger
            value="winners"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg flex items-center gap-2"
          >
            <Award size={16} />
            Winners
          </TabsTrigger>
        </TabsList>
        <TabsContent value="predict" className="mt-4">
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-orange-500/30">
            <PredictionForm
              hasPaid={hasPaid}
              onPaymentSuccess={handlePaymentSuccess}
              onResetPayment={resetPaymentStatus}
            />
          </div>
        </TabsContent>
        <TabsContent value="predictions" className="mt-4">
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-orange-500/30">
            <PredictionsList />
          </div>
        </TabsContent>
        <TabsContent value="winners" className="mt-4">
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-orange-500/30">
            <WinnersList />
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 w-full border border-orange-500/30">
        <RewardInfo />
      </div>

      <footer className="w-full text-center p-6 border-t border-orange-500/30 mt-8 bg-black/40 backdrop-blur-md rounded-xl">
        <div className="flex items-center justify-center mb-4">
          <img
            src="/images/mutu-logo-new.png"
            alt="mutu logo"
            width={40}
            height={40}
            className="rounded-full mr-3 border-2 border-orange-500/50"
          />
          <p className="font-medium text-lg text-orange-500">Developed by @0xmutu</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 flex items-center gap-2 text-orange-500 hover:bg-orange-500/20"
          onClick={handleViewProfile}
        >
          <span>View Profile</span>
          <ExternalLink size={16} />
        </Button>
        <p className="text-sm text-orange-300/70 mt-4">
          Bitcoin Price Prediction Contest &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
