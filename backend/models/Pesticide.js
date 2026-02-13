const mongoose = require("mongoose");

const pesticideSchema = new mongoose.Schema({
  zoneName: { type: String, required: true },
  pesticideType: { type: String, required: true },
  quantity: { type: String, required: true },
  scheduleDate: { type: Date, required: true },
  status: { type: String, default: "Applied" }
}, { timestamps: true });

module.exports = mongoose.model("Pesticide", pesticideSchema);
