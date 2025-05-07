"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getPredictions } from "@/lib/predictions"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, User, Wallet } from "lucide-react"
import { useMiniAppContext } from "@/hooks/use-miniapp-context"

interface Prediction {
  id: string
  userId: number | string
  username: string
  displayName: string
  profilePicture: string
  price: number
  timeframe: string
  createdAt: string
  walletAddress?: string
}

export default function PredictionsList() {
  const { actions } = useMiniAppContext()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const data = await getPredictions()
        setPredictions(data)
      } catch (error) {
        console.error("Error fetching predictions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPredictions()

    // Set up an interval to refresh predictions every 10 seconds
    const interval = setInterval(fetchPredictions, 10000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval)
  }, [])

  const getTimeframeText = (timeframe: string) => {
    const options: Record<string, string> = {
      "1day": "1 Day Later",
      "1week": "1 Week Later",
      "1month": "1 Month Later",
    }
    return options[timeframe] || timeframe
  }

  // Function to format wallet address
  const formatWalletAddress = (address?: string) => {
    if (!address) return "N/A"
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <Card className="bg-black/40 border border-orange-500/30 text-white backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-orange-500">Recent Predictions</CardTitle>
            <CardDescription className="text-orange-200/70">User predictions for Bitcoin price</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-gray-700" />
                    <Skeleton className="h-4 w-[200px] bg-gray-700" />
                  </div>
                </div>
              ))}
          </div>
        ) : predictions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No predictions yet. Be the first to make a prediction!</div>
        ) : (
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div key={prediction.id} className="flex flex-col p-4 border border-orange-500/30 rounded-lg bg-black/60">
                <div className="flex items-center space-x-4 mb-3">
                  <Avatar>
                    {prediction.username === "0xmutu" ? (
                      <AvatarImage src="/images/mutu-logo-new.png" alt={prediction.displayName} />
                    ) : (
                      <AvatarFallback className="bg-orange-500">
                        <User className="h-6 w-6 text-white" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-white">{prediction.displayName}</p>
                    <p className="text-sm text-gray-400">@{prediction.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-500">${prediction.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">{getTimeframeText(prediction.timeframe)}</p>
                  </div>
                </div>

                {/* Wallet Address Section - Prominently displayed */}
                <div className="flex items-center mt-2 p-3 bg-gray-800/50 rounded-md border border-orange-500/20">
                  <Wallet className="h-5 w-5 text-orange-400 mr-2" />
                  <span className="text-sm text-gray-300 mr-2">Wallet:</span>
                  <span className="text-sm font-mono text-orange-300 font-bold">
                    {formatWalletAddress(prediction.walletAddress)}
                  </span>
                </div>

                {/* Prediction Date */}
                <div className="mt-2 text-xs text-gray-400 text-right">
                  Predicted on: {new Date(prediction.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {predictions.length === 0 && (
          <div className="mt-6 flex flex-col items-center justify-center bg-black/60 p-6 rounded-lg">
            <TrendingUp size={100} className="text-orange-500 mb-4" strokeWidth={1.5} />
            <p className="text-center text-orange-300">
              Make a prediction to see it appear here. All predictions are stored on-chain and visible to everyone.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
