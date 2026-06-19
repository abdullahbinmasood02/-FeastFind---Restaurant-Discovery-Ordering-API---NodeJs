const bookingController = require("../controllers/bookingController");
const express = require("express");
const reviewRouter = express.Router();
const authController = require("../controllers/authController");

const bookingRouter = express.Router();

bookingRouter.get(
  "/checkout-session/:menuItemId",
  authController.protect,
  bookingController.getCheckoutSession,
);

module.exports = bookingRouter;
