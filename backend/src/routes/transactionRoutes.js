const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

// Create
router.post("/", protect, addTransaction);

// Read All
router.get("/", protect, getAllTransactions);

// Read One
router.get("/:id", protect, getTransactionById);

// Update
router.put("/:id", protect, updateTransaction);

// Delete
router.delete("/:id", protect, deleteTransaction);

module.exports = router;