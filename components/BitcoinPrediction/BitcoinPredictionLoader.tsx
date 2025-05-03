"use client"

import { useEffect, useState, useCallback } from "react"
import BitcoinPrediction from "."
import { hasAnyPaymentBeenMade, hasUserPaid } from "@/lib/payments"
import { useAuth } from "@/context/auth-context" // Düzeltildi: auth -> auth-context

export default function BitcoinPredictionLoader() {
  const [hasPaid, setHasPaid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  const checkPaymentStatus = useCallback(() => {
    // Check if user has already paid
    const paid = hasAnyPaymentBeenMade()
    console.log("Initial payment check:", paid ? "Paid" : "Not paid")

    // Kullanıcı kimliği varsa, kullanıcıya özel ödeme durumunu kontrol edelim
    if (user && user.id) {
      const userPaid = hasUserPaid(user.id)
      console.log(`User ${user.id} payment check:`, userPaid ? "Paid" : "Not paid")

      // Kullanıcı ödemişse veya genel ödeme yapılmışsa, ödeme durumunu true olarak ayarlayalım
      setHasPaid(paid || userPaid)
    } else {
      setHasPaid(paid)
    }

    setIsLoading(false)
  }, [user])

  useEffect(() => {
    checkPaymentStatus()
  }, [checkPaymentStatus])

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
