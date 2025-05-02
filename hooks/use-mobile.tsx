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

        // Check if it's a mobile device based on user agent
        const isMobileDevice = mobileRegex.test(userAgent.toLowerCase())

        // Also check screen width as a fallback
        const isMobileWidth = window.innerWidth <= 768

        setIsMobile(isMobileDevice || isMobileWidth)

        console.log("Mobile detection:", {
          isMobileDevice,
          isMobileWidth,
          userAgent,
          finalResult: isMobileDevice || isMobileWidth,
        })
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
