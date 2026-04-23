// scripts/deploy.js
// Run:  npx hardhat run scripts/deploy.js --network sepolia

const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  test.exe — Deploy Script");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Deployer  : ${deployer.address}`);
  console.log(`  Balance   : ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`);

  // ── Constructor args ──────────────────────────────────────────────────────
  // preRevealURI: shown for every token until reveal() is called.
  // Replace with your actual pre-reveal image on IPFS.
  const PRE_REVEAL_URI = "ipfs://bafybeihidden000000000000000000000000000000/hidden.json";
  const ROYALTY_BPS    = 500;   // 5 %

  // ── Deploy ────────────────────────────────────────────────────────────────
  const Factory = await ethers.getContractFactory("TestExe");
  const contract = await Factory.deploy(
    deployer.address,  // initialOwner
    PRE_REVEAL_URI,
    ROYALTY_BPS,
  );
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`\n  ✔ Contract deployed at: ${address}`);
  console.log(`  ✔ Name   : ${await contract.name()}`);
  console.log(`  ✔ Symbol : ${await contract.symbol()}`);
  console.log(`  ✔ Mint   : ${ethers.formatEther(await contract.mintPrice())} ETH (~$1 USD)`);
  console.log(`\n  Next steps:`);
  console.log(`    1. Upload hidden/pre-reveal image to IPFS`);
  console.log(`    2. Call toggleSale() to open minting on OpenSea`);
  console.log(`    3. After sellout: upload final images + metadata to IPFS`);
  console.log(`    4. Call reveal("ipfs://<YOUR_CID>/") to reveal collection`);
  console.log(`    5. Verify on Etherscan:\n`);
  console.log(`       npx hardhat verify --network sepolia ${address} \\`);
  console.log(`         "${deployer.address}" \\`);
  console.log(`         "${PRE_REVEAL_URI}" \\`);
  console.log(`         ${ROYALTY_BPS}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
