const reviewController = require("../controllers/reviewController");
const express = require("express");
const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.postReview);
reviewRouter
  .route("/:id")
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = reviewRouter;
