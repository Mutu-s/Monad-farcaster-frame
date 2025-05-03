"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, User } from "lucide-react"
import { getWinners } from "@/lib/predictions"
import { Skeleton } from "@/components/ui/skeleton"

interface Winner {
  id: string
  userId: number
  username: string
  displayName: string
  profilePicture: string
  price: number
  actualPrice: number
  timeframe: string
  predictionDate: string
  winDate: string
  reward: string
}

export default function WinnersList() {
  const [winners, setWinners] = useState<Winner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const data = await getWinners()
        setWinners(data)
      } catch (error) {
        console.error("Error fetching winners:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWinners()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-black/40 border border-orange-500/30 text-white backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-orange-500">Winners</CardTitle>
            <CardDescription className="text-orange-200/70">
              Users who made correct predictions and won rewards
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          <Trophy size={96} className="text-yellow-500" />
        </div>

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
        ) : winners.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No winners yet. You could be the first winner!</div>
        ) : (
          <div className="space-y-4">
            {winners.map((winner) => (
              <div
                key={winner.id}
                className="flex flex-col p-4 border border-orange-500/50 rounded-lg bg-black/60 space-y-3"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    {winner.username === "0xmutu" ? (
                      <AvatarImage src="/images/mutu-logo-new.png" alt={winner.displayName} />
                    ) : (
                      <AvatarFallback className="bg-orange-500">
                        <User className="h-6 w-6 text-white" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-white">{winner.displayName}</p>
                    <p className="text-sm text-gray-400">@{winner.username}</p>
                  </div>
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">Winner!</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">Prediction:</p>
                    <p className="font-bold text-orange-500">${winner.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Actual Price:</p>
                    <p className="font-bold text-white">${winner.actualPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Prediction Date:</p>
                    <p className="text-white">{formatDate(winner.predictionDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Win Date:</p>
                    <p className="text-white">{formatDate(winner.winDate)}</p>
                  </div>
                </div>

                <div className="mt-2 p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded text-center">
                  <p className="font-medium text-yellow-500">Reward: {winner.reward}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
