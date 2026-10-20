const Notification = require("../models/Notification");
const { checkBudgetThresholds } = require("../utils/budgetAlertHelper");

// ======================
// GET NOTIFICATIONS (with filter, search, & summary counts)
// ======================
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check budget thresholds promptly so newly crossed thresholds appear
    try {
      await checkBudgetThresholds(userId);
    } catch (checkErr) {
      console.warn("Background budget threshold check note:", checkErr.message);
    }

    const { filter, category, search, limit = 100, page = 1 } = req.query;

    const query = { user: userId };

    // Apply Filter / Category Tabs: "all", "unread", "budget", "transaction", "system"
    const activeFilter = filter || category || "all";

    if (activeFilter === "unread") {
      query.read = false;
    } else if (activeFilter === "budget") {
      query.category = "budget";
    } else if (activeFilter === "transaction") {
      query.category = "transaction";
    } else if (activeFilter === "system") {
      query.category = "system";
    }

    // Apply text search
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { message: searchRegex },
        { "metadata.budgetName": searchRegex },
        { "metadata.categoryName": searchRegex },
      ];
    }

    const parsedLimit = Math.min(200, Math.max(1, parseInt(limit, 10) || 100));
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const [notifications, totalFiltered] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit),
      Notification.countDocuments(query),
    ]);

    // Aggregate Summary Counts for the user's Dashboard Cards & Filter Badges
    const [
      totalCount,
      unreadCount,
      budgetCount,
      transactionCount,
      systemCount,
      budgetWarningsCount,
      budgetExceededCount,
    ] = await Promise.all([
      Notification.countDocuments({ user: userId }),
      Notification.countDocuments({ user: userId, read: false }),
      Notification.countDocuments({ user: userId, category: "budget" }),
      Notification.countDocuments({ user: userId, category: "transaction" }),
      Notification.countDocuments({ user: userId, category: "system" }),
      Notification.countDocuments({
        user: userId,
        category: "budget",
        type: "warning",
      }),
      Notification.countDocuments({
        user: userId,
        category: "budget",
        $or: [{ type: "danger" }, { "metadata.threshold": { $gte: 100 } }],
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          total: totalFiltered,
          page: parsedPage,
          limit: parsedLimit,
          pages: Math.ceil(totalFiltered / parsedLimit) || 1,
        },
        counts: {
          all: totalCount,
          unread: unreadCount,
          budget: budgetCount,
          transaction: transactionCount,
          system: systemCount,
          budgetWarnings: budgetWarningsCount,
          budgetExceeded: budgetExceededCount,
        },
      },
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

// ======================
// GET UNREAD COUNT (Fast endpoint for badges/navbar)
// ======================
const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    return res.status(200).json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    console.error("Get Unread Count Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread count.",
    });
  }
};

// ======================
// MARK SINGLE NOTIFICATION AS READ
// ======================
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: {
        notification,
        unreadCount,
      },
    });
  } catch (error) {
    console.error("Mark Read Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notification.",
    });
  }
};

// ======================
// MARK SINGLE NOTIFICATION AS UNREAD
// ======================
const markAsUnread = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { read: false },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    return res.status(200).json({
      success: true,
      message: "Notification marked as unread.",
      data: {
        notification,
        unreadCount,
      },
    });
  } catch (error) {
    console.error("Mark Unread Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notification.",
    });
  }
};

// ======================
// MARK ALL AS READ
// ======================
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      data: {
        unreadCount: 0,
      },
    });
  } catch (error) {
    console.error("Mark All Read Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read.",
    });
  }
};

// ======================
// DELETE SINGLE NOTIFICATION
// ======================
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    return res.status(200).json({
      success: true,
      message: "Notification removed.",
      data: { unreadCount },
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification.",
    });
  }
};

// ======================
// CLEAR ALL NOTIFICATIONS
// ======================
const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });

    return res.status(200).json({
      success: true,
      message: "All notifications cleared.",
      data: { unreadCount: 0 },
    });
  } catch (error) {
    console.error("Clear All Notifications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear notifications.",
    });
  }
};

// ======================
// ON-DEMAND CHECK BUDGET ALERTS
// ======================
const checkAlertsOnDemand = async (req, res) => {
  try {
    await checkBudgetThresholds(req.user._id);

    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    return res.status(200).json({
      success: true,
      message: "Budget thresholds checked.",
      data: { notifications, unreadCount },
    });
  } catch (error) {
    console.error("Check Alerts On Demand Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check budget alerts.",
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  checkAlertsOnDemand,
};

