const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { getAlerts, updateAlert, getDashboard } = require("../controllers/adminController");

router.get("/dashboard", protect, authorize("admin"), getDashboard);
router.get("/alerts", protect, authorize("admin"), getAlerts);
router.put("/alerts/:alertId", protect, authorize("admin"), updateAlert);

module.exports = router;