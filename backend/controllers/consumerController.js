const HoneyBatch = require("../models/HoneyBatch");
const Hive = require("../models/Hive");
const ProcessingRecord = require("../models/ProcessingRecord");
const LocationLog = require("../models/LocationLog");
const QualityCertificate = require("../models/QualityCertificate");

// ========================================
// Get Honey Passport
// Public - No Login Required
// ========================================

const getHoneyPassport = async (req, res, next) => {
  try {
    const { batchId } = req.params;

    const batch = await HoneyBatch.findOne({
      batchId,
    })
      .populate(
        "hiveId",
        "hiveId beeSpecies floralSource location"
      )
      .populate(
        "beekeeperId",
        "name location"
      )
      .lean();

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Honey batch not found.",
      });
    }

    // Get processing history
    const processingRecords = await ProcessingRecord.find({
      batchId: batch._id,
    })
      .populate("processorId", "name location")
      .sort({ processingDate: 1 })
      .lean();

    // Get supply-chain location history
    const locationLogs = await LocationLog.find({
      batchId: batch._id,
    })
      .populate("updatedBy", "name role")
      .sort({ timestamp: 1 })
      .lean();

    // Get quality certificates
    const qualityCertificates = await QualityCertificate.find({
      batchId: batch._id,
    })
      .populate("verifiedBy", "name role")
      .sort({ testDate: -1 })
      .lean();

    const latestCertificate = qualityCertificates[0] || null;

    // ========================================
    // Verification status
    // ========================================

    const beekeeperVerified = !!batch.beekeeperId;

    const processingVerified =
      processingRecords.length > 0 &&
      processingRecords.every(
        (record) => record.status === "completed"
      );

    const qualityVerified =
      latestCertificate?.result === "pass" &&
      latestCertificate?.status === "verified";

    const distributionVerified =
      locationLogs.length > 0;

    const batchVerified =
      batch.status === "verified" ||
      batch.status === "packaged" ||
      batch.status === "in_transit" ||
      batch.status === "retail";

    // ========================================
    // Consumer-friendly response
    // ========================================

    res.status(200).json({
      success: true,

      data: {
        batch: {
          batchId: batch.batchId,
          status: batch.status,
          riskLevel: batch.riskLevel,
          trustScore: batch.trustScore,
          harvestDate: batch.harvestDate,
          quantity: batch.quantity,
        },

        source: {
          hiveId: batch.hiveId?.hiveId || null,
          beeSpecies: batch.hiveId?.beeSpecies || null,
          floralSource:
            batch.floralSource ||
            batch.hiveId?.floralSource ||
            null,
          location: batch.harvestLocation,
          beekeeper: batch.beekeeperId?.name || null,
        },

        verification: {
          beekeeperVerified,
          processingVerified,
          qualityVerified,
          distributionVerified,
          batchVerified,
        },

        quality: latestCertificate
          ? {
              certificateId: latestCertificate.certificateId,
              labName: latestCertificate.labName,
              testDate: latestCertificate.testDate,
              moisture: latestCertificate.moisture,
              purity: latestCertificate.purity,
              adulterationStatus:
                latestCertificate.adulterationStatus,
              result: latestCertificate.result,
              status: latestCertificate.status,
              remarks: latestCertificate.remarks,
            }
          : null,

        processing: processingRecords,

        journey: locationLogs,

        certificates: qualityCertificates,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHoneyPassport,
};