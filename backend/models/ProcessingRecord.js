const mongoose = require("mongoose");

const processingRecordSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HoneyBatch",
      required: [true, "Batch ID is required"],
      index: true,
    },

    processorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Processor ID is required"],
    },

    receivedQuantity: {
      type: Number,
      required: [true, "Received quantity is required"],
      min: [0, "Received quantity cannot be negative"],
    },

    processedQuantity: {
      type: Number,
      required: [true, "Processed quantity is required"],
      min: [0, "Processed quantity cannot be negative"],
    },

    processingDate: {
      type: Date,
      required: [true, "Processing date is required"],
    },

    processingUnit: {
      type: String,
      required: [true, "Processing unit is required"],
      trim: true,
    },

    packagingDate: {
      type: Date,
    },

    packageCount: {
      type: Number,
      min: [0, "Package count cannot be negative"],
    },

    status: {
      type: String,
      enum: ["pending", "completed", "flagged"],
      default: "pending",
    },

    // Optional future blockchain integration
    txHash: {
      type: String,
    },

    blockNumber: {
      type: Number,
    },

    ipfsCID: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Quickly retrieve processing history for a batch
processingRecordSchema.index({
  batchId: 1,
  processingDate: -1,
});

module.exports = mongoose.model("ProcessingRecord", processingRecordSchema);