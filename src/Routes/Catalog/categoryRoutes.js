const express = require("express");
const controller = require("../../Controllers/Catalog/categoryController");

const router = express.Router();

router.get("/", controller.getAllCategories);
router.get("/:id", controller.getCategoryById);
router.post("/", controller.createCategory);
router.put("/:id", controller.updateCategory);
router.delete("/:id", controller.deleteCategory);

module.exports = router;
