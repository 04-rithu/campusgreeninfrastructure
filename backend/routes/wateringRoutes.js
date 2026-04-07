const express = require("express");
const router = express.Router();

const {
  getWatering,
  createWatering,
  updateWatering,
  deleteWatering,
} = require("../controllers/wateringController");

const { protect, admin } = require("../middleware/authMiddleware");

// GET all watering data
router.get("/", protect, getWatering);

// POST new watering task
router.post("/", protect, createWatering);

// UPDATE watering task
router.put("/:id", protect, admin, updateWatering);

// DELETE watering task
router.delete("/:id", protect, admin, deleteWatering);

module.exports = router;
