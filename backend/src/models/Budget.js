const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    period: {
      type: String,
      enum: ["weekly", "monthly"],
      default: "monthly",
      required: true,
    },
    category: {
      type: String,
      default: "all",
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    thresholds: {
      type: [Number],
      default: [50, 75, 90, 100],
    },
    active: {
      type: Boolean,
      default: true,
    },
    // Track alerts generated per period to avoid duplicates within the same period cycle
    notifiedThresholds: [
      {
        periodKey: {
          type: String, // e.g. "2026-W42" or "2026-10"
          required: true,
        },
        threshold: {
          type: Number,
          required: true,
        },
        notifiedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness per user, period, category
budgetSchema.index({ user: 1, period: 1, category: 1 });

module.exports = mongoose.model("Budget", budgetSchema);
