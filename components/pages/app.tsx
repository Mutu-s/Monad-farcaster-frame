import { SafeAreaContainer } from "@/components/safe-area-container"
import { useMiniAppContext } from "@/hooks/use-miniapp-context"
import BitcoinPredictionLoader from "@/components/BitcoinPrediction/BitcoinPredictionLoader"

export default function Home() {
  const { context } = useMiniAppContext()
  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <BitcoinPredictionLoader />
    </SafeAreaContainer>
  )
}
