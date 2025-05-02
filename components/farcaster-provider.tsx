"use client"

import type { FrameContext } from "@farcaster/frame-core/dist/context"
import sdk from "@farcaster/frame-sdk"
import { createContext, type ReactNode, useContext, useEffect, useState } from "react"
import FrameWalletProvider from "./frame-wallet-provider"

interface FrameContextValue {
  context: FrameContext | null
  isSDKLoaded: boolean
  isEthProviderAvailable: boolean
  error: string | null
  actions: typeof sdk.actions | null
}

const FrameProviderContext = createContext<FrameContextValue | undefined>(undefined)

export function useFrame() {
  const context = useContext(FrameProviderContext)
  if (context === undefined) {
    throw new Error("useFrame must be used within a FrameProvider")
  }
  return context
}

interface FrameProviderProps {
  children: ReactNode
}

export function FarcasterProvider({ children }: FrameProviderProps) {
  const [context, setContext] = useState<FrameContext | null>(null)
  const [actions, setActions] = useState<typeof sdk.actions | null>(null)
  const [isEthProviderAvailable, setIsEthProviderAvailable] = useState<boolean>(false)
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        // Check if we're in a Farcaster environment
        if (typeof window !== "undefined") {
          console.log("Attempting to load Farcaster SDK...")

          // Add a timeout to detect if SDK initialization is taking too long
          const timeoutId = setTimeout(() => {
            console.warn("SDK initialization timeout")
            setError("SDK initialization timed out. Are you opening this in Warpcast?")
            setIsSDKLoaded(true) // Mark as loaded even though it failed
          }, 5000)

          try {
            const frameContext = await sdk.context
            clearTimeout(timeoutId)

            if (frameContext) {
              console.log("Farcaster context loaded:", frameContext)
              setContext(frameContext as FrameContext)
              setActions(sdk.actions)
              setIsEthProviderAvailable(sdk.wallet.ethProvider ? true : false)

              try {
                await sdk.actions.ready()
                console.log("SDK ready called successfully")
              } catch (readyError) {
                console.warn("Error calling sdk.actions.ready():", readyError)
                // Continue anyway as this might not be critical
              }
            } else {
              console.warn("No Farcaster context available")
              setError("No Farcaster context available. Are you opening this in Warpcast?")
            }
          } catch (sdkError) {
            clearTimeout(timeoutId)
            console.error("Error loading SDK context:", sdkError)
            setError(sdkError instanceof Error ? sdkError.message : "Failed to load Farcaster SDK")
          }
        } else {
          console.log("Window not available, likely server-side rendering")
          setError("Not in browser environment")
        }
      } catch (err) {
        console.error("SDK initialization error:", err)
        setError(err instanceof Error ? err.message : "Failed to initialize SDK")
      } finally {
        setIsSDKLoaded(true)
      }
    }

    if (!isSDKLoaded) {
      load()
    }
  }, [isSDKLoaded])

  return (
    <FrameProviderContext.Provider
      value={{
        context,
        actions,
        isSDKLoaded,
        isEthProviderAvailable,
        error,
      }}
    >
      <FrameWalletProvider>{children}</FrameWalletProvider>
    </FrameProviderContext.Provider>
  )
}
