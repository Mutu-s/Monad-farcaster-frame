import { NextResponse } from "next/server"

export async function GET() {
  // Get the app URL from environment variables or use a default
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://monad.0xhub.xyz"

  return NextResponse.json({
    // Real accountAssociation data provided by the user
    accountAssociation: {
      header:
        "eyJmaWQiOjQ1MzY4NSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJFOEY1NDE0NDcwZTNiZGZCODI4NTZkNkNiYjM2Q2I4QjY4OThENDAifQ",
      payload: "eyJkb21haW4iOiJtb25hZC4weGh1Yi54eXoifQ",
      signature:
        "MHgxOGNmOGFkYjFlZDVlZDIwMTQ2YzI2ZmVlY2U1NTY4YjNiYTJmYjk5ZjA5NWQ0NzY5ZDFjNzRmZjk3OWIzMTA4NmIyY2YwMDExNzBhM2ZlMjFlMWE1M2QzYjI5Mzc3OWFhN2Q3YTUxZmQwZGM3ODlhOGY3NDg3ZmU2OThjMGQwZTFi",
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
      ogTitle: "Bitcoin Price Prediction",
      ogDescription: "Make daily predictions about Bitcoin's price and win rewards if you're right!",
      ogImageUrl: `${appUrl}/images/bitcoin-price-prediction.png`,
    },
  })
}
