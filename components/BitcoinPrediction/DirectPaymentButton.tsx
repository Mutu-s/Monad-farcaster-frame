"use client"

import { useState } from "react"
import { useSendTransaction } from "wagmi"
import { parseEther } from "viem"
import { markUserAsPaid } from "@/lib/payments"
import { useAuth } from "@/context/auth-context"

interface DirectPaymentButtonProps {
  onPaymentSuccess: () => void
}

export default function DirectPaymentButton({ onPaymentSuccess }: DirectPaymentButtonProps) {
  const { user } = useAuth()
  const [isPending, setIsPending] = useState(false)
  const { sendTransaction, isSuccess, isError, error } = useSendTransaction()

  const handleSendPayment = async () => {
    setIsPending(true)
    try {
      await sendTransaction({
        to: "0x9EF7b8dd1425B252d9468A53e6c9664da544D516",
        value: parseEther("0.1"),
      })

      // Mark user as paid
      if (user) {
        markUserAsPaid(user.id)
      }

      // Notify parent component
      onPaymentSuccess()
    } catch (err) {
      console.error("Payment error:", err)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="DirectPayment-container" style={{ width: "100%", textAlign: "center" }}>
      <button
        onClick={handleSendPayment}
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
          maxWidth: "300px",
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
        {isPending ? "Processing..." : "Send 0.1 MON to Enter"}
      </button>
      {isSuccess && (
        <div
          style={{
            color: "#A8FF9D",
            marginTop: "16px",
            padding: "12px",
            background: "rgba(46, 125, 50, 0.2)",
            borderRadius: "8px",
            fontSize: "14px",
            border: "1px solid #2E7D32",
          }}
        >
          Payment successful! 🎉
        </div>
      )}
      {isError && (
        <div
          style={{
            color: "#FF9D9D",
            marginTop: "16px",
            padding: "12px",
            background: "rgba(198, 40, 40, 0.2)",
            borderRadius: "8px",
            fontSize: "14px",
            border: "1px solid #C62828",
          }}
        >
          Error: {error?.message}
        </div>
      )}
    </div>
  )
}
