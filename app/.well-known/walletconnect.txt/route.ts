import { NextResponse } from "next/server"

export async function GET() {
  return new NextResponse(
    `
    # WalletConnect Cloud Verification
    
    domain=monad.0xhub.xyz
    `,
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    },
  )
}
