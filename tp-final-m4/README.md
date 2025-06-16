# 💼 TipJar Solidity Contract

Este repositorio contiene el contrato inteligente `TipJar.sol`, desarrollado en Solidity. Permite recibir propinas (en ETH) con mensajes personalizados y retirar los fondos acumulados únicamente por el propietario del contrato.

Este contrato fue desarrollado como parte del proyecto final de la formación en Ethereum, y está preparado para desplegarse en testnets como Sepolia.

---

## 🚀 Funcionalidades

- Recibir propinas con mensaje personalizado
- Emitir evento por cada propina (`NewTip`)
- Ver historial completo de propinas (por el owner)
- Obtener el balance del contrato (por el owner)
- Retirar todos los fondos (solo owner)
- Emitir evento de retiro (`Withdrawal`)
- Protección contra reentradas (`ReentrancyGuard`)
- Acceso restringido al owner (`onlyOwner`)

---

## 📁 Estructura del contrato

Archivo principal:  
`contracts/TipJar.sol`

Estructura:

```solidity
contract TipJar is ReentrancyGuard {
    address public owner;

    event NewTip(address indexed from, uint256 amount, string message);
    event Withdrawal(address indexed to, uint256 amount);

    struct Tipper {
        address from;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    // Funciones:
    - tip(string message) payable
    - withdraw() onlyOwner
    - getBalance() view onlyOwner
    - getTipsCount() view onlyOwner
    - getTip(uint256 i) view onlyOwner
    - getAllTips() view onlyOwner
}
```

---
## ⚙️ Pre requisitos para trabajar con el contrato (Windows)

- [Visual Studio Code](https://code.visualstudio.com/) instalado.
- Extensión Solidity de Nomic Fundation instalada en Visual Studio Code
- Habilitar [WSL 2](https://learn.microsoft.com/es-es/windows/wsl/install) para trabajar con un entorno Linux nativo.
---

---
## ⚙️ Requisitos para trabajar con el contrato (Windows)

- [Git](https://git-scm.com/) instalado y configurado con tu usuario
- [Node.js](https://nodejs.org/) (v18 o superior) y npm instalados
- [Hardhat](https://hardhat.org/) instalado globalmente o como dependencia
- Crear cuenta en MetaMask con conexión a network testnet Sepolia
- Crear una cuenta y obtener una API Key en [Etherscan](https://etherscan.io/)
- Obtener [ETH](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) de prueba de testnet Sepolia
- Crear una cuenta en [Alchemy](https://alchemy.com/) para el RPC y obtener una Network URL para Sepolia

---

## 🔧 Instalación y uso

1. **Cloná este repositorio:**

```bash
git clone https://github.com/JoseValperga/tipjar_ethereum.git
cd tipjar_ethereum
```

2. **Instalá las dependencias:**

```bash
npm install
```

3. **Configurá tu archivo `.env` con tus claves:**

```env
ALCHEMY_API_KEY=tu_api_key_de_alchemy
SEPOLIA_PRIVATE_KEY_OWNER=clave_privada_owner
SEPOLIA_PRIVATE_KEY_USER=clave_privada_user
ETHERSCAN_API_KEY=tu_api_key_de_etherscan
```

> ⚠️ ¡Nunca subas tu `.env` a GitHub!

4. **Compilá el contrato:**

```bash
npx hardhat compile
```

5. **Desplegá y verifica el contrato en Sepolia:**

```bash
npx hardhat ignition deploy ignition/modules/TipJar.js --network sepolia --verify
```

6. **Obtén la dirección del contrato en Etherscan y agregala en tu .env:**

    A estar atento -> Cuando se hace el deploy aparece en la terminal

```env
ALCHEMY_API_KEY=tu_api_key_de_alchemy
SEPOLIA_PRIVATE_KEY_OWNER=clave_privada_owner
SEPOLIA_PRIVATE_KEY_USER=clave_privada_user
ETHERSCAN_API_KEY=tu_api_key_de_etherscan
TIPJAR_ADDRESS=address de tu contrato en Etherscan obtenida
```

---

## 🧪 Interacción con el contrato 

Podés interactuar con el el contrato de varias maneras.

- Instalá la versión del [contrato](https://github.com/JoseValperga/tipjar_react) en React e interactuá desde ahí

- Utilizar /scripts/interactTipJar.js para testear con dos cuentas (owner y user)
```bash
npx hardhat run /scripts/interactTipJar.js
```
- Utilizar /scripts/interactTipJarOwner.js para testear solo como owner
```bash
npx hardhat run /scripts/interactTipJarOwner.js
```

## 🧪 Testing 

Podés testear el contrato (`test/TipJar.test.js`) para automatizar pruebas usando Hardhat + Chai.

```bash
npx hardhat test
```

---

## 📜 Licencia

MIT — José Valperga, 2025
