const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
      minLength: 4,
      maxLength: 50,
    },

    lastName: {
      type: String,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address", value);
        }
      },
    },

    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter strong password", value);
        }
      },
    },

    age: {
      type: Number,
      min: 18,
    },

    gender: {
      type: String,
      enum: ["male", "female", "others"],
      message: `{VALUE} is not a valid gender type`,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid", value);
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://www.w3schools.com/html/pic_trulli.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url", value);
        }
      },
    },
    about: {
      type: String,
      default: "This is default about of the user",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$790", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
