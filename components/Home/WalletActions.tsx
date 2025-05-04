"use client"

import { useMiniAppContext } from "@/hooks/use-miniapp-context"
import { parseEther } from "viem"
import { useAccount, useDisconnect, useSendTransaction, useSwitchChain } from "wagmi"
import type { Chain } from "wagmi"

const monadTestnetUpdated: Chain = {
  id: 10143,
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "MONAD",
    symbol: "MON",
  },
  rpcUrls: {
    public: { http: ["https://testnet-rpc.monad.xyz/"] },
    default: { http: ["https://testnet-rpc.monad.xyz/"] },
  },
  blockExplorers: {
    default: { name: "MonadExplorer", url: "https://testnet.monadexplorer.com/" },
  },
}

export function WalletActions() {
  const { isEthProviderAvailable } = useMiniAppContext()
  const { isConnected, address, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: hash, sendTransaction } = useSendTransaction()
  const { switchChain } = useSwitchChain()

  async function sendTransactionHandler() {
    sendTransaction({
      to: "0x9EF7b8dd1425B252d9468A53e6c9664da544D516",
      value: parseEther("0.1"),
    })
  }

  return (
    <div className="space-y-4 border border-orange-300 rounded-md p-4 bg-orange-50">
      <h2 className="text-xl font-bold text-left text-orange-800">Wallet Actions</h2>
      <div className="flex flex-row space-x-4 justify-start items-start">
        {isConnected ? (
          <div className="flex flex-col space-y-4 justify-start w-full">
            <p className="text-sm text-left text-orange-700">
              Connected wallet:{" "}
              <span className="bg-orange-200 font-mono text-orange-900 rounded-md p-[4px] text-xs">{address}</span>
            </p>
            <p className="text-sm text-left text-orange-700">
              Chain ID: <span className="bg-orange-200 font-mono text-orange-900 rounded-md p-[4px]">{chainId}</span>
            </p>
            {chainId === monadTestnetUpdated.id ? (
              <div className="flex flex-col space-y-2 border border-orange-300 p-4 rounded-md bg-orange-100">
                <h2 className="text-lg font-semibold text-left text-orange-800">Send Transaction</h2>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-md p-2 text-sm transition-colors"
                  onClick={sendTransactionHandler}
                >
                  Send 0.1 MON
                </button>
                {hash && (
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-md p-2 text-sm transition-colors"
                    onClick={() => window.open(`https://testnet.monadexplorer.com/tx/${hash}`, "_blank")}
                  >
                    View Transaction
                  </button>
                )}
              </div>
            ) : (
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-md p-2 text-sm transition-colors"
                onClick={() => switchChain({ chainId: monadTestnetUpdated.id })}
              >
                Switch to Monad Testnet
              </button>
            )}

            <button
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-md p-2 text-sm transition-colors"
              onClick={() => disconnect()}
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          !isEthProviderAvailable && (
            <p className="text-sm text-left text-orange-700">Wallet connection only via Warpcast</p>
          )
        )}
      </div>
    </div>
  )
}
