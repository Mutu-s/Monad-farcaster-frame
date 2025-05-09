// Local storage key for payment status
const PAYMENT_STATUS_KEY = "bitcoin_prediction_payment_status"
const PREDICTION_COUNT_KEY = "bitcoin_prediction_count"

/**
 * Check if a user has paid the entry fee
 * @param userId The user ID to check
 * @returns True if the user has paid, false otherwise
 */
export function hasUserPaid(userId: string): boolean {
  // Check local storage as a fallback
  if (typeof window !== "undefined") {
    const paymentStatus = localStorage.getItem(PAYMENT_STATUS_KEY)
    return paymentStatus === "paid"
  }

  return false
}

/**
 * Mark a user as having paid the entry fee
 * @param userId The user ID to mark as paid
 */
export function markUserAsPaid(userId: string): void {
  // Store in local storage as a fallback
  if (typeof window !== "undefined") {
    localStorage.setItem(PAYMENT_STATUS_KEY, "paid")
  }
}

/**
 * Check if any payment has been made from this browser
 * @returns True if a payment has been made, false otherwise
 */
export function hasAnyPaymentBeenMade(): boolean {
  if (typeof window !== "undefined") {
    const paymentStatus = localStorage.getItem(PAYMENT_STATUS_KEY)
    return paymentStatus === "paid"
  }
  return false
}

/**
 * Mark that a payment has been made from this browser
 */
export function markPaymentMade(): void {
  if (typeof window !== "undefined") {
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

// Ödeme miktarını 0.1'den 1'e değiştir
/**
 * Get the payment amount based on prediction count
 * @returns The payment amount in MON
 */
export function getPaymentAmount(): string {
  return "1.0"
}

/**
 * Check if this is a subsequent prediction (not the first one)
 * @returns True if this is a subsequent prediction, false if it's the first
 */
export function isSubsequentPrediction(): boolean {
  return getPredictionCount() > 0
}

/**
 * Get the prediction number (1st, 2nd, 3rd, etc.)
 * @returns The prediction number
 */
export function getPredictionNumber(): number {
  return getPredictionCount() + 1
}

/**
 * Reset payment status (for testing)
 */
export function resetPaymentStatus(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PAYMENT_STATUS_KEY)
  }
}
