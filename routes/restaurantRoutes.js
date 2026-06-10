const restaurantController = require("../controllers/restaurant");
const express = require("express");
const restaurantRouter = express.Router();

restaurantRouter.route("/").post(restaurantController.postRestaurant);
restaurantRouter.route("/:id").get(restaurantController.getRestaurant);

module.exports = restaurantRouter;
