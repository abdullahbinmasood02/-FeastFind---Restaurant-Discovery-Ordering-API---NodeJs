const restaurantController = require("../controllers/restaurantController");
const express = require("express");
const restaurantRouter = express.Router();
const reviewRouter = require("./reviewRoutes");

restaurantRouter.use("/:restaurantId/reviews", reviewRouter);
restaurantRouter
  .route("/")
  .get(restaurantController.getAllRestaurants)
  .post(restaurantController.postRestaurant);
restaurantRouter
  .route("/:id")
  .get(restaurantController.getRestaurant)
  .delete(restaurantController.deleteRestaurant)
  .patch(restaurantController.updateRestaurant);

module.exports = restaurantRouter;
