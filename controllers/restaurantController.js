const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");
const restaurantModel = require("../models/restaurantModel");

exports.postRestaurant = factory.create(restaurantModel);
exports.updateRestaurant = factory.update(restaurantModel);
exports.deleteRestaurant = factory.deleteOne(restaurantModel);
exports.getRestaurant = factory.getOne(restaurantModel);
exports.getAllRestaurants = factory.getAll(restaurantModel);

exports.restaurantsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  if (!lat || !lng)
    return next(
      new AppError(
        "please provide latitude and longitude in the format lat,lng",
        400,
      ),
    );
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  const restaurants = await restaurantModel.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: "success",
    results: restaurants.length,
    data: { restaurants },
  });
});

exports.restaurantsNear = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  if (!lat || !lng)
    return next(
      new AppError(
        "please provide latitude and longitude in the format lat,lng",
        400,
      ),
    );

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  const restaurants = await restaurantModel.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        name: 1,
        distance: 1,
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    result: restaurants.length,
    data: {
      restaurants,
    },
  });
});
