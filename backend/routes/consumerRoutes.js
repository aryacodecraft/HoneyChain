const express = require("express");
const router = express.Router();

const {
  getHoneyPassport
} = require("../controllers/consumerController");

// Public endpoint — consumer does not need login
router.get(
  "/batch/:batchId",
  getHoneyPassport
);

module.exports = router;
