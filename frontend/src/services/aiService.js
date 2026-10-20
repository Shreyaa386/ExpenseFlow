import api from "./api";

/**
 * Check Gemini AI readiness and configuration status
 */
export const getAIStatus = async () => {
  const response = await api.get("/ai/status");
  return response.data;
};

/**
 * Fetch authoritative AI Financial Insights
 * @param {boolean} force - Force cache bypass and recalculate
 */
export const getFinancialInsights = async (force = false) => {
  const response = await api.get("/ai/insights", {
    params: { force: force ? "true" : "false" },
  });
  return response.data;
};

/**
 * Send conversational question to the AI Financial Assistant
 * @param {string} message - User inquiry
 */
export const sendChatMessage = async (message) => {
  const response = await api.post("/ai/chat", { message });
  return response.data;
};

/**
 * Retrieve chat history for the authenticated user
 * @param {number} limit
 */
export const getChatHistory = async (limit = 40) => {
  const response = await api.get("/ai/chat/history", {
    params: { limit },
  });
  return response.data;
};

/**
 * Clear chat history for the authenticated user
 */
export const clearChatHistory = async () => {
  const response = await api.delete("/ai/chat/history");
  return response.data;
};
