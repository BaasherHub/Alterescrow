const hre = require("hardhat");

// ─────────────────────────────────────────────────────
//  CONFIGURATION - Edit before deploying
// ─────────────────────────────────────────────────────

// BSC Testnet USDT: 0x337610d27c682E347C9cD60BD4b3b107C9d34dDd
// BSC Mainnet USDT: 0x55d398326f99059fF775485246999027B3197955
const USDT_ADDRESS = {
  bscTestnet: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
  bscMainnet: "0x55d398326f99059fF775485246999027B3197955",
};

// Your wallet address as arbitrator (can update later)
const ARBITRATOR_ADDRESS = process.env.ARBITRATOR_ADDRESS || process.env.DEPLOYER_ADDRESS;

// Platform fee: 50 = 0.5%, 100 = 1%, 30 = 0.3%
const PLATFORM_FEE_BPS = 50; // 0.5%

// ─────────────────────────────────────────────────────

async function main() {
  const network = hre.network.name;
  console.log(`\n🚀 Deploying P2PEscrow to ${network}...`);

  const [deployer] = await hre.ethers.getSigners();
  console.log(`📦 Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Deployer balance: ${hre.ethers.formatEther(balance)} BNB`);

  if (!ARBITRATOR_ADDRESS) {
    throw new Error("ARBITRATOR_ADDRESS not set in .env");
  }

  console.log(`⚖️  Arbitrator: ${ARBITRATOR_ADDRESS}`);
  console.log(`💸 Platform fee: ${PLATFORM_FEE_BPS / 100}%`);

  // Deploy contract
  const P2PEscrow = await hre.ethers.getContractFactory("P2PEscrow");
  const escrow = await P2PEscrow.deploy(ARBITRATOR_ADDRESS, PLATFORM_FEE_BPS);

  await escrow.waitForDeployment();
  const contractAddress = await escrow.getAddress();

  console.log(`\n✅ P2PEscrow deployed to: ${contractAddress}`);

  // Add USDT as supported token
  const usdtAddress = USDT_ADDRESS[network];
  if (usdtAddress) {
    console.log(`\n🪙 Adding USDT (${usdtAddress}) as supported token...`);
    const tx = await escrow.addSupportedToken(usdtAddress);
    await tx.wait();
    console.log(`✅ USDT added successfully`);
  }

  // Print summary
  console.log("\n─────────────────────────────────────────");
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("─────────────────────────────────────────");
  console.log(`Network:          ${network}`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Owner:            ${deployer.address}`);
  console.log(`Arbitrator:       ${ARBITRATOR_ADDRESS}`);
  console.log(`Platform Fee:     ${PLATFORM_FEE_BPS / 100}%`);
  console.log(`USDT Address:     ${usdtAddress}`);
  console.log("─────────────────────────────────────────");
  console.log("\n⚠️  IMPORTANT: Save the contract address above in your .env file:");
  console.log(`NEXT_PUBLIC_ESCROW_CONTRACT=${contractAddress}`);
  console.log(`NEXT_PUBLIC_USDT_ADDRESS=${usdtAddress}`);

  if (network !== "bscTestnet") {
    console.log("\n🔍 Verify contract on BSCScan:");
    console.log(`npx hardhat verify --network ${network} ${contractAddress} "${ARBITRATOR_ADDRESS}" "${PLATFORM_FEE_BPS}"`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
