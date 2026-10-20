require("dotenv").config();

const config = {
  PORT: process.env.PORT || 5000,

  NODE_ENV: process.env.NODE_ENV || "development",

  MONGODB_URI: process.env.MONGODB_URI || "",

  JWT_SECRET: process.env.JWT_SECRET || "",

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",

  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
};

module.exports = config;