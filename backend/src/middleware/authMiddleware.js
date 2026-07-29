const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/env");

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    console.log("==================================");
    console.log("Authorization Header:");
    console.log(req.headers.authorization);

    const decoded = jwt.verify(token, config.JWT_SECRET);

    console.log("Decoded Token:");
    console.log(decoded);

    const user = await User.findById(decoded.id);

    console.log("User Found:");
    console.log(user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH ERROR:");
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login again.",
    });
  }
};

module.exports = protect;