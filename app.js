const express = require("express");
const restaurantRouter = require("./routes/restaurantRoutes");

const app = express();
app.use(express.json());

app.use("/api/v1/restaurants", restaurantRouter);

module.exports = app;
