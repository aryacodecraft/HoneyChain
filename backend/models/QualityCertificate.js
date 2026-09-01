const mongoose = require("mongoose");

const qualityCertificateSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HoneyBatch",
      required: [true, "Batch ID is required"],
      index: true,
    },

    certificateId: {
      type: String,
      required: [true, "Certificate ID is required"],
      unique: true,
      trim: true,
    },

    testDate: {
      type: Date,
      required: [true, "Test date is required"],
    },

    labName: {
      type: String,
      required: [true, "Laboratory name is required"],
      trim: true,
    },

    moisture: {
      type: Number,
      min: 0,
    },

    purity: {
      type: Number,
      min: 0,
      max: 100,
    },

    adulterationStatus: {
      type: String,
      enum: ["not_detected", "detected", "inconclusive"],
      required: true,
    },

    result: {
      type: String,
      enum: ["pass", "fail", "pending"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["verified", "unverified", "rejected"],
      default: "unverified",
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    certificateUrl: {
      type: String,
      trim: true,
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

qualityCertificateSchema.index({
  batchId: 1,
  testDate: -1,
});

module.exports =
  mongoose.models.QualityCertificate ||
  mongoose.model("QualityCertificate", qualityCertificateSchema);
