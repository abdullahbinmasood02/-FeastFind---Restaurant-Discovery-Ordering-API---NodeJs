const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const ApiFeatures = require("../utils/ApiFeatures");

exports.getAll = (model) => {
  return catchAsync(async (req, res, next) => {
    let query = model.find();

    const apiFeatures = new ApiFeatures(req.query, query);

    const result = await apiFeatures.filter().sort().getFields().getPages()
      .query;

    res.status(200).json({
      status: "success",
      data: {
        result,
      },
    });
  });
};

exports.deleteOne = (model) => {
  return catchAsync(async (req, res, next) => {
    const deleted = await model.findByIdAndDelete(req.params.id);

    if (!deleted) return next(new AppError("No such document exists", 404));

    res.status(201).json({
      status: "success",
      data: null,
    });
  });
};
exports.update = (model) => {
  return catchAsync(async (req, res, next) => {
    const updated = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return next(new AppError("No such document exists", 404));

    res.status(201).json({
      status: "success",
      data: { updated },
    });
  });
};

exports.getOne = (model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await model.findById(req.params.id);

    if (!doc) return next(new AppError("No such document exists", 404));

    res.status(200).json({
      status: "success",
      data: { doc },
    });
  });
};

exports.create = (model) => {
  return catchAsync(async (req, res, next) => {
    const created = await model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        created,
      },
    });
  });
};
