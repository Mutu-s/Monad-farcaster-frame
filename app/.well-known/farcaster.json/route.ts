import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    // Account association will need to be generated using the Warpcast Mini App Manifest Tool
    // This is a placeholder - you'll need to replace with your actual signed data
    accountAssociation: {
      header: "REPLACE_WITH_YOUR_HEADER",
      payload: "REPLACE_WITH_YOUR_PAYLOAD",
      signature: "REPLACE_WITH_YOUR_SIGNATURE",
    },
    frame: {
      version: "1",
      name: "Bitcoin Price Prediction",
      iconUrl: "https://i.postimg.cc/qvfw4dNs/bitcoin-price-prediction.png",
      homeUrl: process.env.NEXT_PUBLIC_APP_URL || "https://monad.0xhub.xyz",
      splashImageUrl: "https://i.postimg.cc/qvfw4dNs/bitcoin-price-prediction.png",
      splashBackgroundColor: "#000000",
      subtitle: "Predict Bitcoin price and win rewards",
      description:
        "Make daily predictions about Bitcoin's future price and win rewards if you're right! A fun way to test your crypto market knowledge.",
      screenshotUrls: ["https://i.postimg.cc/qvfw4dNs/bitcoin-price-prediction.png"],
      primaryCategory: "finance",
      tags: ["bitcoin", "prediction", "crypto", "rewards", "game"],
      heroImageUrl: "https://i.postimg.cc/qvfw4dNs/bitcoin-price-prediction.png",
      tagline: "Predict & Win Bitcoin Rewards",
      ogTitle: "Bitcoin Price Prediction",
      ogDescription: "Predict the future price of Bitcoin and win rewards if you're right!",
      ogImageUrl: "https://i.postimg.cc/qvfw4dNs/bitcoin-price-prediction.png",
    },
  })
}
