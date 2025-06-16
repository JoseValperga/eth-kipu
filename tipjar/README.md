# 💰 TipJar dApp

Esta es una aplicación descentralizada (dApp) desarrollada en React + Vite que permite enviar propinas en Ethereum a través de MetaMask. La lógica del contrato inteligente está escrita en Solidity y desplegada en la red Sepolia (testnet).

---

## 🚀 Características

- Conexión con MetaMask
- Envío de propinas con mensajes personalizados
- Visualización de historial de propinas (solo para el owner del contrato)
- Visualización del balance y retiro de fondos (solo owner)
- Ranking de los mayores tippers

---

## ⚠️ IMPORTANTE e INDISPENSABLE

Antes de ejecutar esta aplicación, es **imprescindible** desplegar el contrato inteligente `TipJar.sol` en una red Ethereum compatible (como Sepolia).

### 📍 El contrato se encuentra en:

🔗 [https://github.com/JoseValperga/eth-kipu/tree/main/tp-final-m4](https://github.com/JoseValperga/eth-kipu/tree/main/tp-final-m4)

---

### 🔧 ¿Qué se necesita hacer después del deploy?

Una vez desplegado el contrato:

1. **Copiar la dirección del contrato** desde Etherscan y colocarla en el archivo `.env`:

   ```env
   VITE_CONTRACT_ADDRESS=0xTU_DIRECCION_DE_CONTRATO
   ```

2. **Copiar el ABI del contrato** desde Etherscan o desde el archivo generado por Hardhat (`ignition/deploymets/chain-11155111/artifacts/TipJar#TipJar.json` - el 11155111 corresponde a la red Sepolia) y pegarlo en:

   `src/contracts/TipJar.js`

   ```js
   export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

   export const CONTRACT_ABI = [
     // 👇 Pegá aquí el contenido del campo "abi"
   ];
   ```

> ❗ Si no hacés estos pasos, la aplicación **no podrá conectarse al contrato ni funcionar correctamente**.

---

## ⚙️ Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- Navegador con [MetaMask](https://metamask.io/) instalada
- Contrato TipJar desplegado (por ejemplo, en Sepolia)
- ETH de prueba en la red correspondiente (como Sepolia)

---

## 📦 Tecnologías utilizadas

| Herramienta / Librería | Versión recomendada | Descripción                                                                 |
|------------------------|---------------------|-----------------------------------------------------------------------------|
| [React](https://reactjs.org/) | 18+ | Librería principal para construir la interfaz de usuario                   |
| [Vite](https://vitejs.dev/) | 5+ | Empaquetador rápido y ligero para aplicaciones React                       |
| [ethers.js](https://docs.ethers.io/v6/) | 6.x | Librería para interactuar con contratos en la blockchain Ethereum          |
| [Tailwind CSS](https://tailwindcss.com/) | 3+ | Framework de utilidades CSS para diseño rápido y responsivo                |
| [MetaMask](https://metamask.io/) | extensión navegador | Wallet que permite conectar cuentas Ethereum al navegador                  |
| [dotenv (integrado en Vite)](https://vitejs.dev/guide/env-and-mode.html) | — | Para manejar variables de entorno como la dirección del contrato           |

> **Nota:** No se necesita instalar `dotenv` manualmente porque **Vite ya lo interpreta automáticamente** desde el archivo `.env`, siempre y cuando uses el prefijo `VITE_`.

> El archivo `.env` debe contener únicamente:

```env
VITE_CONTRACT_ADDRESS=0xTU_DIRECCION_DE_CONTRATO
```

---

## 📁 Configuración paso a paso

1. **Cloná el repositorio**:

   ```bash
   git clone https://github.com/tu-usuario/tipjar-frontend.git
   cd tipjar-frontend
   ```

2. **Instalá las dependencias**:

   ```bash
   npm install
   ```

3. **Creá el archivo `.env` en la raíz del proyecto**:

   ```bash
   touch .env
   ```

   Y agregá lo siguiente:

   ```env
   VITE_CONTRACT_ADDRESS=0xTU_DIRECCION_DE_CONTRATO
   ```

   > ⚠️ Reemplazá `0xTU_DIRECCION_DE_CONTRATO` por la dirección real del contrato desplegado en Sepolia u otra testnet compatible con MetaMask.


4. **Copiar el ABI del contrato** desde Etherscan o desde el archivo generado por Hardhat (`/ignition/deploymets/chain-11155111/artifacts/TipJar#TipJar.json` - el 11155111 corresponde a la red Sepolia) y pegarlo en:

   `src/contracts/TipJar.js`

   ```js
   export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

   export const CONTRACT_ABI = [
     // 👇 Pegá aquí el contenido del campo "abi"
   ];
   ```

> ❗ Si no hacés estos pasos, la aplicación **no podrá conectarse al contrato ni funcionar correctamente**.

5. **Ejecutá el servidor de desarrollo**:

   ```bash
   npm run dev
   ```

6. **Abrí el navegador** en:

   ```
   http://localhost:5173
   ```

7. **Conectá MetaMask** y comenzá a usar la dApp ✨

---

## 📌 Importante sobre `.env`

- El archivo `.env` **no debe subirse al repositorio** (está listado en `.gitignore`).
- Solo funciona si las variables están prefijadas con `VITE_`.
- Cada vez que edites `.env`, **reiniciá el servidor** (`Ctrl + C` y luego `npm run dev`).

---

## 🧾 Licencia

MIT — José Valperga, 2025

