const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies; // Get the token from cookies

    if (!token) {
      return new Error("Token is not valid!!!");
    }
    const decodedObj = jwt.verify(token, "DEV@TINDER$790"); // Verify the token using the secret key

    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
};

module.exports = {
  userAuth,
};
