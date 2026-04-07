const mongoose = require("mongoose");

const wateringSchema = new mongoose.Schema({
  zone: { type: String, required: true },
  task_description: { type: String, required: true },
  schedule_date: { type: Date, required: true },
  duration_minutes: { type: Number, required: true },
  status: { type: String, default: "Scheduled" },
  enteredBy: { type: String },
  editedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Watering", wateringSchema);
