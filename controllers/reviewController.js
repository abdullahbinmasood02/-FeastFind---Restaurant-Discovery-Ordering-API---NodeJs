const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");
const reviewModel = require("../models/reviewModel");

exports.postReview = factory.create(reviewModel);
exports.updateReview = factory.update(reviewModel);
exports.deleteReview = factory.deleteOne(reviewModel);
exports.getReview = factory.getOne(reviewModel);
exports.getAllReviews = factory.getAll(reviewModel);

// exports.setParams = function (req, res, next) {
//   if (!req.body.restaurant) req.body.restaurant = req.params.restaurantId;
//   if (!req.body.user) req.body.user = req.params.userId;
//   next();
// };
