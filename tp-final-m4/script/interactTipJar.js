// scripts/interact.js

require("dotenv").config();
const { ethers } = require("ethers");

// Validar variables de entorno
const {
  ALCHEMY_URL,
  SEPOLIA_PRIVATE_KEY_OWNER,
  SEPOLIA_PRIVATE_KEY_USER,
  TIPJAR_ADDRESS
} = process.env;

if (!ALCHEMY_URL || !SEPOLIA_PRIVATE_KEY_OWNER || !SEPOLIA_PRIVATE_KEY_USER || !TIPJAR_ADDRESS) {
  console.error(
    "❌ Variables de entorno faltantes. Define ALCHEMY_URL, SEPOLIA_PRIVATE_KEY_OWNER, SEPOLIA_PRIVATE_KEY_USER y TIPJAR_ADDRESS."
  );
  process.exit(1);
}

// Proveedor y wallets
const provider    = new ethers.JsonRpcProvider(ALCHEMY_URL);
const walletOwner = new ethers.Wallet(SEPOLIA_PRIVATE_KEY_OWNER, provider);
const walletUser  = new ethers.Wallet(SEPOLIA_PRIVATE_KEY_USER,  provider);

// Instancia del contrato con owner y user
const tipJarABI = require("../artifacts/contracts/TipJar.sol/TipJar.json").abi;
const tipJar     = new ethers.Contract(TIPJAR_ADDRESS, tipJarABI,     walletOwner);
const tipJarUser = tipJar.connect(walletUser);

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

async function sendTipUser(message, amountEth) {
  return _sendTip(tipJarUser, "USER", message, amountEth);
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

async function readBalanceUser() {
  try {
    const balance = await tipJarUser.getBalance();
    console.log(`💰 Balance (USER): ${ethers.formatEther(balance)} ETH`);
    return balance;
  } catch (err) {
    console.log("⛔ El USER no tiene permiso para leer el balance:", err.message);
  }
}

async function readTipsCountOwner() {
  const count = await tipJar.getTipsCount();
  console.log(`📥 Número de propinas: ${count.toString()}`);
  return count;
}

async function readTipsCountUser() {
  try {
    const count = await tipJarUser.getTipsCount();
    console.log(`📥 Número de propinas (USER): ${count.toString()}`);
    return count;
  }
  catch (err) {
    console.log("⛔ El USER no tiene permiso para leer el número de propinas:", err.message);
  }
}

async function readLastTipOwner() {
  const count = await readTipsCountOwner();
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

async function readLastTipUser() {
  try {
    const count = await readTipsCountUser();
    if (count.gt(0)) {
      const idx = count.sub(1);
      const [from, amount, message, timestamp] = await tipJarUser.getTip(idx);
      console.log("📝 Última propina (USER):");
      console.log("   From:     ", from);
      console.log("   Amount:   ", ethers.formatEther(amount), "ETH");
      console.log("   Message:  ", message);
      console.log(
        "   Timestamp:",
        new Date(Number(timestamp) * 1000).toLocaleString()
      );
      return { from, amount, message, timestamp };
    } else {
      console.log("No hay propinas aún (USER).");
    }
  } catch (err) {
    console.log("⛔ El USER no tiene permiso para leer la última propina:", err.message);
  }
}


async function withdrawFunds() {
  console.log("→ Retirando fondos al OWNER…");
  const tx = await tipJar.withdraw();
  await tx.wait();
  console.log("💸 Fondos retirados correctamente");
  return tx;
}

async function main() {
  console.log("🔄 Iniciando interacción con TipJar...");
  //await getOwner();

  //await sendTipOwner("¡Excelente trabajo!", "0.005");
  //await readBalanceOwner();

  //await sendTipUser("¡Excelente trabajo!", "0.005");
  //await readBalanceUser();

  //await readTipsCountOwner();
  //await readTipsCountUser();
  await readLastTipOwner();
  //await readLastTipUser();
  //await sendTipUser("Gracias por tu contribución", "0.001");
  //await readBalance();
  //await withdrawFunds();
}

main().catch((error) => {
  console.error("❌ Error en la interacción:", error);
  process.exit(1);
});
