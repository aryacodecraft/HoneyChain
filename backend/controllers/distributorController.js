const HoneyBatch = require("../models/HoneyBatch");
const LocationLog = require("../models/LocationLog");
const Alert = require("../models/Alert");

// ========================================
// Get Batches Ready for Distribution
// ========================================

const getDistributionBatches = async (req, res, next) => {
  try {
    const batches = await HoneyBatch.find({
      status: {
        $in: ["verified", "packaged", "in_transit"],
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
// Get Distributor's Transport History
// ========================================

const getTransportHistory = async (req, res, next) => {
  try {
    const logs = await LocationLog.find({
      updatedBy: req.user._id,
    })
      .populate(
        "batchId",
        "batchId status quantity riskLevel trustScore"
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
// Log Pickup
// ========================================

const pickupBatch = async (req, res, next) => {
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
        message: "Flagged batches cannot be transported.",
      });
    }

    if (
      !["verified", "packaged"].includes(batch.status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only verified or packaged batches can be picked up.",
      });
    }

    const locationLog = await LocationLog.create({
      batchId: batch._id,
      updatedBy: req.user._id,
      actorRole: "distributor",
      location,
      eventType: "picked_up",
    });

    batch.status = "in_transit";

    await batch.save();

    res.status(201).json({
      success: true,
      message: "Batch picked up successfully.",
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
// Update Transport Location
// ========================================

const updateLocation = async (req, res, next) => {
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
        message: "Flagged batches cannot continue in transit.",
      });
    }

    if (batch.status !== "in_transit") {
      return res.status(400).json({
        success: false,
        message:
          "Batch must be in transit before its location can be updated.",
      });
    }

    const locationLog = await LocationLog.create({
      batchId: batch._id,
      updatedBy: req.user._id,
      actorRole: "distributor",
      location,
      eventType: "in_transit",
    });

    res.status(201).json({
      success: true,
      message: "Transport location updated successfully.",
      data: locationLog,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Report Location Anomaly
// ========================================

const reportLocationAnomaly = async (req, res, next) => {
  try {
    const { message, location } = req.body;

    const batch = await HoneyBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    const alert = await Alert.create({
      batchId: batch._id,
      type: "location_anomaly",
      severity: "high",
      title: "Location anomaly reported",
      message:
        message ||
        "A suspicious location event was reported during transportation.",
      riskScore: 80,
    });

    batch.riskLevel = "high";

    await batch.save();

    res.status(201).json({
      success: true,
      message: "Location anomaly reported.",
      data: {
        alert,
        location,
        batch,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDistributionBatches,
  getTransportHistory,
  pickupBatch,
  updateLocation,
  reportLocationAnomaly,
};