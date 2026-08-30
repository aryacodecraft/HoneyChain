const Alert = require("../models/Alert");
const HoneyBatch = require("../models/HoneyBatch");
const BlockchainRecord = require("../models/BlockchainRecord");

// ─── Get All Alerts ───────────────────────────────────────────────────────────
// GET /api/admin/alerts
const getAlerts = async (req, res) => {
  try {
    const { status, severity } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;

    const alerts = await Alert.find(filter)
      .populate("hiveId", "hiveId")
      .populate("batchId", "batchId")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Update Alert ─────────────────────────────────────────────────────────────
// PUT /api/admin/alerts/:alertId
const updateAlert = async (req, res) => {
  try {
    const { status, actionTaken, assignedTo } = req.body;

    const alert = await Alert.findByIdAndUpdate(
      req.params.alertId,
      {
        status,
        actionTaken,
        assignedTo,
        resolvedAt: status === "resolved" ? new Date() : null,
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ success: false, error: "Alert not found" });
    }

    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Get Dashboard Stats ──────────────────────────────────────────────────────
// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const [
      totalBatches,
      flaggedBatches,
      openAlerts,
      highSeverityAlerts,
      blockchainRecords,
    ] = await Promise.all([
      HoneyBatch.countDocuments(),
      HoneyBatch.countDocuments({ status: "flagged" }),
      Alert.countDocuments({ status: "open" }),
      Alert.countDocuments({ status: "open", severity: "high" }),
      BlockchainRecord.countDocuments(),
    ]);

    const batchesByStatus = await HoneyBatch.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        totalBatches,
        flaggedBatches,
        openAlerts,
        highSeverityAlerts,
        totalBlockchainRecords: blockchainRecords,
        batchesByStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAlerts, updateAlert, getDashboard };