"use client"

import { useEffect, useState } from "react"
import BitcoinPrediction from "."
import { hasAnyPaymentBeenMade } from "@/lib/payments"

export default function BitcoinPredictionLoader() {
  const [hasPaid, setHasPaid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Function to check payment status
    const checkPaymentStatus = () => {
      const paid = hasAnyPaymentBeenMade()
      setHasPaid(paid)
    }

    // Check initially
    checkPaymentStatus()

    // Set up an interval to check periodically
    const interval = setInterval(checkPaymentStatus, 1000)

    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsLoading(false)
  }, [hasPaid])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-orange-200">Loading Bitcoin Prediction App...</p>
      </div>
    )
  }

  return <BitcoinPrediction initialHasPaid={hasPaid} />
}
