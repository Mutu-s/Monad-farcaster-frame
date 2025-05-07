import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { WagmiProvider } from "./providers/WagmiProvider"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider>
      <App />
    </WagmiProvider>
  </React.StrictMode>,
)
