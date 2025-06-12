// ignition/modules/DeploySimpleStorage.js
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SimpleStorageModule = buildModule("SimpleStorageModule", (m) => {
  // Aquí registramos la instancia de contrato a desplegar.
  // El constructor no recibe parámetros, así que pasamos un array vacío.
  const simpleStorage = m.contract("SimpleStorage", []);

  // Devolvemos el handle para poder acceder a él después del deploy.
  return { simpleStorage };
});

export default SimpleStorageModule;
