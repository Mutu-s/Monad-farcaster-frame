import type { Metadata } from "next"
import { APP_URL } from "@/lib/constants"
import BitcoinPredictionLoader from "@/components/BitcoinPrediction/BitcoinPredictionLoader"

const frame = {
  version: "next",
  imageUrl: `${APP_URL}/images/feed-image.png`,
  button: {
    title: "Make Prediction",
    action: {
      type: "launch_frame",
      name: "Bitcoin Price Prediction by mutu",
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash-image.png`,
      splashBackgroundColor: "#FF9500", // Updated to match orange theme
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Bitcoin Price Prediction by mutu",
    openGraph: {
      title: "Bitcoin Price Prediction by mutu",
      description: "Predict the future price of Bitcoin and win rewards if you're right!",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  }
}

export default function Home() {
  return <BitcoinPredictionLoader />
}
