const userController = require("../controllers/userController");
const express = require("express");
const userRouter = express.Router();
const authController = require("../controllers/authController");

userRouter.route("/signup").post(authController.signup);
userRouter.route("/login").post(authController.login);
userRouter.route("/forgotPassword").post(authController.forgotPassword);
userRouter.route("/resetPassword/:token").post(authController.resetPassword);

userRouter.use(authController.protect);

userRouter.route("/updatePassword").post(authController.updatePassword);

userRouter.route("/updateMe").post(userController.updateMe);

userRouter.route("/deleteMe").delete(userController.deleteMe);

userRouter.use(authController.restrictTo("admin"));
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
