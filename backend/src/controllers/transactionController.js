const Transaction = require("../models/Transaction");
const { transactionSchema } = require("../validators/transactionValidator");

// ==========================
// Add Transaction
// ==========================
const addTransaction = async (req, res) => {
  try {
    // Validate request body
    const { error } = transactionSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const {
      title,
      amount,
      type,
      category,
      date,
      note,
      account,
    } = req.body;

    // Create transaction
    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      date,
      note,
      account,
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Transaction added successfully.",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addTransaction,
};