const express = require("express");
const router = express.Router();

const {
  getDistributionBatches,
  getTransportHistory,
  pickupBatch,
  updateLocation,
  reportLocationAnomaly,
} = require("../controllers/distributorController");

const { protect, authorize } = require("../middleware/auth");

// ========================================
// DISTRIBUTOR ROUTES
// ========================================

// Batches available for distribution
router.get(
  "/batches",
  protect,
  authorize("distributor"),
  getDistributionBatches
);

// Distributor's transport history
router.get(
  "/history",
  protect,
  authorize("distributor"),
  getTransportHistory
);

// Pick up a batch
router.post(
  "/batches/:id/pickup",
  protect,
  authorize("distributor"),
  pickupBatch
);

// Update current transport location
router.post(
  "/batches/:id/location",
  protect,
  authorize("distributor"),
  updateLocation
);

// Report suspicious location activity
router.post(
  "/batches/:id/location-anomaly",
  protect,
  authorize("distributor"),
  reportLocationAnomaly
);

module.exports = router;