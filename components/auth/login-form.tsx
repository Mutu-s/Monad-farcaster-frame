"use client"

import { useAuth } from "@/context/auth-context"
import { useMiniAppContext } from "@/hooks/use-miniapp-context"
import { Bitcoin, LogIn, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAccount } from "wagmi"
import AppKitButton from "../WalletConnection/AppKitButton"

export default function LoginForm() {
  const { login, isAuthenticated, isLoading, error } = useAuth()
  const { context, isSDKLoaded } = useMiniAppContext()
  const router = useRouter()
  const { isConnected } = useAccount()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  // Handle wallet login when connected
  useEffect(() => {
    const handleWalletLogin = async () => {
      if (isConnected) {
        await login("wallet")
      }
    }

    if (isConnected) {
      handleWalletLogin()
    }
  }, [isConnected, login])

  const handleFarcasterLogin = async () => {
    await login("farcaster")
  }

  const handleWalletConnect = () => {
    // The actual connection is handled by the AppKitButton component
    // After connection, the useEffect above will trigger the login
  }

  const isFarcasterAvailable = !!context?.user

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 animated-bg"
      style={{
        background: "linear-gradient(135deg, #13111C 0%, #1E1A3A 50%, #17132B 100%)",
        backgroundSize: "400% 400%",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-600/5 blur-3xl"></div>
      </div>

      <div className="glass-card rounded-xl p-8 border border-[#3D3A50]/50 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Bitcoin size={80} className="text-[#9B6DFF]" />
            <div className="absolute inset-0 rounded-full bg-[#9B6DFF]/20 animate-pulse"></div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 gradient-text">Welcome Back</h1>

        <p className="text-center text-[#B8A8FF] mb-6">
          Payment received! Sign in to make predictions and track your rewards
        </p>

        <div className="bg-[#2D2B3B]/70 backdrop-blur-md p-5 rounded-xl mb-6 border border-[#3D3A50]/50 flex items-start gap-3">
          <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-[#E9E8FF] mb-1 text-lg">Payment Successful</h3>
            <p className="text-[#B8A8FF] text-sm">
              Your 0.1 MON payment has been received. You now have full access to the prediction contest. Please sign in
              to continue.
            </p>
          </div>
        </div>

        <button
          onClick={handleFarcasterLogin}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-3 button-glow mb-4 ${
            isLoading
              ? "bg-[#9B6DFF]/50 cursor-not-allowed"
              : "bg-[#9B6DFF] hover:bg-[#8A5CF7] hover:shadow-lg hover:shadow-[#9B6DFF]/20 hover:-translate-y-0.5"
          }`}
        >
          <LogIn size={20} />
          {isLoading ? (
            <>
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Processing...
            </>
          ) : isFarcasterAvailable ? (
            "Login with Farcaster"
          ) : (
            "Open in Warpcast to use Farcaster"
          )}
        </button>

        {!isFarcasterAvailable && (
          <p className="text-amber-400 text-sm text-center mb-4 bg-amber-900/20 p-3 rounded-lg border border-amber-800/30">
            To use Farcaster login, please open this app in Warpcast
          </p>
        )}

        <div className="relative w-full my-6">
          <div className="absolute top-1/2 w-full h-px bg-[#3D3A50]/50"></div>
          <div className="relative flex justify-center">
            <span className="bg-[#1A1626] px-4 text-[#8F8BA8] text-sm">or</span>
          </div>
        </div>

        <div className="w-full">
          <AppKitButton onConnect={handleWalletConnect} />
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-red-300 text-sm">
            <p className="font-medium mb-1">Login Error:</p>
            <p>{error}</p>
          </div>
        )}

        <p className="text-center text-[#8F8BA8] text-sm mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
