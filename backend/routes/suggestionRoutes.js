const express = require("express");
const router = express.Router();
const { submitSuggestion, getSuggestions, updateStatus, addResponse } = require("../controllers/suggestionController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, submitSuggestion);
router.get("/", protect, getSuggestions);
router.put("/:id/status", protect, admin, updateStatus);
router.put("/:id/response", protect, admin, addResponse);

module.exports = router;
