const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");
const menuItemModel = require("../models/menuItemModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //get the current menu item

  const item = await menuItemModel.findById(req.params.menuItemId);

  //create checkout session
  stripe.checkout.session.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/`,
    customer_email: req.user.email,
  });
});
