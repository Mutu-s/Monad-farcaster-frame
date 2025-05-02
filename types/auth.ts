export interface User {
  id: string | number
  username: string
  displayName: string
  profilePicture?: string
  fid?: number
  email?: string
  walletAddress?: string
  createdAt: string
  lastLogin?: string
  isAdmin?: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  login: (provider: "farcaster" | "wallet") => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export interface Session {
  user: User
  expiresAt: number
  token?: string
}
