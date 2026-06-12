const menuItemController = require("../controllers/menuItemController");
const express = require("express");
const menuItemRouter = express.Router();

menuItemRouter
  .route("/")
  .get(menuItemController.getAllMenuItems)
  .post(menuItemController.postMenuItem);
menuItemRouter
  .route("/:id")
  .get(menuItemController.getMenuItem)
  .delete(menuItemController.deleteMenuItem)
  .patch(menuItemController.updateMenuItem);

module.exports = menuItemRouter;
