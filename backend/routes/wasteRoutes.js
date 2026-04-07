const router = require("express").Router();
const controller = require("../controllers/wasteController");

const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, controller.addWaste);
router.get("/", protect, controller.getWaste);
router.put("/:id", protect, admin, controller.updateWaste);
router.delete("/:id", protect, admin, controller.deleteWaste);

module.exports = router;
