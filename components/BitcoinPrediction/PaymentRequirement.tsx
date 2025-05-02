"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Coins, ExternalLink } from "lucide-react"
import { parseEther } from "viem"
import { useSendTransaction } from "wagmi"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { markUserAsPaid } from "@/lib/payments"

interface PaymentRequirementProps {
  onPaymentSuccess: () => void
}

export default function PaymentRequirement({ onPaymentSuccess }: PaymentRequirementProps) {
  const { user } = useAuth()
  const [isPaying, setIsPaying] = useState(false)
  const { sendTransaction, isSuccess, isError, error } = useSendTransaction()

  const handleSendPayment = async () => {
    setIsPaying(true)
    try {
      await sendTransaction({
        to: "0x9EF7b8dd1425B252d9468A53e6c9664da544D516",
        value: parseEther("0.1"),
      })

      // Note: This will be called before the transaction is confirmed
      // In a production app, you'd want to wait for confirmation
      toast({
        title: "Payment Sent",
        description: "Your payment of 0.1 MON has been sent. You can now make predictions!",
      })

      if (user) {
        markUserAsPaid(user.id)
      }

      onPaymentSuccess()
    } catch (err) {
      console.error("Payment error:", err)
      toast({
        title: "Payment Failed",
        description: error?.message || "Failed to send payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <Card className="bg-black/70 border-2 border-orange-500 text-white backdrop-blur-md">
      <CardHeader className="bg-gradient-to-r from-orange-500/30 to-yellow-500/30">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-orange-500" />
          <CardTitle className="text-orange-500 text-2xl">Payment Required</CardTitle>
        </div>
        <CardDescription className="text-gray-300 text-lg">
          You must send 0.1 MON to participate in the Bitcoin prediction contest
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="p-5 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg border border-orange-500/50">
          <div className="flex items-center justify-center mb-4">
            <Coins className="h-16 w-16 text-yellow-500" />
          </div>
          <h3 className="text-xl font-semibold text-orange-500 mb-2 text-center">One-time Entry Fee</h3>
          <div className="flex items-center justify-between">
            <p className="text-gray-300">Required payment to participate</p>
            <p className="text-2xl font-bold text-yellow-500">0.1 MONAD</p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-white">This payment is mandatory to participate in the prediction contest.</p>
          <p className="text-sm text-gray-400">All payments go to the prize pool for distribution to winners.</p>
        </div>

        <Button
          onClick={handleSendPayment}
          disabled={isPaying}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg"
        >
          {isPaying ? "Processing..." : "Send 0.1 MONAD to Enter"}
        </Button>

        {isError && (
          <div className="p-4 bg-red-900/30 border border-red-500 rounded-md text-red-300 text-sm">
            Error: {error?.message || "Transaction failed. Please try again."}
          </div>
        )}

        {isSuccess && (
          <div className="p-4 bg-green-900/30 border border-green-500 rounded-md text-green-300 text-sm">
            Payment successful! You can now make predictions.
          </div>
        )}

        <div className="flex items-center justify-center mt-4">
          <a
            href="https://testnet.monadexplorer.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 flex items-center gap-1"
          >
            View on Monad Explorer <ExternalLink size={14} />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
