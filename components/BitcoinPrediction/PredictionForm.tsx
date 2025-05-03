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
import MetaMaskConnector from "../WalletConnection/MetaMaskConnector"

// Payment address for MON tokens
const PAYMENT_ADDRESS = "0x9EF7b8dd1425B252d9468A53e6c9664da544D516"

interface PredictionFormProps {
  hasPaid: boolean
  onPaymentSuccess: () => void
}

export default function PredictionForm({ hasPaid, onPaymentSuccess }: PredictionFormProps) {
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

  // Handle wallet connection
  const handleConnect = () => {
    // AppKitButton bileşeni bağlantıyı yönetecek
    console.log("Connect button clicked in PredictionForm")
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

    // Regular payment before prediction
    sendTransaction({
      to: PAYMENT_ADDRESS,
      value: parseEther("0.1"),
    })
  }

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

    // Ödeme kontrolünü güçlendirelim - hem hasPaid prop'unu hem de localStorage'ı kontrol edelim
    if (!hasPaid) {
      // Yerel depolamadan tekrar kontrol edelim
      const paymentVerified =
        typeof window !== "undefined" && localStorage.getItem("bitcoin_prediction_payment_status") === "paid"

      if (!paymentVerified) {
        toast({
          title: "Payment Required",
          description: "You must send 0.1 MON to participate in the prediction contest.",
          variant: "destructive",
        })
        return
      }
    }

    // Mobil cihazlar için ekstra kontrol
    if (isMobile && !hasPaid) {
      const paymentVerified =
        typeof window !== "undefined" && localStorage.getItem("bitcoin_prediction_payment_status") === "paid"

      if (!paymentVerified) {
        toast({
          title: "Payment Required",
          description: "Mobile users must pay 0.1 MON to participate.",
          variant: "destructive",
        })
        return
      }
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

      // Ödeme kontrolünü bir kez daha yapalım
      if (
        !hasPaid &&
        typeof window !== "undefined" &&
        localStorage.getItem("bitcoin_prediction_payment_status") !== "paid"
      ) {
        toast({
          title: "Payment Verification Failed",
          description: "Please make the required payment before submitting a prediction.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      await addPrediction({
        userId: user?.id || Math.floor(Math.random() * 100000),
        username: user?.username || "Anonymous",
        displayName: user?.displayName || "Anonymous User",
        profilePicture: profilePicture,
        price: Number(price),
        timeframe,
        createdAt: new Date().toISOString(),
      })

      // Increment prediction count
      incrementPredictionCount()

      // Save the submitted values
      setSubmittedPrice(price)
      setSubmittedTimeframe(timeframe)

      // Show success message
      toast({
        title: "Prediction Submitted!",
        description: "Your Bitcoin price prediction has been recorded.",
      })

      // Set prediction as submitted
      setPredictionSubmitted(true)

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
            <p className="text-[#B8A8FF] mb-6">You need to pay 0.1 MON to make a Bitcoin price prediction</p>

            {!isConnected ? (
              <div className="w-full">
                <p className="text-center mb-4 text-[#B8A8FF]">Connect your wallet to continue</p>
                {/* Mobil cihazlarda sadece AppKitButton, masaüstünde sadece MetaMaskConnector kullan */}
                {isMobile ? <AppKitButton onConnect={handleConnect} /> : <MetaMaskConnector />}
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
                {isPending ? "Processing..." : `Pay 0.1 MON Entry Fee`}
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

            <div className="mt-6 p-4 bg-blue-800/20 border border-blue-600/30 rounded-md">
              <p className="text-blue-400 text-center">Refresh the page if you want to make another prediction.</p>
            </div>
          </div>
        </div>
      ) : (
        // Show prediction form if no prediction has been submitted yet
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
