const express = require("express");
const router = express.Router();

const {
  getWatering,
  createWatering,
  updateWatering,
  deleteWatering,
} = require("../controllers/wateringController");

// GET all watering data
router.get("/", getWatering);

// POST new watering task
router.post("/", createWatering);

// UPDATE watering task
router.put("/:id", updateWatering);

// DELETE watering task
router.delete("/:id", deleteWatering);

module.exports = router;
