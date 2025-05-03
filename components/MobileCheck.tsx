"use client"

import { useMobile } from "@/hooks/use-mobile"
import { MobileWalletConnector } from "@/components/WalletConnection/MobileWalletConnector"

export default function MobileCheck() {
  const { isMobile } = useMobile()

  if (isMobile) {
    return <MobileWalletConnector />
  }

  return null
}
