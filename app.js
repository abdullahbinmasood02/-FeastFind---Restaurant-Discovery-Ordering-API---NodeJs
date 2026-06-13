const express = require("express");
const restaurantRouter = require("./routes/restaurantRoutes");
const userRouter = require("./routes/userRoutes");
const globalErrorController = require("./controllers/ErrorController");
const menuItemRouter = require("./routes/menuItemRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const AppError = require("./utils/AppError");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
const sanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");

//startup configs
const app = express();
app.use(express.json());

//security
app.use(helmet());
app.use(xssClean());
app.use(sanitize());
app.use(hpp({ whitelist: ["ratingsAverage", "priceRange", "cuisine"] }));
//limit requests
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests. Please try again later.",
});
app.use("/api", limiter);
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
