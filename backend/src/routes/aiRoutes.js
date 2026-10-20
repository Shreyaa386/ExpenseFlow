const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  getAIStatus,
  getFinancialInsights,
  chatWithAssistant,
  getChatHistory,
  clearChatHistory,
} = require("../controllers/aiController");

// All AI endpoints require authenticated user session
router.use(protect);

// Status check (readiness & configuration info)
router.get("/status", getAIStatus);

// AI Financial Insights with backend-calculated authoritative metrics
router.get("/insights", getFinancialInsights);

// Conversational AI Financial Assistant
router.post("/chat", chatWithAssistant);
router.get("/chat/history", getChatHistory);
router.delete("/chat/history", clearChatHistory);

module.exports = router;
