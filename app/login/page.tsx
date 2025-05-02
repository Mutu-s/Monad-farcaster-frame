import LoginForm from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Bitcoin Price Prediction</h1>
      <LoginForm />
      <div className="mt-4 text-center">
        <Link href="/debug" className="text-orange-500 hover:underline">
          Having trouble? View debug information
        </Link>
      </div>
    </div>
  )
}
