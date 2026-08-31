const HoneyBatch = require("../models/HoneyBatch");
const LocationLog = require("../models/LocationLog");

// ========================================
// Get Batches Arriving at Retail
// ========================================

const getRetailBatches = async (req, res, next) => {
  try {
    const batches = await HoneyBatch.find({
      status: {
        $in: ["in_transit", "retail"],
      },
    })
      .populate(
        "hiveId",
        "hiveId beeSpecies floralSource location"
      )
      .populate(
        "beekeeperId",
        "name location"
      )
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: batches.length,
      data: batches,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Get Retailer's Received Batches
// ========================================

const getReceivedBatches = async (req, res, next) => {
  try {
    const logs = await LocationLog.find({
      updatedBy: req.user._id,
      eventType: "arrived",
    })
      .populate(
        "batchId",
        "batchId quantity status riskLevel trustScore"
      )
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Receive Batch
// ========================================

const receiveBatch = async (req, res, next) => {
  try {
    const { location } = req.body;

    const batch = await HoneyBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    if (batch.status === "flagged") {
      return res.status(400).json({
        success: false,
        message: "Flagged batches cannot be received.",
      });
    }

    if (batch.status !== "in_transit") {
      return res.status(400).json({
        success: false,
        message:
          "Only batches currently in transit can be received.",
      });
    }

    const locationLog = await LocationLog.create({
      batchId: batch._id,
      updatedBy: req.user._id,
      actorRole: "retailer",
      location,
      eventType: "arrived",
    });

    batch.status = "retail";

    await batch.save();

    res.status(200).json({
      success: true,
      message: "Batch received successfully.",
      data: {
        batch,
        locationLog,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Get Retail Batch Details
// ========================================

const getRetailBatchDetails = async (req, res, next) => {
  try {
    const batch = await HoneyBatch.findById(req.params.id)
      .populate(
        "hiveId",
        "hiveId beeSpecies floralSource location"
      )
      .populate(
        "beekeeperId",
        "name location"
      );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    const journey = await LocationLog.find({
      batchId: batch._id,
    })
      .populate("updatedBy", "name role")
      .sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      data: {
        batch,
        journey,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRetailBatches,
  getReceivedBatches,
  receiveBatch,
  getRetailBatchDetails,
};