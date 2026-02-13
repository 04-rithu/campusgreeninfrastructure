const mongoose = require("mongoose");

const wateringSchema = new mongoose.Schema({
  zoneName: { type: String, required: true },
  task: { type: String, required: false }, // Optional as frontend might send 'task' or not
  waterAmount: { type: Number, required: true },
  scheduleDate: { type: Date, required: true },
  status: { type: String, default: "Scheduled" }
}, { timestamps: true });

module.exports = mongoose.model("Watering", wateringSchema);
