const router = require("express").Router();
const controller = require("../controllers/trimmingController");

const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, controller.addTrimming);
router.get("/", protect, controller.getTrimming);
router.put("/:id", protect, admin, controller.updateTrimming);
router.delete("/:id", protect, admin, controller.deleteTrimming);

module.exports = router;
