const Waste = require("../models/Waste");

exports.addWaste = async (req, res) => {
    try {
        const { zone, waste_amount, collection_date } = req.body;

        if (!zone || !waste_amount || !collection_date) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const record = await Waste.create({
            zone,
            waste_amount,
            collection_date,
            enteredBy: req.user.name
        });
        res.status(201).json(record);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getWaste = async (req, res) => {
    try {
        const data = await Waste.find().sort({ collection_date: -1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateWaste = async (req, res) => {
    try {
        const updatedRecord = await Waste.findByIdAndUpdate(
            req.params.id,
            { ...req.body, editedBy: req.user.name },
            { new: true }
        );
        if (!updatedRecord) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.json(updatedRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteWaste = async (req, res) => {
    try {
        const record = await Waste.findByIdAndDelete(req.params.id);
        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }
        res.json({ message: "Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
