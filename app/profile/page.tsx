import ProtectedRoute from "@/components/auth/protected-route"
import UserProfile from "@/components/auth/user-profile"

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Your Profile</h1>
      <div className="flex justify-center">
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      </div>
    </div>
  )
}
