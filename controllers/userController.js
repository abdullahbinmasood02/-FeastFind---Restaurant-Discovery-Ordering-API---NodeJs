const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");
const userModel = require("../models/userModel");

exports.postUser = factory.create(userModel);
exports.updateUser = factory.update(userModel);
exports.deleteUser = factory.deleteOne(userModel);
exports.getUser = factory.getOne(userModel);
exports.getAllUsers = factory.getAll(userModel);

function filterBody(toFilter, ...allowedKeys) {
  const newObj = {};

  Object.keys(toFilter).forEach((key) => {
    if (allowedKeys.includes(key)) newObj[key] = toFilter[key];
  });
  return newObj;
}

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "This route is not for updating passwords. Use /api/v1/users/forgotPassword to update the password",
      ),
    );

  const filteredObj = filterBody(req.body, "name", "email", "photo"); //filter the body for security

  const user = await userModel.findById(req.user._id);
  const updatedUser = await userModel.findByIdAndUpdate(user._id, filteredObj, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const deleted = await userModel.findByIdAndUpdate(req.user._id, {
    active: false,
  });
  res.status(201).json({
    status: "success",
    data: null,
  });
});
