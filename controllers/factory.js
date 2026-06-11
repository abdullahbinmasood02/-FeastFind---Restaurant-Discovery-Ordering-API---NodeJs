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

    res.status(201).json({
      status: "success",
      data: { updated },
    });
  });
};

exports.getOne = (model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await model.findById(req.params.id);

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
