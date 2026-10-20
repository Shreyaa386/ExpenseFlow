const { GoogleGenAI } = require("@google/genai");
const config = require("../config/env");

// In-memory cache for generated insights: Map<userId, { timestamp: number, data: object }>
const insightsCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// In-memory rate limiting map: Map<string, number[]> (userId:type -> array of timestamps)
const rateLimitMap = new Map();

/**
 * Checks if the Gemini API key is configured in backend environment.
 */
function isConfigured() {
  return Boolean(config.GEMINI_API_KEY && config.GEMINI_API_KEY.trim().length > 5);
}

/**
 * Returns configuration status and setup instructions.
 */
function getConfigurationStatus() {
  const configured = isConfigured();
  return {
    configured,
    model: config.GEMINI_MODEL,
    message: configured
      ? "Google Gemini integration is active."
      : "Gemini API key is not configured. AI insights and chatbot features require an API key.",
    setupGuide: {
      steps: [
        "1. Visit Google AI Studio at https://aistudio.google.com/app/apikey to generate a free Gemini API key.",
        "2. Open backend/.env on your server or local setup.",
        "3. Add: GEMINI_API_KEY=your_actual_key_here",
        "4. Restart the ExpenseFlow backend server.",
      ],
      docUrl: "https://aistudio.google.com/",
    },
  };
}

/**
 * Rate limit check: sliding window per user.
 * type: "insights" (max 10 / 10m) or "chat" (max 25 / 10m)
 */
function checkRateLimit(userId, type = "insights") {
  const key = `${userId}:${type}`;
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const limit = type === "insights" ? 10 : 25;

  const timestamps = (rateLimitMap.get(key) || []).filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0];
    const retryAfterSeconds = Math.ceil((windowMs - (now - oldest)) / 1000);
    return {
      allowed: false,
      retryAfterSeconds,
      message: `Rate limit reached for ${type}. Please wait ${retryAfterSeconds}s before trying again.`,
    };
  }

  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
  return { allowed: true };
}

/**
 * Executes a Gemini prompt with timeout handling.
 */
async function callGeminiWithTimeout(client, modelName, contents, configOptions, timeoutMs = 20000) {
  const timeoutPromise = new Promise((_, reject) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      const err = new Error("Gemini API request timed out after 20 seconds. Please try again.");
      err.code = "TIMEOUT";
      reject(err);
    }, timeoutMs);
  });

  const apiPromise = client.models.generateContent({
    model: modelName,
    contents,
    config: configOptions,
  });

  return Promise.race([apiPromise, timeoutPromise]);
}

/**
 * Cleans markdown code blocks from a model's JSON string output.
 */
function extractJsonFromText(rawText) {
  if (!rawText) return null;
  let cleaned = rawText.trim();

  // Strip ```json ... ``` or ``` ... ```
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    // Attempt to locate first { and last }
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = cleaned.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidate);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Generates AI Financial Insights based on verified backend financial data.
 */
