
// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FEE = 100; //1%
const ADRESS_TESORERIA = "0xb6219CaB8C0C50474A43Df76572AbE9FC968d5aD";

const SimpleBankModule = buildModule("SimpleBankModule", (m) => {
    const fee = m.getParameter("fee", FEE);
    const treasuryAddress = m.getParameter("treasuryAddress", ADRESS_TESORERIA);

    const simpleBank = m.contract("SimpleBank", [fee, treasuryAddress]);

    return { simpleBank };
});

export default SimpleBankModule;

