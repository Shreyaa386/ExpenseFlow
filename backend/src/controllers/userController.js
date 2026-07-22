const User = require("../models/User");

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
      req.user.id,
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

module.exports = {
  updatePreferences,
};