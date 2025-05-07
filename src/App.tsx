import { WalletConnectButton } from "./components/WalletConnectButton"

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "24px" }}>Monad Mini App</h1>
      <WalletConnectButton />
    </div>
  )
}

export default App
