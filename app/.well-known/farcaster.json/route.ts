import { NextResponse } from "next/server"

export async function GET() {
  // Get the app URL from environment variables or use a default
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://monad.0xhub.xyz"

  return NextResponse.json({
    // Note: You'll still need to generate this with the Warpcast tool
    // using your actual Farcaster account
    accountAssociation: {
      header: "eyJmaWQiOjEyMzQ1LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4YWJjZGVmMTIzNDU2Nzg5MCJ9",
      payload: "eyJkb21haW4iOiJtb25hZC4weGh1Yi54eXoifQ==",
      signature:
        "MHgxMjM0NTY3ODkwYWJjZGVmMTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTBhYmNkZWYxMjM0NTY3ODkwYWJjZGVmMTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTBhYmNkZWYxMjM0NTY3ODkwYWJjZGVmMTIzNDU2Nzg5MGFiY2RlZg==",
    },
    frame: {
      version: "1",
      name: "Bitcoin Price Prediction",
      iconUrl: `${appUrl}/images/bitcoin-price-prediction.png`,
      homeUrl: appUrl,
      splashImageUrl: `${appUrl}/images/bitcoin-price-prediction.png`,
      splashBackgroundColor: "#FF9900",
      subtitle: "Daily BTC Price Predictions",
      description:
        "Make daily predictions about Bitcoin's future price and win rewards if you're right! Test your crypto market knowledge and compete with others.",
      screenshotUrls: [
        `${appUrl}/images/bitcoin-price-prediction.png`,
        `${appUrl}/images/splash-image.png`,
        `${appUrl}/images/feed-image.png`,
      ],
      primaryCategory: "finance",
      tags: ["bitcoin", "prediction", "crypto", "rewards", "monad"],
      heroImageUrl: `${appUrl}/images/bitcoin-price-prediction.png`,
      tagline: "Predict BTC Price, Win Rewards",
      ogTitle: "Bitcoin Price Prediction Game",
      ogDescription: "Make daily predictions about Bitcoin's price and win rewards if you're right!",
      ogImageUrl: `${appUrl}/images/bitcoin-price-prediction.png`,
      noindex: false,
    },
  })
}
