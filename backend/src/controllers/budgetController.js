const Budget = require("../models/Budget");
const {
  evaluateBudgetUsage,
  checkBudgetThresholds,
} = require("../utils/budgetAlertHelper");

// ======================
// GET ALL BUDGETS
// ======================
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    // Evaluate real-time usage for each budget
    const evaluatedBudgets = await Promise.all(
      budgets.map(async (budget) => {
        const usage = await evaluateBudgetUsage(budget, req.user._id);
        return {
          ...budget.toObject(),
          ...usage,
        };
      })
    );

    // Calculate aggregated overview for active monthly/weekly budgets
    const activeBudgets = evaluatedBudgets.filter((b) => b.active);
    const totalBudgeted = activeBudgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = activeBudgets.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = Math.max(0, totalBudgeted - totalSpent);
    const overallPercentage =
      totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        budgets: evaluatedBudgets,
        overview: {
          totalBudgeted: Math.round(totalBudgeted * 100) / 100,
          totalSpent: Math.round(totalSpent * 100) / 100,
          totalRemaining: Math.round(totalRemaining * 100) / 100,
          overallPercentage,
          activeCount: activeBudgets.length,
          exceededCount: activeBudgets.filter((b) => b.isExceeded).length,
        },
      },
    });
  } catch (error) {
    console.error("Get Budgets Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch budgets.",
    });
  }
};

// ======================
// CREATE BUDGET
// ======================
const createBudget = async (req, res) => {
  try {
    const { name, period, category, amount, thresholds } = req.body;

    if (!name || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid budget name and positive limit amount.",
      });
    }

    const budgetPeriod = period === "weekly" ? "weekly" : "monthly";
    const budgetCategory = category ? category.trim() : "all";

    // Prevent duplicate active budget for same period & category
    const existing = await Budget.findOne({
      user: req.user._id,
      period: budgetPeriod,
      category: budgetCategory,
      active: true,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `An active ${budgetPeriod} budget for category "${budgetCategory}" already exists.`,
      });
    }

    const newBudget = await Budget.create({
      user: req.user._id,
      name: name.trim(),
      period: budgetPeriod,
      category: budgetCategory,
      amount: Number(amount),
      thresholds:
        Array.isArray(thresholds) && thresholds.length > 0
          ? thresholds.map(Number)
          : [50, 75, 90, 100],
    });

    // Check thresholds immediately
    await checkBudgetThresholds(req.user._id);

    const usage = await evaluateBudgetUsage(newBudget, req.user._id);

    return res.status(201).json({
      success: true,
      message: "Budget created successfully.",
      data: {
        ...newBudget.toObject(),
        ...usage,
      },
    });
  } catch (error) {
    console.error("Create Budget Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create budget.",
    });
  }
};

// ======================
// UPDATE BUDGET
// ======================
const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, period, category, amount, thresholds, active } = req.body;

    const budget = await Budget.findOne({ _id: id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found.",
      });
    }

    if (name !== undefined) budget.name = name.trim();
    if (period !== undefined)
      budget.period = period === "weekly" ? "weekly" : "monthly";
    if (category !== undefined) budget.category = category.trim();
    if (amount !== undefined) {
      if (Number(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Budget amount must be greater than 0.",
        });
      }
      budget.amount = Number(amount);
    }
    if (Array.isArray(thresholds)) {
      budget.thresholds = thresholds.map(Number);
    }
    if (active !== undefined) budget.active = Boolean(active);

    await budget.save();

    await checkBudgetThresholds(req.user._id);

    const usage = await evaluateBudgetUsage(budget, req.user._id);

    return res.status(200).json({
      success: true,
      message: "Budget updated successfully.",
      data: {
        ...budget.toObject(),
        ...usage,
      },
    });
  } catch (error) {
    console.error("Update Budget Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update budget.",
    });
  }
};

// ======================
// TOGGLE BUDGET STATUS
// ======================
const toggleBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOne({ _id: id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found.",
      });
    }

    budget.active = !budget.active;
    await budget.save();

    return res.status(200).json({
      success: true,
      message: `Budget ${budget.active ? "activated" : "disabled"} successfully.`,
      data: budget,
    });
  } catch (error) {
    console.error("Toggle Budget Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle budget status.",
    });
  }
};

// ======================
// DELETE BUDGET
// ======================
const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Budget deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Budget Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete budget.",
    });
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  toggleBudget,
  deleteBudget,
};
