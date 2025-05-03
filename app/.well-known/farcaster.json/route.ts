import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    // Frame metadata
    version: "vNext",
    imageUrl: "https://i.postimg.cc/qvfw4dNs/bitcoin-price-prediction.png",
    button: {
      title: "Join",
      action: {
        type: "launch_frame",
        url: process.env.NEXT_PUBLIC_APP_URL || "https://monad.0xhub.xyz",
        name: "Join",
        splashImageUrl: "https://i.postimg.cc/qvfw4dNs/bitcoin-price-prediction.png",
      },
    },
    // Domain verification properties
    properties: {
      name: "Bitcoin Price Prediction",
      description: "Predict the future price of Bitcoin and win rewards if you're right!",
      image: "https://i.postimg.cc/qvfw4dNs/bitcoin-price-prediction.png",
    },
    // Required for domain verification
    domainVerification: {
      domain: "monad.0xhub.xyz",
    },
    // Optional but recommended
    frames: {
      version: "1",
      image: "https://i.postimg.cc/qvfw4dNs/bitcoin-price-prediction.png",
      buttons: [
        {
          label: "Join",
          action: "post",
        },
      ],
      post_url: process.env.NEXT_PUBLIC_APP_URL || "https://monad.0xhub.xyz",
    },
  })
}
