const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { promisify } = require("util");
const sendMail = require("../utils/Email");
const crypto = require("crypto");

function generateJwt(id, role) {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
}

function sendResponse(id, role, statusCode, res) {
  const token = generateJwt(id, role);

  res.status(statusCode).json({
    status: "success",
    token,
  });
}

exports.login = catchAsync(async (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;

  const user = await userModel.findOne({ email }).select("+password");
  //check if user exists and password provided is correct
  if (!user || !(await user.isCorrectPassword(password)))
    return next(new AppError("Email or password not correct", 400));

  //if correct credentials, then generate token and send it as response
  sendResponse(user._id, user.role, 201, res);
});

exports.signup = catchAsync(async (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  const name = req.body.name;
  const passwordConfirm = req.body.passwordConfirm;

  const user = await userModel.create({
    email,
    password,
    name,
    passwordConfirm,
  });

  sendResponse(user._id, user.role, 201, res);
});

exports.restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("You are not authorized for this operation"));
    next();
  };
};

exports.protect = catchAsync(async (req, res, next) => {
  //check token existence
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) return next(new AppError("Token not provided", 400));

  //check token validity
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  if (!decoded)
    return next(new AppError("invalid token. Please login again", 400));

  //check if user still exists

  const user = await userModel.findById(decoded.id);

  if (!user)
    return next(new AppError("User with this token no longer exists", 400));

  //check if password was changed after token was sent

  if (user.changedPasswordAfter(decoded.iat))
    return next(new AppError("Password was changed. Please login again", 400));

  //if everything passes then add user to request  for future use and call next
  req.user = user;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //verify credentials
  const email = req?.body?.email;

  if (!email) return next(new AppError("Email not provided", 400));

  const user = await userModel.findOne({ email });

  if (!user)
    return next(new AppError("User with this email does not exist", 400));

  const token = user.generatePasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${token}`;

  try {
    await sendMail({
      receiver: user.email,
      subject: "Your Password Reset Token",
      message: `forgot your password? Reset it through this link (valid for 10 mins): ${resetUrl}`,
    });
    res.status(201).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("Could not send reset token. Please try again later", 500),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const token = req.params.token;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // check if user with this token exists and token is within valid time range
  const user = await userModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user)
    return next(
      new AppError("Token has expired or user does not exist with this token"),
    );

  //if token is valid then reset the password

  const password = req.body.passwordNew;
  const passwordConfirm = req.body.passwordConfirm;

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendResponse(user._id, user.role, 201, res);
});
