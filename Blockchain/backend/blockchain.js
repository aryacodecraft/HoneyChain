const { ethers } = require("ethers");
const axios = require("axios");
const https = require("https");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: "../.env" });

// ─── Load ABI from Hardhat artifacts ────────────────────────────────────────
const artifactPath = path.join(
  __dirname,
  "../artifacts/contracts/HoneyChain.sol/HoneyChain.json"
);
const contractArtifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
const ABI = contractArtifact.abi;

// ─── Setup ethers.js ─────────────────────────────────────────────────────────
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  ABI,
  signer
);

// ─── Axios instance with SSL fix ─────────────────────────────────────────────
// Fixes "unable to verify the first certificate" on some networks/VPNs
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

// ─── IPFS (Pinata) Helpers ───────────────────────────────────────────────────

async function uploadToIPFS(data, name = "honey-data") {
  try {
    const response = await axiosInstance.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataContent: data,
        pinataMetadata: { name },
      },
      {
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Uploaded to IPFS. CID:", response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (err) {
    console.error("❌ IPFS upload failed:", err.message);
    throw err;
  }
}

async function fetchFromIPFS(cid) {
  const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
  const response = await axiosInstance.get(url);
  return response.data;
}

// ─── Smart Contract Functions ────────────────────────────────────────────────

/**
 * CREATE BATCH
 * Called after beekeeper sends sensor data + ML generates trust score.
 *
 * @returns {{ transactionType, txHash, blockNumber, ipfsCID }}
 *
 * Backend saves to MongoDB blockchain_records:
 *   transactionType   → "batch_created"
 *   transactionHash   → result.txHash
 *   blockNumber       → result.blockNumber
 *   dataHash          → result.ipfsCID
 *   blockchainNetwork → "Sepolia Testnet"
 *   status            → "confirmed"
 */
async function createHoneyBatch(batchId, trustScore, batchData) {
  console.log(`\n📦 Creating batch: ${batchId}`);

  console.log("📤 Uploading to IPFS...");
  const ipfsCID = await uploadToIPFS(batchData, `batch-${batchId}`);

  console.log("⛓️  Writing to blockchain...");
  const tx = await contract.createBatch(batchId, trustScore, ipfsCID);

  console.log("⏳ Waiting for confirmation...");
  const receipt = await tx.wait();

  console.log(`✅ Batch created!`);
  console.log(`   TX Hash     : ${receipt.hash}`);
  console.log(`   Block Number: ${receipt.blockNumber}`);
  console.log(`   IPFS CID    : ${ipfsCID}`);
  console.log(`   Etherscan   : https://sepolia.etherscan.io/tx/${receipt.hash}`);

  return {
    transactionType: "batch_created",
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    ipfsCID,
  };
}

/**
 * PROCESS BATCH
 * Called by processor after receiving, processing & packaging honey.
 *
 * @returns {{ transactionType, txHash, blockNumber, ipfsCID }}
 *
 * Backend saves to MongoDB blockchain_records:
 *   transactionType → "processing_updated"
 */
async function processBatch(batchId, processingData) {
  console.log(`\n🏭 Processing batch: ${batchId}`);

  const ipfsCID = await uploadToIPFS(processingData, `processed-${batchId}`);

  const tx = await contract.processBatch(batchId, ipfsCID);
  const receipt = await tx.wait();

  console.log(`✅ Batch processed!`);
  console.log(`   TX Hash     : ${receipt.hash}`);
  console.log(`   Block Number: ${receipt.blockNumber}`);

  return {
    transactionType: "processing_updated",
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    ipfsCID,
  };
}

/**
 * APPROVE BATCH
 * Called when quantity check passes — no adulteration detected.
 *
 * @returns {{ transactionType, txHash, blockNumber }}
 *
 * Backend saves to MongoDB blockchain_records:
 *   transactionType → "batch_approved"
 */
async function approveBatch(batchId) {
  console.log(`\n✅ Approving batch: ${batchId}`);

  const tx = await contract.approveBatch(batchId);
  const receipt = await tx.wait();

  console.log(`✅ Approved!`);
  console.log(`   TX Hash     : ${receipt.hash}`);
  console.log(`   Block Number: ${receipt.blockNumber}`);

  return {
    transactionType: "batch_approved",
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  };
}

/**
 * FLAG BATCH
 * Called when quantity mismatch or anomaly detected.
 *
 * @returns {{ transactionType, txHash, blockNumber }}
 *
 * Backend saves to MongoDB blockchain_records:
 *   transactionType → "batch_flagged"
 */
