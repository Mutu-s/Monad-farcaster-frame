import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    version: "next",
    imageUrl: "https://i.ibb.co/JFthYC2J/7E24DC.png",
    button: {
      title: "Donate",
      action: {
        type: "launch_frame",
        url: process.env.NEXT_PUBLIC_APP_URL || "https://monad-mini-app.vercel.app",
        name: "Donate",
        splashImageUrl: "https://www.finsmes.com/wp-content/uploads/2024/04/monad.jpeg",
      },
    },
  })
}
