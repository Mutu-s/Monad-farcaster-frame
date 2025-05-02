import { NextResponse } from "next/server"

export async function GET() {
  const domain = "monad.0xhub.xyz"
  const baseUrl = `https://${domain}`

  return NextResponse.json({
    accountAssociation: {
      header:
        "eyJmaWQiOjQ1MzY4NSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDJFOEY1NDE0NDcwZTNiZGZCODI4NTZkNkNiYjM2Q2I4QjY4OThENDAifQ",
      payload: "eyJkb21haW4iOiJtb25hZC4weGh1Yi54eXoifQ",
      signature:
        "MHgxYTQ1Zjg5NDYzNzczOTE0MDNiMDQ1NmUwMTNlY2ExZGMyYTE4OGMwM2ZkNjUwOTA3Nzg4MWYwODVhYWZkNjdjNGJiYjI1MTA0NmQ0ODM1OWJjZjUyY2M5ZDk2ZmI1MDI4NzViMTI5MjA3NTA4ODg3MDQyYjY0NTkzMzVjYTQ0YjFi",
    },
    frame: {
      version: "1",
      name: "Bitcoin Price Prediction",
      iconUrl: `${baseUrl}/images/mutu-logo-new.png`,
      homeUrl: baseUrl,
      splashImageUrl: `${baseUrl}/images/splash-image.png`,
      splashBackgroundColor: "#FF9500", // Turuncu tema
      subtitle: "Predict BTC prices and win",
      description:
        "Make your Bitcoin price predictions and earn MON tokens for correct guesses. Join the competition now!",
      screenshotUrls: [
        `${baseUrl}/images/feed-image.png`,
        `${baseUrl}/images/splash-image.png`,
        `${baseUrl}/images/mutu-logo-new.png`,
      ],
      primaryCategory: "finance",
      tags: ["bitcoin", "prediction", "crypto", "rewards", "monad"],
      heroImageUrl: `${baseUrl}/images/feed-image.png`,
      tagline: "Predict and Win",
      ogTitle: "Bitcoin Price Prediction",
      ogDescription: "Make your Bitcoin price predictions and earn MON tokens for correct guesses.",
      ogImageUrl: `${baseUrl}/images/feed-image.png`,
      buttonTitle: "Make Prediction",
      webhookUrl: `${baseUrl}/api/webhook`,
    },
  })
}
