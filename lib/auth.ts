import type { User, Session } from "@/types/auth"

// Session storage key
const SESSION_KEY = "bitcoin_prediction_session"

// Store user session in localStorage
export const storeSession = (session: Session): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }
}

// Get user session from localStorage
export const getSession = (): Session | null => {
  if (typeof window !== "undefined") {
    const sessionData = localStorage.getItem(SESSION_KEY)
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData) as Session
        // Check if session is expired
        if (session.expiresAt < Date.now()) {
          removeSession()
          return null
        }
        return session
      } catch (error) {
        console.error("Failed to parse session data:", error)
        removeSession()
      }
    }
  }
  return null
}

// Remove user session from localStorage
export const removeSession = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY)
  }
}

// Create a new session
export const createSession = (user: User, expiresInDays = 7): Session => {
  const expiresAt = Date.now() + expiresInDays * 24 * 60 * 60 * 1000
  const session: Session = {
    user,
    expiresAt,
  }
  storeSession(session)
  return session
}

// Convert Farcaster user to our User type
export const convertFarcasterUser = (farcasterUser: any): User => {
  if (!farcasterUser) return null

  // Use local avatar for 0xmutu, otherwise use a default avatar
  const profilePicture =
    farcasterUser.username === "0xmutu" ? "/images/mutu-logo-new.png" : "/images/default-avatar.png"

  return {
    id: farcasterUser.fid,
    username: farcasterUser.username || `user_${farcasterUser.fid}`,
    displayName: farcasterUser.displayName || `User ${farcasterUser.fid}`,
    profilePicture: profilePicture,
    fid: farcasterUser.fid,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }
}

// Convert wallet address to User
export const createWalletUser = (address: string): User => {
  const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`

  return {
    id: address,
    username: shortAddress,
    displayName: shortAddress,
    profilePicture: "/images/default-avatar.png",
    walletAddress: address,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }
}
