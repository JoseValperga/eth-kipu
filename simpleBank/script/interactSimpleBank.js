//Ejemplo completo en
//https://gist.github.com/luisvid/2ca8d398630bb2ae18c42dc0da82ce9e


const { ethers } = require("ethers");
const simpleBankABI = require("../artifacts/contracts/simpleBank.sol/SimpleBank.json");

require("dotenv").config();
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const SIMPLEBANK_ADDRESS = process.env.SIMPLEBANK_ADDRESS;

// Crear proveedor y wallet
const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);
const wallet = new ethers.Wallet(SEPOLIA_PRIVATE_KEY, provider);

// Instanciar el contrato
const simpleBankContract = new ethers.Contract(SIMPLEBANK_ADDRESS, simpleBankABI.abi, wallet);

// Función para registrar un usuario
async function registerUser() {
    console.log("Registrando usuario...");
    const txRegister = await simpleBankContract.register("Jose", "Valperga");
    console.log("Hash de transacción:", txRegister.hash);
    await txRegister.wait();
    console.log("Usuario registrado correctamente ✅");
}

async function depositEth() {
    console.log("Depositando ETH...");
    const amount = ethers.parseEther("0.01"); // 0.01 ETH
    const txDeposit = await simpleBankContract.deposit({ value: amount });
    console.log("Hash de transacción:", txDeposit.hash);
    await txDeposit.wait();
    console.log("Depósito realizado correctamente ✅");
    console.log(`${ethers.formatEther(amount)} ETH depositados.`);
}

async function getBalance() {
    console.log("Obteniendo balance del usuario...");
    const balance = await simpleBankContract.getBalance();
    console.log(`El balance del usuario es: ${ethers.formatEther(balance)} ETH`);
}

async function withdrawEth() {
    console.log("Retirando ETH...");
    const amount = ethers.parseEther("0.005"); // 0.005 ETH
    const txWithdraw = await simpleBankContract.withdraw(amount);
    console.log("Hash de transacción:", txWithdraw.hash);
    await txWithdraw.wait();
    console.log("Retiro realizado correctamente ✅");
    console.log(`${ethers.formatEther(amount)} ETH retirados.`);
}

async function emergencyWithdraw() {
    console.log("Realizando retiro de emergencia...");
    const txEmergencyWithdraw = await simpleBankContract.emergencyWithdraw();
    console.log("Hash de transacción:", txEmergencyWithdraw.hash);
    await txEmergencyWithdraw.wait();
    console.log("Retiro de emergencia realizado correctamente ✅");
}

// Función principal
async function main() {
    console.log("Interactuando con el contrato SimpleBank...");
    await registerUser();
    await depositEth();
    await getBalance();
    await withdrawEth();
    await getBalance();
    await emergencyWithdraw();
    await getBalance();

    console.log("Interacción completada.");
}

// Ejecutar main
main().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
});
