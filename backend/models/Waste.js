const mongoose = require("mongoose");

const wasteSchema = new mongoose.Schema({
    zone: { type: String, required: true },
    waste_amount: { type: String, required: true },
    collection_date: { type: Date, required: true },
    status: { type: String, default: "Scheduled" },
    enteredBy: { type: String },
    editedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Waste", wasteSchema);
