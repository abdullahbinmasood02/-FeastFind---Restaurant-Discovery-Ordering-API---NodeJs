const AppError = require("../utils/AppError");

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

function handleDuplicateErrorDb(err) {
  let message = `Duplicate value: ${Object.values(err.keyValue)[0]} for  ${Object.keys(err.keyValue)[0]} provided!`;
  return new AppError(message, 400);
}

function handleValErrorDb(err) {
  const errors = Object.values(err.errors);

  let message = "";

  errors.forEach((error) => (message += error.message + ". "));
  message = message.trim();

  return new AppError(message, 400);
}

function handleCastErrorDb(err) {
  return new AppError(
    `invalid value ${err.value} for path ${err.path} provided`,
    400,
  );
}

function sendErrorProd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went very wrong!",
    });
  }
}

function handleJwtError(err) {
  return new AppError("Token is malformed. Please try again", 400);
}

function handleJwtExpiredError(err) {
  return new AppError("Token has expired. Please login again", 400);
}

function globalErrorController(err, req, res, next) {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;
  let error = "";

  if (process.env.NODE_ENV === "dev") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "prod") {
    if (err.name === "CastError") error = handleCastErrorDb(err);
    else if (err.name === "ValidationError") error = handleValErrorDb(err);
    else if (err.code === 11000) error = handleDuplicateErrorDb(err);
    else if (err.name === "JsonWebTokenError") error = handleJwtError(err);
    else if (err.name === "TokenExpiredError")
      error = handleJwtExpiredError(err);

    sendErrorProd(error || err, res);
  }
}

module.exports = globalErrorController;
