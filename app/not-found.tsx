import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="text-orange-500 text-9xl font-bold mb-4">404</div>
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl mb-8 text-gray-400">The page you are looking for doesn't exist or has been moved.</p>
      <Link href="/" className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
        Return Home
      </Link>
    </div>
  )
}
