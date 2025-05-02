// Function to get current Bitcoin price from CoinGecko API
export async function getCurrentBitcoinPrice(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      { next: { revalidate: 60 } }, // Cache for 60 seconds
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch Bitcoin price: ${response.status}`)
    }

    const data = await response.json()
    return data.bitcoin.usd
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error)
    // Return a mock price for demo purposes
    return 65000
  }
}

// Function to check if a prediction is correct (within 1% margin)
export function isPredictionCorrect(predictedPrice: number, actualPrice: number): boolean {
  const margin = 0.01 // 1% margin
  const lowerBound = actualPrice * (1 - margin)
  const upperBound = actualPrice * (1 + margin)

  return predictedPrice >= lowerBound && predictedPrice <= upperBound
}
