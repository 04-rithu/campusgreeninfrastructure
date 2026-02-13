const mongoose = require("mongoose");

const trimmingSchema = new mongoose.Schema({
  zoneName: { type: String, required: true },
  trimmingType: { type: String, required: true },
  staffAssigned: { type: String, required: true },
  scheduleDate: { type: Date, required: true },
  status: { type: String, default: "Scheduled" }
}, { timestamps: true });

module.exports = mongoose.model("Trimming", trimmingSchema);
