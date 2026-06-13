const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//injecting env
dotenv.config({
  path: "./config.env",
});

const app = require("./app");

//handling exceptions and unhandled promises
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

//connecting to mongoDB
const DB = process.env.DB.replace("<PASSWORD>", process.env.PASSWORD);
mongoose.connect(DB).then(() => console.log("Database Connected"));

const PORT = process.env.PORT || 3000;

//connecting to server
const server = app.listen(PORT, () =>
  console.log(`server listening at port ${PORT}`),
);
