const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.set("strictQuery", true).connect(process.env.MONGO_URI);
};

module.exports = connectDB;
