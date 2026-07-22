const express = require("express");

const protect = require("../middleware/authMiddleware");
const { updatePreferences } = require("../controllers/userController");

const router = express.Router();

router.patch("/preferences", protect, updatePreferences);

module.exports = router;