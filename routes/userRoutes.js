const userController = require("../controllers/userController");
const express = require("express");
const userRouter = express.Router();
const authController = require("../controllers/authController");

userRouter.route("/signup").post(authController.signup);
userRouter.route("/login").post(authController.login);

userRouter
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.postUser);
userRouter
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

module.exports = userRouter;
