import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";

const Airdrop = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);

  const publicKey = wallet.publicKey ? wallet.publicKey : null;

  // Function to fetch balance
  const fetchBalance = async () => {
    if (!publicKey || !connection) return;
    try {
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / 1_000_000_000); // Convert lamports to SOL
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  // Fetch balance when wallet connects
  useEffect(() => {
    fetchBalance();
  }, [publicKey, connection]);

  // Function to request an airdrop
  async function send() {
    if (!publicKey || !connection) {
      alert("Wallet not connected!");
      return;
    }

    try {
      const lamports = parseFloat(amount) * 1_000_000_000; // Convert SOL to lamports
      const tx = await connection.requestAirdrop(publicKey, lamports);
      alert(`Airdrop requested! Transaction: ${tx}`);
      setAmount("")

      // Wait a bit and refresh balance
      setTimeout(fetchBalance, 5000);
    } catch (error) {
      console.error("Airdrop failed:", error);
      alert("Airdrop failed! Check console for details.");
      setAmount("")
    }
  }

  return (
    <div className=" flex flex-col"
     >
      <p className="font-semibold text-slate-800 font-mono  " >Public key:- {publicKey ? publicKey.toString() : "Not connected"}</p>
      <p className="font-mono" >Balance:- {balance !== null ? `${balance} SOL` : "Fetching..."}</p>
      <div className="flex justify-center items-center " >
      <input className="px-3 py-2 mx-2 my-2 bg-slate-100 border rounded-md border-blue-500 "
        type="number"
        placeholder="Amount in SOL"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}

      />
      <button className=" p-2 bg-gray-300 rounded-md  border border-gray-700 " onClick={send}>Airdrop</button>
      </div>
    </div>
  );
};

export default Airdrop;
