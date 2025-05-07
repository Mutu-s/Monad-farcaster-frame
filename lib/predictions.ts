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

// Örnek tahminleri boş bir dizi ile değiştir
const initialPredictions: Prediction[] = []

// Mock data for winners kısmını da boş bir dizi ile değiştir
const winners: Winner[] = []

// Load predictions from localStorage
const loadPredictions = (): Prediction[] => {
  if (typeof window !== "undefined") {
    const storedPredictions = localStorage.getItem(PREDICTIONS_STORAGE_KEY)
    if (storedPredictions) {
      try {
        return JSON.parse(storedPredictions)
      } catch (error) {
        console.error("Error parsing stored predictions:", error)
      }
    }
  }
  return [...initialPredictions] // Return a copy of initial predictions if nothing in localStorage
}

// Save predictions to localStorage
const savePredictions = (predictions: Prediction[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(PREDICTIONS_STORAGE_KEY, JSON.stringify(predictions))
  }
}

// Get all predictions (sorted by newest first)
export async function getPredictions(): Promise<Prediction[]> {
  return loadPredictions()
}

// Add a new prediction
export async function addPrediction(prediction: Omit<Prediction, "id">): Promise<Prediction> {
  const predictions = loadPredictions()

  const newPrediction: Prediction = {
    ...prediction,
    id: uuidv4(),
  }

  predictions.unshift(newPrediction) // Add to beginning of array

  // Keep only the last 100 predictions
  if (predictions.length > 100) {
    predictions = predictions.slice(0, 100)
  }

  // Save to localStorage
  savePredictions(predictions)

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
