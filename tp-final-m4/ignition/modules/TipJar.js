import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TipJar", (m) => {
  // 'TipJar' debe coincidir con el nombre del contrato en Solidity
  const tipJarModule = m.contract("TipJar", /* constructor args si tuviera */);
  return { tipJarModule };
});