const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { createBatch, getMyBatches } = require("../controllers/beekeeperController");
const { processBatchController, approveBatchController, flagBatchController } = require("../controllers/processorController");
const { logTransportController } = require("../controllers/distributorController");
const { markDeliveredController, getBatchQR } = require("../controllers/retailerController");

// Beekeeper
router.post("/", protect, authorize("beekeeper"), createBatch);
router.get("/", protect, authorize("beekeeper"), getMyBatches);

// Processor
router.post("/:batchId/process", protect, authorize("processor"), processBatchController);
router.post("/:batchId/approve", protect, authorize("processor", "admin"), approveBatchController);
router.post("/:batchId/flag", protect, authorize("processor", "admin"), flagBatchController);

// Distributor
router.post("/:batchId/location", protect, authorize("distributor"), logTransportController);

// Retailer
router.post("/:batchId/deliver", protect, authorize("retailer"), markDeliveredController);
router.get("/:batchId/qr", protect, getBatchQR);

module.exports = router;