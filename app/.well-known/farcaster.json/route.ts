import { NextResponse } from "next/server"

export async function GET() {
  const domain = "btcgame-monad.vercel.app"
  const baseUrl = `https://${domain}`

  return NextResponse.json({
    accountAssociation: {
      // Bu kısmı Warpcast Mini App Manifest Tool'dan alacağınız gerçek değerlerle değiştirmeniz gerekecek
      header:
        "eyJmaWQiOjkxNTIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMmVmNzkwRGQ3OTkzQTM1ZkQ4NDdDMDUzRURkQUU5NDBEMDU1NTk2In0",
      payload: `eyJkb21haW4iOiIke2RvbWFpbn0ifQ`,
      signature:
        "MHgxMGQwZGU4ZGYwZDUwZTdmMGIxN2YxMTU2NDI1MjRmZTY0MTUyZGU4ZGU1MWU0MThhYjU4ZjVmZmQxYjRjNDBiNGVlZTRhNDcwNmVmNjhlMzQ0ZGQ5MDBkYmQyMmNlMmVlZGY5ZGQ0N2JlNWRmNzMwYzUxNjE4OWVjZDJjY2Y0MDFj",
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
