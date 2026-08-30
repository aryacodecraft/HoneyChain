const mongoose = require("mongoose");

const processingRecordSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HoneyBatch",
      required: true,
    },
    processorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receivedQuantity: { type: Number, required: true },
    processedQuantity: { type: Number, required: true },
    processingDate: { type: Date, required: true },
    processingUnit: { type: String, required: true }, // e.g. "PROC-04"
    packagingDate: { type: Date },
    packageCount: { type: Number },
    status: {
      type: String,
      enum: ["pending", "completed", "flagged"],
      default: "pending",
    },

    // Blockchain reference for this processing event
    txHash: { type: String },
    blockNumber: { type: Number },
    ipfsCID: { type: String },
  },
  { timestamps: true }
);

processingRecordSchema.index({ batchId: 1 });

module.exports = mongoose.model("ProcessingRecord", processingRecordSchema);