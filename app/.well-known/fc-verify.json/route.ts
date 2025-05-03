import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    // Using the FID from the accountAssociation data
    fid: 453685,
    username: "453685", // Update this with your actual username if different
    domain: "monad.0xhub.xyz",
  })
}
