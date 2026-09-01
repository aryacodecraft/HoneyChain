const express = require("express");
const router = express.Router();

const {
  getRetailBatches,
  getReceivedBatches,
  receiveBatch,
  getRetailBatchDetails,
} = require("../controllers/retailerController");

const { protect, authorize } = require("../middleware/auth");

// Batches arriving at retail
router.get(
  "/batches",
  protect,
  authorize("retailer"),
  getRetailBatches
);

// Retailer's received batches
router.get(
  "/history",
  protect,
  authorize("retailer"),
  getReceivedBatches
);

// Receive a batch
router.post(
  "/batches/:id/receive",
  protect,
  authorize("retailer"),
  receiveBatch
);

// View batch details and journey
router.get(
  "/batches/:id",
  protect,
  authorize("retailer"),
  getRetailBatchDetails
);

module.exports = router;