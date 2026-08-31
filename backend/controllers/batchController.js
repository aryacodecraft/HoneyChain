const mongoose = require("mongoose");

const HoneyBatch = require("../models/HoneyBatch");
const Hive = require("../models/Hive");
const ProcessingRecord = require("../models/ProcessingRecord");
const LocationLog = require("../models/LocationLog");
const Alert = require("../models/Alert");

// ======================================================
// CREATE HONEY BATCH
// Beekeeper
// ======================================================

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

    if (!mongoose.Types.ObjectId.isValid(hiveId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hive ID.",
      });
    }

    if (Number(quantity.value) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Honey quantity must be greater than zero.",
      });
    }

    const existingBatch = await HoneyBatch.findOne({ batchId });

    if (existingBatch) {
      return res.status(409).json({
        success: false,
        message: "A batch with this ID already exists.",
      });
    }

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

    const batch = await HoneyBatch.create({
      batchId,
      hiveId: hive._id,
      beekeeperId: req.user._id,
      floralSource: floralSource || hive.floralSource,
      harvestDate,
      harvestLocation,
      quantity: {
        value: Number(quantity.value),
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

// ======================================================
// GET MY BATCHES
// Beekeeper
// ======================================================

const getMyBatches = async (req, res, next) => {
  try {
    const batches = await HoneyBatch.find({
      beekeeperId: req.user._id,
    })
      .populate(
        "hiveId",
        "hiveId beeSpecies floralSource location currentStatus currentMetrics"
      )
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

// ======================================================
// GET SINGLE BATCH
// ======================================================

const getBatch = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid batch ID.",
      });
    }

    const batch = await HoneyBatch.findById(req.params.id)
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

// ======================================================
// PROCESS BATCH
// Processor
// ======================================================

const processBatch = async (req, res, next) => {
  try {
    const { receivedQuantity, processedQuantity } = req.body;

    const {
      processingDate,
      processingUnit,
      packagingDate,
      packageCount,
    } = req.body;

    if (
      receivedQuantity === undefined ||
      processedQuantity === undefined ||
      !processingDate ||
      !processingUnit
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Received quantity, processed quantity, processing date and processing unit are required.",
      });
    }

    if (
      Number(receivedQuantity) < 0 ||
      Number(processedQuantity) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantities cannot be negative.",
      });
    }

    const batch = await HoneyBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    if (
      ["flagged", "retail", "in_transit"].includes(batch.status)
    ) {
      return res.status(400).json({
        success: false,
        message: `Batch cannot be processed in its current status: ${batch.status}.`,
      });
    }

    const harvestedQuantity = Number(batch.quantity.value);
    const received = Number(receivedQuantity);
    const processed = Number(processedQuantity);

    // Prevent impossible quantities
    if (received > harvestedQuantity) {
      return res.status(400).json({
        success: false,
        message:
          "Received quantity cannot be greater than harvested quantity.",
      });
    }

    if (processed > received) {
      return res.status(400).json({
        success: false,
        message:
          "Processed quantity cannot be greater than received quantity.",
      });
    }

    // Quantity mismatch tolerance
    const difference = harvestedQuantity - received;

    // 5% tolerance for prototype
    const tolerance = harvestedQuantity * 0.05;

    const quantityMismatch = difference > tolerance;

    const processingRecord = await ProcessingRecord.create({
      batchId: batch._id,
      processorId: req.user._id,
      receivedQuantity: received,
      processedQuantity: processed,
      processingDate,
      processingUnit,
      packagingDate,
      packageCount,
      status: quantityMismatch ? "flagged" : "completed",
    });

    // Flag batch if mismatch is suspicious
    if (quantityMismatch) {
      batch.status = "flagged";
      batch.riskLevel = "high";
      batch.trustScore = Math.max(
        0,
        (batch.trustScore || 0) - 40
      );

      await batch.save();

      const alert = await Alert.create({
        batchId: batch._id,
        type: "quantity_mismatch",
        severity: "high",
        title: "Honey quantity mismatch detected",
        message:
          `Harvested quantity was ${harvestedQuantity} kg, ` +
          `but only ${received} kg was received by the processor.`,
        riskScore: 85,
      });

      return res.status(201).json({
        success: true,
        message:
          "Processing recorded, but the batch has been flagged due to a quantity mismatch.",
        data: {
          processingRecord,
          batch,
          quantityMismatch: true,
          alert,
        },
      });
    }

    batch.status = packagingDate
      ? "packaged"
      : "processing";

    await batch.save();

    res.status(201).json({
      success: true,
      message: "Batch processing recorded successfully.",
      data: {
        processingRecord,
        batch,
        quantityMismatch: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// APPROVE BATCH
// Processor
// ======================================================

const approveBatch = async (req, res, next) => {
  try {
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
        message:
          "Flagged batches cannot be approved until the issue is resolved.",
      });
    }

    batch.status = "verified";
    batch.riskLevel = "low";
    batch.trustScore = Math.max(
      batch.trustScore || 0,
      90
    );

    await batch.save();

    res.status(200).json({
      success: true,
      message: "Batch approved successfully.",
      data: batch,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// FLAG BATCH
// Processor / Admin
// ======================================================

const flagBatch = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const batch = await HoneyBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    batch.status = "flagged";
    batch.riskLevel = "high";
    batch.trustScore = Math.min(
      batch.trustScore || 100,
      30
    );

    await batch.save();

    const alert = await Alert.create({
      batchId: batch._id,
      type: "suspicious_activity",
      severity: "high",
      title: "Honey batch flagged",
      message:
        reason || "The batch was flagged for further investigation.",
      riskScore: 85,
    });

    res.status(200).json({
      success: true,
      message: "Batch flagged successfully.",
      data: {
        batch,
        alert,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// ADD LOCATION / TRANSPORT EVENT
// Distributor / Processor / Retailer
// ======================================================

const addLocationLog = async (req, res, next) => {
  try {
    const {
      location,
      eventType,
    } = req.body;

    if (!eventType) {
      return res.status(400).json({
        success: false,
        message: "Event type is required.",
      });
    }

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
        message:
          "Flagged batches cannot continue through the supply chain.",
      });
    }

    const locationLog = await LocationLog.create({
      batchId: batch._id,
      updatedBy: req.user._id,
      actorRole: req.user.role,
      location,
      eventType,
    });

    // Update batch status based on movement
    if (eventType === "in_transit") {
      batch.status = "in_transit";
    }

    if (eventType === "arrived") {
      batch.status = "retail";
    }

    await batch.save();

    res.status(201).json({
      success: true,
      message: "Batch location updated successfully.",
      data: {
        locationLog,
        batch,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// MARK DELIVERED
// Retailer
// ======================================================

const markDelivered = async (req, res, next) => {
  try {
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
        message:
          "Flagged batches cannot be marked as delivered.",
      });
    }

    batch.status = "retail";

    await batch.save();

    const locationLog = await LocationLog.create({
      batchId: batch._id,
      updatedBy: req.user._id,
      actorRole: req.user.role,
      eventType: "arrived",
    });

    res.status(200).json({
      success: true,
      message: "Batch marked as delivered successfully.",
      data: {
        batch,
        locationLog,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET BATCH QR
// ======================================================

const getBatchQR = async (req, res, next) => {
  try {
    const batch = await HoneyBatch.findOne({
      batchId: req.params.batchId,
    });

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Honey batch not found.",
      });
    }

    if (!batch.qrCodeImage) {
      const qr = await generateBatchQR(batch.batchId);

      batch.qrCode = qr.qrCode;
      batch.qrCodeImage = qr.qrCodeImage;

      await batch.save();
    }

    res.status(200).json({
      success: true,
      data: {
        batchId: batch.batchId,
        qrCode: batch.qrCode,
        qrCodeImage: batch.qrCodeImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBatch,
  getMyBatches,
  getBatch,
  processBatch,
  approveBatch,
  flagBatch,
  addLocationLog,
  markDelivered,
  getBatchQR,
};
