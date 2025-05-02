import { NextResponse } from "next/server"

export async function GET() {
  return new NextResponse("monad.0xhub.xyz", {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
