const express = require("express");
const router = express.Router();

const {
  getProcessingBatches,
  getProcessingHistory,
  addQualityCertificate,
  getBatchProcessingDetails,
} = require("../controllers/processorController");

const { protect, authorize } = require("../middleware/auth");

// ========================================
// PROCESSOR ROUTES
// ========================================

// Batches waiting to be processed
router.get(
  "/batches",
  protect,
  authorize("processor"),
  getProcessingBatches
);

// Processor's processing history
router.get(
  "/history",
  protect,
  authorize("processor"),
  getProcessingHistory
);

// Get complete processing details for a batch
router.get(
  "/batches/:id",
  protect,
  authorize("processor"),
  getBatchProcessingDetails
);

// Add quality certificate to a batch
router.post(
  "/batches/:id/quality",
  protect,
  authorize("processor"),
  addQualityCertificate
);

module.exports = router;