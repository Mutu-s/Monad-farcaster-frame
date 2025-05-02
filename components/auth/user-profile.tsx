"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { LogOut, Save, User } from "lucide-react"
import { useState } from "react"

export default function UserProfile() {
  const { user, logout, updateProfile } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [email, setEmail] = useState(user?.email || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      await updateProfile({
        displayName,
        email,
      })
      setMessage("Profile updated successfully!")
    } catch (error) {
      setMessage("Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return null
  }

  // Determine which avatar to show
  const showUserAvatar = () => {
    if (user.username === "0xmutu") {
      return (
        <img
          src="/images/mutu-logo-new.png"
          alt={user.displayName}
          className="w-24 h-24 rounded-full border-2 border-orange-500"
        />
      )
    } else {
      return (
        <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-2 border-orange-500">
          <User size={40} className="text-orange-500" />
        </div>
      )
    }
  }

  return (
    <Card className="w-full max-w-md bg-black/70 border border-orange-500 text-white backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-orange-500">Your Profile</CardTitle>
        <CardDescription className="text-gray-300">Manage your account information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-6">{showUserAvatar()}</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">
              Username
            </Label>
            <Input id="username" value={user.username} disabled className="bg-gray-900 border-gray-700 text-gray-400" />
            <p className="text-xs text-gray-500">Username cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-gray-300">
              Display Name
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-gray-900 border-orange-500/50 focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email (Optional)
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-900 border-orange-500/50 focus:border-orange-500"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes("Failed") ? "text-red-500" : "text-green-500"}`}>{message}</p>
          )}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-gray-400">
        <p>
          {user.fid
            ? `Connected with Farcaster (FID: ${user.fid})`
            : user.walletAddress
              ? `Connected with wallet: ${user.walletAddress}`
              : "Connected account"}
        </p>
      </CardFooter>
    </Card>
  )
}
