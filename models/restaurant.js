const mongoose = require("mongoose");
const { trim } = require("validator");
const slugify = require("slugify");
const userModel = require("./user");

const restaurantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 50,
      trim: true,
      required: [true, "please enter restaurant name"],
    },
    slug: String,
    cuisine: {
      type: String,
      enum: [
        "italian",
        "chinese",
        "mexican",
        "japanese",
        "indian",
        "american",
        "thai",
        "mediterranean",
        "other",
      ],
    },
    address: {
      type: String,
      required: [true, "please enter restaurant address"],
      trim: true,
    },
    location: {
      type: { type: "String", default: "Point", enum: ["Point"] },
      coordinates: [Number],
      address: String,
      description: String,
    },
    phone: {
      type: String,
      required: [true, "please enter restaurant phone number"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.0,
      min: 1.0,
      max: 5.0,
      set: (val) => (val * 100) / 100,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceRange: {
      type: String,
      required: [true, "please enter price range"],
      enum: ["budget", "moderate", "fine=dining"],
    },
    openingHours: {
      open: {
        type: String,
        required: [true, "restaurant must have opening hours"],
      },
      closed: {
        type: String,
        required: [true, "restaurant must have closed hours"],
      },
    },
    coverImage: {
      type: String,
      required: [true, "cover image is required"],
    },
    images: [
      {
        type: String,
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
    },
  },
  {
    toJson: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

restaurantSchema.pre("save", function () {
  if (!this.isNew) return next();

  const slug = slugify(this.name);
  this.slug = slug;
});

restaurantSchema.pre(/^find/, function (next) {
  this.where({ isVerified: { $ne: false } });
});

restaurantSchema.pre(/^find/, function (next) {
  this.populate({
    path: "owner",
    select: "name",
  });
});

restaurantSchema.virtual("reviews", {
  ref: "reviews",
  foreignField: "restaurant",
  localField: "_id",
});

restaurantSchema.index({ priceRange: 1, ratingsAverage: 1 });
restaurantSchema.index({ location: "2dsphere" });

const restaurantModel = mongoose.model("restaurants", restaurantSchema);
module.exports = restaurantModel;
