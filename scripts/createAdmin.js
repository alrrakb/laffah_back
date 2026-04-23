require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminUser = {
      email: "admin@hana.com",
      password: "admin123456",
      role: "admin",
    };

    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const user = await User.create(adminUser);
    console.log("Admin user created successfully:", user.email);
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
