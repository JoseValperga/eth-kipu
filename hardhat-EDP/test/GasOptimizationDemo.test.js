import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("GasOptimizationDemo", function () {
    async function deployFixture() {
        const [owner] = await ethers.getSigners();
        const Factory = await ethers.getContractFactory("GasOptimizationDemo");
        const contract = await Factory.deploy();
        await contract.waitForDeployment();

        return { contract, owner };
    }

    async function measureGas(txPromise, label) {
        const tx = await txPromise;
        const receipt = await tx.wait();
        console.log(`${label}: ${receipt.gasUsed.toString()} gas`);
    }

    describe("Gas Measurements", function () {
        it("setValueAlways vs setValueIfDifferent", async function () {
            const { contract } = await loadFixture(deployFixture);

            await measureGas(contract.setValueAlways(100), "setValueAlways");
            await measureGas(
                contract.setValueIfDifferent(100),
                "setValueIfDifferent (no change)"
            );
            await measureGas(
                contract.setValueIfDifferent(101),
                "setValueIfDifferent (changed)"
            );
        });

        it("incrementBalanceStorage vs incrementBalanceWithMemory", async function () {
            const { contract } = await loadFixture(deployFixture);

            await measureGas(
                contract.incrementBalanceStorage(),
                "incrementBalanceStorage"
            );
            await measureGas(
                contract.incrementBalanceWithMemory(),
                "incrementBalanceWithMemory"
            );
        });

        it("Storage vs Memory: fillArrayStorage vs operateInMemoryAndEmit", async function () {
            const { contract } = await loadFixture(deployFixture);

            await measureGas(contract.fillArrayStorage(), "fillArrayStorage");
            await measureGas(
                contract.operateInMemoryAndEmit(),
                "operateInMemoryAndEmit (memory with event)"
            );
        });
    });
});