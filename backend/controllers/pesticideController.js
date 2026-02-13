const Pesticide = require("../models/Pesticide");

exports.addPesticide = async (req, res) => {
  try {
    const { zoneName, pesticideType, quantity, scheduleDate } = req.body;

    if (!zoneName || !pesticideType || !quantity || !scheduleDate) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const record = await Pesticide.create({
      zoneName,
      pesticideType,
      quantity,
      scheduleDate
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPesticide = async (req, res) => {
  try {
    const data = await Pesticide.find().sort({ scheduleDate: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePesticide = async (req, res) => {
  try {
    const updatedRecord = await Pesticide.findByIdAndUpdate(
      req.params.id,
      req.body,
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

exports.deletePesticide = async (req, res) => {
  try {
    const record = await Pesticide.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
