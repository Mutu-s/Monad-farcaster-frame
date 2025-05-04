"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Check, Clock } from "lucide-react"
import { addPrediction } from "@/lib/predictions"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/context/auth-context"
import { incrementPredictionCount } from "@/lib/payments"
import { useSendTransaction } from "wagmi"
import { parseEther } from "viem"
import AppKitButton from "../WalletConnection/AppKitButton"
import { useAccount } from "wagmi"
import { useMobile } from "@/hooks/use-mobile"
import { sdk } from "@farcaster/frame-sdk"

// Payment address for MON tokens
const PAYMENT_ADDRESS = "0x9EF7b8dd1425B252d9468A53e6c9664da544D516"

interface PredictionFormProps {
  hasPaid: boolean
  onPaymentSuccess: () => void
  onResetPayment?: () => void
  onPredictionSubmitted?: () => void
}

// Function to check if a date is today
function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

// Function to get time until midnight
function getTimeUntilMidnight(): string {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)

  const diffMs = midnight.getTime() - now.getTime()
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  return `${diffHrs}h ${diffMins}m`
}

export default function PredictionForm({
  hasPaid,
  onPaymentSuccess,
  onResetPayment,
  onPredictionSubmitted,
}: PredictionFormProps) {
  const { isAuthenticated, user } = useAuth()
  const [price, setPrice] = useState("")
  const [timeframe, setTimeframe] = useState("1week")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { sendTransaction, isPending, isSuccess } = useSendTransaction()
  const { isConnected, address } = useAccount()
  const [predictionSubmitted, setPredictionSubmitted] = useState(false)
  const [submittedPrice, setSubmittedPrice] = useState("")
  const [submittedTimeframe, setSubmittedTimeframe] = useState("")
  const formRef = useRef<HTMLFormElement>(null)
  const { isMobile } = useMobile()

  // Add states for daily prediction tracking
  const [hasAlreadyPredictedToday, setHasAlreadyPredictedToday] = useState(false)
  const [lastPredictionDate, setLastPredictionDate] = useState<Date | null>(null)
  const [timeUntilNextPrediction, setTimeUntilNextPrediction] = useState("")

  // Update time until midnight every minute
  useEffect(() => {
    if (hasAlreadyPredictedToday) {
      setTimeUntilNextPrediction(getTimeUntilMidnight())

      const interval = setInterval(() => {
        setTimeUntilNextPrediction(getTimeUntilMidnight())
      }, 60000) // Update every minute

      return () => clearInterval(interval)
    }
  }, [hasAlreadyPredictedToday])

  // Add this useEffect to check if the user has already made a prediction today when the component mounts
  useEffect(() => {
    // Check localStorage for existing prediction
    if (typeof window !== "undefined") {
      const existingPrediction = localStorage.getItem("user_prediction")
      if (existingPrediction) {
        const prediction = JSON.parse(existingPrediction)
        setSubmittedPrice(prediction.price)
        setSubmittedTimeframe(prediction.timeframe)

        // Check if the prediction was made today
        const predictionDate = new Date(prediction.timestamp)
        setLastPredictionDate(predictionDate)

        if (isToday(predictionDate)) {
          setHasAlreadyPredictedToday(true)
        } else {
          // If prediction was not made today, user can make a new prediction
          setHasAlreadyPredictedToday(false)
        }
      }
    }
  }, [])

  // Handle wallet connection for web (MetaMask)
  const connectMetaMask = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        // Request connection to MetaMask
        await window.ethereum.request({ method: "eth_requestAccounts" })

        // Switch to Monad Testnet
        await window.ethereum
          .request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x279f" }], // Monad Testnet chain ID (10143 in hex)
          })
          .catch(async (switchError: any) => {
            // If the network is not added, add it
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x279f", // 10143 in hex
                    chainName: "Monad Testnet",
                    nativeCurrency: {
                      name: "MONAD",
                      symbol: "MON",
                      decimals: 18,
                    },
                    rpcUrls: ["https://testnet-rpc.monad.xyz/"],
                    blockExplorerUrls: ["https://testnet.monadexplorer.com/"],
                  },
                ],
              })
            }
          })

        toast({
          title: "Wallet Connected",
          description: "MetaMask wallet connected successfully!",
        })
      } catch (error) {
        console.error("MetaMask connection error:", error)
        toast({
          title: "Connection Failed",
          description: "Failed to connect to MetaMask. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask extension to connect your wallet.",
        variant: "destructive",
      })
    }
  }

  // Handle wallet connection
  const handleConnect = () => {
    if (isMobile) {
      // Mobile uses AppKitButton component which has its own connection logic
      return
    } else {
      // Web uses MetaMask connection
      connectMetaMask()
    }
  }

  // Handle payment success
  useEffect(() => {
    if (isSuccess && !hasPaid) {
      // Regular payment success
      onPaymentSuccess()
    }
  }, [isSuccess, hasPaid, onPaymentSuccess])

  // Handle payment
  const handlePayment = () => {
    if (!isConnected) return

    sendTransaction({
      to: PAYMENT_ADDRESS,
      value: parseEther("1"),
    })
  }

  // Handle view profile
  const handleViewProfile = async () => {
    try {
      await sdk.actions.viewProfile({ fid: 453685 })
    } catch (error) {
      console.error("Error viewing profile:", error)
      window.open("https://warpcast.com/0xmutu", "_blank")
    }
  }

  // Modify the handleSubmit function to save the prediction to localStorage with timestamp
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to make predictions.",
        variant: "destructive",
      })
      return
    }

    if (!hasPaid) {
      toast({
        title: "Payment Required",
        description: "You must send 1 MON to participate in the prediction contest.",
        variant: "destructive",
      })
      return
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid Bitcoin price.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Always use local images
      const profilePicture = user?.username === "0xmutu" ? "/images/mutu-logo-new.png" : "/images/default-avatar.png"

      const newPrediction = await addPrediction({
        userId: user?.id || Math.floor(Math.random() * 100000),
        username: user?.username || "Anonymous",
        displayName: user?.displayName || "Anonymous User",
        profilePicture: profilePicture,
        price: Number(price),
        timeframe,
        createdAt: new Date().toISOString(),
      })

      console.log("Prediction added:", newPrediction)

      // Increment prediction count
      incrementPredictionCount()

      // Save the submitted values
      setSubmittedPrice(price)
      setSubmittedTimeframe(timeframe)

      // Get current date and time
      const now = new Date()
      setLastPredictionDate(now)

      // Save to localStorage to track that user has made a prediction today
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "user_prediction",
          JSON.stringify({
            price,
            timeframe,
            timestamp: now.toISOString(),
          }),
        )
      }

      // Set that user has already predicted today
      setHasAlreadyPredictedToday(true)

      // Show success message
      toast({
        title: "Prediction Submitted!",
        description: "Your Bitcoin price prediction has been recorded.",
      })

      // Set prediction as submitted
      setPredictionSubmitted(true)

      // Notify parent component that a prediction was submitted
      if (onPredictionSubmitted) {
        onPredictionSubmitted()
      }

      // Clear the form
      setPrice("")
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

  // Add this after the handleSubmit function
  useEffect(() => {
    // If prediction was submitted, show success message for 3 seconds then reset to payment page
    if (predictionSubmitted) {
      const timer = setTimeout(() => {
        // Reset to payment page
        setPredictionSubmitted(false)

        // Reset payment status
        if (typeof window !== "undefined") {
          localStorage.removeItem("bitcoin_prediction_payment_status")
        }

        // Notify parent component
        if (onResetPayment) {
          onResetPayment()
        }
      }, 3000) // Show success message for 3 seconds

      return () => clearTimeout(timer)
    }
  }, [predictionSubmitted, onResetPayment])

  const timeframeOptions = {
    "1day": "1 Day Later",
    "1week": "1 Week Later",
    "1month": "1 Month Later",
  }

  // If authenticated but hasn't paid, show payment button
  if (!hasPaid) {
    return (
      <div
        style={{
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          margin: "0 auto",
          background: "#1A1626",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          width: "100%",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              style={{
                color: "#E9E8FF",
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              Bitcoin Price Prediction
            </h1>
            <p
              style={{
                color: "#B8A8FF",
                fontSize: "14px",
                marginTop: "4px",
              }}
            >
              Predict the future price of Bitcoin and win rewards
            </p>
          </div>
        </div>

        <div className="flex justify-center mb-6 bg-[#2D2B3B] p-4 rounded-lg">
          <LineChart size={200} className="text-[#9B6DFF]" strokeWidth={1.5} />
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-[#2D2B3B] rounded-lg border border-[#3D3A50] text-center">
            <h2 className="text-2xl font-bold text-[#E9E8FF] mb-4">Prediction Fee</h2>
            <p className="text-[#B8A8FF] mb-6">You need to pay 1 MON to make a Bitcoin price prediction</p>

            {!isConnected ? (
              <div className="w-full">
                <p className="text-center mb-4 text-[#B8A8FF]">Connect your wallet to continue</p>
                {isMobile ? (
                  // Mobile uses AppKitButton
                  <AppKitButton onConnect={handleConnect} />
                ) : (
                  // Web uses MetaMask button
                  <button
                    onClick={connectMetaMask}
                    style={{
                      padding: "14px 28px",
                      fontSize: "16px",
                      backgroundColor: "#9B6DFF",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                      width: "100%",
                      boxShadow: "0 4px 20px rgba(155, 109, 255, 0.3)",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#8A5CF7"
                      e.currentTarget.style.transform = "translateY(-1px)"
                      e.currentTarget.style.boxShadow = "0 6px 25px rgba(155, 109, 255, 0.4)"
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#9B6DFF"
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(155, 109, 255, 0.3)"
                    }}
                  >
                    Connect MetaMask
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={handlePayment}
                disabled={isPending}
                style={{
                  padding: "14px 28px",
                  fontSize: "16px",
                  backgroundColor: "#9B6DFF",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
                  cursor: isPending ? "not-allowed" : "pointer",
                  opacity: isPending ? 0.5 : 1,
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  width: "100%",
                  boxShadow: "0 4px 20px rgba(155, 109, 255, 0.3)",
                }}
                onMouseOver={(e) => {
                  if (!isPending) {
                    e.currentTarget.style.backgroundColor = "#8A5CF7"
                    e.currentTarget.style.transform = "translateY(-1px)"
                    e.currentTarget.style.boxShadow = "0 6px 25px rgba(155, 109, 255, 0.4)"
                  }
                }}
                onMouseOut={(e) => {
                  if (!isPending) {
                    e.currentTarget.style.backgroundColor = "#9B6DFF"
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(155, 109, 255, 0.3)"
                  }
                }}
              >
                {isPending ? "Processing..." : `Pay 1 MON Entry Fee`}
              </button>
            )}
          </div>

          {isSuccess && (
            <div className="p-4 bg-green-800/30 border border-green-600 rounded-md">
              <p className="text-green-400 text-center">Payment successful! You can now make your prediction.</p>
            </div>
          )}
        </div>

        <p
          style={{
            color: "#8F8BA8",
            textAlign: "center",
            marginTop: "24px",
            fontSize: "14px",
          }}
        >
          Winners with correct predictions will receive rewards based on their accuracy.
        </p>
      </div>
    )
  }

  // If authenticated and has paid, show prediction form or success message
  return (
    <div
      style={{
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        background: "#1A1626",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        width: "100%",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            style={{
              color: "#E9E8FF",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            Bitcoin Price Prediction
          </h1>
          <p
            style={{
              color: "#B8A8FF",
              fontSize: "14px",
              marginTop: "4px",
            }}
          >
            Predict the future price of Bitcoin and win rewards
          </p>
        </div>
      </div>

      <div className="flex justify-center mb-6 bg-[#2D2B3B] p-4 rounded-lg">
        <LineChart size={200} className="text-[#9B6DFF]" strokeWidth={1.5} />
      </div>

      {predictionSubmitted ? (
        // Show success message and submitted prediction details
        <div className="space-y-6">
          <div className="p-6 bg-green-800/20 border border-green-600/30 rounded-lg text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-500/20 p-3 rounded-full">
                <Check className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Prediction Submitted!</h2>
            <p className="text-green-300 mb-4">
              Your Bitcoin price prediction has been successfully recorded. Thank you for participating!
            </p>
          </div>

          <div className="p-6 bg-[#2D2B3B] rounded-lg border border-[#3D3A50]">
            <h3 className="text-xl font-bold text-[#E9E8FF] mb-4 text-center">Your Prediction</h3>

            <div className="space-y-4">
              <div>
                <p className="text-[#B8A8FF] text-sm">Predicted Bitcoin Price ($)</p>
                <p className="text-[#E9E8FF] text-lg font-medium">${submittedPrice}</p>
              </div>

              <div>
                <p className="text-[#B8A8FF] text-sm">Time Frame</p>
                <p className="text-[#E9E8FF] text-lg font-medium">
                  {submittedTimeframe === "1day"
                    ? "1 Day Later"
                    : submittedTimeframe === "1week"
                      ? "1 Week Later"
                      : "1 Month Later"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : hasAlreadyPredictedToday ? (
        // Show the user's existing prediction with disabled form and countdown to next prediction
        <div className="space-y-6">
          <div className="p-6 bg-blue-800/20 border border-blue-600/30 rounded-lg text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-500/20 p-3 rounded-full">
                <Clock className="h-12 w-12 text-blue-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-blue-400 mb-2">Daily Prediction Limit Reached</h2>
            <p className="text-blue-300 mb-2">
              You can make one prediction per day. Your next prediction will be available at midnight.
            </p>
            <p className="text-blue-300 font-semibold">Time until next prediction: {timeUntilNextPrediction}</p>
          </div>

          <div className="p-6 bg-[#2D2B3B] rounded-lg border border-[#3D3A50]">
            <h3 className="text-xl font-bold text-[#E9E8FF] mb-4 text-center">Today's Prediction</h3>

            <div className="space-y-4">
              <div>
                <p className="text-[#B8A8FF] text-sm">Predicted Bitcoin Price ($)</p>
                <p className="text-[#E9E8FF] text-lg font-medium">${submittedPrice}</p>
              </div>

              <div>
                <p className="text-[#B8A8FF] text-sm">Time Frame</p>
                <p className="text-[#E9E8FF] text-lg font-medium">
                  {submittedTimeframe === "1day"
                    ? "1 Day Later"
                    : submittedTimeframe === "1week"
                      ? "1 Week Later"
                      : "1 Month Later"}
                </p>
              </div>

              {lastPredictionDate && (
                <div>
                  <p className="text-[#B8A8FF] text-sm">Submitted</p>
                  <p className="text-[#E9E8FF] text-lg font-medium">
                    {lastPredictionDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Show prediction form if no prediction has been submitted today
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-[#B8A8FF]">
              Predicted Bitcoin Price ($)
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="e.g. 65000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="bg-[#2D2B3B] border-[#3D3A50] focus:border-[#9B6DFF] text-[#E9E8FF]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeframe" className="text-[#B8A8FF]">
              Time Frame
            </Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="bg-[#2D2B3B] border-[#3D3A50] focus:border-[#9B6DFF] text-[#E9E8FF]">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent className="bg-[#2D2B3B] border border-[#3D3A50]">
                {Object.entries(timeframeOptions).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-blue-800/10 border border-blue-600/20 rounded-md mt-4">
            <p className="text-blue-300 text-center text-sm">
              You can make one prediction per day. Your prediction right resets at midnight.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "14px 28px",
              fontSize: "16px",
              backgroundColor: "#9B6DFF",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "12px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.5 : 1,
              fontWeight: "500",
              transition: "all 0.2s ease",
              width: "100%",
              marginTop: "24px",
              boxShadow: "0 4px 20px rgba(155, 109, 255, 0.3)",
            }}
            onMouseOver={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = "#8A5CF7"
                e.currentTarget.style.transform = "translateY(-1px)"
                e.currentTarget.style.boxShadow = "0 6px 25px rgba(155, 109, 255, 0.4)"
              }
            }}
            onMouseOut={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = "#9B6DFF"
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(155, 109, 255, 0.3)"
              }
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit My Prediction"}
          </button>
        </form>
      )}

      <p
        style={{
          color: "#8F8BA8",
          textAlign: "center",
          marginTop: "24px",
          fontSize: "14px",
        }}
      >
        Winners with correct predictions will receive rewards based on their accuracy.
      </p>

      <Toaster />
    </div>
  )
}
