// scripts/interact.js

require("dotenv").config();
const { ethers } = require("ethers");

// Validar variables de entorno
const {
  ALCHEMY_URL,
  SEPOLIA_PRIVATE_KEY_OWNER,
  TIPJAR_ADDRESS
} = process.env;

if (!ALCHEMY_URL || !SEPOLIA_PRIVATE_KEY_OWNER || !TIPJAR_ADDRESS) {
  console.error(
    "❌ Variables de entorno faltantes. Define ALCHEMY_URL, SEPOLIA_PRIVATE_KEY_OWNER y TIPJAR_ADDRESS."
  );
  process.exit(1);
}

// Proveedor y wallets
const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);
const walletOwner = new ethers.Wallet(SEPOLIA_PRIVATE_KEY_OWNER, provider);

// Instancia del contrato con owner y user
const tipJarABI = require("../artifacts/contracts/TipJar.sol/TipJar.json").abi;
const tipJar = new ethers.Contract(TIPJAR_ADDRESS, tipJarABI, walletOwner);

// Función interna para envío de propinas
async function _sendTip(contractInstance, who, message, amountEth) {
  const amount = ethers.parseEther(amountEth);
  console.log(`→ ${who} envía propina de ${amountEth} ETH: "${message}"`);
  const tx = await contractInstance.tip(message, { value: amount });
  await tx.wait();
  console.log(`✅ Propina de ${who} completada`);
  return tx;
}

async function sendTipOwner(message, amountEth) {
  return _sendTip(tipJar, "OWNER", message, amountEth);
}


async function getOwner() {
  const owner = await tipJar.owner();
  console.log("🔑 Owner del contrato:", owner);
  return owner;
}

async function readBalanceOwner() {
  const balance = await tipJar.getBalance();
  console.log(`💰 Balance del contrato: ${ethers.formatEther(balance)} ETH`);
  return balance;
}

async function readTipsCountOwner() {
  const count = await tipJar.getTipsCount();
  console.log(`📥 Número de propinas: ${count.toString()}`);
  return count;
}

async function readLastTipOwner() {
  const count = await readTipsCountOwner();
  if (count > 0n) {
    const idx = count - 1n;
    const [from, amount, message, timestamp] = await tipJar.getTip(idx);
    console.log("📝 Última propina:");
    console.log("   From:     ", from);
    console.log("   Amount:   ", ethers.formatEther(amount), "ETH");
    console.log("   Message:  ", message);
    console.log(
      "   Timestamp:",
      new Date(Number(timestamp) * 1000).toLocaleString()
    );
    return { from, amount, message, timestamp };
  } else {
    console.log("No hay propinas aún.");
  }
}

async function withdrawFundsOwner() {
  console.log("→ Retirando fondos al OWNER…");
  const tx = await tipJar.withdraw();
  await tx.wait();
  console.log("💸 Fondos retirados correctamente");
  return tx;
}

async function readAllTipsOwner() {
  const allTips = await tipJar.getAllTips();
  console.log(`📋 Todas las propinas (total: ${allTips.length}):`);
  allTips.forEach((tip, i) => {
    console.log(`\nTip #${i + 1}`);
    console.log("   From:     ", tip.from);
    console.log("   Amount:   ", ethers.formatEther(tip.amount), "ETH");
    console.log("   Message:  ", tip.message);
    console.log(
      "   Timestamp:",
      new Date(Number(tip.timestamp) * 1000).toLocaleString()
    );
  });
  return allTips;
}

async function main() {
  console.log("🔄 Iniciando interacción con TipJar...");

  await getOwner();

  console.log("Interacción con propinas owner");
  await sendTipOwner("¡Excelente trabajo!", "0.005");
  await readBalanceOwner();
  console.log(" ");

  console.log("Interacción con cantidad de propinas owner");
  await readTipsCountOwner();
  console.log(" ");

  console.log("Interacción con última propina owner");
  await readLastTipOwner();
  console.log(" ");

  console.log("Interacción todas las propinas recibidas");
  await readAllTipsOwner();
  console.log(" ");

  console.log("Interacción con retiro de fondos owner");
  await withdrawFundsOwner();
  console.log(" ");

  console.log("✅ Interacción con TipJar completada");
  console.log("🔚 Fin de la interacción");
}

main().catch((error) => {
  console.error("❌ Error en la interacción:", error.reason);
  process.exit(1);
});
