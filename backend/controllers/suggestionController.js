const Suggestion = require("../models/Suggestion");

// Submit a suggestion (User)
exports.submitSuggestion = async (req, res) => {
  try {
    const { zone, suggestion_type, description } = req.body;
    
    // Fetch user to get the name, as it's not present in JWT
    const User = require("../models/User");
    const user = await User.findById(req.user.id);
    const userName = user ? user.name : "Unknown User";

    const newSuggestion = new Suggestion({
      user_id: req.user.id,
      user_name: req.user.name || userName,
      zone,
      suggestion_type,
      description
    });
    await newSuggestion.save();
    res.status(201).json({ message: "Suggestion submitted successfully", suggestion: newSuggestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all suggestions (Admin) or User's own suggestions
exports.getSuggestions = async (req, res) => {
  try {
    let suggestions;
    if (req.user.role === "admin") {
      suggestions = await Suggestion.find().sort({ date_submitted: -1 });
    } else {
      suggestions = await Suggestion.find({ user_id: req.user.id }).sort({ date_submitted: -1 });
    }
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update suggestion status (Admin)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const suggestion = await Suggestion.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!suggestion) return res.status(404).json({ message: "Suggestion not found" });
    res.json({ message: "Status updated", suggestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add admin response (Admin)
exports.addResponse = async (req, res) => {
  try {
    const { admin_response } = req.body;
    const suggestion = await Suggestion.findByIdAndUpdate(
      req.params.id,
      { admin_response },
      { new: true }
    );
    if (!suggestion) return res.status(404).json({ message: "Suggestion not found" });
    res.json({ message: "Response added", suggestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
