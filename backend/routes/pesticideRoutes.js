const router = require("express").Router();
const controller = require("../controllers/pesticideController");

const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, controller.addPesticide);
router.get("/", protect, controller.getPesticide);
router.put("/:id", protect, admin, controller.updatePesticide);
router.delete("/:id", protect, admin, controller.deletePesticide);

module.exports = router;
