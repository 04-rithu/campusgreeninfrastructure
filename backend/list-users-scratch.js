require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campusGreenDB";

const listUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const users = await User.find({}, 'name email role');
    console.log("Existing Users:");
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("Error listing users:", err);
    process.exit(1);
  }
};

listUsers();
