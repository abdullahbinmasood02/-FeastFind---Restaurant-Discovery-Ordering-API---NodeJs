const menuItemController = require("../controllers/menuItemController");
const express = require("express");
const menuItemRouter = express.Router();
const authController = require("../controllers/authController");

menuItemRouter.use(
  authController.protect,
  authController.restrictTo("owner", "admin"),
);

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
