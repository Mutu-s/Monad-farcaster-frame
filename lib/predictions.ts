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

// Real predictions storage (in a real app, this would be a database)
let predictions: Prediction[] = []
const winners: Winner[] = []

// Add a new prediction
export async function addPrediction(prediction: Omit<Prediction, "id">): Promise<Prediction> {
  const newPrediction: Prediction = {
    ...prediction,
    id: uuidv4(),
  }

  predictions.unshift(newPrediction) // Add to beginning of array

  // Keep only the last 100 predictions
  if (predictions.length > 100) {
    predictions = predictions.slice(0, 100)
  }

  return newPrediction
}

// Get all predictions (sorted by newest first)
export async function getPredictions(): Promise<Prediction[]> {
  return predictions
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
