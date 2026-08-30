const express = require("express");
const router = express.Router();
const { getHoneyPassport } = require("../controllers/consumerController");

// Public — no auth needed (consumer QR scan)
// GET /api/public/batches/:batchId
router.get("/batches/:batchId", getHoneyPassport);

module.exports = router;