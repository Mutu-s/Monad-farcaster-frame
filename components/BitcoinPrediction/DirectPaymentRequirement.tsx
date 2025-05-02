"use client"

import { useAuth } from "@/context/auth-context"
import DirectPaymentButton from "./DirectPaymentButton"

interface DirectPaymentRequirementProps {
  onPaymentSuccess: () => void
}

export default function DirectPaymentRequirement({ onPaymentSuccess }: DirectPaymentRequirementProps) {
  const { user } = useAuth()

  return (
    <div
      style={{
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 auto",
        background: "#1A1626",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h1
        style={{
          color: "#E9E8FF",
          fontSize: "28px",
          marginBottom: "32px",
          textAlign: "center",
          fontWeight: "600",
        }}
      >
        Bitcoin Prediction Payment
      </h1>

      <div
        style={{
          background: "#2D2B3B",
          padding: "12px 20px",
          borderRadius: "12px",
          width: "100%",
          textAlign: "center",
          border: "1px solid #3D3A50",
          marginBottom: "24px",
        }}
      >
        <div style={{ color: "#B8A8FF", marginBottom: "4px", fontSize: "14px" }}>Payment Address</div>
        <div style={{ color: "#E9E8FF", fontWeight: "500", wordBreak: "break-all" }}>
          0x9EF7b8dd1425B252d9468A53e6c9664da544D516
        </div>
      </div>

      <div
        style={{
          background: "#2D2B3B",
          padding: "12px 20px",
          borderRadius: "12px",
          width: "100%",
          textAlign: "center",
          border: "1px solid #3D3A50",
          marginBottom: "24px",
        }}
      >
        <div style={{ color: "#B8A8FF", marginBottom: "4px", fontSize: "14px" }}>Required Payment</div>
        <div style={{ color: "#E9E8FF", fontWeight: "500" }}>0.1 MONAD</div>
      </div>

      <DirectPaymentButton onPaymentSuccess={onPaymentSuccess} />
    </div>
  )
}
