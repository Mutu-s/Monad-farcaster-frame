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

  // Mobil cihazlar için görünümü web ile aynı hale getirmek için değişiklikler yapıyoruz
  // checkPaymentStatus fonksiyonunu güncelliyoruz

  const checkPaymentStatus = useCallback(() => {
    // Ödeme durumunu kontrol et (mobil ve web için aynı mantık)
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

    // Mobil cihazlar için ek kontrol yapmıyoruz, web ile aynı görünümü sağlamak için
    // Böylece mobil cihazlarda da "Unlock Full Access" kısmı görünecek

    setIsLoading(false)
  }, [user])

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
