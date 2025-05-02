import { MobileWalletConnector } from "@/components/WalletConnection/MobileWalletConnector"
import { Home } from "@/components/Home"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <MobileWalletConnector />
        <Home />
      </div>
    </main>
  )
}
