const express = require("express");
const router = express.Router();

const {
  registerHive,
  getMyHives,
  addSensorReading,
  getSensorReadings,
  getLatestPrediction,
  savePrediction,
} = require("../controllers/hiveController");

const { protect, authorize } = require("../middleware/auth");

router.post(
  "/",
  protect,
  authorize("beekeeper"),
  registerHive
);

router.get(
  "/",
  protect,
  authorize("beekeeper"),
  getMyHives
);

router.post(
  "/:hiveId/sensors",
  protect,
  authorize("beekeeper"),
  addSensorReading
);

router.get(
  "/:hiveId/sensors",
  protect,
  authorize("beekeeper"),
  getSensorReadings
);

router.get(
  "/:hiveId/predictions/latest",
  protect,
  authorize("beekeeper"),
  getLatestPrediction
);

router.post(
  "/:hiveId/predictions",
  protect,
  authorize("beekeeper"),
  savePrediction
);

module.exports = router;