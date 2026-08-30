const HoneyBatch = require("../models/HoneyBatch");
const LocationLog = require("../models/LocationLog");
const BlockchainRecord = require("../models/BlockchainRecord");
const { logTransport } = require("../../Blockchain/backend/blockchain");

// ─── Log Transport ────────────────────────────────────────────────────────────
// POST /api/batches/:batchId/location
const logTransportController = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { location, eventType, vehicle, route } = req.body;
    // location: { latitude, longitude, city, state }
    // eventType: "picked_up" / "in_transit" / "arrived"

    const honeyBatch = await HoneyBatch.findOne({ batchId });
    if (!honeyBatch) {
      return res.status(404).json({ success: false, error: "Batch not found" });
    }

    const transportData = {
      batchId,
      distributorId: req.user.id,
      location,
      eventType,
      vehicle,
      route,
      timestamp: new Date().toISOString(),
    };

    // Call blockchain
    const blockchainResult = await logTransport(batchId, transportData);

    // Save location log to MongoDB
    const locationLog = await LocationLog.create({
      batchId: honeyBatch._id,
      updatedBy: req.user.id,
      actorRole: "distributor",
      location,
      eventType,
      locationCID: blockchainResult.locationCID,
      txHash: blockchainResult.txHash,
      timestamp: new Date(),
    });

    // Update batch status
    honeyBatch.status = "in_transit";
    await honeyBatch.save();

    // Save blockchain record
    await BlockchainRecord.create({
      batchId: honeyBatch._id,
      transactionType: "location_updated",
      transactionHash: blockchainResult.txHash,
      blockNumber: blockchainResult.blockNumber,
      dataHash: blockchainResult.locationCID,
      blockchainNetwork: "Sepolia Testnet",
      status: "confirmed",
    });

    res.json({
      success: true,
      message: "Transport logged on blockchain",
      data: {
        batchId,
        status: "in_transit",
        eventType,
        txHash: blockchainResult.txHash,
        blockNumber: blockchainResult.blockNumber,
        locationCID: blockchainResult.locationCID,
        etherscan: `https://sepolia.etherscan.io/tx/${blockchainResult.txHash}`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { logTransportController };