const mongoose = require("mongoose");

const hiveSchema = new mongoose.Schema(
  {
    hiveId: { type: String, required: true, unique: true }, // e.g. "HIVE-102"
    beekeeperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    beeSpecies: { type: String },
    floralSource: { type: String },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      state: { type: String, required: true },
      district: { type: String },
    },
    installationDate: { type: Date },
    currentStatus: {
      type: String,
      enum: ["healthy", "warning", "critical", "inactive"],
      default: "healthy",
    },
    currentMetrics: {
      temperature: { type: Number },
      humidity: { type: Number },
      weight: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hive", hiveSchema);