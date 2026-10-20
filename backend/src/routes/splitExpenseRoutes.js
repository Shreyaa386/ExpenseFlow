const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getSplitExpenses,
  createSplitExpense,
  recordSettlement,
  deleteSplitExpense,
} = require("../controllers/splitExpenseController");

router.use(protect);

router.get("/", getSplitExpenses);
router.post("/", createSplitExpense);
router.post("/:id/settle", recordSettlement);
router.delete("/:id", deleteSplitExpense);

module.exports = router;
