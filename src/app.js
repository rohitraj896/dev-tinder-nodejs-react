const express = require("express");
const connectDB = require("./config/database");
const app = express();

const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

// post sign user

app.post("/signup", async (req, res) => {
  // validation of data

  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
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

    const user = User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Email id is not present in db");
    }
    const isPasswordValid = bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("User login successful");
    } else {
      throw new Error("password is not correct");
    }
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});
// get user
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    // const users = await User.find({ emailId: userEmail });
    const users = await User.findOne({ emailId: userEmail });
    res.send(users);
    // if (users.length === 0) {
    //   res.status(400).send("user not found");
    // }
    // res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// delete user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);

    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// update user

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every(k =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills can not be more than 10");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    throw new Error("Update not allowed");
  }
});
// feed all user

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
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
