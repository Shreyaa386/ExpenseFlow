const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "en",
    },

    currency: {
      type: String,
      default: "INR",
    },

    theme: {
      type: String,
      default: "light",
    },

    monthlyIncome: {
      type: Number,
      default: 0,
    },

    monthlySavingGoal: {
      type: Number,
      default: 0,
    },

    accounts: {
      type: [accountSchema],
      default: [
        {
          name: "Cash",
          balance: 0,
        },
      ],
    },

    refreshToken: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

module.exports = mongoose.model("User", userSchema);