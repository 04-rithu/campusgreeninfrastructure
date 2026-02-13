const express = require("express");
const router = express.Router();
const Zone = require("../models/Zone");

// ✅ POST → Add Zone
router.post("/", async (req, res) => {
  try {
    const zone = new Zone(req.body);
    await zone.save();
    res.status(201).json({ message: "Zone added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET → Fetch All Zones
router.get("/", async (req, res) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
