const HoneyBatch = require("../models/HoneyBatch");
const BlockchainRecord = require("../models/BlockchainRecord");
const ProcessingRecord = require("../models/ProcessingRecord");
const QualityCertificate = require("../models/QualityCertificate");
const LocationLog = require("../models/LocationLog");
const { getBatchInfo } = require("../../Blockchain/backend/blockchain");

// ─── Get Honey Passport ───────────────────────────────────────────────────────
// GET /api/public/batches/:batchId
// Called when consumer scans QR code — NO auth required
const getHoneyPassport = async (req, res) => {
  try {
    const { batchId } = req.params;

    // Get from blockchain + IPFS (source of truth)
    const blockchainData = await getBatchInfo(batchId);

    // Get MongoDB batch record
    const honeyBatch = await HoneyBatch.findOne({ batchId })
      .populate("beekeeperId", "name location")
      .populate("hiveId", "hiveId beeSpecies floralSource");

    if (!honeyBatch) {
      return res.status(404).json({ success: false, error: "Batch not found" });
    }

    // Get processing record
    const processingRecord = await ProcessingRecord.findOne({
      batchId: honeyBatch._id,
    });

    // Get quality certificate
    const qualityCert = await QualityCertificate.findOne({
      batchId: honeyBatch._id,
      status: "verified",
    });

    // Get location history
    const locationHistory = await LocationLog.find({ batchId: honeyBatch._id })
      .sort({ timestamp: 1 });

    // Get all blockchain transaction records
    const blockchainRecords = await BlockchainRecord.find({
      batchId: honeyBatch._id,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      data: {
        // ── Honey Passport UI fields (matches Image 1) ──
        honeyPassport: {
          batch: batchId,
          source: honeyBatch.hiveId?.hiveId || blockchainData.honeyPassport.source,
          beekeeperVerified: true,
          floralSource: honeyBatch.floralSource || blockchainData.honeyPassport.floralSource,
          harvestDate: honeyBatch.harvestDate?.toISOString().split("T")[0] ||
                       blockchainData.honeyPassport.harvestDate,
          qualityTest: honeyBatch.trustScore >= 70 ? "PASS" : "FAIL",
          processingVerified: !!processingRecord,
          distributionVerified: locationHistory.length > 0,
          blockchainVerified: true,
        },

        // ── Batch details ──
        trustScore: honeyBatch.trustScore,
        riskLevel: honeyBatch.riskLevel,
        status: honeyBatch.status,
        quantity: honeyBatch.quantity,
        harvestLocation: honeyBatch.harvestLocation,

        // ── Quality certificate ──
        qualityCertificate: qualityCert || null,

        // ── Processing details ──
        processingDetails: processingRecord || null,

        // ── Location history ──
        locationHistory: locationHistory.map((log) => ({
          eventType: log.eventType,
          actorRole: log.actorRole,
          location: log.location,
          timestamp: log.timestamp,
        })),

        // ── Blockchain transaction history ──
        blockchainHistory: blockchainRecords.map((record) => ({
          type: record.transactionType,
          txHash: record.transactionHash,
          blockNumber: record.blockNumber,
          network: record.blockchainNetwork,
          timestamp: record.timestamp,
          status: record.status,
          etherscan: `https://sepolia.etherscan.io/tx/${record.transactionHash}`,
        })),

        // ── Chain of custody from blockchain ──
        custodyChain: blockchainData.custodyChain,

        // ── Full IPFS data ──
        ipfsData: blockchainData.fullData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getHoneyPassport };