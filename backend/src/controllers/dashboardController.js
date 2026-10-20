const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const SplitExpense = require("../models/SplitExpense");
const Notification = require("../models/Notification");
const { evaluateBudgetUsage } = require("../utils/budgetAlertHelper");

const getDashboard = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;

    // Date range filter for period summary
    let dateFilter = {};
    const now = new Date();

    if (startDate && endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: end,
        },
      };
    } else if (period === "month") {
      dateFilter = {
        date: {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
        },
      };
    } else if (period === "30days") {
      dateFilter = {
        date: {
          $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        },
      };
    } else if (period === "year") {
      dateFilter = {
        date: {
          $gte: new Date(now.getFullYear(), 0, 1),
        },
      };
    }

    // ==========================
    // Total Income (respecting period filter)
    // ==========================
    const totalIncome = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "income",
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    // ==========================
    // Total Expense (respecting period filter)
    // ==========================
    const totalExpense = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "expense",
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const income = totalIncome[0]?.total || 0;
    const expense = totalExpense[0]?.total || 0;
    const balance = income - expense;

    // ==========================
    // Recent Transactions
    // ==========================
    const recentTransactions = await Transaction.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // ==========================
    // Current Calendar Month Baseline
    // ==========================
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const monthlyIncome = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "income",
          date: {
            $gte: startOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const monthlyExpense = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "expense",
          date: {
            $gte: startOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    // ==========================
    // Income vs Expense Chart (Current Year)
    // ==========================
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const monthlyChart = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: startOfYear,
          },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$date",
            },
            type: "$type",
          },
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = months.map((month, index) => {
      const inc =
        monthlyChart.find(
          (item) =>
            item._id.month === index + 1 &&
            item._id.type === "income"
        )?.total || 0;

      const exp =
        monthlyChart.find(
          (item) =>
            item._id.month === index + 1 &&
            item._id.type === "expense"
        )?.total || 0;

      return {
        month,
        income: inc,
        expense: exp,
      };
    });

    // ==========================
    // Expense By Category (respecting period filter if provided)
    // ==========================
    const categoryData = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "expense",
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: "$category",
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          amount: 1,
        },
      },
      {
        $sort: {
          amount: -1,
        },
      },
    ]);

    // ==========================
    // Budget Summary & Threshold Warnings
    // ==========================
    const userBudgets = await Budget.find({ user: req.user._id, active: true });
    const evaluatedBudgets = await Promise.all(
      userBudgets.map(async (b) => {
        const usage = await evaluateBudgetUsage(b, req.user._id);
        return {
          ...b.toObject(),
          ...usage,
        };
      })
    );

    const totalBudgeted = evaluatedBudgets.reduce((sum, b) => sum + b.amount, 0);
    const totalBudgetSpent = evaluatedBudgets.reduce((sum, b) => sum + b.spent, 0);
    const totalBudgetRemaining = Math.max(0, totalBudgeted - totalBudgetSpent);
    const overallBudgetPercentage =
      totalBudgeted > 0 ? Math.round((totalBudgetSpent / totalBudgeted) * 100) : 0;

    const thresholdWarnings = evaluatedBudgets.filter(
      (b) => b.isExceeded || b.percentage >= 80
    );

    // ==========================
    // Split Expenses Summary
    // ==========================
    const userEmail = req.user.email ? req.user.email.toLowerCase() : "";
    const activeSplits = await SplitExpense.find({
      status: "active",
      $or: [
        { creator: req.user._id },
        { "participants.userId": req.user._id },
        { "participants.email": userEmail },
      ],
    }).sort({ date: -1 });

    let totalOwedToUser = 0;
    let totalUserOwes = 0;

    activeSplits.forEach((split) => {
      const userPart = split.participants.find(
        (p) =>
          (p.userId && String(p.userId) === String(req.user._id)) ||
          (p.email && p.email.toLowerCase() === userEmail) ||
          p.isCreator
      );
      if (userPart) {
        if (userPart.netBalance > 0.01) {
          totalOwedToUser += userPart.netBalance;
        } else if (userPart.netBalance < -0.01) {
          totalUserOwes += Math.abs(userPart.netBalance);
        }
      }
    });

    // ==========================
    // Recent Notifications
    // ==========================
    const recentNotifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const unreadNotificationCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    return res.status(200).json({
      success: true,
      data: {
        totalIncome: income,
        totalExpense: expense,
        balance,
        monthlyIncome: monthlyIncome[0]?.total || 0,
        monthlyExpense: monthlyExpense[0]?.total || 0,
        recentTransactions,
        chartData,
        categoryData,
        filter: {
          period: period || "all",
        },
        budgetSummary: {
          totalBudgeted: Math.round(totalBudgeted * 100) / 100,
          totalSpent: Math.round(totalBudgetSpent * 100) / 100,
          totalRemaining: Math.round(totalBudgetRemaining * 100) / 100,
          overallPercentage: overallBudgetPercentage,
          activeBudgets: evaluatedBudgets,
          thresholdWarnings,
        },
        splitSummary: {
          totalOwedToUser: Math.round(totalOwedToUser * 100) / 100,
          totalUserOwes: Math.round(totalUserOwes * 100) / 100,
          netBalance: Math.round((totalOwedToUser - totalUserOwes) * 100) / 100,
          activeCount: activeSplits.length,
          recentSplits: activeSplits.slice(0, 3),
        },
        notifications: {
          recent: recentNotifications,
          unreadCount: unreadNotificationCount,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};