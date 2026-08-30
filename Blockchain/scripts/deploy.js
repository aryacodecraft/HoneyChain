const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying HoneyChain to Sepolia...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with wallet:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Wallet balance:", ethers.formatEther(balance), "ETH");

  const HoneyChain = await ethers.getContractFactory("HoneyChain");
  const contract = await HoneyChain.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ Contract deployed to:", address);
  console.log("📋 Copy this address to your .env as CONTRACT_ADDRESS");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});