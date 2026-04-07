const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user_name: { type: String, required: true },
  zone: { type: String, required: true },
  suggestion_type: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Assigned", "Resolved"], default: "Pending" },
  admin_response: { type: String, default: "" },
  date_submitted: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Suggestion", suggestionSchema);
