const Hive = require("../models/Hive");
const SensorReading = require("../models/SensorReading");
const MLPrediction = require("../models/MLPrediction");
const Alert = require("../models/Alert");

// =========================
// Create Hive
// =========================

const createHive = async (req, res, next) => {
  try {
    const {
      hiveId,
      beeSpecies,
      floralSource,
      location,
      installationDate,
    } = req.body;

    if (!hiveId || !location?.state) {
      return res.status(400).json({
        success: false,
        message: "Hive ID and state are required.",
      });
    }

    const existingHive = await Hive.findOne({ hiveId });

    if (existingHive) {
      return res.status(409).json({
        success: false,
        message: "A hive with this ID already exists.",
      });
    }

    const hive = await Hive.create({
      hiveId,
      beekeeperId: req.user._id,
      beeSpecies,
      floralSource,
      location,
      installationDate,
    });

    res.status(201).json({
      success: true,
      message: "Hive created successfully.",
      data: hive,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// Get My Hives
// =========================

const getMyHives = async (req, res, next) => {
  try {
    const hives = await Hive.find({
      beekeeperId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hives.length,
      data: hives,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// Get Single Hive
// =========================

const getHive = async (req, res, next) => {
  try {
    const hive = await Hive.findOne({
      hiveId: req.params.hiveId,
      beekeeperId: req.user._id,
    });

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: hive,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// Update Hive
// =========================

const updateHive = async (req, res, next) => {
  try {
    const allowedFields = [
      "beeSpecies",
      "floralSource",
      "location",
      "installationDate",
      "currentStatus",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const hive = await Hive.findOneAndUpdate(
      {
        hiveId: req.params.hiveId,
        beekeeperId: req.user._id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hive updated successfully.",
      data: hive,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// Add Sensor Reading
// =========================

const addSensorReading = async (req, res, next) => {
  try {
    const { temperature, humidity, weight, batteryLevel, timestamp } =
      req.body;

    // Validate required sensor values
    if (
      temperature === undefined ||
      humidity === undefined ||
      weight === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Temperature, humidity and weight are required.",
      });
    }

    // Find hive
    const hive = await Hive.findOne({
      hiveId: req.params.hiveId,
      beekeeperId: req.user._id,
    });

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found.",
      });
    }

    // Save sensor reading
    const reading = await SensorReading.create({
      hiveId: hive._id,
      temperature,
      humidity,
      weight,
      batteryLevel,
      timestamp,
    });

    // Update current hive metrics
    hive.currentMetrics = {
      temperature,
      humidity,
      weight,
      batteryLevel,
    };

    // Basic anomaly detection
    const anomalies = [];

    if (temperature < 10 || temperature > 40) {
      anomalies.push("Temperature is outside the normal range.");
    }

    if (humidity < 30 || humidity > 90) {
      anomalies.push("Humidity is outside the normal range.");
    }

    if (batteryLevel !== undefined && batteryLevel < 20) {
      anomalies.push("Hive sensor battery is low.");
    }

    // Determine hive status
    if (anomalies.length >= 2) {
      hive.currentStatus = "critical";
    } else if (anomalies.length === 1) {
      hive.currentStatus = "warning";
    } else {
      hive.currentStatus = "healthy";
    }

    await hive.save();

    // Create alert if anomaly detected
    let alert = null;

    if (anomalies.length > 0) {
      const severity = anomalies.length >= 2 ? "high" : "medium";

      alert = await Alert.create({
        hiveId: hive._id,
        type: "sensor_anomaly",
        severity,
        title: "Hive sensor anomaly detected",
        message: anomalies.join(" "),
        riskScore: anomalies.length >= 2 ? 80 : 55,
      });
    }

    res.status(201).json({
      success: true,
      message: "Sensor reading recorded successfully.",
      data: {
        reading,
        hiveStatus: hive.currentStatus,
        anomalyDetected: anomalies.length > 0,
        anomalies,
        alert,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// Get Sensor History
// =========================

const getSensorReadings = async (req, res, next) => {
  try {
    const hive = await Hive.findOne({
      hiveId: req.params.hiveId,
      beekeeperId: req.user._id,
    });

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found.",
      });
    }

    const limit = Math.min(
      parseInt(req.query.limit, 10) || 50,
      200
    );

    const readings = await SensorReading.find({
      hiveId: hive._id,
    })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: readings.length,
      data: readings,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// Get Latest Prediction
// =========================

const getLatestPrediction = async (req, res, next) => {
  try {
    const hive = await Hive.findOne({
      hiveId: req.params.hiveId,
      beekeeperId: req.user._id,
    });

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found.",
      });
    }

    const prediction = await MLPrediction.findOne({
      hiveId: hive._id,
    }).sort({ timestamp: -1 });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "No prediction available for this hive.",
      });
    }

    res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// Save ML Prediction
// =========================

const savePrediction = async (req, res, next) => {
  try {
    const hive = await Hive.findOne({
      hiveId: req.params.hiveId,
      beekeeperId: req.user._id,
    });

    if (!hive) {
      return res.status(404).json({
        success: false,
        message: "Hive not found.",
      });
    }

    const {
      riskScore,
      riskLevel,
      prediction,
      confidence,
      factors,
      explanation,
      modelVersion,
    } = req.body;

    if (
      riskScore === undefined ||
      !riskLevel ||
      !prediction ||
      confidence === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Risk score, risk level, prediction and confidence are required.",
      });
    }

    const mlPrediction = await MLPrediction.create({
      hiveId: hive._id,
      riskScore,
      riskLevel,
      prediction,
      confidence,
      factors,
      explanation,
      modelVersion,
    });

    // Create alert for high-risk prediction
    if (riskLevel === "high" || prediction === "potential_anomaly") {
      await Alert.create({
        hiveId: hive._id,
        type: "sensor_anomaly",
        severity: riskLevel === "high" ? "high" : "medium",
        title: "Potential hive anomaly detected",
        message:
          explanation ||
          "The monitoring system detected a potential anomaly.",
        riskScore,
      });
    }

    res.status(201).json({
      success: true,
      message: "ML prediction saved successfully.",
      data: mlPrediction,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHive,
  getMyHives,
  getHive,
  updateHive,
  addSensorReading,
  getSensorReadings,
  getLatestPrediction,
  savePrediction,
};