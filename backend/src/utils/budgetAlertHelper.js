const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const User = require("../models/User");

/**
 * Returns startDate, endDate, and periodKey for weekly or monthly budgets
 */
function getPeriodBoundaries(period, refDate = new Date()) {
  const date = new Date(refDate);

  if (period === "weekly") {
    // Week starting Monday
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // Monday offset
    const startDate = new Date(date);
    startDate.setDate(date.getDate() + diff);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    // Calculate ISO Week
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    const weekNumber = 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
    const periodKey = `${tempDate.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;

    return { startDate, endDate, periodKey };
  }

  // Monthly
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  const periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

  return { startDate, endDate, periodKey };
}

/**
 * Evaluates spending for a specific budget and returns calculated stats
 */
async function evaluateBudgetUsage(budget, userId) {
  const { startDate, endDate, periodKey } = getPeriodBoundaries(budget.period);

  const matchFilter = {
    user: userId,
    type: "expense",
    date: { $gte: startDate, $lte: endDate },
  };

  if (budget.category && budget.category.toLowerCase() !== "all") {
    matchFilter.category = budget.category;
  }

  const spendAgg = await Transaction.aggregate([
    { $match: matchFilter },
    { $group: { _id: null, totalSpent: { $sum: "$amount" } } },
  ]);

  const spent = Math.round((spendAgg[0]?.totalSpent || 0) * 100) / 100;
  const remaining = Math.max(0, Math.round((budget.amount - spent) * 100) / 100);
  const percentage = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;
  const isExceeded = spent > budget.amount;

  return {
    spent,
    remaining,
    percentage,
    isExceeded,
    startDate,
    endDate,
    periodKey,
  };
}

/**
 * Checks all active budgets for a user, evaluates thresholds, and generates notifications
 */
async function checkBudgetThresholds(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Check if user has budget alerts enabled in preferences
    const alertsAllowed = user.notifications?.budgetAlerts !== false;

    const budgets = await Budget.find({ user: userId, active: true });

    for (const budget of budgets) {
      const usage = await evaluateBudgetUsage(budget, userId);
      const thresholds = Array.isArray(budget.thresholds)
        ? [...budget.thresholds].sort((a, b) => a - b)
        : [50, 75, 90, 100];

      let updated = false;
      const categoryLabel =
        budget.category && budget.category.toLowerCase() !== "all"
          ? budget.category
          : "overall";

      // 1. Check configured percentage thresholds (50%, 75%, 90%, 100%)
      for (const threshold of thresholds) {
        if (usage.percentage >= threshold) {
          // Check if already recorded in budget.notifiedThresholds
          const alreadyRecorded = budget.notifiedThresholds?.some(
            (n) => n.periodKey === usage.periodKey && n.threshold === threshold
          );

          // Also double-check DB to prevent any race condition
          const existingNotif = await Notification.findOne({
            user: userId,
            "metadata.budgetId": budget._id,
            "metadata.periodKey": usage.periodKey,
            "metadata.threshold": threshold,
          });

          if (!alreadyRecorded && !existingNotif) {
            if (alertsAllowed) {
              let title = `Budget Alert — ${threshold}% consumed`;
              let message = `You have spent ₹${usage.spent.toLocaleString()} of your ₹${budget.amount.toLocaleString()} ${budget.period} budget for ${categoryLabel}. ₹${usage.remaining.toLocaleString()} remains.`;
              let type = "info";

              if (threshold === 50) {
                title = `Budget Alert — 50% consumed`;
                message = `You have spent ₹${usage.spent.toLocaleString()} of your ₹${budget.amount.toLocaleString()} ${budget.period} budget for ${categoryLabel}. ₹${usage.remaining.toLocaleString()} remains.`;
                type = "info";
              } else if (threshold === 75) {
                title = `Budget Warning — 75% consumed`;
                message = `You have spent ₹${usage.spent.toLocaleString()} of your ₹${budget.amount.toLocaleString()} ${budget.period} budget for ${categoryLabel}. ₹${usage.remaining.toLocaleString()} remains.`;
                type = "warning";
              } else if (threshold === 90) {
                title = `High-Priority Budget Warning — 90% consumed`;
                message = `You have spent ₹${usage.spent.toLocaleString()} of your ₹${budget.amount.toLocaleString()} ${budget.period} budget for ${categoryLabel}. Only ₹${usage.remaining.toLocaleString()} remains.`;
                type = "warning";
              } else if (threshold >= 100) {
                title = `Budget Limit Reached — 100% consumed`;
                message = `You have reached your ${budget.period} ${categoryLabel} budget of ₹${budget.amount.toLocaleString()}.`;
                type = "warning";
              }

              await Notification.create({
                user: userId,
                title,
                message,
                type,
                category: "budget",
                metadata: {
                  budgetId: budget._id,
                  budgetName: budget.name,
                  categoryName: categoryLabel,
                  period: budget.period,
                  threshold,
                  spent: usage.spent,
                  limit: budget.amount,
                  remaining: usage.remaining,
                  percentage: usage.percentage,
                  overAmount: 0,
                  periodKey: usage.periodKey,
                },
              });
            }

            if (!budget.notifiedThresholds) {
              budget.notifiedThresholds = [];
            }
            budget.notifiedThresholds.push({
              periodKey: usage.periodKey,
              threshold,
              notifiedAt: new Date(),
            });

            updated = true;
          }
        }
      }

      // 2. Check for Exceeded Budget (spent > budget.amount, threshold code 101)
      if (usage.spent > budget.amount) {
        const EXCEEDED_THRESHOLD_CODE = 101;
        const alreadyRecordedExceeded = budget.notifiedThresholds?.some(
          (n) =>
            n.periodKey === usage.periodKey &&
            n.threshold === EXCEEDED_THRESHOLD_CODE
        );

        const existingExceededNotif = await Notification.findOne({
          user: userId,
          "metadata.budgetId": budget._id,
          "metadata.periodKey": usage.periodKey,
          "metadata.threshold": EXCEEDED_THRESHOLD_CODE,
        });

        if (!alreadyRecordedExceeded && !existingExceededNotif) {
          const overAmount =
            Math.round((usage.spent - budget.amount) * 100) / 100;

          if (alertsAllowed) {
            await Notification.create({
              user: userId,
              title: "Budget Exceeded",
              message: `Your spending exceeded the ${budget.name} budget by ₹${overAmount.toLocaleString()}. Review your recent transactions.`,
              type: "danger",
              category: "budget",
              metadata: {
                budgetId: budget._id,
                budgetName: budget.name,
                categoryName: categoryLabel,
                period: budget.period,
                threshold: EXCEEDED_THRESHOLD_CODE,
                spent: usage.spent,
                limit: budget.amount,
                remaining: 0,
                percentage: usage.percentage,
                overAmount,
                periodKey: usage.periodKey,
              },
            });
          }

          if (!budget.notifiedThresholds) {
            budget.notifiedThresholds = [];
          }
          budget.notifiedThresholds.push({
            periodKey: usage.periodKey,
            threshold: EXCEEDED_THRESHOLD_CODE,
            notifiedAt: new Date(),
          });

          updated = true;
        }
      }

      if (updated) {
        await budget.save();
      }
    }
  } catch (error) {
    console.error("Error in checkBudgetThresholds:", error);
  }
}

module.exports = {
  getPeriodBoundaries,
  evaluateBudgetUsage,
  checkBudgetThresholds,
};
