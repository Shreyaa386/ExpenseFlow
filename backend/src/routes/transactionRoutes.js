const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addTransaction,
} = require("../controllers/transactionController");

// Protected Route
router.post("/", protect, addTransaction);

module.exports = router;