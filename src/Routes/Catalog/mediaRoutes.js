const express = require("express");
const controller = require("../../Controllers/Catalog/inventoryController");

const router = express.Router();

router.get("/", controller.getAllInventories);
router.get("/:id", controller.getInventoryById);
router.post("/", controller.createInventory);
router.put("/:id", controller.updateInventory);
router.delete("/:id", controller.deleteInventory);

module.exports = router;
