const HoneyBatch = require("../models/HoneyBatch");
const ProcessingRecord = require("../models/ProcessingRecord");
const BlockchainRecord = require("../models/BlockchainRecord");
const Alert = require("../models/Alert");
const {
  processBatch,
  approveBatch,
  flagBatch,
} = require("../../Blockchain/backend/blockchain");

// ─── Process Batch ────────────────────────────────────────────────────────────
// POST /api/batches/:batchId/process
const processBatchController = async (req, res) => {
  try {
    const { batchId } = req.params;
    const {
      receivedQuantity,
      processedQuantity,
      processingDate,
      processingUnit,
      packagingDate,
      packageCount,
    } = req.body;

    const honeyBatch = await HoneyBatch.findOne({ batchId });
    if (!honeyBatch) {
      return res.status(404).json({ success: false, error: "Batch not found" });
    }

    const processingData = {
      batchId,
      processorId: req.user.id,
      receivedQuantity,
      processedQuantity,
      processingDate,
      processingUnit,
      packagingDate,
      packageCount,
      timestamp: new Date().toISOString(),
    };

    // Call blockchain
    const blockchainResult = await processBatch(batchId, processingData);

    // Save processing record to MongoDB
    const processingRecord = await ProcessingRecord.create({
      batchId: honeyBatch._id,
      processorId: req.user.id,
      receivedQuantity,
      processedQuantity,
      processingDate,
      processingUnit,
      packagingDate,
      packageCount,
      status: "completed",
      txHash: blockchainResult.txHash,
      blockNumber: blockchainResult.blockNumber,
      ipfsCID: blockchainResult.ipfsCID,
    });

    // Check for quantity mismatch — flag if >10% difference
    const originalQty = honeyBatch.quantity.value;
    const difference = Math.abs(originalQty - receivedQuantity) / originalQty;
    let quantityMismatch = false;

    if (difference > 0.1) {
      quantityMismatch = true;
      await Alert.create({
        batchId: honeyBatch._id,
        type: "quantity_mismatch",
        severity: difference > 0.2 ? "high" : "medium",
        title: "Quantity mismatch detected",
        message: `Expected ${originalQty} kg but processor reported ${receivedQuantity} kg.`,
        riskScore: Math.round(difference * 100),
        status: "open",
      });
    }

    // Update batch status
    honeyBatch.status = "processing";
    await honeyBatch.save();

    // Save blockchain record
    await BlockchainRecord.create({
      batchId: honeyBatch._id,
      transactionType: "processing_updated",
      transactionHash: blockchainResult.txHash,
      blockNumber: blockchainResult.blockNumber,
      dataHash: blockchainResult.ipfsCID,
      blockchainNetwork: "Sepolia Testnet",
      status: "confirmed",
    });

    res.json({
      success: true,
      message: "Batch processing recorded on blockchain",
      data: {
        batchId,
        status: "processing",
        quantityMismatch,
        txHash: blockchainResult.txHash,
        blockNumber: blockchainResult.blockNumber,
        etherscan: `https://sepolia.etherscan.io/tx/${blockchainResult.txHash}`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Approve Batch ────────────────────────────────────────────────────────────
// POST /api/batches/:batchId/approve
const approveBatchController = async (req, res) => {
  try {
    const { batchId } = req.params;

    const honeyBatch = await HoneyBatch.findOne({ batchId });
    if (!honeyBatch) {
      return res.status(404).json({ success: false, error: "Batch not found" });
    }

    const blockchainResult = await approveBatch(batchId);

    honeyBatch.status = "packaged";
    await honeyBatch.save();

    await BlockchainRecord.create({
      batchId: honeyBatch._id,
      transactionType: "batch_approved",
      transactionHash: blockchainResult.txHash,
      blockNumber: blockchainResult.blockNumber,
      dataHash: honeyBatch.ipfsCID,
      blockchainNetwork: "Sepolia Testnet",
      status: "confirmed",
    });

    res.json({
      success: true,
      message: "Batch approved on blockchain",
      data: {
        batchId,
        status: "packaged",
        txHash: blockchainResult.txHash,
        blockNumber: blockchainResult.blockNumber,
        etherscan: `https://sepolia.etherscan.io/tx/${blockchainResult.txHash}`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Flag Batch ───────────────────────────────────────────────────────────────
// POST /api/batches/:batchId/flag
const flagBatchController = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { reason } = req.body;

    const honeyBatch = await HoneyBatch.findOne({ batchId });
    if (!honeyBatch) {
      return res.status(404).json({ success: false, error: "Batch not found" });
    }

    const blockchainResult = await flagBatch(batchId, reason);

    honeyBatch.status = "flagged";
    await honeyBatch.save();

    await BlockchainRecord.create({
      batchId: honeyBatch._id,
      transactionType: "batch_flagged",
      transactionHash: blockchainResult.txHash,
      blockNumber: blockchainResult.blockNumber,
      dataHash: honeyBatch.ipfsCID,
      blockchainNetwork: "Sepolia Testnet",
      status: "confirmed",
    });

    await Alert.create({
      batchId: honeyBatch._id,
      type: "suspicious_activity",
      severity: "high",
      title: "Batch flagged for adulteration",
      message: reason,
      status: "open",
    });

    res.json({
      success: true,
      message: "Batch flagged on blockchain",
      data: {
        batchId,
        status: "flagged",
        reason,
        txHash: blockchainResult.txHash,
        blockNumber: blockchainResult.blockNumber,
        etherscan: `https://sepolia.etherscan.io/tx/${blockchainResult.txHash}`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  processBatchController,
  approveBatchController,
  flagBatchController,
};