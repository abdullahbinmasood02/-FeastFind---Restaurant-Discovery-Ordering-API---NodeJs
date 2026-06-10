const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

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
