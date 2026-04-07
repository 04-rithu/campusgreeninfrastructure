const express = require("express");
const router = express.Router();
const { exportData } = require("../controllers/exportController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/:module", protect, admin, exportData);

module.exports = router;
