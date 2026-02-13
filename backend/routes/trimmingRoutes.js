const router = require("express").Router();
const controller = require("../controllers/trimmingController");

router.post("/", controller.addTrimming);
router.get("/", controller.getTrimming);
router.put("/:id", controller.updateTrimming);
router.delete("/:id", controller.deleteTrimming);

module.exports = router;
