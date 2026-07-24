const Transaction = require("../models/Transaction");

const getDashboard = async (req, res) => {
  try {
    // ==========================
    // Total Income
    // ==========================
    const totalIncome = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "income",
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
    // Total Expense
    // ==========================
    const totalExpense = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "expense",
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
    // Current Month
    // ==========================
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    // ==========================
    // Monthly Income
    // ==========================
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

    // ==========================
    // Monthly Expense
    // ==========================
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
    // Income vs Expense Chart
    // ==========================
    const monthlyChart = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
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
      const income =
        monthlyChart.find(
          (item) =>
            item._id.month === index + 1 &&
            item._id.type === "income"
        )?.total || 0;

      const expense =
        monthlyChart.find(
          (item) =>
            item._id.month === index + 1 &&
            item._id.type === "expense"
        )?.total || 0;

      return {
        month,
        income,
        expense,
      };
    });

    // ==========================
    // Expense By Category
    // ==========================
    const categoryData = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "expense",
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

    res.status(200).json({
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
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};