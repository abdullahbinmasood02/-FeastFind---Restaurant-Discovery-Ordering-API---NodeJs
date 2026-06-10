const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    min: 2,
    max: 30,
    required: [true, "please enter your name"],
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    lowercase: true,
    validate: validator.isEmail,
  },
  role: {
    type: String,
    enum: ["customer", "owner", "delivery-agent", "admin"],
    default: ["customer"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    min: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function () {
        return this.password === this.passwordConfirm;
      },
      message: "Passwords do not match",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
  },
  deliveryAddress: {
    type: { type: "String", default: "Point", enum: ["Point"] },
    coordinates: [Number],
    address: String,
    description: String,
  },
});

//pre middlewares

//encrypt the password before storing to db
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  const hashedPassword = bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  this.passwordChangedAt = Date.now();
  this.passwordConfirm = undefined;
  next();
});

//filter out inactive users
userSchema.pre(/^find/, function (next) {
  this.where({ isActive: { $ne: false } });
  next();
});

//instance methods
userSchema.methods.isCorrectPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//method to check if password was changed after jwt was issued, returns true if yes
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  const jwtMs = jwtTimestamp * 1000;
  return this.passwordChangedAt.getTime() > jwtMs;
};

userSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(32);
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  this.passwordResetToken = hashedToken; //store hashed token in db
  this.passwordResetExpires = Date.now() * 10 * 60 * 100; // expire token in 10mins
  return token; //return the unencrypted token
};

const userModel = mongoose.model("users", userSchema);
module.exports = userModels;
