const User = require("../models/User");
const bcrypt = require("bcrypt");
// ======================
// GET PROFILE
// ======================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// ======================
// UPDATE PROFILE
// ======================
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      avatar,
      monthlyIncome,
      monthlySavingGoal,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(name !== undefined && { name }),
        ...(avatar !== undefined && { avatar }),
        ...(monthlyIncome !== undefined && { monthlyIncome }),
        ...(monthlySavingGoal !== undefined && {
          monthlySavingGoal,
        }),
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -refreshToken");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// ======================
// UPDATE PREFERENCES
// ======================
const updatePreferences = async (req, res) => {
  try {
    const { language, currency } = req.body;

    if (!language || !currency) {
      return res.status(400).json({
        success: false,
        message: "Language and currency are required.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        language,
        currency,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -refreshToken");

    return res.status(200).json({
      success: true,
      message: "Preferences updated successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Update Preferences Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// ======================
// UPDATE THEME
// ======================
const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;

    if (!theme) {
      return res.status(400).json({
        success: false,
        message: "Theme is required.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { theme },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -refreshToken");

    return res.status(200).json({
      success: true,
      message: "Theme updated successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Update Theme Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// ======================
// UPDATE NOTIFICATIONS
// ======================
const updateNotifications = async (req, res) => {
  try {
    const notifications = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { notifications },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -refreshToken");

    return res.status(200).json({
      success: true,
      message: "Notification settings updated successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Update Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// ======================
// CHANGE PASSWORD
// ======================
const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
  updateTheme,
  updateNotifications,
  changePassword,
};