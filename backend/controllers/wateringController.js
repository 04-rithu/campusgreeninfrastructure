const Watering = require("../models/Watering");

// GET all watering data
const getWatering = async (req, res) => {
  try {
    const waterings = await Watering.find().sort({ scheduleDate: 1 });
    res.json(waterings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST new watering task
const createWatering = async (req, res) => {
  const { zoneName, task, waterAmount, scheduleDate } = req.body;

  if (!zoneName || !waterAmount || !scheduleDate) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const newWatering = new Watering({
    zoneName,
    task,
    waterAmount,
    scheduleDate
  });

  try {
    const savedWatering = await newWatering.save();
    res.status(201).json(savedWatering);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE watering task
const updateWatering = async (req, res) => {
  try {
    const updatedWatering = await Watering.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedWatering) {
      return res.status(404).json({ message: "Watering task not found" });
    }
    res.json(updatedWatering);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE watering task
const deleteWatering = async (req, res) => {
  try {
    const watering = await Watering.findByIdAndDelete(req.params.id);
    if (!watering) {
      return res.status(404).json({ message: "Watering task not found" });
    }
    res.json({ message: "Watering task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWatering, createWatering, updateWatering, deleteWatering };
