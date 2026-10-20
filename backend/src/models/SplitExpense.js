const mongoose = require("mongoose");

const settlementSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
      trim: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { _id: true, timestamps: true }
);

const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    isCreator: {
      type: Boolean,
      default: false,
    },
    shareAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Net balance: positive means they are owed money, negative means they owe money
    netBalance: {
      type: Number,
      default: 0,
    },
    settled: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const splitExpenseSchema = new mongoose.Schema(
  {
    creator: {
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
    totalAmount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    splitType: {
      type: String,
      enum: ["equal", "custom"],
      default: "equal",
    },
    paidBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
      },
      isCreator: {
        type: Boolean,
        default: true,
      },
    },
    participants: {
      type: [participantSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length >= 2;
        },
        message: "A split expense must have at least 2 participants.",
      },
    },
    settlements: {
      type: [settlementSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "settled"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

splitExpenseSchema.index({ creator: 1, status: 1, date: -1 });

module.exports = mongoose.model("SplitExpense", splitExpenseSchema);
