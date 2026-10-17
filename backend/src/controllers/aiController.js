const ChatMessage = require("../models/ChatMessage");
const { getAuthoritativeFinancialSummary } = require("../services/financialSummaryService");
const {
  getConfigurationStatus,
  generateFinancialInsights,
  generateChatResponse,
} = require("../services/geminiService");

/**
 * Returns configuration readiness of Gemini AI for the client
 * GET /api/v1/ai/status
 */
const getAIStatus = async (req, res) => {
  try {
    const status = getConfigurationStatus();
    return res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to check AI status.",
    });
  }
};

/**
 * Generates or retrieves cached authoritative monthly AI financial insights
 * GET /api/v1/ai/insights
 */
const getFinancialInsights = async (req, res) => {
  try {
    const forceRefresh = req.query.force === "true" || req.query.refresh === "true";
    const userId = req.user._id;

    // 1. Backend calculates authoritative financial totals before Gemini is contacted
    const summary = await getAuthoritativeFinancialSummary(userId);

    // 2. Generate insights via Gemini service with rate-limiting & caching
    const insights = await generateFinancialInsights(userId, summary, forceRefresh);

    return res.status(200).json({
      success: true,
      data: {
        ...insights,
        rawLedgerSnapshot: {
          currentMonth: summary.currentMonth,
          previousMonth: summary.previousMonth,
          comparison: summary.comparison,
          topCategories: summary.categories.slice(0, 5),
          budgets: summary.budgets,
          savingsGoal: summary.savingsGoal,
        },
      },
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      code: error.code || "AI_INSIGHTS_ERROR",
      message: error.message || "Failed to generate AI financial insights.",
      setupGuide: error.setupGuide || null,
      retryAfterSeconds: error.retryAfterSeconds || null,
    });
  }
};

/**
 * Conversational AI chatbot: grounded strictly in verified user financial summaries
 * POST /api/v1/ai/chat
 */
const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message text is required.",
      });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Message exceeds 1000 characters limit.",
      });
    }

    const cleanMessage = message.trim();

    // 1. Authoritative financial figures computed in trusted backend code
    const summary = await getAuthoritativeFinancialSummary(userId);

    // 2. Retrieve recent chat history for conversational context (last 8 messages)
    const recentMessages = await ChatMessage.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(8);

    const orderedHistory = recentMessages.reverse();

    // 3. Call Gemini with strict instructions and authoritative financial context
    const aiResult = await generateChatResponse(userId, cleanMessage, orderedHistory, summary);

    // 4. Persist user message and model response to database associated with authenticated user
    const [savedUserMsg, savedModelMsg] = await Promise.all([
      ChatMessage.create({
        user: userId,
        role: "user",
        content: cleanMessage,
      }),
      ChatMessage.create({
        user: userId,
        role: "model",
        content: aiResult.reply,
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        userMessage: savedUserMsg,
        assistantMessage: savedModelMsg,
        disclaimer: aiResult.disclaimer,
        metricsSnapshot: aiResult.metricsSnapshot,
      },
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      code: error.code || "CHAT_ERROR",
      message: error.message || "An error occurred while processing your message.",
      setupGuide: error.setupGuide || null,
      retryAfterSeconds: error.retryAfterSeconds || null,
    });
  }
};

/**
 * Retrieves chat history for the authenticated user
 * GET /api/v1/ai/chat/history
 */
const getChatHistory = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 40, 100);
    const messages = await ChatMessage.find({ user: req.user._id })
      .sort({ createdAt: 1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load chat history.",
    });
  }
};

/**
 * Clears chat history for the authenticated user
 * DELETE /api/v1/ai/chat/history
 */
const clearChatHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ user: req.user._id });

    return res.status(200).json({
      success: true,
      message: "Chat history cleared successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to clear chat history.",
    });
  }
};

module.exports = {
  getAIStatus,
  getFinancialInsights,
  chatWithAssistant,
  getChatHistory,
  clearChatHistory,
};
