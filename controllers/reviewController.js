const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");
const reviewModel = require("../models/reviewModel");

exports.postReview = factory.create(reviewModel);
exports.updateReview = factory.update(reviewModel);
exports.deleteReview = factory.deleteOne(reviewModel);
exports.getReview = factory.getOne(reviewModel);
exports.getAllReviews = factory.getAll(reviewModel);
