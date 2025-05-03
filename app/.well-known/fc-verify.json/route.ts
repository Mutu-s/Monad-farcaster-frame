import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    domain: "monad.0xhub.xyz",
    // Replace with your actual Farcaster ID (FID)
    fid: 17979, // Update this with your actual FID
    username: "mutu", // Update this with your actual username
  })
}
