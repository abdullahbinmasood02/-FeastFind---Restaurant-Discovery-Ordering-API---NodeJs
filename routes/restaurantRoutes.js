const restaurantController = require("../controllers/restaurantController");
const express = require("express");
const restaurantRouter = express.Router();
const reviewRouter = require("./reviewRoutes");
const authController = require("../controllers/authController");

restaurantRouter
  .route("/within/:distance/center/:latlng/unit/:unit")
  .get(restaurantController.restaurantsWithin);
restaurantRouter
  .route("/distances/:latlng/unit/:unit")
  .get(restaurantController.restaurantsNear);
restaurantRouter.use("/:restaurantId/reviews", reviewRouter);
restaurantRouter
  .route("/")
  .get(restaurantController.getAllRestaurants)
  .post(
    authController.protect,
    authController.restrictTo("owner", "admin"),
    restaurantController.postRestaurant,
  );

restaurantRouter.use(authController.protect);

restaurantRouter
  .route("/:id")
  .get(restaurantController.getRestaurant)
  .delete(
    authController.restrictTo("admin"),
    restaurantController.deleteRestaurant,
  )
  .patch(
    authController.restrictTo("admin", "owner"),
    restaurantController.updateRestaurant,
  );

module.exports = restaurantRouter;
