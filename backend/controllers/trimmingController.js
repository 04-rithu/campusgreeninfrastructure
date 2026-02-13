const Trimming = require("../models/Trimming");

exports.addTrimming = async (req, res) => {
  try {
    const { zoneName, trimmingType, staffAssigned, scheduleDate } = req.body;

    if (!zoneName || !trimmingType || !staffAssigned || !scheduleDate) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const record = await Trimming.create({
      zoneName,
      trimmingType,
      staffAssigned,
      scheduleDate
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getTrimming = async (req, res) => {
  try {
    const data = await Trimming.find().sort({ scheduleDate: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTrimming = async (req, res) => {
  try {
    const updatedRecord = await Trimming.findByIdAndUpdate(
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

exports.deleteTrimming = async (req, res) => {
  try {
    const record = await Trimming.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
