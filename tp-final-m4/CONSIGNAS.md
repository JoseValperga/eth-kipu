# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

# 📝 Ejercicio: “Contrato de propinas – TipJar”

## 🎯 Objetivo

Desarrollar un contrato inteligente llamado `TipJar` que permita a los usuarios enviar propinas en ETH con un mensaje, y que el owner pueda retirar los fondos.  
Se debe desplegar en la testnet Sepolia, escribir tests automatizados y crear scripts que interactúen con el contrato usando **Hardhat** y **Ethers.js**.

---

## 🛠️ Requisitos

### 🔹 Contrato Solidity (`TipJar.sol`)

- Función `tip(string memory message)` pública y `payable`.
- Función `withdraw()` solo accesible por el owner.
- Evento `NewTip(address indexed from, uint amount, string message)`.
- Variable pública `owner`.
- (Opcional) Guardar lista de propinas en un mapping para consultas.

---

### 🔹 Hardhat

- Configurar proyecto con Hardhat y Ethers.js.
- Scripts de:
  - Deploy en testnet Sepolia (`scripts/deploy.js`)

---

### 🔹 Tests

- Al menos 3 tests en `test/TipJar.js` que verifiquen:
  - Recepción de propinas y emisión del evento
  - Restricción del `withdraw()` solo al owner
  - Correcta actualización del balance

---

### 🔹 Scripts Ethers.js

- Script que conecte con el contrato desplegado en Sepolia para:
  - Enviar una propina con mensaje
  - Mostrar balance
  - Ejecutar `withdraw()` desde el owner

---

## 📦 Entregables

- ✅ Contrato `TipJar.sol`
- ✅ Scripts de deployment e interacción
- ✅ Archivo de tests en `test/TipJar.js`
- ✅ Archivo `README.md` con instrucciones para:
  - Compilar, testear y desplegar
  - Ejecutar los scripts
  - Configurar la red Sepolia
- ✅ **Link al repositorio público en GitHub**

---

## 💡 Bonus (para alumnos avanzados)

* Agregar struct con `Tipper`, `message`, y `timestamp`
* Guardar array de propinas
* Crear una pequeña UI en React para mostrar mensajes y mandar tips

---

¡Buena suerte y a practicar con código real en Web3! 🚀
