const reviewController = require("../controllers/reviewController");
const express = require("express");
const reviewRouter = express.Router({ mergeParams: true });
const authController = require("../controllers/authController");

reviewRouter.use(authController.protect);
reviewRouter
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    reviewController.setParams,
    authController.restrictTo("customer"),
    reviewController.postReview,
  );
reviewRouter
  .route("/:id")
  .get(reviewController.getReview)
  .delete(authController.restrictTo("customer"), reviewController.deleteReview)
  .patch(authController.restrictTo("customer"), reviewController.updateReview);

module.exports = reviewRouter;
