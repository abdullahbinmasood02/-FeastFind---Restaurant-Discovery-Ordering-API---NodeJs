const express = require("express");
const restaurantRouter = require("./routes/restaurantRoutes");
const globalErrorController = require("./controllers/ErrorController");
const AppError = require("./utils/AppError");

const app = express();
app.use(express.json());

app.use("/api/v1/restaurants", restaurantRouter);

app.all("*", function (req, res, next) {
  next(new AppError("Route not found on this server", 404));
});

app.use(globalErrorController);

module.exports = app;
