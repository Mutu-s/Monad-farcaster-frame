import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi"
import { monadTestnet } from "../config/chains"

export function useWalletConnection() {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  // Function to connect to MetaMask
  const connectMetaMask = async () => {
    const injectedConnector = connectors.find((c) => c.id === "injected")
    if (injectedConnector) {
      try {
        await connect({ connector: injectedConnector })
      } catch (error) {
        console.error("Failed to connect to MetaMask:", error)
      }
    } else {
      console.error("Injected connector not found")
    }
  }

  // Function to switch to Monad Testnet
  const switchToMonad = async () => {
    if (chainId !== monadTestnet.id) {
      try {
        await switchChain({ chainId: monadTestnet.id })
      } catch (error) {
        console.error("Failed to switch to Monad Testnet:", error)
      }
    }
  }

  return {
    address,
    isConnected,
    isPending,
    connectMetaMask,
    disconnect,
    chainId,
    switchToMonad,
    isMonadNetwork: chainId === monadTestnet.id,
  }
}
