const mongoose = require("mongoose");

const locationLogSchema = new mongoose.Schema({
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HoneyBatch",
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  actorRole: {
    type: String,
    required: true,
    enum: ["distributor", "processor", "retailer"],
  },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    city: { type: String },
    state: { type: String },
  },
  eventType: {
    type: String,
    required: true,
    enum: ["picked_up", "in_transit", "arrived"],
  },
  timestamp: { type: Date, default: Date.now },

  // Blockchain reference
  locationCID: { type: String },
  txHash: { type: String },
});

locationLogSchema.index({ batchId: 1, timestamp: -1 });

module.exports = mongoose.model("LocationLog", locationLogSchema);