const restaurantController = require("../controllers/restaurant");
const express = require("express");
const restaurantRouter = express.Router();

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
