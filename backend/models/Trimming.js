const mongoose = require("mongoose");

const trimmingSchema = new mongoose.Schema({
  zone: { type: String, required: true },
  trimming_type: { type: String, required: true },
  schedule_date: { type: Date, required: true },
  staff_assigned: { type: String, required: true },
  status: { type: String, default: "Scheduled" },
  enteredBy: { type: String },
  editedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Trimming", trimmingSchema);
