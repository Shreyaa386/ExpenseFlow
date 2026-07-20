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

// Add Transaction
router.post("/", protect, addTransaction);

// Get All Transactions
router.get("/", protect, getAllTransactions);

// Get Transaction By ID
router.get("/:id", protect, getTransactionById);

// Update Transaction
router.put("/:id", protect, updateTransaction);

// Delete Transaction
router.delete("/:id", protect, deleteTransaction);

module.exports = router;