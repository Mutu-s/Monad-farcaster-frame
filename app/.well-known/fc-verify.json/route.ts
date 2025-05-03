import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    // Replace with your actual Farcaster ID and username
    fid: 453685,
    username: "453685",
    // The domain should match exactly what you entered in the Warpcast tool
    domain: "monad.0xhub.xyz",
  })
}
