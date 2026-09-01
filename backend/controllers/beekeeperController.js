const HoneyBatch = require("../models/HoneyBatch");
const Hive = require("../models/Hive");

// ========================================
// Create Honey Batch
// ========================================

const createBatch = async (req, res, next) => {
  try {
    const {
      batchId,
      hiveId,
      floralSource,
      harvestDate,
      harvestLocation,
      quantity,
    } = req.body;

    // Validate required fields
    if (
      !batchId ||
      !hiveId ||
      !harvestDate ||
      !harvestLocation?.state ||
      quantity?.value === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Batch ID, hive ID, harvest date, harvest state and quantity are required.",
      });
    }

    // Check whether batch ID already exists
    const existingBatch = await HoneyBatch.findOne({ batchId });

    if (existingBatch) {
      return res.status(409).json({
        success: false,
        message: "A batch with this ID already exists.",
      });
    }

    // Check that hive belongs to logged-in beekeeper
    const hive = await Hive.findOne({
      _id: hiveId,
      beekeeperId: req.user._id,
    });

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found or does not belong to you.",
      });
    }

    // Validate quantity
    if (quantity.value <= 0) {
      return res.status(400).json({
        success: false,
        message: "Honey quantity must be greater than zero.",
      });
    }

    // Create batch
    const batch = await HoneyBatch.create({
      batchId,
      hiveId: hive._id,
      beekeeperId: req.user._id,
      floralSource: floralSource || hive.floralSource,
      harvestDate,
      harvestLocation,
      quantity: {
        value: quantity.value,
        unit: quantity.unit || "kg",
      },
      status: "created",
      riskLevel: "low",
      trustScore: 0,
    });

    res.status(201).json({
      success: true,
      message: "Honey batch created successfully.",
      data: batch,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Get Beekeeper's Batches
// ========================================

const getMyBatches = async (req, res, next) => {
  try {
    const batches = await HoneyBatch.find({
      beekeeperId: req.user._id,
    })
      .populate("hiveId", "hiveId beeSpecies floralSource location")
      .sort({ createdAt: -1 });

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
// Get Single Batch
// ========================================

const getBatch = async (req, res, next) => {
  try {
    const batch = await HoneyBatch.findOne({
      _id: req.params.id,
      beekeeperId: req.user._id,
    })
      .populate(
        "hiveId",
        "hiveId beeSpecies floralSource location currentStatus currentMetrics"
      )
      .populate(
        "beekeeperId",
        "name email phone location"
      );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBatch,
  getMyBatches,
  getBatch,
};