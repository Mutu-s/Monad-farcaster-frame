import { v4 as uuidv4 } from "uuid"

// Types
export interface Prediction {
  id: string
  userId: number | string
  username: string
  displayName: string
  profilePicture: string
  price: number
  timeframe: string
  createdAt: string
  walletAddress?: string
}

export interface Winner extends Prediction {
  actualPrice: number
  predictionDate: string
  winDate: string
  reward: string
}

// Local storage key for predictions
const PREDICTIONS_STORAGE_KEY = "bitcoin_predictions"

// Boş başlangıç tahminleri
const initialPredictions: Prediction[] = []

// Boş kazananlar listesi
const winners: Winner[] = []

// Load predictions from localStorage
const loadPredictions = (): Prediction[] => {
  if (typeof window !== "undefined") {
    const storedPredictions = localStorage.getItem(PREDICTIONS_STORAGE_KEY)
    if (storedPredictions) {
      try {
        const parsedPredictions = JSON.parse(storedPredictions)
        console.log("Loaded predictions from localStorage:", parsedPredictions)
        return parsedPredictions
      } catch (error) {
        console.error("Error parsing stored predictions:", error)
      }
    }
  }
  console.log("No predictions found in localStorage, returning empty array")
  return [...initialPredictions]
}

// Save predictions to localStorage
const savePredictions = (predictions: Prediction[]): void => {
  if (typeof window !== "undefined") {
    console.log("Saving predictions to localStorage:", predictions)
    localStorage.setItem(PREDICTIONS_STORAGE_KEY, JSON.stringify(predictions))
  }
}

// Get all predictions (sorted by newest first)
export async function getPredictions(): Promise<Prediction[]> {
  const predictions = loadPredictions()
  console.log("getPredictions returning:", predictions)
  return predictions
}

// Add a new prediction
export async function addPrediction(prediction: Omit<Prediction, "id">): Promise<Prediction> {
  const predictions = loadPredictions()

  const newPrediction: Prediction = {
    ...prediction,
    id: uuidv4(),
  }

  console.log("Adding new prediction:", newPrediction)

  // Add to beginning of array
  const updatedPredictions = [newPrediction, ...predictions]

  // Keep only the last 100 predictions
  const limitedPredictions = updatedPredictions.slice(0, 100)

  // Save to localStorage
  savePredictions(limitedPredictions)

  return newPrediction
}

// Get all winners
export async function getWinners(): Promise<Winner[]> {
  return winners
}

// Add a winner (would be called by a scheduled job in a real app)
export async function addWinner(winner: Omit<Winner, "id">): Promise<Winner> {
  const newWinner: Winner = {
    ...winner,
    id: uuidv4(),
  }

  winners.unshift(newWinner)
  return newWinner
}

// Debug function to clear all predictions (for testing)
export function clearAllPredictions(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PREDICTIONS_STORAGE_KEY)
    console.log("All predictions cleared from localStorage")
  }
}
