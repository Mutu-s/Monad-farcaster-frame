"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { getCurrentBitcoinPrice } from "@/lib/bitcoin"
import { incrementPredictionCount } from "@/lib/payments"
import { useMiniAppContext } from "@/hooks/use-miniapp-context"
import { addPrediction } from "@/lib/predictions" // Import the actual addPrediction function
import PaymentRequirement from "./PaymentRequirement" // Use the existing PaymentRequirement component

interface PredictionFormProps {
  hasPaid: boolean
  onPaymentSuccess: () => void
  onResetPayment: () => void
}

export default function PredictionForm({ hasPaid, onPaymentSuccess, onResetPayment }: PredictionFormProps) {
  const { user } = useAuth()
  const { context } = useMiniAppContext()
  const { toast } = useToast()
  const [price, setPrice] = useState("")
  const [timeframe, setTimeframe] = useState("1day")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [predictionEntered, setPredictionEntered] = useState(false)
  const [pendingPrediction, setPendingPrediction] = useState<any>(null)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const price = await getCurrentBitcoinPrice()
        setCurrentPrice(price)
      } catch (error) {
        console.error("Error fetching Bitcoin price:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrice()
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!price) {
      toast({
        title: "Error",
        description: "Please enter a prediction price.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to make a prediction.",
        variant: "destructive",
      })
      return
    }

    setPendingPrediction({ price, timeframe })
    setPredictionEntered(true)
  }

  const handlePaymentSuccess = () => {
    submitPrediction()
    onPaymentSuccess()
  }

  // Function to submit the prediction after payment
  const submitPrediction = async () => {
    if (!pendingPrediction && !price) {
      toast({
        title: "Error",
        description: "Please enter a prediction price.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Use the pending prediction if available, otherwise use the current form values
      const predictionPrice = pendingPrediction ? pendingPrediction.price : price
      const predictionTimeframe = pendingPrediction ? pendingPrediction.timeframe : timeframe

      // Always use local images
      const profilePicture = user?.username === "0xmutu" ? "/images/mutu-logo-new.png" : "/images/default-avatar.png"

      // Create a new prediction with the user's wallet address
      const newPrediction = {
        userId: user?.id || context?.client?.address || Math.floor(Math.random() * 100000).toString(),
        username: user?.username || "Anonymous",
        displayName: user?.displayName || "Anonymous User",
        profilePicture: profilePicture,
        price: Number(predictionPrice),
        timeframe: predictionTimeframe,
        createdAt: new Date().toISOString(),
        walletAddress: context?.client?.address || user?.walletAddress || "Unknown",
      }

      console.log("Submitting prediction:", newPrediction)

      // Add the prediction to our storage
      await addPrediction(newPrediction)

      // Increment prediction count
      incrementPredictionCount()

      // Save to localStorage to track that user has made a prediction
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "user_prediction",
          JSON.stringify({
            price: predictionPrice,
            timeframe: predictionTimeframe,
            timestamp: new Date().toISOString(),
            walletAddress: context?.client?.address || user?.walletAddress,
          }),
        )
      }

      // Show success message
      toast({
        title: "Prediction Submitted!",
        description: "Your Bitcoin price prediction has been recorded.",
      })

      // Reset form
      setPrice("")

      // Show success message and reset UI state
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
        setPredictionEntered(false)
        setPendingPrediction(null)
      }, 3000)
    } catch (error) {
      console.error("Error submitting prediction:", error)
      toast({
        title: "Error",
        description: "An error occurred while submitting your prediction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center">Loading Bitcoin price...</div>
      ) : (
        <>
          {!hasPaid ? (
            <PaymentRequirement onPaymentSuccess={handlePaymentSuccess} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-300">
                  Bitcoin Price Prediction ($)
                </Label>
                <Input
                  type="number"
                  id="price"
                  placeholder="Enter your prediction"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-gray-900 border-orange-500/50 focus:border-orange-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe" className="text-gray-300">
                  Prediction Timeframe
                </Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="bg-gray-900 border-orange-500/50 focus:border-orange-500 text-white">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-orange-500/50">
                    <SelectItem value="1day">1 Day Later</SelectItem>
                    <SelectItem value="1week">1 Week Later</SelectItem>
                    <SelectItem value="1month">1 Month Later</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Prediction"}
              </Button>

              {showSuccessMessage && (
                <div className="p-4 bg-green-900/30 border border-green-500 rounded-md text-green-300 text-center">
                  Prediction submitted successfully!
                </div>
              )}
            </form>
          )}
        </>
      )}
    </div>
  )
}
