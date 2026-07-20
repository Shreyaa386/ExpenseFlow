const Transaction = require("../models/Transaction");

const getDashboard = async (req, res) => {
  try {
    // Total Income
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

    // Total Expense
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

    // Balance
    const balance = income - expense;

    res.status(200).json({
      success: true,
      data: {
        totalIncome: income,
        totalExpense: expense,
        balance,
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