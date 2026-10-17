const Category = require("../models/Category");
const Transaction = require("../models/Transaction");

const defaultCategories = [
  { name: "Food", type: "Expense", icon: "Utensils", color: "text-orange-400", bg: "bg-orange-500/15" },
  { name: "Travel", type: "Expense", icon: "Car", color: "text-blue-400", bg: "bg-blue-500/15" },
  { name: "Shopping", type: "Expense", icon: "ShoppingBag", color: "text-pink-400", bg: "bg-pink-500/15" },
  { name: "Health", type: "Expense", icon: "HeartPulse", color: "text-red-400", bg: "bg-red-500/15" },
  { name: "Home", type: "Expense", icon: "Home", color: "text-emerald-400", bg: "bg-emerald-500/15" },
  { name: "Bills", type: "Expense", icon: "Receipt", color: "text-rose-400", bg: "bg-rose-500/15" },
  { name: "Entertainment", type: "Expense", icon: "Gamepad2", color: "text-yellow-400", bg: "bg-yellow-500/15" },
  { name: "Salary", type: "Income", icon: "Briefcase", color: "text-violet-400", bg: "bg-violet-500/15" },
  { name: "Freelancing", type: "Income", icon: "Wallet", color: "text-teal-400", bg: "bg-teal-500/15" },
  { name: "Investment", type: "Income", icon: "Landmark", color: "text-indigo-400", bg: "bg-indigo-500/15" },
];

// ==========================
// Get All Categories
// ==========================
const getCategories = async (req, res) => {
  try {
    let categories = await Category.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Seed defaults if user has no categories yet
    if (categories.length === 0) {
      const seeded = defaultCategories.map((c) => ({
        ...c,
        user: req.user._id,
      }));
      categories = await Category.insertMany(seeded);
    }

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Create Category
// ==========================
const createCategory = async (req, res) => {
  try {
    const { name, type, icon, color, bg } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const normalizedName = name.trim();
    const normalizedType =
      type && type.toLowerCase() === "income" ? "Income" : "Expense";

    // Check for existing duplicate category for this user
    const existing = await Category.findOne({
      user: req.user._id,
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Category "${normalizedName}" already exists.`,
      });
    }

    const category = await Category.create({
      name: normalizedName,
      type: normalizedType,
      icon: icon || "Wallet",
      color: color || "text-teal-400",
      bg: bg || "bg-teal-500/15",
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Category
// ==========================
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, icon, color, bg } = req.body;

    const category = await Category.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const oldName = category.name;
    const newName = name ? name.trim() : oldName;
    const newType =
      type ? (type.toLowerCase() === "income" ? "Income" : "Expense") : category.type;

    // Check duplicate name if renamed
    if (newName.toLowerCase() !== oldName.toLowerCase()) {
      const duplicate = await Category.findOne({
        user: req.user._id,
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${newName}$`, "i") },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `Category "${newName}" already exists.`,
        });
      }
    }

    category.name = newName;
    category.type = newType;
    if (icon) category.icon = icon;
    if (color) category.color = color;
    if (bg) category.bg = bg;

    await category.save();

    // If category name was updated, synchronize any existing transactions using old category name
    if (oldName !== newName) {
      await Transaction.updateMany(
        { user: req.user._id, category: oldName },
        { category: newName }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete Category (Safe Deletion Policy)
// ==========================
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // SAFE DELETION POLICY: Prevent deletion if active transactions depend on it
    const activeTransactionsCount = await Transaction.countDocuments({
      user: req.user._id,
      category: category.name,
    });

    if (activeTransactionsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category "${category.name}" because ${activeTransactionsCount} transaction(s) are assigned to it. Reassign or delete those transactions first to protect historical ledger integrity.`,
        activeTransactionsCount,
      });
    }

    await Category.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
