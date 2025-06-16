import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contracts/TipJar";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [tipJar, setTipJar] = useState(null);
  const [message, setMessage] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [balance, setBalance] = useState(null);
  const [tips, setTips] = useState([]);
  const [ranking, setRanking] = useState([]);

  // Conectar wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Instalá MetaMask");
      return;
    }
    const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accs[0]);

    const _provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(_provider);

    const signer = await _provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    setTipJar(contract);

    const ownerAddress = await contract.owner();
    setIsOwner(accs[0].toLowerCase() === ownerAddress.toLowerCase());
  };

  // Enviar propina
  const sendTip = async () => {
    if (!message || !tipJar) return;
    const tx = await tipJar.tip(message, {
      value: ethers.parseEther("0.01"),
    });
    await tx.wait();
    alert("Propina enviada");
    setMessage("");
    if (isOwner) loadOwnerData();
  };

  // Cargar datos del owner (balance + propinas + ranking)
  const loadOwnerData = async () => {
    if (!tipJar || !isOwner) return;

    const bal = await tipJar.getBalance();
    setBalance(ethers.formatEther(bal));

    const allTips = await tipJar.getAllTips();
    const parsed = allTips.map((tip) => ({
      from: tip.from,
      amount: ethers.formatEther(tip.amount),
      message: tip.message,
      timestamp: new Date(Number(tip.timestamp) * 1000).toLocaleString(),
    }));
    setTips(parsed);

    // Calcular ranking por dirección
    const aggregated = {};
    parsed.forEach((tip) => {
      if (!aggregated[tip.from]) {
        aggregated[tip.from] = { total: 0, count: 0 };
      }
      aggregated[tip.from].total += parseFloat(tip.amount);
      aggregated[tip.from].count += 1;
    });

    const rankingArray = Object.entries(aggregated)
      .map(([from, data]) => ({
        from,
        total: data.total,
        count: data.count,
      }))
      .sort((a, b) => b.total - a.total); // orden descendente

    setRanking(rankingArray);
  };

  // Retirar fondos
  const withdraw = async () => {
    if (!tipJar) return;
    const tx = await tipJar.withdraw();
    await tx.wait();
    alert("Fondos retirados");
    setTips([]);
    setBalance("0");
    setRanking([]);
  };

  // Detectar cambio de cuenta
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
    }
  }, []);

  useEffect(() => {
    if (isOwner) {
      loadOwnerData();
    }
  }, [tipJar, isOwner]);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">💰 TipJar dApp</h1>

      {!account ? (
        <button className="px-4 py-2 bg-blue-600 text-white" onClick={connectWallet}>
          Conectar Wallet
        </button>
      ) : (
        <div>
          <p>Cuenta conectada: <strong>{account}</strong></p>
          <p>Rol: {isOwner ? "👑 Owner" : "🧑 Usuario"}</p>
          <p className="text-sm text-gray-600">
            Cambiá de cuenta desde MetaMask si querés enviar desde otra.
          </p>

          <div className="mt-4 space-y-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje"
              className="border p-2 w-full"
            />
            <button
              onClick={sendTip}
              className="bg-green-600 text-white px-4 py-2"
            >
              Enviar propina (0.01 ETH)
            </button>
          </div>

          {isOwner && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Panel de Owner</h2>
              <p>💼 Balance del contrato: {balance} ETH</p>
              <button
                onClick={withdraw}
                className="bg-red-600 text-white px-4 py-2 mt-2"
              >
                Retirar fondos
              </button>

              <h3 className="mt-4 font-bold">📜 Historial de Propinas:</h3>
              {tips.length === 0 ? (
                <p>No hay propinas registradas</p>
              ) : (
                <ul className="space-y-2 mt-2">
                  {tips.map((tip, index) => (
                    <li key={index} className="border p-2">
                      <p><strong>{tip.from}</strong> envió {tip.amount} ETH</p>
                      <p>🗨️ "{tip.message}"</p>
                      <p className="text-sm text-gray-500">{tip.timestamp}</p>
                    </li>
                  ))}
                </ul>
              )}

              <h3 className="mt-6 font-bold">🏆 Ranking de Tippers:</h3>
              {ranking.length === 0 ? (
                <p>Sin ranking</p>
              ) : (
                <ul className="space-y-2 mt-2">
                  {ranking.map((entry, idx) => (
                    <li key={idx} className="border p-2">
                      <p>#{idx + 1} <strong>{entry.from}</strong></p>
                      <p>Total: {entry.total.toFixed(4)} ETH en {entry.count} tips</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
