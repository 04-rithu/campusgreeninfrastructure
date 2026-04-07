const mongoose = require("mongoose");

const pesticideSchema = new mongoose.Schema({
  zone: { type: String, required: true },
  pesticide_type: { type: String, required: true },
  quantity: { type: String, required: true },
  schedule_date: { type: Date, required: true },
  status: { type: String, default: "Applied" },
  enteredBy: { type: String },
  editedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Pesticide", pesticideSchema);
