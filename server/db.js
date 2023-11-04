const mongoose = require("mongoose");

const connectToMongoose = async () => {
  try {
    await mongoose
      .connect(process.env.DATABASE_URL)
      .then(() => console.log("DB connect successfully"));
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectToMongoose;
