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
    const { zoneName, areaType, greenCover, waterSource } = req.body;

    const newZone = new Zone({
      zoneName,
      areaType,
      greenCover,
      waterSource
    });

    await newZone.save();

    res.status(201).json({
      message: "Zone added successfully"
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
      if (zone.greenCover < 40) {
        suggestions.push("Increase tree plantation to improve green cover");
      }

      // 💧 Water source rule
      if (zone.waterSource === "Borewell") {
        suggestions.push("Implement rainwater harvesting system");
      }

      // 🧪 Pesticide rule
      const pesticide = await Pesticide
        .findOne({ zoneId: zone._id })
        .sort({ appliedDate: -1 });

      if (pesticide && pesticide.category === "Chemical") {
        suggestions.push("Reduce chemical pesticide usage");
      }

      // ✂️ Trimming rule
      const trimming = await Trimming
        .findOne({ zoneId: zone._id })
        .sort({ lastTrimmedDate: -1 });

      if (trimming && trimming.riskLevel === "High") {
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
