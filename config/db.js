require("dotenv").config();
const mongoose = require("mongoose");
const argon2 = require("argon2");
const envSecrets = require("./index");
const Admin = require("../models/adminModel");

const ensureDefaultAdmin = async () => {
  const email = "admin@yopmail.com";
  const password = "Admin@123";

  const exists = await Admin.findOne({ email });
  if (exists) {
    console.log("ℹ️ Admin already exists");
    return;
  }

  const hashedPassword = await argon2.hash(password);

  await Admin.create({
    email,
    password: hashedPassword,
    role: "ADMIN",
    isVerified: true,
  });

  console.log("✅ Default admin created");
};

const connectDatabase = async () => {
  try {
    if (!envSecrets.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const connection = await mongoose.connect(envSecrets.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: "majority",
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    console.log(
      `✅ Database connected on ${connection.connection.host}:${connection.connection.port}`,
    );

    // 🔐 ensure admin AFTER db connection
    await ensureDefaultAdmin();

    return connection;
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
