import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BitcoinPrediction from "@/components/BitcoinPrediction"
import PredictionsList from "@/components/BitcoinPrediction/PredictionsList"
import WinnersList from "@/components/BitcoinPrediction/WinnersList"
import MobileWalletConnector from "@/components/WalletConnection/MobileWalletConnector"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-black">
      <div className="w-full max-w-3xl mx-auto">
        {/* Mobile Wallet Connector - Moved to top for better visibility */}
        <div className="mb-8">
          <MobileWalletConnector />
        </div>

        <div className="mb-8">
          <BitcoinPrediction />
        </div>

        <Tabs defaultValue="predict" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="predict" className="text-white">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Predict
              </span>
            </TabsTrigger>
            <TabsTrigger value="predictions" className="text-white">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Predictions
              </span>
            </TabsTrigger>
            <TabsTrigger value="winners" className="text-white">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Winners
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="predict">
            <div className="bg-gray-900 rounded-lg p-4">
              <BitcoinPrediction />
            </div>
          </TabsContent>
          <TabsContent value="predictions">
            <div className="bg-gray-900 rounded-lg p-4">
              <PredictionsList />
            </div>
          </TabsContent>
          <TabsContent value="winners">
            <div className="bg-gray-900 rounded-lg p-4">
              <WinnersList />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
