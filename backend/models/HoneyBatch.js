const mongoose = require("mongoose");
const honeyBatchSchema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: [true, "Batch ID is required"],
      unique: true,
      trim: true,
    },

    hiveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hive",
      required: [true, "Hive ID is required"],
    },

    beekeeperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Beekeeper ID is required"],
    },

    floralSource: {
      type: String,
      trim: true,
    },

    harvestDate: {
      type: Date,
      required: [true, "Harvest date is required"],
    },

    harvestLocation: {
      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },

      state: {
        type: String,
        required: [true, "Harvest state is required"],
        trim: true,
      },

      district: {
        type: String,
        trim: true,
      },
    },

    quantity: {
      value: {
        type: Number,
        required: [true, "Honey quantity is required"],
        min: [0, "Quantity cannot be negative"],
      },

      unit: {
        type: String,
        default: "kg",
        trim: true,
      },
    },

    status: {
      type: String,
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

    trustScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    // QR information
    qrCode: {
      type: String,
      trim: true,
    },

    qrCodeImage: {
      type: String,
    },

    // Reserved for future blockchain/IPFS integration.
    // The backend does not depend on these fields.
    ipfsCID: {
      type: String,
    },

    txHash: {
      type: String,
    },

    blockNumber: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
honeyBatchSchema.index({ beekeeperId: 1 });
honeyBatchSchema.index({ hiveId: 1 });
honeyBatchSchema.index({ status: 1 });
honeyBatchSchema.index({ batchId: 1 }, { unique: true });

module.exports = mongoose.model("HoneyBatch", honeyBatchSchema);