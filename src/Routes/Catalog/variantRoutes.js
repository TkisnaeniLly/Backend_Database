const express = require("express");
const controller = require("../../Controllers/Catalog/variantController");

const router = express.Router();

router.get("/", controller.getAllVariants);
router.get("/:id", controller.getVariantById);
router.post("/", controller.createVariant);
router.put("/:id", controller.updateVariant);
router.delete("/:id", controller.deleteVariant);

module.exports = router;
