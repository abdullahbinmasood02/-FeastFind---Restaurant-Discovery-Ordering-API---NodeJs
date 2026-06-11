const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factory");
const restaurantModel = require("../models/restaurant");

exports.postRestaurant = factory.create(restaurantModel);
exports.updateRestaurant = factory.update(restaurantModel);
exports.deleteRestaurant = factory.deleteOne(restaurantModel);
exports.getRestaurant = factory.getOne(restaurantModel);
exports.getAllRestaurants = factory.getAll(restaurantModel);
