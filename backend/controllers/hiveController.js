const Hive = require("../models/Hive");
const SensorReading = require("../models/SensorReading");
const MLPrediction = require("../models/MLPrediction");

// ─── Register Hive ───────────────────────────────────────────────────────────
// POST /api/hives
const registerHive = async (req, res) => {
  try {
    const { hiveId, beeSpecies, floralSource, location, installationDate } = req.body;

    const existing = await Hive.findOne({ hiveId });
    if (existing) {
      return res.status(400).json({ success: false, error: "Hive ID already exists" });
    }

    const hive = await Hive.create({
      hiveId,
      beekeeperId: req.user.id, // from JWT token
      beeSpecies,
      floralSource,
      location,
      installationDate,
    });

    res.status(201).json({
      success: true,
      message: "Hive registered successfully",
      data: hive,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Get My Hives ─────────────────────────────────────────────────────────────
// GET /api/hives
const getMyHives = async (req, res) => {
  try {
    const hives = await Hive.find({ beekeeperId: req.user.id });
    res.json({ success: true, data: hives });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Add Sensor Reading ───────────────────────────────────────────────────────
// POST /api/hives/:hiveId/sensors
const addSensorReading = async (req, res) => {
  try {
    const hive = await Hive.findOne({ hiveId: req.params.hiveId });
    if (!hive) {
      return res.status(404).json({ success: false, error: "Hive not found" });
    }

    const { temperature, humidity, weight, soundActivity, batteryLevel } = req.body;

    const reading = await SensorReading.create({
      hiveId: hive._id,
      temperature,
      humidity,
      weight,
      soundActivity,
      batteryLevel,
      timestamp: new Date(),
    });

    // Update hive current metrics
    hive.currentMetrics = { temperature, humidity, weight };
    await hive.save();

    res.status(201).json({ success: true, data: reading });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Get Sensor Readings ──────────────────────────────────────────────────────
// GET /api/hives/:hiveId/sensors
const getSensorReadings = async (req, res) => {
  try {
    const hive = await Hive.findOne({ hiveId: req.params.hiveId });
    if (!hive) {
      return res.status(404).json({ success: false, error: "Hive not found" });
    }

    const readings = await SensorReading.find({ hiveId: hive._id })
      .sort({ timestamp: -1 })
      .limit(50); // last 50 readings

    res.json({ success: true, data: readings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Get Latest ML Prediction ─────────────────────────────────────────────────
// GET /api/hives/:hiveId/predictions/latest
const getLatestPrediction = async (req, res) => {
  try {
    const hive = await Hive.findOne({ hiveId: req.params.hiveId });
    if (!hive) {
      return res.status(404).json({ success: false, error: "Hive not found" });
    }

    const prediction = await MLPrediction.findOne({ hiveId: hive._id })
      .sort({ timestamp: -1 });

    res.json({ success: true, data: prediction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Save ML Prediction ───────────────────────────────────────────────────────
// POST /api/hives/:hiveId/predictions
// Called by ML model after analyzing sensor data
const savePrediction = async (req, res) => {
  try {
    const hive = await Hive.findOne({ hiveId: req.params.hiveId });
    if (!hive) {
      return res.status(404).json({ success: false, error: "Hive not found" });
    }

    const {
      riskScore, riskLevel, prediction,
      confidence, factors, explanation, modelVersion,
    } = req.body;

    const mlPrediction = await MLPrediction.create({
      hiveId: hive._id,
      riskScore,
      riskLevel,
      prediction,
      confidence,
      factors,
      explanation,
      modelVersion,
      timestamp: new Date(),
    });

    // Update hive status based on risk
    hive.currentStatus =
      riskLevel === "high" ? "critical" :
      riskLevel === "medium" ? "warning" : "healthy";
    await hive.save();

    res.status(201).json({ success: true, data: mlPrediction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  registerHive,
  getMyHives,
  addSensorReading,
  getSensorReadings,
  getLatestPrediction,
  savePrediction,
};