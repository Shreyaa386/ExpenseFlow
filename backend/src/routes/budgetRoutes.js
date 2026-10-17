const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getBudgets,
  createBudget,
  updateBudget,
  toggleBudget,
  deleteBudget,
} = require("../controllers/budgetController");

router.use(protect);

router.get("/", getBudgets);
router.post("/", createBudget);
router.put("/:id", updateBudget);
router.patch("/:id/toggle", toggleBudget);
router.delete("/:id", deleteBudget);

module.exports = router;
