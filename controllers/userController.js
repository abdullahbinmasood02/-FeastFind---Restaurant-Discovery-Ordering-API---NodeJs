const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");
const userModel = require("../models/userModel");

exports.postUser = factory.create(userModel);
exports.updateUser = factory.update(userModel);
exports.deleteUser = factory.deleteOne(userModel);
exports.getUser = factory.getOne(userModel);
exports.getAllUsers = factory.getAll(userModel);
