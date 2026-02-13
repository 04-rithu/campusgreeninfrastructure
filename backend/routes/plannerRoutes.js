const express = require("express");
const router = express.Router();

// IMPORTANT: this matches your actual file name
const plannerController = require("../controllers/plannerController");

// Health / status check
router.get("/status", (req, res) => {
  res.json({
    message: "Campus Green Infrastructure Planner API working",
    status: "OK"
  });
});

// Zone APIs
router.post("/zones", plannerController.addZone);
router.get("/zones", plannerController.getZones);

// Planner suggestion API
router.get(
  "/planner/suggestions",
  plannerController.getPlannerSuggestions
);

module.exports = router;
