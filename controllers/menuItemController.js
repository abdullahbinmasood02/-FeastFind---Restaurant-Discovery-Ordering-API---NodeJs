const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");
const menuItemModel = require("../models/menuItemModel");

exports.postMenuItem = factory.create(menuItemModel);
exports.updateMenuItem = factory.update(menuItemModel);
exports.deleteMenuItem = factory.deleteOne(menuItemModel);
exports.getMenuItem = factory.getOne(menuItemModel);
exports.getAllMenuItems = factory.getAll(menuItemModel);
