"use client"

import { useAuth } from "@/context/auth-context"
import { markUserAsPaid } from "@/lib/payments"
import StyledPaymentButton from "./StyledPaymentButton"

interface StyledPaymentRequirementProps {
  onPaymentSuccess: () => void
}

export default function StyledPaymentRequirement({ onPaymentSuccess }: StyledPaymentRequirementProps) {
  const { user } = useAuth()

  const handlePaymentSuccess = () => {
    if (user) {
      markUserAsPaid(user.id)
    }
    onPaymentSuccess()
  }

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
        width: "100%",
      }}
    >
      <h1
        style={{
          color: "#E9E8FF",
          fontSize: "28px",
          marginBottom: "16px",
          textAlign: "center",
          fontWeight: "600",
        }}
      >
        Payment Required
      </h1>

      <p
        style={{
          color: "#B8A8FF",
          textAlign: "center",
          marginBottom: "24px",
          fontSize: "16px",
        }}
      >
        To participate in the Bitcoin prediction contest, you must send 0.1 MON
      </p>

      <div
        style={{
          background: "#2D2B3B",
          padding: "16px 20px",
          borderRadius: "12px",
          width: "100%",
          textAlign: "center",
          border: "1px solid #3D3A50",
          marginBottom: "24px",
        }}
      >
        <div style={{ color: "#B8A8FF", marginBottom: "4px", fontSize: "14px" }}>Payment Address</div>
        <div style={{ color: "#E9E8FF", fontWeight: "500", wordBreak: "break-all", fontSize: "14px" }}>
          0x9EF7b8dd1425B252d9468A53e6c9664da544D516
        </div>
      </div>

      <div
        style={{
          background: "#2D2B3B",
          padding: "16px 20px",
          borderRadius: "12px",
          width: "100%",
          textAlign: "center",
          border: "1px solid #3D3A50",
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ color: "#B8A8FF", fontSize: "16px" }}>Entry Fee</div>
        <div style={{ color: "#E9E8FF", fontWeight: "600", fontSize: "20px" }}>0.1 MONAD</div>
      </div>

      <StyledPaymentButton onPaymentSuccess={handlePaymentSuccess} />

      <p
        style={{
          color: "#8F8BA8",
          textAlign: "center",
          marginTop: "24px",
          fontSize: "14px",
        }}
      >
        All payments go to the prize pool for distribution to winners
      </p>
    </div>
  )
}
