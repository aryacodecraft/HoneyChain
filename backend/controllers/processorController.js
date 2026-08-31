const HoneyBatch = require("../models/HoneyBatch");
const ProcessingRecord = require("../models/ProcessingRecord");
const QualityCertificate = require("../models/QualityCertificate");

// ========================================
// Get Batches Available for Processing
// ========================================

const getProcessingBatches = async (req, res, next) => {
  try {
    const batches = await HoneyBatch.find({
      status: {
        $in: ["created", "processing", "packaged"],
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
// Get Processing History
// ========================================

const getProcessingHistory = async (req, res, next) => {
  try {
    const records = await ProcessingRecord.find({
      processorId: req.user._id,
    })
      .populate(
        "batchId",
        "batchId quantity status riskLevel trustScore"
      )
      .sort({ processingDate: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Add Quality Certificate
// ========================================

const addQualityCertificate = async (req, res, next) => {
  try {
    const {
      certificateId,
      testDate,
      labName,
      moisture,
      purity,
      adulterationStatus,
      result,
      remarks,
      certificateUrl,
    } = req.body;

    if (
      !certificateId ||
      !testDate ||
      !labName ||
      !adulterationStatus
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Certificate ID, test date, lab name and adulteration status are required.",
      });
    }

    const batch = await HoneyBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    // Certificate IDs must be unique
    const existingCertificate =
      await QualityCertificate.findOne({
        certificateId,
      });

    if (existingCertificate) {
      return res.status(409).json({
        success: false,
        message: "Certificate ID already exists.",
      });
    }

    const certificate = await QualityCertificate.create({
      batchId: batch._id,
      certificateId,
      testDate,
      labName,
      moisture,
      purity,
      adulterationStatus,
      result: result || "pending",
      status:
        result === "pass"
          ? "verified"
          : result === "fail"
          ? "rejected"
          : "unverified",
      verifiedBy: req.user._id,
      certificateUrl,
      remarks,
    });

    // Update batch based on quality result
    if (result === "fail" || adulterationStatus === "detected") {
      batch.status = "flagged";
      batch.riskLevel = "high";
      batch.trustScore = Math.min(
        batch.trustScore || 100,
        20
      );

      await batch.save();
    }

    if (
      result === "pass" &&
      adulterationStatus === "not_detected" &&
      batch.status !== "flagged"
    ) {
      batch.riskLevel = "low";
      batch.trustScore = Math.max(
        batch.trustScore || 0,
        90
      );

      await batch.save();
    }

    res.status(201).json({
      success: true,
      message: "Quality certificate added successfully.",
      data: {
        certificate,
        batch,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Get Batch Processing Details
// ========================================

const getBatchProcessingDetails = async (
  req,
  res,
  next
) => {
  try {
    const batch = await HoneyBatch.findById(req.params.id)
      .populate(
        "hiveId",
        "hiveId beeSpecies floralSource location"
      )
      .populate(
        "beekeeperId",
        "name email location"
      );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    const processingRecords =
      await ProcessingRecord.find({
        batchId: batch._id,
      })
        .populate("processorId", "name email")
        .sort({ processingDate: -1 });

    const certificates =
      await QualityCertificate.find({
        batchId: batch._id,
      })
        .populate("verifiedBy", "name email")
        .sort({ testDate: -1 });

    res.status(200).json({
      success: true,
      data: {
        batch,
        processingRecords,
        certificates,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProcessingBatches,
  getProcessingHistory,
  addQualityCertificate,
  getBatchProcessingDetails,
};