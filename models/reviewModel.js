const mongoose = require("mongoose");
const restaurantModel = require("./restaurantModel");

const reviewSchema = mongoose.Schema({
  review: {
    type: String,
    required: [true, "review cannot be empty"],
  },
  rating: {
    type: Number,
    required: [true, "review must have a rating"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "restaurants",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: [true, "user field cannot be empty"],
    ref: "users",
  },
});

//indexes
reviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });

//static methods
reviewSchema.statics.calcAverageRatings = async function (restaurantId) {
  const stats = await this.aggregate([
    {
      $match: { restaurant: restaurantId },
    },

    {
      $group: {
        _id: "$restaurant",
        ratingsAverage: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await restaurantModel.findByIdAndUpdate(restaurantId, {
      ratingsAverage: stats[0].ratingsAverage,
      ratingsQuantity: stats[0].ratingsQuantity,
    });
  } else {
    await restaurantModel.findByIdAndUpdate(restaurantId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
//middlewares

//pre
reviewSchema.pre("save", function () {
  this.constructor.calcAverageRatings(this.restaurant);
});

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name",
  });
});

reviewSchema.post(/^findOneAnd/, function (doc) {
  if (doc) doc.constructor.calcAverageRatings(doc.restaurant);
});

const reviewModel = mongoose.model("reviews", reviewSchema);
module.exports = reviewModel;
