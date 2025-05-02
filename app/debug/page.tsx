import DebugInfo from "@/components/debug-info"

export default function DebugPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Debug Information</h1>
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <DebugInfo />
          <div className="mt-4 p-4 bg-black/70 border border-orange-500 text-white backdrop-blur-md rounded-md">
            <h2 className="text-xl font-bold text-orange-500 mb-2">Troubleshooting Tips</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Make sure you're opening the app from Warpcast to use Farcaster login</li>
              <li>Clear your browser cache and cookies if you're experiencing issues</li>
              <li>Try using wallet login if Farcaster login isn't working</li>
              <li>Check your internet connection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
