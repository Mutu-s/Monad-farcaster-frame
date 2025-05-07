import { createFrameConnector } from "@farcaster/frame-wagmi-connector"
import { createAppKitConnector } from "@reown/appkit-adapter-wagmi"
import { injected } from "wagmi/connectors"

interface ConnectorsConfig {
  projectId: string
  appName: string
}

export function createConnectors({ projectId, appName }: ConnectorsConfig) {
  // Create the Frame connector for Farcaster
  const frameConnector = createFrameConnector()

  // Create the AppKit connector
  const appKitConnector = createAppKitConnector({
    projectId,
    appName,
  })

  // Create the injected connector (MetaMask, etc.)
  const injectedConnector = injected()

  return {
    connectors: [frameConnector, appKitConnector, injectedConnector],
  }
}
