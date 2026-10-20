import { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles,
  Send,
  Trash2,
  ShieldCheck,
  KeyRound,
  ExternalLink,
  RefreshCw,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Target,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import {
  getAIStatus,
  sendChatMessage,
  getChatHistory,
  clearChatHistory,
} from "../../services/aiService";
import { getDashboardData } from "../../services/dashboardService";

const SUGGESTED_PROMPTS = [
  "Where did most of my money go this month?",
  "How much did I spend on food?",
  "Am I close to my budget?",
  "Compare my spending with last month.",
  "Suggest ways to reduce my expenses.",
  "Summarize my financial position.",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState({ configured: true, model: "gemini-2.5-flash" });
  const [ledgerOverview, setLedgerOverview] = useState(null);
  const [clearing, setClearing] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const loadData = useCallback(async () => {
    try {
      setInitialLoading(true);

      const [statusRes, historyRes, dashRes] = await Promise.allSettled([
        getAIStatus(),
        getChatHistory(),
        getDashboardData({ period: "month" }),
      ]);

      if (statusRes.status === "fulfilled" && statusRes.value?.data) {
        setAiStatus(statusRes.value.data);
      }

      if (historyRes.status === "fulfilled" && historyRes.value?.data) {
        setMessages(historyRes.value.data);
      }

      if (dashRes.status === "fulfilled" && dashRes.value) {
        setLedgerOverview(dashRes.value);
      }
    } catch (err) {
      console.error("Failed to load initial AI assistant data:", err);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSendMessage = useCallback(async (textToSend) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || loading) return;

    if (!aiStatus.configured) {
      toast.error("Please configure GEMINI_API_KEY in backend/.env first.");
      return;
    }

    setInputMessage("");

    // Optimistically add user message to list
    const timestamp = new Date().toISOString();
    const tempUserMessage = {
      _id: `temp-${Math.random().toString(36).slice(2, 9)}`,
      role: "user",
      content: message,
      createdAt: timestamp,
    };

    setMessages((prev) => [...prev, tempUserMessage]);
    setLoading(true);

    try {
      const res = await sendChatMessage(message);
      if (res?.success && res?.data) {
        const { userMessage, assistantMessage } = res.data;
        // Replace temp message and append assistant message
        setMessages((prev) => {
          const filtered = prev.filter((m) => m._id !== tempUserMessage._id);
          return [...filtered, userMessage, assistantMessage];
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      const resp = err?.response?.data;
      if (resp?.code === "GEMINI_NOT_CONFIGURED" || err?.response?.status === 503) {
        setAiStatus((prev) => ({ ...prev, configured: false }));
        toast.error("Gemini is not configured. Please add GEMINI_API_KEY.");
      } else if (err?.response?.status === 429) {
        toast.error("Chat rate limit reached. Please wait a moment.");
      } else {
        toast.error(resp?.message || "Failed to receive response from AI assistant.");
      }
      // Keep user message or mark with error
      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempUserMessage._id
            ? { ...m, error: true }
            : m
        )
      );
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [inputMessage, loading, aiStatus.configured]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your conversation history?")) return;

    try {
      setClearing(true);
      await clearChatHistory();
      setMessages([]);
      toast.success("Chat thread cleared.");
    } catch {
      toast.error("Failed to clear chat thread.");
    } finally {
      setClearing(false);
    }
  };

  const renderMessageContent = (content) => {
    // Process markdown-like formatting: bold (**text**), bullet points (* or -)
    const lines = content.split("\n");

    return (
      <div className="space-y-2 leading-relaxed text-sm sm:text-[15px] text-[#102A2A]">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Bullet point
          if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
            const bulletText = trimmed.replace(/^[*-•]\s*/, "");
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-1">
                <span className="text-[#087F68] mt-1 font-bold text-base leading-none">•</span>
                <span
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: bulletText.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="text-[#102A2A] font-bold">$1</strong>'
                    ),
                  }}
                />
              </div>
            );
          }

          // Normal line with bold replacement
          return (
            <p
              key={idx}
              className="leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: trimmed.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="text-[#102A2A] font-bold">$1</strong>'
                ),
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col space-y-6 sm:space-y-7 min-h-[calc(100vh-13.5rem)]">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#E8E7DE] bg-[#FFFDF8] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="relative flex h-12 w-12 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-2xl bg-[#087F68]/10 text-[#087F68] border border-[#087F68]/20">
            <Sparkles size={24} />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#FFFDF8] bg-[#3F8F46]" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#102A2A]">
                ExpenseFlow AI Financial Assistant
              </h2>
              <Badge variant="teal" size="sm">
                {aiStatus.model || "Gemini 2.5 Flash"}
              </Badge>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#66736E] font-medium leading-relaxed">
              Grounded exclusively in your authorized ledger. No hallucinated math.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-[#087F68] bg-[#087F68]/10 border border-[#087F68]/25 px-3 py-1.5 rounded-xl font-medium">
            <ShieldCheck size={15} />
            <span>Sandboxed Ledger</span>
          </div>

          {messages.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearHistory}
              disabled={clearing}
              className="h-10 text-xs sm:text-sm text-[#66736E] hover:text-[#D9573B] hover:border-[#D9573B]/30"
              title="Clear Conversation"
            >
              <Trash2 size={14} className="mr-1.5" />
              <span>Clear Thread</span>
            </Button>
          )}
        </div>
      </div>

      {/* Unconfigured Notice Banner (if GEMINI_API_KEY is not set) */}
      {!aiStatus.configured && (
        <div className="rounded-2xl border border-[#E69A20]/40 bg-[#FFFDF8] dark:bg-[#162447] p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            <div className="p-3 rounded-2xl bg-[#E69A20]/15 text-[#E69A20] shrink-0 border border-[#E69A20]/30 mt-0.5">
              <KeyRound size={22} />
            </div>

            <div className="space-y-3 flex-1 min-w-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#102A2A] dark:text-[#F8FAFC]">
                  Google Gemini API Key Required
                </h3>
                <p className="text-sm sm:text-[15px] text-[#66736E] dark:text-[#94A3B8] leading-relaxed mt-1">
                  To chat with the assistant and get AI insights, add your free Gemini API key to <code className="bg-[#F8F7F0] dark:bg-[#0E172F] border border-[#E8E7DE] dark:border-[#1E2D4A] px-2 py-0.5 rounded-md text-[#087F68] dark:text-[#00D09C] font-mono text-xs sm:text-sm font-semibold">backend/.env</code>:
                </p>
              </div>

              <div className="rounded-xl bg-[#F8F7F0] dark:bg-[#0E172F] p-3.5 font-mono text-sm text-[#087F68] dark:text-[#00D09C] border border-[#E8E7DE] dark:border-[#1E2D4A] select-all font-semibold my-2">
                GEMINI_API_KEY=your_gemini_api_key_here
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-1">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#087F68] dark:text-[#00D09C] hover:text-[#104E42] dark:hover:text-emerald-300 hover:underline font-bold transition"
                >
                  <span>Get Free Key at Google AI Studio</span>
                  <ExternalLink size={14} />
                </a>

                <button
                  type="button"
                  onClick={loadData}
                  className="inline-flex items-center gap-1.5 text-sm text-[#66736E] dark:text-[#94A3B8] hover:text-[#102A2A] dark:hover:text-[#F8FAFC] font-semibold cursor-pointer transition"
                >
                  <RefreshCw size={14} />
                  <span>Check Again</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verified Live Metrics Strip (Direct authoritative facts grounded in user data) */}
      {ledgerOverview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="flex items-center gap-3.5 rounded-2xl border border-[#E8E7DE] bg-[#FFFDF8] p-5 sm:p-6 shadow-xs min-h-[96px]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3F8F46]/10 text-[#3F8F46] border border-[#3F8F46]/20">
              <ArrowDownCircle size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E] truncate">
                Month Income
              </p>
              <p className="mt-1 font-bold text-[#3F8F46] font-mono text-xl sm:text-2xl tracking-tight leading-tight truncate">
                ₹{Number(ledgerOverview.monthlyIncome || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-[#E8E7DE] bg-[#FFFDF8] p-5 sm:p-6 shadow-xs min-h-[96px]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D9573B]/10 text-[#D9573B] border border-[#D9573B]/20">
              <ArrowUpCircle size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E] truncate">
                Month Expense
              </p>
              <p className="mt-1 font-bold text-[#D9573B] font-mono text-xl sm:text-2xl tracking-tight leading-tight truncate">
                ₹{Number(ledgerOverview.monthlyExpense || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-[#E8E7DE] bg-[#FFFDF8] p-5 sm:p-6 shadow-xs min-h-[96px]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#087F68]/10 text-[#087F68] border border-[#087F68]/20">
              <Wallet size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E] truncate">
                Ledger Balance
              </p>
              <p className="mt-1 font-bold text-[#087F68] font-mono text-xl sm:text-2xl tracking-tight leading-tight truncate">
                ₹{Number(ledgerOverview.balance || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] p-5 sm:p-6 shadow-xs min-h-[96px]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D99016]/10 text-[#D99016] border border-[#D99016]/20">
              <Target size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8] truncate">
                Budget Consumed
              </p>
              <p className="mt-1 font-bold text-[#102A2A] dark:text-[#F8FAFC] font-mono text-xl sm:text-2xl tracking-tight leading-tight truncate">
                {ledgerOverview.budgetSummary?.overallPercentage || 0}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Scroll Container */}
      <div className="flex-1 overflow-y-auto rounded-3xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] p-6 sm:p-8 lg:p-10 shadow-xs space-y-6 min-h-[460px]">
        {initialLoading ? (
          <div className="flex h-full items-center justify-center space-y-2 flex-col">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#104E42] border-t-transparent" />
            <p className="text-xs text-[#66736E] font-medium">Loading conversation history...</p>
          </div>
        ) : messages.length === 0 ? (
          /* Empty State / Welcome Guide */
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center py-6 sm:py-8 space-y-6 sm:space-y-7">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-[#087F68]/10 text-[#087F68] border border-[#087F68]/20 shadow-xs mb-1">
              <Sparkles size={36} />
            </div>

            <div className="space-y-2.5 max-w-2xl">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#102A2A] dark:text-[#F8FAFC] leading-snug">
                How can I assist your financial journey today?
              </h3>
              <p className="text-sm sm:text-base text-[#66736E] dark:text-[#94A3B8] leading-relaxed">
                I can review your spending patterns, track your budget thresholds, compare cash flows with previous periods, and offer actionable cost-reduction strategies grounded strictly in your ExpenseFlow ledger.
              </p>
            </div>

            <div className="w-full pt-2">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-12 bg-[#E8E7DE] dark:bg-[#1E2D4A]" />
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">
                  Suggested Financial Inquiries
                </p>
                <span className="h-px w-12 bg-[#E8E7DE] dark:bg-[#1E2D4A]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 text-left w-full">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={loading}
                    onClick={() => handleSendMessage(prompt)}
                    className="flex items-start gap-3.5 rounded-2xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] p-4 text-left transition-all duration-150 hover:border-[#087F68] dark:hover:border-[#00D09C] hover:bg-[#FFFDF8] dark:hover:bg-[#162447] hover:shadow-xs group cursor-pointer active:scale-[0.99] disabled:opacity-50"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#087F68]/10 text-[#087F68] dark:text-[#00D09C] mt-0.5 group-hover:bg-[#087F68] group-hover:text-white transition-colors">
                      <HelpCircle size={16} />
                    </div>
                    <span className="text-sm sm:text-[14.5px] font-medium text-[#102A2A] dark:text-[#F8FAFC] leading-snug whitespace-normal">
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="space-y-5">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";

              return (
                <div
                  key={msg._id || index}
                  className={`flex items-start gap-3.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                      isUser
                        ? "bg-[#104E42] text-white"
                        : "bg-[#087F68]/10 text-[#087F68] border border-[#087F68]/20"
                    }`}
                  >
                    {isUser ? "You" : <Sparkles size={18} />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-5 shadow-xs ${
                      isUser
                        ? "bg-[#104E42] text-white rounded-tr-sm"
                        : "bg-[#F8F7F0] dark:bg-[#162447] border border-[#E8E7DE] dark:border-[#1E2D4A] text-[#102A2A] dark:text-[#F8FAFC] rounded-tl-sm"
                    }`}
                  >
                    {isUser ? (
                      <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="space-y-2.5">
                        {renderMessageContent(msg.content)}

                        {/* Verified Grounding Tag */}
                        <div className="pt-2.5 border-t border-[#E8E7DE] dark:border-[#1E2D4A] flex items-center justify-between text-xs text-[#66736E] dark:text-[#94A3B8] font-mono">
                          <span className="flex items-center gap-1.5 text-[#087F68] dark:text-[#00D09C] font-medium">
                            <CheckCircle2 size={13} /> Grounded in ExpenseFlow ledger
                          </span>
                          <span>
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Just now"}
                          </span>
                        </div>
                      </div>
                    )}

                    {msg.error && (
                      <p className="text-xs text-[#D9573B] dark:text-[#F87171] mt-1.5 flex items-center gap-1.5 font-medium">
                        <AlertTriangle size={13} /> Failed to send. Please retry.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pulsating Thinking Indicator */}
            {loading && (
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#087F68]/10 text-[#087F68] dark:text-[#00D09C] border border-[#087F68]/20 animate-pulse">
                  <Sparkles size={18} />
                </div>
                <div className="rounded-3xl rounded-tl-sm bg-[#F8F7F0] dark:bg-[#162447] border border-[#E8E7DE] dark:border-[#1E2D4A] p-4 text-xs sm:text-sm text-[#66736E] dark:text-[#94A3B8] flex items-center gap-2.5">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#087F68] dark:bg-[#00D09C] animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 rounded-full bg-[#087F68] dark:bg-[#00D09C] animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-[#087F68] dark:bg-[#00D09C] animate-bounce" />
                  </div>
                  <span className="text-[#102A2A] dark:text-[#F8FAFC] font-medium ml-1">Analyzing ledger with Gemini...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Suggestions Chips Bar (Visible during active conversation) */}
      {messages.length > 0 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-xs uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8] font-semibold shrink-0">
            Quick:
          </span>
          {SUGGESTED_PROMPTS.slice(0, 4).map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={loading}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 rounded-full border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] px-4 py-1.5 text-xs text-[#66736E] dark:text-[#94A3B8] hover:border-[#087F68] dark:hover:border-[#00D09C] hover:text-[#102A2A] dark:hover:text-[#F8FAFC] transition disabled:opacity-50 cursor-pointer shadow-xs font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      <div className="relative rounded-3xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] p-3 sm:p-3.5 shadow-sm mt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              aiStatus.configured
                ? "Ask about your spending, food budget, comparisons, or saving tips..."
                : "Configure GEMINI_API_KEY in backend/.env to start chatting..."
            }
            disabled={loading || !aiStatus.configured}
            maxLength={1000}
            className="flex-1 bg-transparent px-4 py-2 text-sm sm:text-base text-[#102A2A] dark:text-[#F8FAFC] placeholder-[#66736E] dark:placeholder-[#94A3B8] focus:outline-none disabled:opacity-50"
          />

          <Button
            type="submit"
            disabled={!inputMessage.trim() || loading || !aiStatus.configured}
            className="h-11 w-11 sm:h-12 sm:w-12 !p-0 rounded-2xl bg-[#104E42] hover:bg-[#176453] text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition shadow-sm cursor-pointer"
            aria-label="Send message"
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