async function generateFinancialInsights(userId, summary, forceRefresh = false) {
  if (!isConfigured()) {
    const status = getConfigurationStatus();
    const error = new Error(status.message);
    error.status = 503;
    error.code = "GEMINI_NOT_CONFIGURED";
    error.setupGuide = status.setupGuide;
    throw error;
  }

  // Check cache first if not forced
  const cacheKey = String(userId);
  const cached = insightsCache.get(cacheKey);
  if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      ...cached.data,
      cached: true,
      cacheAgeSeconds: Math.round((Date.now() - cached.timestamp) / 1000),
    };
  }

  // Rate limit check
  const rateLimit = checkRateLimit(userId, "insights");
  if (!rateLimit.allowed) {
    const err = new Error(rateLimit.message);
    err.status = 429;
    err.code = "RATE_LIMIT_EXCEEDED";
    err.retryAfterSeconds = rateLimit.retryAfterSeconds;
    throw err;
  }

  const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });
  const model = config.GEMINI_MODEL || "gemini-2.5-flash";

  // System instruction enforcing strict accuracy, non-invention, and distinction of observations vs suggestions
  const systemInstruction = `You are an expert financial analyst assistant embedded in the ExpenseFlow application.
Your role is to analyze verified financial data of a user and produce clear, concise monthly insights.

CRITICAL RULES:
1. Ground every statement STRICTLY in the provided JSON metrics. Never invent, extrapolate, or hallucinate figures.
2. Distinguish clearly between:
   - "observations": Objective facts and trends verified by the ledger (e.g. "Food expenses increased by 15% compared to last month", "Shopping represents 32% of total expenses").
   - "suggestions": Practical, actionable, and nonjudgmental financial suggestions (e.g. "Trimming discretionary entertainment may help reach your savings target").
3. If there is insufficient data (e.g. no transactions in previous month, or hasSufficientComparisonData is false), clearly state that comparison trends require more history.
4. Keep tone encouraging, constructive, and free of shame or judgment.
5. NEVER present your output as certified or professional financial advice.
6. Return your response as a valid JSON object matching this exact schema:
{
  "executiveSummary": "1-2 sentence overview of current month financial stance",
  "observations": [
    {
      "title": "Short descriptive title",
      "detail": "Verified observation grounded in actual numbers",
      "category": "spending" | "budget" | "saving" | "trend",
      "sentiment": "positive" | "negative" | "neutral"
    }
  ],
  "suggestions": [
    {
      "title": "Actionable title",
      "detail": "Practical, realistic step to consider",
      "impact": "Expected benefit (e.g. Helps avoid budget threshold)"
    }
  ],
  "dataSufficiency": "sufficient" | "insufficient_history" | "no_activity",
  "dataNotes": "Brief note on comparison window validity or data coverage"
}`;

  // Minimalized prompt containing ONLY the verified financial metrics
  const userPrompt = `Here is the user's verified financial summary for analysis:
${JSON.stringify(
  {
    currency: summary.currency,
    currentMonth: summary.currentMonth,
    previousMonth: summary.previousMonth,
    comparison: summary.comparison,
    topCategories: summary.categories.slice(0, 6),
    budgets: summary.budgets,
    savingsGoal: summary.savingsGoal,
  },
  null,
  2
)}

Generate the structured monthly financial insights JSON now.`;

  try {
    const response = await callGeminiWithTimeout(
      ai,
      model,
      userPrompt,
      {
        systemInstruction,
        temperature: 0.2, // Low temperature for high factual accuracy
        responseMimeType: "application/json",
      },
      20000
    );

    const rawText = response.text;
    const parsed = extractJsonFromText(rawText);

    if (!parsed || !Array.isArray(parsed.observations)) {
      throw new Error("Unable to parse structured financial insights from model response.");
    }

    const result = {
      executiveSummary: parsed.executiveSummary || "Financial overview calculated for current period.",
      observations: parsed.observations || [],
      suggestions: parsed.suggestions || [],
      dataSufficiency: parsed.dataSufficiency || "sufficient",
      dataNotes: parsed.dataNotes || "",
      disclaimer:
        "AI financial insights are for informational purposes only and do not constitute professional financial advice. All figures are verified by your ExpenseFlow ledger.",
      generatedAt: new Date(),
      verifiedMetrics: {
        currency: summary.currency,
        currentIncome: summary.currentMonth.income,
        currentExpense: summary.currentMonth.expense,
        currentSavings: summary.currentMonth.savings,
        savingsRatePct: summary.currentMonth.savingsRatePct,
        prevIncome: summary.previousMonth.income,
        prevExpense: summary.previousMonth.expense,
        expenseDiff: summary.comparison.expenseDiff,
        expenseChangePct: summary.comparison.expenseChangePct,
        topCategory: summary.categories[0] || null,
        totalBudgeted: summary.budgets.totalBudgeted,
        totalBudgetSpent: summary.budgets.totalSpent,
        budgetPercentage: summary.budgets.overallPercentage,
      },
    };

    // Cache the result
    insightsCache.set(cacheKey, { timestamp: Date.now(), data: result });

    return { ...result, cached: false };
  } catch (err) {
    if (err.code === "TIMEOUT") {
      err.status = 504;
      throw err;
    }
    // Handle standard Google API auth or quota errors
    const errMsg = String(err.message || "").toLowerCase();
    if (errMsg.includes("api_key") || errMsg.includes("unauthenticated") || errMsg.includes("401") || errMsg.includes("403")) {
      const authErr = new Error("Google Gemini API key appears invalid or unauthorized. Please verify GEMINI_API_KEY.");
      authErr.status = 401;
      authErr.code = "INVALID_API_KEY";
      throw authErr;
    }
    if (errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("resource_exhausted")) {
      const quotaErr = new Error("Google Gemini API quota exceeded. Please try again in a few moments.");
      quotaErr.status = 429;
      quotaErr.code = "PROVIDER_QUOTA_EXCEEDED";
      throw quotaErr;
    }

    err.status = err.status || 500;
    throw err;
  }
}

/**
 * Handles conversational inquiries with the AI Financial Assistant.
 */
