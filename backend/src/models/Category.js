const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Income", "Expense", "income", "expense"],
      required: true,
    },

    icon: {
      type: String,
      default: "Wallet",
      trim: true,
    },

    color: {
      type: String,
      default: "text-teal-400",
      trim: true,
    },

    bg: {
      type: String,
      default: "bg-teal-500/15",
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate category names for the same user (case-insensitive indexing)
categorySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
