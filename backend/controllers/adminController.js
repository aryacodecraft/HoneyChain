const User = require("../models/User");
const HoneyBatch = require("../models/HoneyBatch");
const Hive = require("../models/Hive");
const Alert = require("../models/Alert");
const ProcessingRecord = require("../models/ProcessingRecord");
const LocationLog = require("../models/LocationLog");

// ========================================
// Dashboard Statistics
// ========================================

const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalHives,
      totalBatches,
      activeAlerts,
      flaggedBatches,
      processingRecords,
      locationLogs,
    ] = await Promise.all([
      User.countDocuments(),
      Hive.countDocuments(),
      HoneyBatch.countDocuments(),
      Alert.countDocuments({
        status: {
          $in: ["open", "investigating"],
        },
      }),
      HoneyBatch.countDocuments({
        status: "flagged",
      }),
      ProcessingRecord.countDocuments(),
      LocationLog.countDocuments(),
    ]);

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const batchesByStatus = await HoneyBatch.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          hives: totalHives,
          batches: totalBatches,
          activeAlerts,
          flaggedBatches,
          processingRecords,
          locationLogs,
        },

        usersByRole,
        batchesByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Get All Users
// ========================================

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Update User Status
// ========================================

const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["active", "suspended"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be either active or suspended.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Prevent admin from suspending themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own account status.",
      });
    }

    user.status = status;

    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${status === "active" ? "activated" : "suspended"} successfully.`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Get All Batches
// ========================================

const getAllBatches = async (req, res, next) => {
  try {
    const batches = await HoneyBatch.find()
      .populate(
        "beekeeperId",
        "name email location"
      )
      .populate(
        "hiveId",
        "hiveId beeSpecies floralSource location"
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
// Get All Alerts
// ========================================

const getAlerts = async (req, res, next) => {
  try {
    const { status, severity } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (severity) {
      filter.severity = severity;
    }

    const alerts = await Alert.find(filter)
      .populate(
        "hiveId",
        "hiveId currentStatus currentMetrics"
      )
      .populate(
        "batchId",
        "batchId status riskLevel trustScore"
      )
      .populate(
        "assignedTo",
        "name email role"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

// ========================================
// Update Alert
// ========================================

const updateAlert = async (req, res, next) => {
  try {
    const {
      status,
      assignedTo,
      actionTaken,
    } = req.body;

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found.",
      });
    }

    if (
      status &&
      ![
        "open",
        "investigating",
        "resolved",
        "dismissed",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert status.",
      });
    }

    if (
      actionTaken &&
      ![
        "approved",
        "flagged",
        "rejected",
      ].includes(actionTaken)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid action.",
      });
    }

    if (status !== undefined) {
      alert.status = status;
    }

    if (assignedTo !== undefined) {
      alert.assignedTo = assignedTo;
    }

    if (actionTaken !== undefined) {
      alert.actionTaken = actionTaken;
    }

    if (
      status === "resolved" ||
      status === "dismissed"
    ) {
      alert.resolvedAt = new Date();
    }

    await alert.save();

    res.status(200).json({
      success: true,
      message: "Alert updated successfully.",
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getAllBatches,
  getAlerts,
  updateAlert,
};