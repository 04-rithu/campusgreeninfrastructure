const express = require("express");
const router = express.Router();

// IMPORTANT: this matches your actual file name
const plannerController = require("../controllers/plannerController");
const { protect, admin } = require("../middleware/authMiddleware");

// Health / status check
router.get("/status", (req, res) => {
  res.json({
    message: "Campus Green Infrastructure Planner API working",
    status: "OK"
  });
});

// Zone APIs
router.post("/zones", protect, admin, plannerController.addZone);
router.get("/zones", protect, plannerController.getZones);
router.put("/zones/:id", protect, admin, plannerController.updateZone);
router.delete("/zones/:id", protect, admin, plannerController.deleteZone);

// Planner suggestion API
router.get(
  "/planner/suggestions",
  protect,
  plannerController.getPlannerSuggestions
);

module.exports = router;
