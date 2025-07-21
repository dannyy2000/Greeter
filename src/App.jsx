import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress = "0x64a2e28b881A12e9C314A6D2113564b4eFB141a3";

function App() {
  const [text, setText] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");

  async function requestAccount() {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error("Error requesting account:", error);
      alert("Failed to connect to MetaMask. Please ensure MetaMask is installed and unlocked.");
    }
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      if (!window.ethereum) {
        alert("MetaMask not found. Please install MetaMask to use this application.");
        return;
      }

      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.setMessage(text);
      const txReceipt = await tx.wait();
      console.log("Transaction successful:", txReceipt);
      alert("Message set successfully!");
      setText(""); 
    } catch (error) {
      console.error("Error setting message:", error);
      // alert(error.message || "Failed to set message.");
    }
  };

  const handleGet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not found. Please install MetaMask to use this application.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const message = await contract.getMessage();
      setCurrentMessage(message);
      console.log("Current message:", message);
    } catch (error) {
      console.error("Error getting message:", error);
      alert(error.message || "Failed to get message.");
    }
  };
return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>
        Set Message on Smart Contract
      </h1>
      <input
        type="text"
        placeholder="Set message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          padding: "0.5rem",
          width: "100%",
          marginBottom: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
        <button
          onClick={handleSet}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Set Message
        </button>
        <button
          onClick={handleGet}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Get Message
        </button>
      </div>
      {currentMessage && (
        <p style={{ marginTop: "1rem", textAlign: "center", wordBreak: "break-word" }}>
          Current Message: {currentMessage}
        </p>
      )}
    </div>
  );
}


export default App; 