async function generateChatResponse(userId, userMessage, chatHistory, summary) {
  if (!isConfigured()) {
    const status = getConfigurationStatus();
    const error = new Error(status.message);
    error.status = 503;
    error.code = "GEMINI_NOT_CONFIGURED";
    error.setupGuide = status.setupGuide;
    throw error;
  }

  // Rate limit check
  const rateLimit = checkRateLimit(userId, "chat");
  if (!rateLimit.allowed) {
    const err = new Error(rateLimit.message);
    err.status = 429;
    err.code = "RATE_LIMIT_EXCEEDED";
    err.retryAfterSeconds = rateLimit.retryAfterSeconds;
    throw err;
  }

  const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });
  const model = config.GEMINI_MODEL || "gemini-2.5-flash";

  // System instruction for financial assistant
  const systemInstruction = `You are the ExpenseFlow AI Financial Assistant, an intelligent and polite conversational companion.
You help users explore their personal finances by answering questions grounded EXCLUSIVELY in their verified ExpenseFlow ledger data.

USER'S VERIFIED FINANCIAL METRICS (AUTHORITATIVE):
- Currency: ${summary.currency}
- Current Month (${summary.currentMonth.label}): Income = ${summary.currency} ${summary.currentMonth.income}, Expenses = ${summary.currency} ${summary.currentMonth.expense}, Net Savings = ${summary.currency} ${summary.currentMonth.savings} (${summary.currentMonth.savingsRatePct}% savings rate), Total Transactions = ${summary.currentMonth.transactionCount}.
- Previous Month (${summary.previousMonth.label}): Income = ${summary.currency} ${summary.previousMonth.income}, Expenses = ${summary.currency} ${summary.previousMonth.expense}, Total Transactions = ${summary.previousMonth.transactionCount}.
- Comparison: Expense change = ${summary.comparison.expenseChangePct !== null ? `${summary.comparison.expenseChangePct}%` : "No prior month data"}.
- Category Breakdown:
${summary.categories.map((c) => `  * ${c.category}: ${summary.currency} ${c.amount} (${c.shareOfTotalPct}% of expenses, count: ${c.count}${c.changePct !== null ? `, vs prev month: ${c.changePct > 0 ? "+" : ""}${c.changePct}%` : ""})`).join("\n") || "  * No category transactions recorded."}
- Budgets: Total Cap = ${summary.currency} ${summary.budgets.totalBudgeted}, Spent = ${summary.currency} ${summary.budgets.totalSpent} (${summary.budgets.overallPercentage}% used).
${summary.budgets.list.map((b) => `  * ${b.name} (${b.category}): ${summary.currency} ${b.spent} / ${summary.currency} ${b.amount} (${b.percentage}%)${b.isExceeded ? " [EXCEEDED]" : ""}`).join("\n") || "  * No active budgets configured."}
- Savings Target: Goal = ${summary.currency} ${summary.savingsGoal.monthlyTarget}, Current Saved = ${summary.currency} ${summary.savingsGoal.currentSaved} (${summary.savingsGoal.progressPct}% of target${summary.savingsGoal.achieved ? " - Target Achieved!" : ""}).
- Recent Transactions:
${summary.recentTransactions.map((t) => `  * ${t.date} | ${t.type.toUpperCase()}: ${t.title} (${t.category}) = ${summary.currency} ${t.amount} [${t.account}]`).join("\n") || "  * No recent transactions recorded."}

STRICT OPERATIONAL RULES:
1. ONLY cite figures present in the verified metrics above. Do not invent amounts or calculate hypothetical expenditures.
2. If the user asks about an expense, category, or time window not in the record, clearly explain that no transaction is recorded for that in their ExpenseFlow ledger.
3. Distinguish between verified facts and suggestions:
   - State observations clearly using bold figures (e.g. "**₹12,400** on Food & Dining").
   - Offer constructive, respectful, nonjudgmental suggestions when appropriate.
4. If asked for investment advice (stocks, crypto, speculative assets), explicitly state you cannot provide investment advice, and provide general personal budgeting best practices instead.
5. Format responses cleanly using markdown (bullet points, bold text). Keep responses concise, helpful, and scannable.
6. You have NO permission or ability to run shell commands, execute database writes, or access any other user's data.`;

  // Format message history for conversation
  const contents = [];

  // Append recent chat history (max 8 messages)
  if (Array.isArray(chatHistory)) {
    chatHistory.slice(-8).forEach((msg) => {
      contents.push({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    });
  }

  // Append current user message
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  try {
    const response = await callGeminiWithTimeout(
      ai,
      model,
      contents,
      {
        systemInstruction,
        temperature: 0.3,
      },
      25000
    );

    const replyText = response.text || "I was unable to generate a response. Please try again.";

    return {
      reply: replyText,
      disclaimer: "AI responses are for financial guidance only and do not replace professional advice.",
      metricsSnapshot: {
        currentExpense: summary.currentMonth.expense,
        currentIncome: summary.currentMonth.income,
        topCategory: summary.categories[0]?.category || "None",
        budgetUsedPct: summary.budgets.overallPercentage,
      },
    };
  } catch (err) {
    if (err.code === "TIMEOUT") {
      err.status = 504;
      throw err;
    }
    const errMsg = String(err.message || "").toLowerCase();
    if (errMsg.includes("api_key") || errMsg.includes("unauthenticated") || errMsg.includes("401") || errMsg.includes("403")) {
      const authErr = new Error("Google Gemini API key appears invalid or unauthorized. Please verify GEMINI_API_KEY.");
      authErr.status = 401;
      authErr.code = "INVALID_API_KEY";
      throw authErr;
    }
    if (errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("resource_exhausted")) {
      const quotaErr = new Error("Google Gemini API quota exceeded. Please try again in a few moments.");
      quotaErr.status = 429;
      quotaErr.code = "PROVIDER_QUOTA_EXCEEDED";
      throw quotaErr;
    }

    err.status = err.status || 500;
    throw err;
  }
}

/**
 * Invalidates cache for a user (e.g., when a transaction is added or refreshed).
 */
function invalidateUserCache(userId) {
  insightsCache.delete(String(userId));
}

module.exports = {
  isConfigured,
  getConfigurationStatus,
  checkRateLimit,
  generateFinancialInsights,
  generateChatResponse,
  invalidateUserCache,
};
