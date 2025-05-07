import { createConfig, http } from "wagmi"
import { mainnet, monadTestnet } from "./chains"
import { createConnectors } from "./connectors"

// Get the project ID from environment variables
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID"

// Create the connectors
const { connectors } = createConnectors({
  projectId,
  appName: "Monad Mini App",
})

// Create the Wagmi config
export const config = createConfig({
  chains: [monadTestnet, mainnet],
  transports: {
    [monadTestnet.id]: http(),
    [mainnet.id]: http(),
  },
  connectors,
})

export default config
