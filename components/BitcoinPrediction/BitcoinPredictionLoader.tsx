"use client"

import { useEffect, useState, useCallback } from "react"
import BitcoinPrediction from "."
import { hasAnyPaymentBeenMade, hasUserPaid } from "@/lib/payments"
import { useAuth } from "@/context/auth-context"
import { useMobile } from "@/hooks/use-mobile" // Mobil kontrolü için eklendi

export default function BitcoinPredictionLoader() {
  const [hasPaid, setHasPaid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { isMobile } = useMobile() // Mobil cihaz kontrolü

  const checkPaymentStatus = useCallback(() => {
    // Mobil cihazlar için daha katı kontrol
    if (isMobile) {
      console.log("Mobile device detected, applying strict payment verification")

      // Mobil cihazlarda ödeme durumunu doğrudan localStorage'dan kontrol et
      const mobilePaymentVerified =
        typeof window !== "undefined" &&
        (localStorage.getItem("bitcoin_prediction_payment_status") === "paid" ||
          localStorage.getItem("mobile_payment_verified") === "true" ||
          localStorage.getItem("user_payment_verified") === "true")

      console.log("Mobile payment verification:", mobilePaymentVerified ? "Paid" : "Not paid")

      // Mobil cihazlarda ödeme yapılmamışsa, hasPaid'i kesinlikle false olarak ayarla
      setHasPaid(mobilePaymentVerified)
      setIsLoading(false)
      return
    }

    // Mobil olmayan cihazlar için normal kontrol
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
  }, [user, isMobile])

  useEffect(() => {
    checkPaymentStatus()

    // Düzenli olarak ödeme durumunu kontrol et
    const interval = setInterval(checkPaymentStatus, 2000)
    return () => clearInterval(interval)
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
