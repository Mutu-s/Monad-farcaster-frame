"use client"

import { useFrame } from "../components/farcaster-provider"
import type { FrameContext } from "@farcaster/frame-core/dist/context"
import type sdk from "@farcaster/frame-sdk"

// Define specific types for each context
interface FarcasterContextResult {
  context: FrameContext | null
  actions: typeof sdk.actions | null
  isEthProviderAvailable: boolean
  isSDKLoaded: boolean
  error: string | null
}

// Union type of all possible results
type ContextResult = FarcasterContextResult

export const useMiniAppContext = (): ContextResult => {
  // Initialize frameContext with default values
  let frameContext: FarcasterContextResult = {
    context: null,
    actions: null,
    isEthProviderAvailable: false,
    isSDKLoaded: false,
    error: null,
  }

  // Call useFrame unconditionally
  const rawFrameContext = useFrame()

  try {
    // Update frameContext with the values from useFrame
    frameContext = {
      context: rawFrameContext.context,
      actions: rawFrameContext.actions,
      isEthProviderAvailable: rawFrameContext.isEthProviderAvailable,
      isSDKLoaded: rawFrameContext.isSDKLoaded,
      error: rawFrameContext.error,
    }
  } catch (e) {
    console.error("Error accessing Farcaster context:", e)
    frameContext.error = e instanceof Error ? e.message : "Unknown error accessing Farcaster context"
  }

  // Return the context
  return frameContext
}
