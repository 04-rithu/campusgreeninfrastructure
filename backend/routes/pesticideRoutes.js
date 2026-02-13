const router = require("express").Router();
const controller = require("../controllers/pesticideController");

router.post("/", controller.addPesticide);
router.get("/", controller.getPesticide);
router.put("/:id", controller.updatePesticide);
router.delete("/:id", controller.deletePesticide);

module.exports = router;
