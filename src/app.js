const express = require("express");
const connectDB = require("./config/database");
const app = express();

const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
app.use(express.json());
app.use(cookieParser());
// post sign user

app.post("/signup", async (req, res) => {
  // validation of data

  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

// login user

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Email id is not present in db");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // create jwt token
      const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$790", {
        expiresIn: "0d",
      });
      res.cookie("token", token, {
        expires: new Date(Date().now + 8 * 3600000),
      });
      res.send("User login successful");
    } else {
      throw new Error("password is not correct");
    }
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  console.log("Sending connection request");
  res.send("Connection request sent " + user.firstName);
});

connectDB()
  .then(() => {
    console.log("Database connection established....");
    app.listen(7777, () => {
      console.log("server is running on port 3000");
    });
  })

  .catch(err => {
    console.error("Database cannot be connected");
  });
