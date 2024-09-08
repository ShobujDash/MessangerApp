const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

   console.log("connect mongodb")
  } catch (error) {
    console.log("Something is wrong ", error);
  }
}

module.exports = connectDB;
