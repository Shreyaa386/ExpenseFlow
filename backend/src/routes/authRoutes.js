const express = require("express");

const router = express.Router();

const {
  signup,
  login,
} = require("../controllers/authController");

// Register User
router.post("/signup", signup);

// Login User
router.post("/login", login);

module.exports = router;