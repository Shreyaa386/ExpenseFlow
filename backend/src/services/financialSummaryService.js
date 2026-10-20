const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const User = require("../models/User");
const { evaluateBudgetUsage } = require("../utils/budgetAlertHelper");

/**
 * Calculates authoritative financial statistics for the authenticated user.
 * Strictly calculates all numbers in trusted backend code before Gemini is invoked.
 */
async function getAuthoritativeFinancialSummary(userId) {
  const now = new Date();

  // Current calendar month boundaries
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Previous calendar month boundaries
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  // User profile details for goals and currency
  const user = await User.findById(userId).select("name currency monthlyIncome monthlySavingGoal");
  const currency = user?.currency || "INR";
  const monthlySavingGoal = Number(user?.monthlySavingGoal) || 0;
  const targetMonthlyIncome = Number(user?.monthlyIncome) || 0;

  // 1. Current Month Inflow & Outflow
  const currentMonthAgg = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: currentMonthStart, $lte: currentMonthEnd },
      },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  let currentIncome = 0;
  let currentExpense = 0;
  let currentTxCount = 0;

  currentMonthAgg.forEach((item) => {
    if (item._id === "income") currentIncome = item.total;
    if (item._id === "expense") currentExpense = item.total;
    currentTxCount += item.count;
  });

  currentIncome = Math.round(currentIncome * 100) / 100;
  currentExpense = Math.round(currentExpense * 100) / 100;
  const currentSavings = Math.round((currentIncome - currentExpense) * 100) / 100;
  const savingsRatePct =
    currentIncome > 0
      ? Math.max(0, Math.round(((currentIncome - currentExpense) / currentIncome) * 100))
      : 0;

  // 2. Previous Month Inflow & Outflow
  const prevMonthAgg = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: prevMonthStart, $lte: prevMonthEnd },
      },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  let prevIncome = 0;
  let prevExpense = 0;
  let prevTxCount = 0;

  prevMonthAgg.forEach((item) => {
    if (item._id === "income") prevIncome = item.total;
    if (item._id === "expense") prevExpense = item.total;
    prevTxCount += item.count;
  });

  prevIncome = Math.round(prevIncome * 100) / 100;
  prevExpense = Math.round(prevExpense * 100) / 100;
  const prevSavings = Math.round((prevIncome - prevExpense) * 100) / 100;

  // Comparison metrics
  const expenseDiff = Math.round((currentExpense - prevExpense) * 100) / 100;
  const expenseChangePct =
    prevExpense > 0
      ? Math.round(((currentExpense - prevExpense) / prevExpense) * 100)
      : null;

  const hasSufficientComparisonData = prevTxCount > 0;

  // 3. Current Month Category Breakdown
  const currentCategoryAgg = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: "expense",
        date: { $gte: currentMonthStart, $lte: currentMonthEnd },
      },
    },
    {
      $group: {
        _id: "$category",
        amount: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { amount: -1 } },
  ]);

  // 4. Previous Month Category Breakdown
  const prevCategoryAgg = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: "expense",
        date: { $gte: prevMonthStart, $lte: prevMonthEnd },
      },
    },
    {
      $group: {
        _id: "$category",
        amount: { $sum: "$amount" },
      },
    },
  ]);

  const prevCategoryMap = new Map();
  prevCategoryAgg.forEach((c) => {
    prevCategoryMap.set(c._id, c.amount);
  });

  const categories = currentCategoryAgg.map((c) => {
    const currentCatAmount = Math.round(c.amount * 100) / 100;
    const prevCatAmount = prevCategoryMap.get(c._id)
      ? Math.round(prevCategoryMap.get(c._id) * 100) / 100
      : 0;

    const diff = Math.round((currentCatAmount - prevCatAmount) * 100) / 100;
    const changePct =
      prevCatAmount > 0
        ? Math.round(((currentCatAmount - prevCatAmount) / prevCatAmount) * 100)
        : null;

    const shareOfTotalPct =
      currentExpense > 0
        ? Math.round((currentCatAmount / currentExpense) * 100)
        : 0;

    return {
      category: c._id,
      amount: currentCatAmount,
      prevAmount: prevCatAmount,
      diff,
      changePct,
      shareOfTotalPct,
      count: c.count,
    };
  });

  // 5. Budgets Evaluation
  const activeBudgets = await Budget.find({ user: userId, active: true });
  const evaluatedBudgets = await Promise.all(
    activeBudgets.map(async (b) => {
      const usage = await evaluateBudgetUsage(b, userId);
      return {
        id: b._id,
        name: b.name,
        category: b.category,
        period: b.period,
        amount: b.amount,
        spent: usage.spent,
        remaining: usage.remaining,
        percentage: usage.percentage,
        isExceeded: usage.isExceeded,
      };
    })
  );

  const totalBudgeted = evaluatedBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalBudgetSpent = evaluatedBudgets.reduce((sum, b) => sum + b.spent, 0);
  const overallBudgetPercentage =
    totalBudgeted > 0 ? Math.round((totalBudgetSpent / totalBudgeted) * 100) : 0;

  // 6. Savings Goal Progress
  const savingsProgressPct =
    monthlySavingGoal > 0
      ? Math.min(200, Math.round((currentSavings / monthlySavingGoal) * 100))
      : 0;

  // 7. Recent 6-Month Trend
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const trendAgg = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const trends = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yr = d.getFullYear();
    const m = d.getMonth() + 1;
    const inc = trendAgg.find((t) => t._id.year === yr && t._id.month === m && t._id.type === "income")?.total || 0;
    const exp = trendAgg.find((t) => t._id.year === yr && t._id.month === m && t._id.type === "expense")?.total || 0;
    trends.push({
      label: `${monthNames[m - 1]} ${yr}`,
      income: Math.round(inc * 100) / 100,
      expense: Math.round(exp * 100) / 100,
    });
  }

  // 8. Recent 8 transactions for context (strictly financial metadata: title, amount, type, category, date)
  const recentTransactions = await Transaction.find({ user: userId })
    .sort({ date: -1, createdAt: -1 })
    .limit(8)
    .select("title amount type category date account");

  const monthLabel = now.toLocaleString("en-US", { month: "long", year: "numeric" });
  const prevMonthLabel = new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return {
    currency,
    currentMonth: {
      label: monthLabel,
      income: currentIncome,
      expense: currentExpense,
      savings: currentSavings,
      savingsRatePct,
      transactionCount: currentTxCount,
    },
    previousMonth: {
      label: prevMonthLabel,
      income: prevIncome,
      expense: prevExpense,
      savings: prevSavings,
      transactionCount: prevTxCount,
    },
    comparison: {
      expenseDiff,
      expenseChangePct,
      hasSufficientComparisonData,
    },
    categories,
    budgets: {
      totalBudgeted: Math.round(totalBudgeted * 100) / 100,
      totalSpent: Math.round(totalBudgetSpent * 100) / 100,
      overallPercentage: overallBudgetPercentage,
      list: evaluatedBudgets,
    },
    savingsGoal: {
      monthlyTarget: monthlySavingGoal,
      targetMonthlyIncome,
      currentSaved: currentSavings,
      progressPct: savingsProgressPct,
      achieved: monthlySavingGoal > 0 && currentSavings >= monthlySavingGoal,
    },
    trends,
    recentTransactions: recentTransactions.map((t) => ({
      title: t.title,
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: t.date ? new Date(t.date).toISOString().split("T")[0] : "",
      account: t.account,
    })),
  };
}

module.exports = {
  getAuthoritativeFinancialSummary,
};
