"use client"

import { useWalletConnection } from "../hooks/useWalletConnection"

export function WalletConnectButton() {
  const { isConnected, isPending, connectMetaMask, disconnect, address, isMonadNetwork, switchToMonad } =
    useWalletConnection()

  // Format the address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="wallet-connect-container">
      {!isConnected ? (
        <button
          onClick={connectMetaMask}
          disabled={isPending}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            backgroundColor: "#3B82F6",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {isPending ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "8px",
              backgroundColor: "#F3F4F6",
              fontSize: "14px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: isMonadNetwork ? "#10B981" : "#EF4444",
              }}
            />
            <span>{formatAddress(address)}</span>
            <button
              onClick={disconnect}
              style={{
                marginLeft: "8px",
                padding: "4px 8px",
                borderRadius: "4px",
                backgroundColor: "#EF4444",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Disconnect
            </button>
          </div>

          {!isMonadNetwork && (
            <button
              onClick={switchToMonad}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: "#10B981",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Switch to Monad Testnet
            </button>
          )}
        </div>
      )}
    </div>
  )
}
