const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  checkAlertsOnDemand,
} = require("../controllers/notificationController");

router.use(protect);

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.post("/check-alerts", checkAlertsOnDemand);
router.patch("/read-all", markAllAsRead);
router.delete("/clear-all", clearAllNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/:id/unread", markAsUnread);
router.delete("/:id", deleteNotification);

module.exports = router;

