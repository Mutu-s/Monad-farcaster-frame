import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { FarcasterProvider } from "@/components/farcaster-provider"
import AppKitProvider from "@/components/WalletConnection/AppKitProvider"
import { AuthProvider } from "@/context/auth-context" // Add this import

const inter = Inter({ subsets: ["latin"] })

// Farcaster Frame meta etiketlerini güncelle
export const metadata: Metadata = {
  title: "Bitcoin Price Prediction",
  description: "Predict the future price of Bitcoin and win rewards!",
  // Farcaster Frame meta etiketleri
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://i.postimg.cc/qvfw4dNs/bitcoin-price-prediction.png",
      button: {
        title: "Join",
        action: {
          type: "launch_frame",
          url: process.env.NEXT_PUBLIC_APP_URL || "https://monad-mini-app.vercel.app",
          name: "Join",
          splashImageUrl: "https://www.finsmes.com/wp-content/uploads/2024/04/monad.jpeg",
        },
      },
    }),
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <FarcasterProvider>
            <AppKitProvider>
              <AuthProvider>
                {" "}
                {/* Add AuthProvider here */}
                {children}
                <Toaster />
              </AuthProvider>
            </AppKitProvider>
          </FarcasterProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
