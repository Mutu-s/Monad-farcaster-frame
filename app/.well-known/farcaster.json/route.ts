import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    version: "next",
    imageUrl: "https://i.postimg.cc/qvfw4dNs/bitcoin-price-prediction.png",
    button: {
      title: "Join",
      action: {
        type: "launch_frame",
        url: process.env.NEXT_PUBLIC_APP_URL || "https://monad-mini-app.vercel.app",
        name: "Join",
        splashImageUrl: "https://i.postimg.cc/qvfw4dNs/bitcoin-price-prediction.png",
      },
    },
  })
}
