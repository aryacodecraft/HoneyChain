const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    hiveId: { type: mongoose.Schema.Types.ObjectId, ref: "Hive" },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: "HoneyBatch" },
    type: {
      type: String,
      required: true,
      enum: [
        "sensor_anomaly",
        "quantity_mismatch",
        "location_anomaly",
        "suspicious_activity",
      ],
    },
    severity: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    riskScore: { type: Number, min: 0, max: 100 },
    status: {
      type: String,
      enum: ["open", "investigating", "resolved", "dismissed"],
      default: "open",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    actionTaken: {
      type: String,
      enum: ["approved", "flagged", "rejected", null],
      default: null,
    },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

alertSchema.index({ status: 1, severity: 1 });

module.exports = mongoose.model("Alert", alertSchema);