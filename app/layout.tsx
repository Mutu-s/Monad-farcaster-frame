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

export const metadata: Metadata = {
  title: "Bitcoin Price Prediction",
  description: "Predict the future price of Bitcoin and win rewards!",
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
