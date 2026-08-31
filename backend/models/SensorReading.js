const mongoose = require("mongoose");

const sensorReadingSchema = new mongoose.Schema(
  {
    hiveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hive",
      required: [true, "Hive ID is required"],
      index: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },

    temperature: {
      type: Number,
      required: [true, "Temperature is required"],
      min: [-20, "Temperature is too low"],
      max: [80, "Temperature is too high"],
    },

    humidity: {
      type: Number,
      required: [true, "Humidity is required"],
      min: [0, "Humidity cannot be negative"],
      max: [100, "Humidity cannot exceed 100"],
    },

    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: [0, "Weight cannot be negative"],
    },

    batteryLevel: {
      type: Number,
      min: [0, "Battery level cannot be negative"],
      max: [100, "Battery level cannot exceed 100"],
    },
  },
  {
    timestamps: true,
  }
);

// Fast retrieval of recent readings for a hive
sensorReadingSchema.index({
  hiveId: 1,
  timestamp: -1,
});

module.exports = mongoose.model("SensorReading", sensorReadingSchema);