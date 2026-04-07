const Zone = require("../models/Zone");
const Watering = require("../models/Watering");
const Pesticide = require("../models/Pesticide");
const Trimming = require("../models/Trimming");

/**
 * POST /api/zones
 * Add a new zone
 */
exports.addZone = async (req, res) => {
  try {
    const { zoneName, currentGreenCover, requiredGreenCover, waterSource } = req.body;

    const newZone = new Zone({
      zoneName,
      currentGreenCover,
      requiredGreenCover,
      waterSource
    });

    await newZone.save();

    res.status(201).json({
      message: "Zone added successfully",
      zone: newZone
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * GET /api/zones
 * Get all zones
 */
exports.getZones = async (req, res) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * PUT /api/zones/:id
 * Update a zone
 */
exports.updateZone = async (req, res) => {
  try {
    const updatedZone = await Zone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedZone) return res.status(404).json({ message: "Zone not found" });
    res.json({ message: "Zone updated successfully", zone: updatedZone });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /api/zones/:id
 * Delete a zone
 */
exports.deleteZone = async (req, res) => {
  try {
    const zone = await Zone.findByIdAndDelete(req.params.id);
    if (!zone) return res.status(404).json({ message: "Zone not found" });
    res.json({ message: "Zone deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * GET /api/planner/suggestions
 * FULL PLANNER LOGIC (Zones + Watering + Pesticide + Trimming)
 */
exports.getPlannerSuggestions = async (req, res) => {
  try {
    const zones = await Zone.find();
    let result = [];

    for (let zone of zones) {
      let suggestions = [];

      // 🌱 Green cover rule
      if (zone.currentGreenCover < zone.requiredGreenCover) {
        suggestions.push(`Increase tree plantation to reach target of ${zone.requiredGreenCover}%`);
      }

      // 💧 Water source rule
      if (zone.waterSource === "Borewell") {
        suggestions.push("Implement rainwater harvesting system");
      }

      // 🧪 Pesticide rule
      const pesticide = await Pesticide
        .findOne({ zone: zone.zoneName })
        .sort({ schedule_date: -1 });

      if (pesticide && pesticide.status === "Chemical") { // Assuming status or type could be checked
        suggestions.push("Reduce chemical pesticide usage");
      }

      // ✂️ Trimming rule
      const trimming = await Trimming
        .findOne({ zone: zone.zoneName })
        .sort({ schedule_date: -1 });

      if (trimming && trimming.status === "High") {
        suggestions.push("Immediate trimming required");
      }

      result.push({
        zoneName: zone.zoneName,
        suggestions
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Planner logic failed"
    });
  }
};
