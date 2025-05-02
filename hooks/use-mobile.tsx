"use client"

import { useEffect, useState } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Initial check
      const checkMobile = () => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
        const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
        setIsMobile(mobileRegex.test(userAgent.toLowerCase()))
      }

      // Check immediately
      checkMobile()

      // Also add a listener for resize events in case of orientation changes
      window.addEventListener("resize", checkMobile)

      // Cleanup
      return () => {
        window.removeEventListener("resize", checkMobile)
      }
    }
  }, [])

  return { isMobile }
}

export default useMobile
