const QRCode = require("qrcode");
const Hive = require("../models/Hive");
const HoneyBatch = require("../models/HoneyBatch");
const MLPrediction = require("../models/MLPrediction");
const BlockchainRecord = require("../models/BlockchainRecord");
const Alert = require("../models/Alert");
const { createHoneyBatch } = require("../../Blockchain/backend/blockchain");

// ─── Create Honey Batch ───────────────────────────────────────────────────────
// POST /api/batches
// Called after ML generates trust score from sensor data
const createBatch = async (req, res) => {
  try {
    const {
      hiveId,           // e.g. "HIVE-102"
      floralSource,
      harvestDate,
      harvestLocation,  // { latitude, longitude, state, district }
      quantity,         // { value, unit }
      trustScore,       // from ML model
      riskLevel,        // from ML model: "low" / "medium" / "high"
    } = req.body;

    // Find hive
    const hive = await Hive.findOne({ hiveId });
    if (!hive) {
      return res.status(404).json({ success: false, error: "Hive not found" });
    }

    // Get latest ML prediction for explanation
    const latestML = await MLPrediction.findOne({ hiveId: hive._id })
      .sort({ timestamp: -1 });

    // Generate batch ID matching schema: HC-2026-001
    const year = new Date().getFullYear();
    const count = await HoneyBatch.countDocuments();
    const batchId = `HC-${year}-${String(count + 1).padStart(3, "0")}`;

    // Data to store on IPFS
    const batchData = {
      batchId,
      hiveId,
      floralSource,
      harvestDate,
      harvestLocation,
      quantity,
      trustScore,
      riskLevel,
      mlExplanation: latestML?.explanation || "N/A",
      mlFactors: latestML?.factors || {},
      beekeeperLocation: hive.location,
      createdAt: new Date().toISOString(),
    };

    // Upload to IPFS + write to blockchain
    const blockchainResult = await createHoneyBatch(batchId, trustScore, batchData);

    // Generate QR code
    const qrIdentifier = `QR-${batchId}`;
    const qrCodeImage = await QRCode.toDataURL(batchId);

    // Save to MongoDB
    const honeyBatch = await HoneyBatch.create({
      batchId,
      hiveId: hive._id,
      beekeeperId: req.user.id,
      floralSource,
      harvestDate,
      harvestLocation,
      quantity,
      status: "created",
      riskLevel,
      trustScore,
      qrCode: qrIdentifier,
      qrCodeImage,
      ipfsCID: blockchainResult.ipfsCID,
      txHash: blockchainResult.txHash,
      blockNumber: blockchainResult.blockNumber,
    });

    // Save blockchain record
    await BlockchainRecord.create({
      batchId: honeyBatch._id,
      transactionType: "batch_created",
      transactionHash: blockchainResult.txHash,
      blockNumber: blockchainResult.blockNumber,
      dataHash: blockchainResult.ipfsCID,
      blockchainNetwork: "Sepolia Testnet",
      status: "confirmed",
    });

    // Create alert if high risk
    if (riskLevel === "high") {
      await Alert.create({
        hiveId: hive._id,
        batchId: honeyBatch._id,
        type: "sensor_anomaly",
        severity: "high",
        title: "High risk batch created",
        message: `Batch ${batchId} created with high risk score: ${trustScore}/100`,
        riskScore: trustScore,
        status: "open",
      });
    }

    res.status(201).json({
      success: true,
      message: "Honey batch created and recorded on blockchain",
      data: {
        batchId,
        trustScore,
        riskLevel,
        status: "created",
        qrCode: qrIdentifier,
        qrCodeImage,
        txHash: blockchainResult.txHash,
        blockNumber: blockchainResult.blockNumber,
        ipfsCID: blockchainResult.ipfsCID,
        etherscan: `https://sepolia.etherscan.io/tx/${blockchainResult.txHash}`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Get My Batches ───────────────────────────────────────────────────────────
// GET /api/batches
const getMyBatches = async (req, res) => {
  try {
    const batches = await HoneyBatch.find({ beekeeperId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: batches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createBatch, getMyBatches };