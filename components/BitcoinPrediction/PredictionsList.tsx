"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getPredictions } from "@/lib/predictions"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, User, RefreshCw } from "lucide-react"
import { useMiniAppContext } from "@/hooks/use-miniapp-context"
import { Button } from "@/components/ui/button"

interface Prediction {
  id: string
  userId: number
  username: string
  displayName: string
  profilePicture: string
  price: number
  timeframe: string
  createdAt: string
}

export default function PredictionsList() {
  const { actions } = useMiniAppContext()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchPredictions = async () => {
    setIsLoading(true)
    try {
      const data = await getPredictions()
      setPredictions(data)
      console.log("Fetched predictions:", data)
    } catch (error) {
      console.error("Error fetching predictions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh predictions when component mounts or refreshKey changes
  useEffect(() => {
    fetchPredictions()
  }, [refreshKey])

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const getTimeframeText = (timeframe: string) => {
    const options: Record<string, string> = {
      "1day": "1 Day Later",
      "1week": "1 Week Later",
      "1month": "1 Month Later",
    }
    return options[timeframe] || timeframe
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString()
    } catch (e) {
      return dateString
    }
  }

  return (
    <Card className="bg-black/40 border border-orange-500/30 text-white backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-orange-500">Recent Predictions</CardTitle>
            <CardDescription className="text-orange-200/70">User predictions for Bitcoin price</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(5)
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
              <div
                key={prediction.id}
                className="flex items-center space-x-4 p-4 border border-orange-500/30 rounded-lg bg-black/60"
              >
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
                  <p className="text-xs text-gray-500">{formatDate(prediction.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-500">${prediction.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">{getTimeframeText(prediction.timeframe)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex justify-center bg-black/60 p-4 rounded-lg">
          <TrendingUp size={200} className="text-orange-500" strokeWidth={1.5} />
        </div>
      </CardContent>
    </Card>
  )
}
