require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campusGreenDB";

const resetPasswords = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    
    // Admin Reset
    const adminPassword = await bcrypt.hash("admin123", 10);
    await User.findOneAndUpdate(
      { email: "admin@campus.edu" },
      { password: adminPassword, role: "admin" },
      { upsert: true, new: true }
    );
    console.log("Admin account updated: admin@campus.edu / admin123");

    // User Reset
    const userPassword = await bcrypt.hash("user123", 10);
    await User.findOneAndUpdate(
      { email: "rithupavisha.ct23@bitsathy.ac.in" },
      { password: userPassword, role: "user" },
      { upsert: true, new: true }
    );
    console.log("User account updated: rithupavisha.ct23@bitsathy.ac.in / user123");

    process.exit(0);
  } catch (err) {
    console.error("Error resetting passwords:", err);
    process.exit(1);
  }
};

resetPasswords();
