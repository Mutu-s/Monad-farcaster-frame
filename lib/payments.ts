// Local storage key for payment status
const PAYMENT_STATUS_KEY = "bitcoin_prediction_payment_status"
const PREDICTION_COUNT_KEY = "bitcoin_prediction_count"

/**
 * Check if any payment has been made from this browser
 * @returns True if a payment has been made, false otherwise
 */
export function hasAnyPaymentBeenMade(): boolean {
  if (typeof window !== "undefined") {
    const paymentStatus = localStorage.getItem(PAYMENT_STATUS_KEY)

    // Ödeme durumunu daha sıkı kontrol edelim
    if (paymentStatus === "paid") {
      // Ödeme yapıldığını doğrulayalım
      console.log("Payment verification: Payment has been made")
      return true
    }

    // Ödeme yapılmadığını loglayalım
    console.log("Payment verification: No payment found")
    return false
  }
  return false
}

/**
 * Mark that a payment has been made from this browser
 */
export function markPaymentMade(): void {
  if (typeof window !== "undefined") {
    console.log("Marking payment as made")
    localStorage.setItem(PAYMENT_STATUS_KEY, "paid")
  }
}

/**
 * Get the number of predictions a user has made
 * @returns The number of predictions made
 */
export function getPredictionCount(): number {
  if (typeof window !== "undefined") {
    const count = localStorage.getItem(PREDICTION_COUNT_KEY)
    return count ? Number.parseInt(count, 10) : 0
  }
  return 0
}

/**
 * Increment the prediction count for a user
 */
export function incrementPredictionCount(): void {
  if (typeof window !== "undefined") {
    const currentCount = getPredictionCount()
    localStorage.setItem(PREDICTION_COUNT_KEY, (currentCount + 1).toString())
  }
}

/**
 * Reset payment status (for testing)
 */
export function resetPaymentStatus(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PAYMENT_STATUS_KEY)
  }
}

/**
 * Mark a specific user as paid (using their ID).  This is a mock implementation.
 * In a real application, this would update a database.
 * @param userId The ID of the user to mark as paid.
 */
export function markUserAsPaid(userId: string | number): void {
  // In a real application, you would update a database here.
  // This is a mock implementation for demonstration purposes.
  console.log(`Marking user ${userId} as paid. (Mock Implementation)`)
  markPaymentMade() // Also set the browser-level flag
}
