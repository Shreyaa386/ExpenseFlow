const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["warning", "danger", "info", "success"],
      default: "info",
    },
    category: {
      type: String,
      enum: ["budget", "split", "system", "transaction"],
      default: "system",
    },
    metadata: {
      budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Budget",
      },
      splitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SplitExpense",
      },
      transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
      budgetName: String,
      categoryName: String,
      period: String,
      threshold: Number,
      spent: Number,
      limit: Number,
      remaining: Number,
      percentage: Number,
      overAmount: Number,
      periodKey: String,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes to quickly query notifications by user, read status, and category
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ user: 1, category: 1, createdAt: -1 });
notificationSchema.index({
  user: 1,
  "metadata.budgetId": 1,
  "metadata.periodKey": 1,
  "metadata.threshold": 1,
});

module.exports = mongoose.model("Notification", notificationSchema);

