const express = require("express");
const router = express.Router();

const {
  getHoneyPassport,
} = require("../controllers/consumerController");

// ========================================
// PUBLIC CONSUMER API
// No authentication required
// ========================================

// Scan QR / view Honey Passport
router.get(
  "/batches/:batchId",
  getHoneyPassport
);

module.exports = router;