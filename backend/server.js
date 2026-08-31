const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const consumerRoutes = require("./routes/consumerRoutes");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// =========================
// Middleware
// =========================

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// Routes
// =========================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/hives", require("./routes/hiveRoutes"));
app.use("/api/batches", require("./routes/batchRoutes"));
app.use("/api/public", require("./routes/publicRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/processor", require("./routes/processorRoutes"));
app.use("/api/distributor", require("./routes/distributorRoutes"));
app.use(
  "/api/retailer",
  require("./routes/retailerRoutes")
);
app.use("/api/consumer", consumerRoutes);
// =========================
// Health Check
// =========================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HoneyChain API is running",
    version: "1.0.0",
    status: "healthy",
  });
});

// =========================
// 404 Handler
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =========================
// Global Error Handler
// =========================

app.use(errorHandler);

// =========================
// Start Server
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`HoneyChain API running on port ${PORT}`);
});