// scripts/interact.js

const { ethers } = require("ethers");
const TipJarABI = require("../artifacts/contracts/TipJar.sol/TipJar.json");

require("dotenv").config();
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const TIPJAR_ADDRESS = process.env.TIPJAR_ADDRESS;

// Configuración de provider y wallet
const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);

const wallet = new ethers.Wallet(SEPOLIA_PRIVATE_KEY, provider);
const tipJar = new ethers.Contract(
  TIPJAR_ADDRESS,
  TipJarABI.abi,
  wallet
);

/**
 * Obtiene y muestra la dirección del owner del contrato
 */
async function getOwner() {
  const owner = await tipJar.owner();
  console.log("🔑 Owner del contrato:", owner);
  return owner;
}

/**
 * Envía una propina con mensaje y cantidad especificada en ETH
 * @param {string} message - Mensaje de la propina
 * @param {string} amountEth - Cantidad en ETH (como string)
 */
async function sendTip(message, amountEth) {
  const amount = ethers.parseEther(amountEth);
  console.log(`→ Enviando propina de ${amountEth} ETH: "${message}"`);
  const tx = await tipJar.tip(message, { value: amount });
  await tx.wait();
  console.log("✅ Propina enviada");
}

/**
 * Lee y muestra el balance del contrato (solo owner)
 */
async function readBalance() {
  const balance = await tipJar.getBalance();
  console.log(
    `💰 Balance del contrato: ${ethers.formatEther(balance)} ETH`
  );
  return balance;
}

/**
 * Devuelve el número total de propinas recibidas
 */
async function readTipsCount() {
  const count = await tipJar.getTipsCount();
  console.log(`📥 Número de propinas: ${count.toString()}`);
  return count;
}

/**
 * Lee y muestra la última propina recibida
 */
async function readLastTip() {
  const count = await readTipsCount();
  if (count.gt(0)) {
    const idx = count.sub(1);
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

/**
 * Retira todos los fondos del contrato al owner (solo owner)
 */
async function withdrawFunds() {
  console.log("→ Retirando fondos al owner…");
  const tx = await tipJar.withdraw();
  await tx.wait();
  console.log("💸 Fondos retirados correctamente");
}

/**
 * Función principal de ejecución
 */
async function main() {
  console.log("🔄 Iniciando interacción con TipJar...");
  //await getOwner();
  //await sendTip("¡Excelente trabajo!", "0.005");
  await readBalance();
  //await readLastTip();
  //await withdrawFunds();
}

main().catch((error) => {
  console.error("❌ Error en la interacción:", error);
  process.exit(1);
});
