const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth",    require("./routes/authRoutes"));
app.use("/api/hives",   require("./routes/hiveRoutes"));
app.use("/api/batches", require("./routes/batchRoutes"));
app.use("/api/public",  require("./routes/publicRoutes"));   // No auth — consumer QR
app.use("/api/admin",   require("./routes/adminRoutes"));

// ─── Health Check + API Map ───────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🍯 HoneyChain API is running",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login:    "POST /api/auth/login",
        me:       "GET  /api/auth/me",
      },
      hives: {
        register:       "POST /api/hives",
        getMyHives:     "GET  /api/hives",
        addSensor:      "POST /api/hives/:hiveId/sensors",
        getSensors:     "GET  /api/hives/:hiveId/sensors",
        getPrediction:  "GET  /api/hives/:hiveId/predictions/latest",
        savePrediction: "POST /api/hives/:hiveId/predictions",
      },
      batches: {
        createBatch:   "POST /api/batches              (beekeeper)",
        getMyBatches:  "GET  /api/batches              (beekeeper)",
        processBatch:  "POST /api/batches/:id/process  (processor)",
        approveBatch:  "POST /api/batches/:id/approve  (processor)",
        flagBatch:     "POST /api/batches/:id/flag     (processor)",
        logTransport:  "POST /api/batches/:id/location (distributor)",
        markDelivered: "POST /api/batches/:id/deliver  (retailer)",
        getQR:         "GET  /api/batches/:id/qr",
      },
      public: {
        honeyPassport: "GET /api/public/batches/:batchId  ← QR scan",
      },
      admin: {
        dashboard: "GET /api/admin/dashboard",
        alerts:    "GET /api/admin/alerts",
        updateAlert: "PUT /api/admin/alerts/:alertId",
      },
    },
  });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 HoneyChain API running on port ${PORT}`);
  console.log(`📡 http://localhost:${PORT}`);
  console.log(`📋 API map: http://localhost:${PORT}/\n`);
});