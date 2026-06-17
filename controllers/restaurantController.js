const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");
const restaurantModel = require("../models/restaurantModel");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image"))
    return cb(new AppError("File not an image", 400), false);
  else cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadRestaurantImages = upload.fields([
  {
    name: "imageCover",
    max: 1,
  },
  {
    name: "images",
    max: 3,
  },
]);

exports.processImages = catchAsync(async (req, res, next) => {
  //cover image
  if (!req.files.imageCover || !req.files.images) return next();

  req.body.coverImage = `restaurant-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg(90)
    .toFile(`public/img/restaurants/${req.body.coverImage}`);

  //other images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (image, index) => {
      const filename = `restaurant-${req.params.id}-${Date.now()}-${index}.jpeg`;

      await sharp(image.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg(90)
        .toFile(`public/img/restaurants/${filename}`);

      req.body.images.push(filename);
    }),
  );

  next();
});

exports.postRestaurant = factory.create(restaurantModel);
exports.updateRestaurant = factory.update(restaurantModel);
exports.deleteRestaurant = factory.deleteOne(restaurantModel);
exports.getRestaurant = factory.getOne(restaurantModel, { path: "reviews" });
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
