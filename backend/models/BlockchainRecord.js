const mongoose = require("mongoose");

// Matches schema section 11 exactly
const blockchainRecordSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HoneyBatch",
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
      enum: [
        "batch_created",
        "processing_updated",
        "batch_approved",
        "batch_flagged",
        "location_updated",
        "certificate_added",
        "batch_delivered",
      ],
    },
    transactionHash: { type: String, required: true, unique: true },
    blockNumber: { type: Number },
    dataHash: { type: String, required: true }, // IPFS CID
    blockchainNetwork: { type: String, default: "Sepolia Testnet" },
    timestamp: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

blockchainRecordSchema.index({ batchId: 1 });
blockchainRecordSchema.index({ transactionHash: 1 }, { unique: true });

module.exports = mongoose.model("BlockchainRecord", blockchainRecordSchema);