const signup = async (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: "Signup API is working 🚀",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  signup,
};