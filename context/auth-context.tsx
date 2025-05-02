"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { AuthContextType, AuthState, User } from "@/types/auth"
import { useMiniAppContext } from "@/hooks/use-miniapp-context"
import { convertFarcasterUser, createSession, createWalletUser, getSession, removeSession } from "@/lib/auth"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { farcasterFrame } from "@farcaster/frame-wagmi-connector"

// Initial auth state
const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState)
  const { context } = useMiniAppContext()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      const session = getSession()
      if (session) {
        // Ensure the profile picture is a local image
        const user = {
          ...session.user,
          profilePicture: session.user.username === "0xmutu" ? "/images/mutu-logo.png" : "/images/default-avatar.png",
        }

        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        })
      } else {
        setState({
          ...initialState,
          isLoading: false,
        })
      }
    }

    checkSession()
  }, [])

  // Check for Farcaster user
  useEffect(() => {
    if (context?.user && !state.isAuthenticated && !state.isLoading) {
      const user = convertFarcasterUser(context.user)
      if (user) {
        createSession(user)
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        })
      }
    }
  }, [context?.user, state.isAuthenticated, state.isLoading])

  // Check for wallet connection
  useEffect(() => {
    if (isConnected && address && !state.isAuthenticated && !state.isLoading) {
      const user = createWalletUser(address)
      createSession(user)
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      })
    }
  }, [isConnected, address, state.isAuthenticated, state.isLoading])

  // Login function
  const login = async (provider: "farcaster" | "wallet") => {
    setState({ ...state, isLoading: true, error: null })

    try {
      if (provider === "farcaster") {
        // If we're in Farcaster context, we should already have the user
        if (context?.user) {
          const user = convertFarcasterUser(context.user)
          createSession(user)
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          })
        } else {
          // If we're not in Farcaster context but the user wants to use Farcaster,
          // we need to inform them that they need to access the app from Warpcast
          setState({
            ...state,
            isLoading: false,
            error: "Please open this app from Warpcast to use Farcaster login",
          })
        }
      } else if (provider === "wallet") {
        // Connect wallet
        connect({ connector: farcasterFrame() })
        // The useEffect above will handle setting the user once connected
      }
    } catch (error) {
      console.error("Login error:", error)
      setState({
        ...state,
        isLoading: false,
        error: error.message || "Failed to login",
      })
    }
  }

  // Logout function
  const logout = async () => {
    try {
      if (isConnected) {
        disconnect()
      }
      removeSession()
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      })
    } catch (error) {
      console.error("Logout error:", error)
      setState({
        ...state,
        error: error.message || "Failed to logout",
      })
    }
  }

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    if (!state.user) {
      setState({
        ...state,
        error: "No user logged in",
      })
      return
    }

    try {
      const updatedUser = {
        ...state.user,
        ...data,
        // Ensure profile picture is always a local image
        profilePicture: state.user.username === "0xmutu" ? "/images/mutu-logo.png" : "/images/default-avatar.png",
      }

      // In a real app, you would send this to your API
      // await api.updateUser(updatedUser);

      // Update session
      createSession(updatedUser)

      setState({
        ...state,
        user: updatedUser,
      })
    } catch (error) {
      console.error("Update profile error:", error)
      setState({
        ...state,
        error: error.message || "Failed to update profile",
      })
    }
  }

  const value = {
    ...state,
    login,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
