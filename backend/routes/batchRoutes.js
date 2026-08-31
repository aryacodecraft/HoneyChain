const express = require("express");
const router = express.Router();

const {
  createBatch,
  getMyBatches,
  getBatch,
  processBatch,
  approveBatch,
  flagBatch,
  addLocationLog,
  markDelivered,
  getBatchQR
} = require("../controllers/batchController");

const { protect, authorize } = require("../middleware/auth");

// ======================================================
// BEEKEEPER
// ======================================================

// Create honey batch
router.post(
  "/",
  protect,
  authorize("beekeeper"),
  createBatch
);

// Get beekeeper's batches
router.get(
  "/",
  protect,
  authorize("beekeeper"),
  getMyBatches
);


// Get batch QR code
router.get(
  "/:batchId/qr",
  protect,
  getBatchQR
);

// Get a single batch
router.get(
  "/:id",
  protect,
  getBatch
);

// ======================================================
// PROCESSOR
// ======================================================

// Process and package batch
router.post(
  "/:id/process",
  protect,
  authorize("processor"),
  processBatch
);

// Approve batch
router.post(
  "/:id/approve",
  protect,
  authorize("processor"),
  approveBatch
);

// Flag batch
router.post(
  "/:id/flag",
  protect,
  authorize("processor", "admin"),
  flagBatch
);

// ======================================================
// DISTRIBUTOR / PROCESSOR / RETAILER
// ======================================================

// Add supply-chain location event
router.post(
  "/:id/location",
  protect,
  authorize("distributor", "processor", "retailer"),
  addLocationLog
);

// ======================================================
// RETAILER
// ======================================================

// Mark batch as delivered
router.post(
  "/:id/deliver",
  protect,
  authorize("retailer"),
  markDelivered
);

module.exports = router;