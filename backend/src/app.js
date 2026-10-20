const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const config = require("./config/env");

// Routes
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const splitExpenseRoutes = require("./routes/splitExpenseRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// ==============================
// Middlewares
// ==============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  config.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin) || config.NODE_ENV === "development") {
        return callback(null, true);
      }
      return callback(null, origin);
    },
    credentials: true,
  })
);

// ==============================
// API Routes
// ==============================

// Health Check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ExpenseFlow API is running successfully 🚀",
    environment: config.NODE_ENV,
    version: "v1",
  });
});

// Authentication
app.use("/api/v1/auth", authRoutes);

// Users
app.use("/api/v1/users", userRoutes);

// Transactions
app.use("/api/v1/transactions", transactionRoutes);

// Dashboard
app.use("/api/v1/dashboard", dashboardRoutes);

// Categories
app.use("/api/v1/categories", categoryRoutes);

// Budgets
app.use("/api/v1/budgets", budgetRoutes);

// Split Expenses
app.use("/api/v1/splits", splitExpenseRoutes);

// Notifications
app.use("/api/v1/notifications", notificationRoutes);

// Gemini AI Financial Insights & Conversational Assistant
app.use("/api/v1/ai", aiRoutes);

// ==============================
// 404 Route
// ==============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

module.exports = app;