async function flagBatch(batchId, reason) {
  console.log(`\n🚩 Flagging batch: ${batchId}`);
  console.log(`   Reason: ${reason}`);

  const tx = await contract.flagBatch(batchId, reason);
  const receipt = await tx.wait();

  console.log(`🚩 Flagged!`);
  console.log(`   TX Hash     : ${receipt.hash}`);
  console.log(`   Block Number: ${receipt.blockNumber}`);

  return {
    transactionType: "batch_flagged",
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  };
}

/**
 * LOG TRANSPORT
 * Called by distributor when honey is being transported.
 *
 * @returns {{ transactionType, txHash, blockNumber, locationCID }}
 *
 * Backend saves to MongoDB blockchain_records:
 *   transactionType → "location_updated"
 *   dataHash        → result.locationCID
 */
async function logTransport(batchId, transportData) {
  console.log(`\n🚚 Logging transport for batch: ${batchId}`);

  const locationCID = await uploadToIPFS(transportData, `transport-${batchId}`);

  const tx = await contract.logTransport(batchId, locationCID);
  const receipt = await tx.wait();

  console.log(`✅ Transport logged!`);
  console.log(`   TX Hash     : ${receipt.hash}`);
  console.log(`   Block Number: ${receipt.blockNumber}`);
  console.log(`   Location CID: ${locationCID}`);

  return {
    transactionType: "location_updated",
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    locationCID,
  };
}

/**
 * MARK DELIVERED
 * Called when retailer receives the honey batch.
 *
 * @returns {{ transactionType, txHash, blockNumber }}
 *
 * Backend saves to MongoDB blockchain_records:
 *   transactionType → "batch_delivered"
 */
async function markDelivered(batchId) {
  console.log(`\n🏪 Marking delivered: ${batchId}`);

  const tx = await contract.markDelivered(batchId);
  const receipt = await tx.wait();

  console.log(`✅ Delivered!`);
  console.log(`   TX Hash     : ${receipt.hash}`);
  console.log(`   Block Number: ${receipt.blockNumber}`);

  return {
    transactionType: "batch_delivered",
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  };
}

/**
 * GET BATCH INFO — Consumer QR Scan
 * READ ONLY — free, no gas needed.
 * Returns everything needed for Honey Passport UI.
 *
 * honeyPassport fields match Image 1 UI exactly:
 *   batch, source, beekeeperVerified, floralSource,
 *   harvestDate, qualityTest, processingVerified,
 *   distributionVerified, blockchainVerified
 */
async function getBatchInfo(batchId) {
  console.log(`\n🔍 Fetching batch info: ${batchId}`);

  const [id, beekeeper, trustScore, ipfsCID, status, createdAt] =
    await contract.getBatch(batchId);

  const custodyChain = await contract.getCustodyChain(batchId);
  const ipfsData = await fetchFromIPFS(ipfsCID);

  const statusMap = {
    0: "Created",
    1: "Processing",
    2: "Approved",
    3: "FlaggedAdulteration",
    4: "InTransit",
    5: "Delivered",
  };
  const statusStr = statusMap[Number(status)] || "Unknown";

  // Ready-to-display fields for Honey Passport UI (matches your Image 1)
  const honeyPassport = {
    batch: id,
    source: ipfsData.hiveId || "N/A",
    beekeeperVerified: !!beekeeper,
    floralSource: ipfsData.floralSource || "N/A",
    harvestDate: ipfsData.harvestDate || "N/A",
    qualityTest: Number(trustScore) >= 70 ? "PASS" : "FAIL",
    processingVerified: ["Processing", "Approved", "InTransit", "Delivered"].includes(statusStr),
    distributionVerified: ["InTransit", "Delivered"].includes(statusStr),
    blockchainVerified: true,
  };

  return {
    batchId: id,
    beekeeper,
    trustScore: Number(trustScore),
    status: statusStr,
    createdAt: new Date(Number(createdAt) * 1000).toISOString(),
    ipfsCID,
    isBlockchainVerified: true,
    fullData: ipfsData,
    honeyPassport,
    custodyChain: custodyChain.map((log) => ({
      from: log.from,
      to: log.to,
      role: log.role,
      timestamp: new Date(Number(log.timestamp) * 1000).toISOString(),
      locationCID: log.locationCID || null,
    })),
  };
}

// ─── Export all functions ────────────────────────────────────────────────────
module.exports = {
  createHoneyBatch,
  processBatch,
  approveBatch,
  flagBatch,
  logTransport,
  markDelivered,
  getBatchInfo,
  uploadToIPFS,
  fetchFromIPFS,
};