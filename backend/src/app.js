const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const config = require("./config/env");

// Routes
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ==============================
// Middlewares
// ==============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  })
);

// ==============================
// Routes
// ==============================

// Health Check Route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ExpenseFlow API is running successfully 🚀",
    environment: config.NODE_ENV,
    version: "v1",
  });
});

// Authentication Routes
app.use("/api/v1/auth", authRoutes);

// Transaction Routes
app.use("/api/v1/transactions", transactionRoutes);

// Dashboard Routes
app.use("/api/v1/dashboard", dashboardRoutes);

module.exports = app;