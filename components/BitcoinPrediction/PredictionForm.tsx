"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Check } from "lucide-react"
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

// Payment address for MON tokens
const PAYMENT_ADDRESS = "0x9EF7b8dd1425B252d9468A53e6c9664da544D516"

interface PredictionFormProps {
  hasPaid: boolean
  onPaymentSuccess: () => void
  onResetPayment?: () => void
}

// Track last prediction date but without daily limit
// const [lastPredictionDate, setLastPredictionDate] = useState<Date | null>(null)

// Function to connect to MetaMask
const connectMetaMask = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      // Simple direct request to connect
      await window.ethereum.request({ method: "eth_requestAccounts" })

      toast({
        title: "Wallet Connected",
        description: "MetaMask wallet connected successfully!",
      })

      // After successful connection, try to switch to Monad network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x279f" }], // Monad Testnet chain ID (10143 in hex)
        })
      } catch (switchError: any) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          try {
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
          } catch (addError) {
            console.error("Error adding network:", addError)
          }
        }
        console.error("Error switching network:", switchError)
      }
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

export default function PredictionForm({ hasPaid, onPaymentSuccess, onResetPayment }: PredictionFormProps) {
  const { isAuthenticated, user } = useAuth()
  const [price, setPrice] = useState("")
  const [timeframe, setTimeframe] = useState("1week")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { sendTransaction, isPending, isSuccess, reset } = useSendTransaction()
  const { isConnected, address } = useAccount()
  const [predictionSubmitted, setPredictionSubmitted] = useState(false)
  const [submittedPrice, setSubmittedPrice] = useState("")
  const [submittedTimeframe, setSubmittedTimeframe] = useState("")
  const formRef = useRef<HTMLFormElement>(null)
  const { isMobile } = useMobile()

  // New state for the prediction-first flow
  const [predictionEntered, setPredictionEntered] = useState(false)
  const [pendingPrediction, setPendingPrediction] = useState<{ price: string; timeframe: string } | null>(null)
  const [lastPredictionDate, setLastPredictionDate] = useState<Date | null>(null)

  // Add this useEffect to check if the user has already made a prediction today when the component mounts
  useEffect(() => {
    // Check localStorage for existing prediction
    if (typeof window !== "undefined") {
      const existingPrediction = localStorage.getItem("user_prediction")
      if (existingPrediction) {
        const prediction = JSON.parse(existingPrediction)
        setSubmittedPrice(prediction.price)
        setSubmittedTimeframe(prediction.timeframe)

        // Store the prediction date
        const predictionDate = new Date(prediction.timestamp)
        setLastPredictionDate(predictionDate)
      }
    }
  }, [])

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

      // Now that payment is successful, submit the pending prediction
      if (pendingPrediction) {
        submitPrediction(pendingPrediction.price, pendingPrediction.timeframe)
      }
    }
  }, [isSuccess, hasPaid, onPaymentSuccess, pendingPrediction])

  // Handle payment
  const handlePayment = () => {
    if (!isConnected) return

    sendTransaction({
      to: PAYMENT_ADDRESS,
      value: parseEther("0.1"),
    })
  }

  // New function to handle the initial prediction entry
  const handlePredictionEntry = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset transaction success state
    reset()

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid Bitcoin price.",
        variant: "destructive",
      })
      return
    }

    // Check if wallet is connected
    if (!isConnected) {
      // Instead of showing an error toast, show wallet connection options
      setPendingPrediction({
        price,
        timeframe,
      })
      setPredictionEntered(true)
      return
    }

    // If wallet is connected but not authenticated
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please authenticate with your wallet to make predictions.",
        variant: "destructive",
      })
      return
    }

    // Store the prediction for later submission after payment
    setPendingPrediction({
      price,
      timeframe,
    })

    // Move to payment step
    setPredictionEntered(true)
  }

  // Function to submit the prediction after payment
  const submitPrediction = async (predictionPrice: string, predictionTimeframe: string) => {
    setIsSubmitting(true)

    try {
      // Always use local images
      const profilePicture = user?.username === "0xmutu" ? "/images/mutu-logo-new.png" : "/images/default-avatar.png"

      await addPrediction({
        userId: user?.id || Math.floor(Math.random() * 100000),
        username: user?.username || "Anonymous",
        displayName: user?.displayName || "Anonymous User",
        profilePicture: profilePicture,
        price: Number(predictionPrice),
        timeframe: predictionTimeframe,
        createdAt: new Date().toISOString(),
      })

      // Increment prediction count
      incrementPredictionCount()

      // Save the submitted values
      setSubmittedPrice(predictionPrice)
      setSubmittedTimeframe(predictionTimeframe)

      // Get current date and time
      const now = new Date()
      setLastPredictionDate(now)

      // Save to localStorage to track that user has made a prediction today
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "user_prediction",
          JSON.stringify({
            price: predictionPrice,
            timeframe: predictionTimeframe,
            timestamp: now.toISOString(),
          }),
        )
      }

      // Show success message
      toast({
        title: "Prediction Submitted!",
        description: "Your Bitcoin price prediction has been recorded.",
      })

      // Set prediction as submitted
      setPredictionSubmitted(true)

      // Clear the form
      setPrice("")
      setPendingPrediction(null)
      setPredictionEntered(false)
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
    // If prediction was submitted, show success message for 3 seconds then reset payment status
    if (predictionSubmitted) {
      const timer = setTimeout(() => {
        // Reset to payment page
        setPredictionSubmitted(false)

        // Reset payment status
        if (typeof window !== "undefined") {
          localStorage.removeItem("bitcoin_prediction_payment_status")
        }

        // Reset transaction success state
        reset()

        // Notify parent component
        if (onResetPayment) {
          onResetPayment()
        }
      }, 3000) // Show success message for 3 seconds

      return () => clearTimeout(timer)
    }
  }, [predictionSubmitted, onResetPayment, reset])

  const timeframeOptions = {
    "1day": "1 Day Later",
    "1week": "1 Week Later",
    "1month": "1 Month Later",
  }

  // If prediction is submitted, show success message
  if (predictionSubmitted) {
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

  // If prediction is entered but not yet paid for, show payment screen
  if (predictionEntered && pendingPrediction) {
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
          <div className="p-6 bg-[#2D2B3B] rounded-lg border border-[#3D3A50]">
            <h3 className="text-xl font-bold text-[#E9E8FF] mb-4 text-center">Your Prediction</h3>

            <div className="space-y-4">
              <div>
                <p className="text-[#B8A8FF] text-sm">Predicted Bitcoin Price ($)</p>
                <p className="text-[#E9E8FF] text-lg font-medium">${pendingPrediction.price}</p>
              </div>

              <div>
                <p className="text-[#B8A8FF] text-sm">Time Frame</p>
                <p className="text-[#E9E8FF] text-lg font-medium">
                  {pendingPrediction.timeframe === "1day"
                    ? "1 Day Later"
                    : pendingPrediction.timeframe === "1week"
                      ? "1 Week Later"
                      : "1 Month Later"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#2D2B3B] rounded-lg border border-[#3D3A50] text-center">
            <h2 className="text-2xl font-bold text-[#E9E8FF] mb-4">Prediction Fee</h2>
            <p className="text-[#B8A8FF] mb-6">You need to pay 0.1 MON to submit your Bitcoin price prediction</p>

            {!isConnected ? (
              <div className="w-full space-y-4">
                <div className="p-4 bg-purple-900/20 border border-purple-600/30 rounded-lg text-center mb-4">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Wallet Connection Required</h3>
                  <p className="text-purple-300 mb-4">
                    Please connect your wallet to continue with your prediction payment.
                  </p>
                  {isMobile ? (
                    // Mobile uses AppKitButton
                    <AppKitButton onConnect={handleConnect} />
                  ) : (
                    // Web uses direct MetaMask button
                    <button
                      onClick={connectMetaMask}
                      className="w-full py-3 px-4 bg-[#FF9900] hover:bg-[#E68A00] text-white font-medium rounded-lg"
                    >
                      Connect MetaMask
                    </button>
                  )}
                </div>
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
                {isPending ? "Processing..." : `Pay 0.1 MON to Submit`}
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setPredictionEntered(false)
              setPendingPrediction(null)
            }}
            className="w-full text-center text-[#B8A8FF] hover:text-[#9B6DFF] transition-colors"
          >
            ← Back to edit prediction
          </button>

          {isSuccess && !isPending && (
            <div className="p-4 bg-green-800/30 border border-green-600 rounded-md">
              <p className="text-green-400 text-center">Payment successful! Your prediction is being submitted...</p>
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

  // Initial prediction form
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

      <form ref={formRef} onSubmit={handlePredictionEntry} className="space-y-4">
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
            Her tahmin için 0.1 MON ödeme yapmanız gerekmektedir. Her doğru tahmin için ödül kazanma şansınız var!
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
          {isSubmitting ? "Processing..." : "Continue to Payment"}
        </button>
      </form>

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
