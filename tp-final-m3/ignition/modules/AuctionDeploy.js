import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AuctionDeploy", (m) => {
  const deployer = m.getAccount(0);

  const token = m.contract("AuctionToken", [deployer]);
  const nft = m.contract("AuctionNFT", [deployer]);
  const platform = m.contract("AuctionPlatform", [token, nft]);

  return { token, nft, platform };
});
