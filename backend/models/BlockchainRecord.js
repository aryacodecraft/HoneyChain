const mongoose = require("mongoose");

const blockchainRecordSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HoneyBatch",
      required: true,
      index: true,
    },

    transactionType: {
      type: String,
      enum: [
        "batch_created",
        "processing_updated",
        "batch_approved",
        "batch_flagged",
        "location_updated",
        "certificate_added",
        "batch_delivered",
      ],
      required: true,
    },

    transactionHash: {
      type: String,
      unique: true,
      sparse: true,
    },

    blockNumber: {
      type: Number,
    },

    dataHash: {
      type: String,
    },

    blockchainNetwork: {
      type: String,
      default: "Sepolia Testnet",
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

blockchainRecordSchema.index({
  batchId: 1,
  timestamp: -1,
});

module.exports = mongoose.model(
  "BlockchainRecord",
  blockchainRecordSchema
);