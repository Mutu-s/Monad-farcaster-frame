"use client"

import { useEffect, useRef } from "react"

export default function SplashImage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 1200
    canvas.height = 630

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#ff9500")
    gradient.addColorStop(1, "#ff6a00")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Load and draw the mutu logo
    const logo = new Image()
    logo.crossOrigin = "anonymous"
    logo.src = "/images/mutu-logo-new.png"

    logo.onload = () => {
      // Draw logo in the center
      const logoSize = 240
      ctx.drawImage(logo, (canvas.width - logoSize) / 2, (canvas.height - logoSize) / 2 - 60, logoSize, logoSize)

      // Draw text
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 72px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Bitcoin Price Prediction", canvas.width / 2, canvas.height / 2 + 120)

      // Export the canvas as an image
      const dataUrl = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.href = dataUrl
      downloadLink.download = "splash-image.png"

      // Add a download button
      const downloadButton = document.createElement("button")
      downloadButton.textContent = "Download Splash Image"
      downloadButton.className = "mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
      downloadButton.onclick = () => downloadLink.click()

      const container = canvas.parentElement
      if (container) {
        container.appendChild(downloadButton)
      }
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-4 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">Farcaster Splash Image Preview</h2>
      <div className="border-2 border-orange-500 rounded-lg overflow-hidden shadow-lg">
        <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }}></canvas>
      </div>
      <p className="mt-4 text-gray-400 text-sm">This is the splash screen users will see when opening your app</p>
    </div>
  )
}
