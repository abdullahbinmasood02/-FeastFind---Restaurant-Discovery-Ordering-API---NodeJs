const express = require("express");
const restaurantRouter = require("./routes/restaurantRoutes");
const userRouter = require("./routes/userRoutes");
const globalErrorController = require("./controllers/ErrorController");
const menuItemRouter = require("./routes/menuItemRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const AppError = require("./utils/AppError");

//startup configs
const app = express();
app.use(express.json());

//routers
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/menuItems", menuItemRouter);
app.use("/api/v1/reviews", reviewRouter);

//invalid route handler
app.all("*", function (req, res, next) {
  next(new AppError("Route not found on this server", 404));
});

//error handler
app.use(globalErrorController);

module.exports = app;
