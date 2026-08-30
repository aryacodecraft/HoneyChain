const HoneyBatch = require("../models/HoneyBatch");
const LocationLog = require("../models/LocationLog");
const BlockchainRecord = require("../models/BlockchainRecord");
const { markDelivered } = require("../../Blockchain/backend/blockchain");

// ─── Mark Delivered ───────────────────────────────────────────────────────────
// POST /api/batches/:batchId/deliver
const markDeliveredController = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { location } = req.body;

    const honeyBatch = await HoneyBatch.findOne({ batchId });
    if (!honeyBatch) {
      return res.status(404).json({ success: false, error: "Batch not found" });
    }

    const blockchainResult = await markDelivered(batchId);

    // Log final arrival location
    await LocationLog.create({
      batchId: honeyBatch._id,
      updatedBy: req.user.id,
      actorRole: "retailer",
      location,
      eventType: "arrived",
      txHash: blockchainResult.txHash,
      timestamp: new Date(),
    });

    honeyBatch.status = "retail";
    await honeyBatch.save();

    await BlockchainRecord.create({
      batchId: honeyBatch._id,
      transactionType: "batch_delivered",
      transactionHash: blockchainResult.txHash,
      blockNumber: blockchainResult.blockNumber,
      dataHash: honeyBatch.ipfsCID,
      blockchainNetwork: "Sepolia Testnet",
      status: "confirmed",
    });

    res.json({
      success: true,
      message: "Batch marked as delivered on blockchain",
      data: {
        batchId,
        status: "retail",
        txHash: blockchainResult.txHash,
        blockNumber: blockchainResult.blockNumber,
        etherscan: `https://sepolia.etherscan.io/tx/${blockchainResult.txHash}`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Get Batch QR ─────────────────────────────────────────────────────────────
// GET /api/batches/:batchId/qr
const getBatchQR = async (req, res) => {
  try {
    const honeyBatch = await HoneyBatch.findOne({ batchId: req.params.batchId });
    if (!honeyBatch) {
      return res.status(404).json({ success: false, error: "Batch not found" });
    }
    res.json({
      success: true,
      data: { batchId: honeyBatch.batchId, qrCode: honeyBatch.qrCodeImage },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { markDeliveredController, getBatchQR };