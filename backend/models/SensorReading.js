const mongoose = require("mongoose");

const sensorReadingSchema = new mongoose.Schema({
  hiveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hive",
    required: true,
  },
  timestamp: { type: Date, required: true, default: Date.now },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  weight: { type: Number, required: true },
  soundActivity: { type: Number },
  batteryLevel: { type: Number },
});

// Index for fast time-series queries
sensorReadingSchema.index({ hiveId: 1, timestamp: -1 });

module.exports = mongoose.model("SensorReading", sensorReadingSchema);