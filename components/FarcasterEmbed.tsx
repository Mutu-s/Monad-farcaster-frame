"use client"

import { useEffect, useRef } from "react"

export default function FarcasterEmbed() {
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
    gradient.addColorStop(0, "#4a1c94")
    gradient.addColorStop(1, "#2a0e54")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Load and draw the mutu logo
    const logo = new Image()
    logo.crossOrigin = "anonymous"
    logo.src = "/images/mutu-logo-new.png"

    logo.onload = () => {
      // Draw logo in the center top area
      const logoSize = 180
      ctx.drawImage(logo, (canvas.width - logoSize) / 2, 120, logoSize, logoSize)

      // Draw text
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 72px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Bitcoin Price Prediction", canvas.width / 2, canvas.height / 2 + 60)

      ctx.font = "bold 48px Arial"
      ctx.fillText("by mutu", canvas.width / 2, canvas.height / 2 + 140)

      // Draw button-like shape
      const buttonWidth = 300
      const buttonHeight = 80
      const buttonX = (canvas.width - buttonWidth) / 2
      const buttonY = canvas.height - 150

      // Button background
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
      ctx.beginPath()
      ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 40)
      ctx.fill()

      // Button text
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 36px Arial"
      ctx.fillText("Make Prediction", canvas.width / 2, buttonY + buttonHeight / 2 + 12)

      // Export the canvas as an image
      const dataUrl = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.href = dataUrl
      downloadLink.download = "feed-image.png"

      // Add a download button
      const downloadButton = document.createElement("button")
      downloadButton.textContent = "Download Feed Image"
      downloadButton.className = "mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
      downloadButton.onclick = () => downloadLink.click()

      const container = canvas.parentElement
      if (container) {
        container.appendChild(downloadButton)
      }
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">Farcaster Feed Image Preview</h2>
      <div className="border-2 border-orange-500 rounded-lg overflow-hidden shadow-lg">
        <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }}></canvas>
      </div>
      <p className="mt-4 text-gray-400 text-sm">This is how your app will appear in Farcaster feeds</p>
    </div>
  )
}
