const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    // "mongodb+srv://rohitkr3390:HbgKMzv6EId0ReXU@cluster0.hdi6p.mongodb.net/"
    "mongodb+srv://rohitkr3390:HbgKMzv6EId0ReXU@cluster0.hdi6p.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
