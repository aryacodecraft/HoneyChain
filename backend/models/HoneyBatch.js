const mongoose = require("mongoose");

// Central traceability entity — matches schema exactly
const honeyBatchSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, unique: true }, // e.g. "HC-2026-001"
    hiveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hive",
      required: true,
    },
    beekeeperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    floralSource: { type: String },
    harvestDate: { type: Date, required: true },
    harvestLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
      state: { type: String, required: true },
      district: { type: String },
    },
    quantity: {
      value: { type: Number, required: true },
      unit: { type: String, default: "kg" },
    },
    status: {
      type: String,
      required: true,
      enum: [
        "created",
        "processing",
        "packaged",
        "in_transit",
        "retail",
        "verified",
        "flagged",
      ],
      default: "created",
    },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    trustScore: { type: Number, min: 0, max: 100 },

    // QR code identifier
    qrCode: { type: String },          // QR identifier e.g. "QR-HC-2026-001"
    qrCodeImage: { type: String },     // base64 QR image for display

    // Blockchain + IPFS references
    ipfsCID: { type: String },
    txHash: { type: String },
    blockNumber: { type: Number },
  },
  { timestamps: true }
);

// Indexes from schema
honeyBatchSchema.index({ batchId: 1 }, { unique: true });
honeyBatchSchema.index({ beekeeperId: 1 });
honeyBatchSchema.index({ status: 1 });

module.exports = mongoose.model("HoneyBatch", honeyBatchSchema);