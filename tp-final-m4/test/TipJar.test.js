import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("TipJar", function () {
  async function deployTipJarFixture() {
    const [owner, tipper] = await hre.ethers.getSigners();
    const TipJar = await hre.ethers.getContractFactory("TipJar");
    const tipJar = await TipJar.deploy();
    return { tipJar, owner, tipper };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { tipJar, owner } = await loadFixture(deployTipJarFixture);
      expect(await tipJar.owner()).to.equal(owner.address);
    });
  });

  describe("Tipping", function () {
    it("Should accept tips and emit NewTip event", async function () {
      const { tipJar, tipper } = await loadFixture(deployTipJarFixture);

      const tipAmount = hre.ethers.parseEther("0.01");
      const message = "¡Excelente trabajo!";

      await expect(
        tipJar.connect(tipper).tip(message, { value: tipAmount })
      )
        .to.emit(tipJar, "NewTip")
        .withArgs(tipper.address, tipAmount, message);

      const tipsCount = await tipJar.getTipsCount();
      expect(tipsCount).to.equal(1);

      const tip = await tipJar.getTip(0);
      expect(tip.from).to.equal(tipper.address);
      expect(tip.amount).to.equal(tipAmount);
      expect(tip.message).to.equal(message);
    });

    it("Should revert if tip amount is zero", async function () {
      const { tipJar, tipper } = await loadFixture(deployTipJarFixture);

      await expect(
        tipJar.connect(tipper).tip("Propina vacía", { value: 0 })
      ).to.be.revertedWith("Must send ETH to tip");
    });
  });

  describe("Withdraw", function () {
    it("Should allow owner to withdraw and clear tips", async function () {
      const { tipJar, owner, tipper } = await loadFixture(deployTipJarFixture);
      const tipAmount = hre.ethers.parseEther("0.05");

      await tipJar.connect(tipper).tip("Gracias!", { value: tipAmount });

      // Confirm tip exists
      const tipsBefore = await tipJar.getTipsCount();
      expect(tipsBefore).to.equal(1);

      // Expect balance change
      await expect(() => tipJar.connect(owner).withdraw()).to.changeEtherBalance(
        owner,
        tipAmount
      );

      const tipsAfter = await tipJar.getTipsCount();
      expect(tipsAfter).to.equal(0);
    });

    it("Should revert if non-owner tries to withdraw", async function () {
      const { tipJar, tipper } = await loadFixture(deployTipJarFixture);

      await expect(tipJar.connect(tipper).withdraw()).to.be.revertedWith(
        "Only owner"
      );
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to access balance", async function () {
      const { tipJar, owner, tipper } = await loadFixture(deployTipJarFixture);
      const tipAmount = hre.ethers.parseEther("0.01");

      await tipJar.connect(tipper).tip("Hola", { value: tipAmount });

      const balance = await tipJar.connect(owner).getBalance();
      expect(balance).to.equal(tipAmount);

      await expect(tipJar.connect(tipper).getBalance()).to.be.revertedWith("Only owner");
    });

    it("Should only allow owner to get tips list", async function () {
      const { tipJar, owner, tipper } = await loadFixture(deployTipJarFixture);

      await tipJar.connect(tipper).tip("Test", { value: hre.ethers.parseEther("0.01") });

      const allTips = await tipJar.connect(owner).getAllTips();
      expect(allTips.length).to.equal(1);

      await expect(tipJar.connect(tipper).getAllTips()).to.be.revertedWith("Only owner");
    });
  });
});
