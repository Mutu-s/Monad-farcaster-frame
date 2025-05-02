import { NextResponse } from "next/server"

export async function GET() {
  return new NextResponse(
    "e261cc22-df51-4244-9b49-18c78d964642=1dbac49c752d969b699ea8b8306b18ff29e457e60770acba0e3a3fbeab2e2388",
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  )
}
