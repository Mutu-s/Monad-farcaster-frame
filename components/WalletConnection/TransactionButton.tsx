"use client"

import { useState } from "react"
import { parseEther } from "viem"
import { useAccount, useSendTransaction } from "wagmi"

interface TransactionButtonProps {
  onSuccess: () => void
}

export default function TransactionButton({ onSuccess }: TransactionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address } = useAccount()

  // Use wagmi's useSendTransaction hook
  const { sendTransaction } = useSendTransaction()

  const handleSendTransaction = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // The recipient address for the payment
      const to = "0x9EF7b8dd1425B252d9468A53e6c9664da544D516"

      // Send 0.1 MONAD
      await sendTransaction({
        to,
        value: parseEther("0.1"),
      })

      // Call the success callback
      onSuccess()
    } catch (err) {
      console.error("Transaction error:", err)
      setError("Transaction failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <button
        onClick={handleSendTransaction}
        disabled={isLoading || !address}
        style={{
          padding: "14px 28px",
          fontSize: "16px",
          backgroundColor: "#9B6DFF",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "12px",
          cursor: isLoading || !address ? "not-allowed" : "pointer",
          opacity: isLoading || !address ? 0.5 : 1,
          fontWeight: "500",
          transition: "all 0.2s ease",
          width: "100%",
          maxWidth: "300px",
          boxShadow: "0 4px 20px rgba(155, 109, 255, 0.3)",
        }}
        onMouseOver={(e) => {
          if (!isLoading && address) {
            e.currentTarget.style.backgroundColor = "#8A5CF7"
            e.currentTarget.style.transform = "translateY(-1px)"
            e.currentTarget.style.boxShadow = "0 6px 25px rgba(155, 109, 255, 0.4)"
          }
        }}
        onMouseOut={(e) => {
          if (!isLoading && address) {
            e.currentTarget.style.backgroundColor = "#9B6DFF"
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(155, 109, 255, 0.3)"
          }
        }}
      >
        {isLoading ? "Sending..." : "Send 0.1 MONAD"}
      </button>

      {error && (
        <div
          style={{
            color: "#FF9D9D",
            marginTop: "16px",
            padding: "12px",
            background: "rgba(198, 40, 40, 0.2)",
            borderRadius: "8px",
            fontSize: "14px",
            border: "1px solid #C62828",
            width: "100%",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}
