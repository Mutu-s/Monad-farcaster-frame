"use client"

import { useEffect, useState } from "react"
import { hasAnyPaymentBeenMade } from "@/lib/payments"
import BitcoinPrediction from "."

export default function BitcoinPredictionLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasPaid, setHasPaid] = useState(false)

  // Check if user has already paid
  useEffect(() => {
    const checkPaymentStatus = () => {
      try {
        const paymentStatus = hasAnyPaymentBeenMade()
        setHasPaid(paymentStatus)
      } catch (error) {
        console.error("Error checking payment status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkPaymentStatus()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  // Always show the BitcoinPrediction component, payment will be handled inside
  return <BitcoinPrediction initialHasPaid={hasPaid} />
}
