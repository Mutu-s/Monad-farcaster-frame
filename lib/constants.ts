export const MESSAGE_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30 // 30 day

// Update the URL to the new domain
export const APP_URL = process.env.NEXT_PUBLIC_URL || "https://monad.0xhub.xyz"

// Remove the error throw to prevent build failures
// if (!APP_URL) {
//   throw new Error("NEXT_PUBLIC_URL is not set")
// }
