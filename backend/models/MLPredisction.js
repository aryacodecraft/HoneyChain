const mongoose = require("mongoose");

const mlPredictionSchema = new mongoose.Schema(
  {
    hiveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hive",
      required: true,
    },
    timestamp: { type: Date, required: true, default: Date.now },
    riskScore: { type: Number, required: true, min: 0, max: 100 },
    riskLevel: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    prediction: {
      type: String,
      required: true,
      enum: ["normal", "potential_anomaly"],
    },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    factors: {
      temperature: { type: String },
      humidity: { type: String },
      weightChange: { type: String },
      soundActivity: { type: String },
    },
    explanation: { type: String },
    modelVersion: { type: String, required: true, default: "honey-hive-v1" },
  },
  { timestamps: true }
);

// Index for latest ML results per hive
mlPredictionSchema.index({ hiveId: 1, timestamp: -1 });

module.exports = mongoose.model("MLPrediction", mlPredictionSchema);