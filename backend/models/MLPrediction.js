const mongoose = require("mongoose");

const mlPredictionSchema = new mongoose.Schema(
  {
    hiveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hive",
      required: [true, "Hive ID is required"],
      index: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },

    riskScore: {
      type: Number,
      required: [true, "Risk score is required"],
      min: 0,
      max: 100,
    },

    riskLevel: {
      type: String,
      required: [true, "Risk level is required"],
      enum: ["low", "medium", "high"],
    },

    prediction: {
      type: String,
      required: [true, "Prediction is required"],
      enum: ["normal", "potential_anomaly"],
    },

    confidence: {
      type: Number,
      required: [true, "Confidence is required"],
      min: 0,
      max: 100,
    },

    factors: {
      temperature: {
        type: String,
      },

      humidity: {
        type: String,
      },

      weightChange: {
        type: String,
      },
    },

    explanation: {
      type: String,
      trim: true,
    },

    modelVersion: {
      type: String,
      required: true,
      default: "honey-hive-v1",
    },
  },
  {
    timestamps: true,
  }
);

// Get latest predictions for a hive quickly
mlPredictionSchema.index({
  hiveId: 1,
  timestamp: -1,
});

module.exports = mongoose.model("MLPrediction", mlPredictionSchema);