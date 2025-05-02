import FarcasterEmbed from "@/components/FarcasterEmbed"
import SplashImage from "@/components/SplashImage"

export default function FarcasterImagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">Farcaster Images</h1>
      <div className="flex flex-col gap-8">
        <FarcasterEmbed />
        <SplashImage />
      </div>
    </div>
  )
}
