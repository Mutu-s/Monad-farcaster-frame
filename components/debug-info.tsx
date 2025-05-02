"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMiniAppContext } from "@/hooks/use-miniapp-context"
import { useAuth } from "@/context/auth-context"

export default function DebugInfo() {
  const { context, isSDKLoaded, error: sdkError } = useMiniAppContext()
  const { isAuthenticated, user, error: authError } = useAuth()

  return (
    <Card className="bg-black/70 border border-orange-500 text-white backdrop-blur-md mt-4">
      <CardHeader>
        <CardTitle className="text-orange-500">Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <p>
            <strong>SDK Loaded:</strong> {isSDKLoaded ? "Yes" : "No"}
          </p>
          <p>
            <strong>Farcaster Context:</strong> {context ? "Available" : "Not Available"}
          </p>
          {context && (
            <div className="pl-4 mt-1">
              <p>
                <strong>User FID:</strong> {context.user?.fid || "N/A"}
              </p>
              <p>
                <strong>Username:</strong> {context.user?.username || "N/A"}
              </p>
            </div>
          )}
          <p>
            <strong>SDK Error:</strong> {sdkError || "None"}
          </p>
        </div>
        <div className="mt-2">
          <p>
            <strong>Auth Status:</strong> {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </p>
          {user && (
            <div className="pl-4 mt-1">
              <p>
                <strong>User ID:</strong> {user.id || "N/A"}
              </p>
              <p>
                <strong>Username:</strong> {user.username || "N/A"}
              </p>
            </div>
          )}
          <p>
            <strong>Auth Error:</strong> {authError || "None"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
