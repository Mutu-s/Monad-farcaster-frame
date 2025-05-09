"use client"

import { useEffect, useState } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileChecked, setIsMobileChecked] = useState(false)

  useEffect(() => {
    // Mobil cihaz tespiti
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

      // iOS tespiti
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream

      // Android tespiti
      const isAndroid = /android/i.test(userAgent)

      // Genel mobil tarayıcı tespiti
      const isMobileCheck = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

      // Ekran genişliği kontrolü
      const isSmallScreen = window.innerWidth <= 768

      setIsMobile(isIOS || isAndroid || isMobileCheck || isSmallScreen)
      setIsMobileChecked(true)
    }

    if (typeof window !== "undefined") {
      checkMobile()
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
