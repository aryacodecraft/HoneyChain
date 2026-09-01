const mongoose = require("mongoose");

const hiveSchema = new mongoose.Schema(
  {
    hiveId: {
      type: String,
      required: [true, "Hive ID is required"],
      unique: true,
      trim: true,
    },

    beekeeperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Beekeeper is required"],
    },

    beeSpecies: {
      type: String,
      trim: true,
    },

    floralSource: {
      type: String,
      trim: true,
    },

    location: {
      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },

      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },

      district: {
        type: String,
        trim: true,
      },
    },

    installationDate: {
      type: Date,
    },

    currentStatus: {
      type: String,
      enum: ["healthy", "warning", "critical", "inactive"],
      default: "healthy",
    },

    currentMetrics: {
      temperature: {
        type: Number,
      },

      humidity: {
        type: Number,
      },

      weight: {
        type: Number,
      },

      batteryLevel: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Useful indexes
hiveSchema.index({ beekeeperId: 1 });
hiveSchema.index({ currentStatus: 1 });

module.exports = mongoose.model("Hive", hiveSchema);