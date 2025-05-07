import { v4 as uuidv4 } from "uuid"

// Types
export interface Prediction {
  id: string
  userId: number
  username: string
  displayName: string
  profilePicture: string
  price: number
  timeframe: string
  createdAt: string
  walletAddress?: string // Added wallet address field
}

export interface Winner extends Prediction {
  actualPrice: number
  predictionDate: string
  winDate: string
  reward: string
}

// Mock data storage (in a real app, this would be a database)
let predictions: Prediction[] = []
const winners: Winner[] = [
  {
    id: "1",
    userId: 12345,
    username: "0xmutu",
    displayName: "mutu",
    profilePicture: "/images/mutu-logo-new.png", // Use local image
    price: 64500,
    actualPrice: 64600,
    timeframe: "1week",
    createdAt: "2023-04-15T10:30:00Z",
    predictionDate: "2023-04-15T10:30:00Z",
    winDate: "2023-04-22T10:30:00Z",
    reward: "10 MONAD Tokens",
    walletAddress: "0x9EF7b8dd1425B252d9468A53e6c9664da544D516",
  },
  {
    id: "2",
    userId: 67890,
    username: "vitalik",
    displayName: "Vitalik B.",
    profilePicture: "/images/default-avatar.png", // Use local image
    price: 70200,
    actualPrice: 70000,
    timeframe: "1day",
    createdAt: "2023-03-01T14:20:00Z",
    predictionDate: "2023-03-01T14:20:00Z",
    winDate: "2023-03-02T14:20:00Z",
    reward: "1 MONAD Token",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
  },
]

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
  // In a real app, we would fetch from a database
  // For demo purposes, return some mock data if no predictions exist
  if (predictions.length === 0) {
    return [
      {
        id: "3",
        userId: 54321,
        username: "0xmutu",
        displayName: "mutu",
        profilePicture: "/images/mutu-logo-new.png", // Use local image
        price: 68000,
        timeframe: "1week",
        createdAt: new Date().toISOString(),
        walletAddress: "0x9EF7b8dd1425B252d9468A53e6c9664da544D516",
      },
      {
        id: "4",
        userId: 98765,
        username: "cryptoqueen",
        displayName: "Crypto Queen",
        profilePicture: "/images/default-avatar.png", // Use local image
        price: 72500,
        timeframe: "1month",
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        walletAddress: "0x7a16ff8270133f063aab6c9977183d9e72835428",
      },
    ]
  }

  return predictions
}

// Get all winners
export async function getWinners(): Promise<Winner[]> {
  // In a real app, we would fetch from a database
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
