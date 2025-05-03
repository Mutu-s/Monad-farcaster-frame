"use client"

import { useEffect, useState } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileChecked, setIsMobileChecked] = useState(false)

  useEffect(() => {
    // Mobile device detection
    const checkMobile = () => {
      if (typeof window === "undefined" || typeof navigator === "undefined") {
        return false
      }

      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

      // iOS detection
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream

      // Android detection
      const isAndroid = /android/i.test(userAgent)

      // General mobile browser detection
      const isMobileCheck = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

      // Screen width check
      const isSmallScreen = window.innerWidth <= 768

      // Farcaster app detection (additional check)
      const isFarcasterApp = userAgent.includes("Farcaster") || userAgent.includes("Warpcast")

      // Store mobile status in localStorage for consistent detection
      const mobileDetected = isIOS || isAndroid || isMobileCheck || isSmallScreen || isFarcasterApp

      if (typeof window !== "undefined") {
        localStorage.setItem("is_mobile_device", mobileDetected ? "true" : "false")
      }

      setIsMobile(mobileDetected)
      setIsMobileChecked(true)

      return mobileDetected
    }

    if (typeof window !== "undefined") {
      // First check localStorage for cached result
      const cachedMobileStatus = localStorage.getItem("is_mobile_device")

      if (cachedMobileStatus) {
        setIsMobile(cachedMobileStatus === "true")
        setIsMobileChecked(true)
      } else {
        checkMobile()
      }

      window.addEventListener("resize", checkMobile)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", checkMobile)
      }
    }
  }, [])

  return { isMobile, isMobileChecked }
}
