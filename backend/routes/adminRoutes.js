const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getAllBatches,
  getAlerts,
  updateAlert,
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/auth");

// ========================================
// ADMIN DASHBOARD
// ========================================

// Dashboard statistics
router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboardStats
);

// ========================================
// USER MANAGEMENT
// ========================================

// Get all users
router.get(
  "/users",
  protect,
  authorize("admin"),
  getUsers
);

// Activate / suspend user
router.patch(
  "/users/:id/status",
  protect,
  authorize("admin"),
  updateUserStatus
);

// ========================================
// BATCH MANAGEMENT
// ========================================

// View all batches
router.get(
  "/batches",
  protect,
  authorize("admin"),
  getAllBatches
);

// ========================================
// ALERT MANAGEMENT
// ========================================

// View alerts
router.get(
  "/alerts",
  protect,
  authorize("admin"),
  getAlerts
);

// Update alert
router.patch(
  "/alerts/:id",
  protect,
  authorize("admin"),
  updateAlert
);

module.exports = router;