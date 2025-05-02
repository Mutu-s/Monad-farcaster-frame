"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { Bitcoin, LogIn, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { isAuthenticated, user } = useAuth()
  const pathname = usePathname()

  return (
    <nav className="bg-black/80 border-b border-orange-500/30 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Bitcoin className="h-8 w-8 text-orange-500 mr-2" />
              <span className="text-xl font-bold text-white">BTC Predict</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/" ? "text-orange-500" : "text-gray-300 hover:text-orange-500"
              }`}
            >
              Home
            </Link>
            <Link
              href="/predictions"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/predictions" ? "text-orange-500" : "text-gray-300 hover:text-orange-500"
              }`}
            >
              Predictions
            </Link>
            <Link
              href="/winners"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/winners" ? "text-orange-500" : "text-gray-300 hover:text-orange-500"
              }`}
            >
              Winners
            </Link>

            {isAuthenticated ? (
              <Link href="/profile">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  {user?.displayName || "Profile"}
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
