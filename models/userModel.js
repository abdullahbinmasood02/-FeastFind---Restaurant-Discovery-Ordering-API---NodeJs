const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [2, "name cannot be less than 2 characters"],
    max: [30, "name cannot be more than 30 characterss"],
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
    default: "customer",
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minlength: [8, "password cannot be less than 8 characters"],
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
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  this.passwordChangedAt = Date.now();
  this.passwordConfirm = undefined;
});

//filter out inactive users
userSchema.pre(/^find/, function () {
  this.where({ active: { $ne: false } });
});

//instance methods
userSchema.methods.isCorrectPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//method to check if password was changed after jwt was issued, returns true if yes
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  const jwtMs = jwtTimestamp * 1000;
  return this.passwordChangedAt
    ? this.passwordChangedAt.getTime() > jwtMs
    : false;
};

userSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  this.passwordResetToken = hashedToken; //store hashed token in db
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // expire token in 10mins
  return token; //return the unencrypted token
};

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
