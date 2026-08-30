const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  registerHive, getMyHives,
  addSensorReading, getSensorReadings,
  getLatestPrediction, savePrediction,
} = require("../controllers/hiveController");

router.post("/", protect, authorize("beekeeper"), registerHive);
router.get("/", protect, authorize("beekeeper"), getMyHives);
router.post("/:hiveId/sensors", protect, addSensorReading);
router.get("/:hiveId/sensors", protect, getSensorReadings);
router.get("/:hiveId/predictions/latest", protect, getLatestPrediction);
router.post("/:hiveId/predictions", protect, savePrediction);

module.exports = router;