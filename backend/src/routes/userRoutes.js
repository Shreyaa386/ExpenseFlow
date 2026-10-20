const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  updatePreferences,
  updateTheme,
  updateNotifications,
  changePassword,
} = require("../controllers/userController");

const router = express.Router();

// ======================
// PROFILE
// ======================

router.get("/profile", protect, getProfile);

router.patch("/profile", protect, updateProfile);

router.patch("/preferences", protect, updatePreferences);

// ======================
// SETTINGS
// ======================

router.patch("/theme", protect, updateTheme);

router.patch("/notifications", protect, updateNotifications);

router.patch("/change-password", protect, changePassword);

module.exports = router;