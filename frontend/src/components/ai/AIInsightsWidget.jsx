import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  KeyRound,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { getFinancialInsights } from "../../services/aiService";

export default function AIInsightsWidget({ title = "AI Financial Insights", compact = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const fetchInsights = useCallback(async (force = false) => {
    try {
      if (force) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setErrorState(null);

      const res = await getFinancialInsights(force);
      if (res?.success && res?.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("AI Insights fetch failed:", err);
      const resp = err?.response?.data;
      if (resp?.code === "GEMINI_NOT_CONFIGURED" || err?.response?.status === 503) {
        setErrorState({
          type: "UNCONFIGURED",
          message: resp?.message || "Gemini API key is not configured.",
          setupGuide: resp?.setupGuide,
        });
      } else if (err?.response?.status === 429) {
        setErrorState({
          type: "RATE_LIMIT",
          message: resp?.message || "Rate limit reached. Please wait a moment before refreshing.",
          retryAfterSeconds: resp?.retryAfterSeconds,
        });
        toast.error("Rate limit reached. Please wait before refreshing insights.");
      } else {
        setErrorState({
          type: "ERROR",
          message: resp?.message || err?.message || "Failed to generate AI insights.",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights(false);
  }, [fetchInsights]);

  const handleRefresh = () => {
    fetchInsights(true);
  };

  // 1. Loading State
  if (loading && !data && !errorState) {
    return (
      <Card className="p-6 border-[#E8E7DE]">
        <div className="flex flex-col items-center justify-center py-10 space-y-3">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#087F68] border-t-transparent" />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-[#102A2A]">Analyzing Ledger with Gemini...</p>
            <p className="text-xs text-[#66736E] mt-0.5">
              Calculating authoritative metrics and generating monthly insights.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // 2. Unconfigured API Key State
  if (errorState?.type === "UNCONFIGURED") {
    return (
      <Card className="p-5 sm:p-6 flex flex-col justify-between h-full border-[#E8E7DE] bg-[#FFFDF8]">
        <div>
          <CardHeader className="flex-row items-center justify-between pb-3 border-b border-[#E8E7DE]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D99016]/10 text-[#D99016] border border-[#D99016]/20">
                <KeyRound size={16} />
              </div>
              <div>
                <CardTitle>{title}</CardTitle>
                <p className="text-xs text-[#66736E] mt-0.5">Setup required to activate Gemini intelligence.</p>
              </div>
            </div>
            <Badge variant="warning" size="sm">
              Setup Key
            </Badge>
          </CardHeader>

          <CardContent className="space-y-3 pt-4">
            <div className="rounded-xl border border-[#E8E7DE] bg-[#F8F7F0] p-3.5 text-xs text-[#102A2A] space-y-2">
              <p className="text-xs font-semibold text-[#102A2A]">Google Gemini Setup</p>
              <p className="text-[#66736E] leading-relaxed text-xs">
                To enable AI Financial Insights and Assistant, configure your Gemini API key in the backend environment.
              </p>
              <div className="rounded-lg bg-[#FFFDF8] p-2.5 font-mono text-xs text-[#087F68] border border-[#E8E7DE] select-all font-semibold">
                GEMINI_API_KEY=your_key_here
              </div>
            </div>
          </CardContent>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E8E7DE] flex flex-wrap items-center justify-between gap-3">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#087F68] hover:text-[#104E42] font-medium transition"
          >
            <span>Get Free Key (Google AI Studio)</span>
            <ExternalLink size={13} />
          </a>

          <Button size="sm" variant="outline" onClick={() => fetchInsights(true)}>
            <RefreshCw size={13} className="mr-1.5" />
            <span>Check Status</span>
          </Button>
        </div>
      </Card>
    );
  }

  // 3. Rate Limit or General Error State
  if (errorState && !data) {
    return (
      <Card className="p-6 border-[#D9573B]/20 bg-[#FFFDF8]">
        <CardHeader className="flex-row items-center justify-between pb-3 border-b border-[#E8E7DE]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D9573B]/10 text-[#D9573B] border border-[#D9573B]/20">
              <AlertTriangle size={16} />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <p className="text-xs text-[#66736E]">Insight provider temporarily unavailable.</p>
            </div>
          </div>
          <Badge variant="danger">Notice</Badge>
        </CardHeader>

        <CardContent className="space-y-4 pt-3">
          <p className="text-xs text-[#102A2A]">{errorState.message}</p>
          <Button size="sm" variant="outline" onClick={() => fetchInsights(true)}>
            <RefreshCw size={13} className="mr-1.5" />
            <span>Try Again</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const metrics = data?.verifiedMetrics;
  const observations = data?.observations || [];
  const suggestions = data?.suggestions || [];

  return (
    <Card className="relative overflow-hidden p-6 border-[#E8E7DE] bg-[#FFFDF8]">
      {/* Header */}
      <CardHeader className="flex-row items-center justify-between pb-4 border-b border-[#E8E7DE]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#087F68]/10 text-[#087F68] border border-[#087F68]/20">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>{title}</CardTitle>
              <Badge variant="teal" size="sm">
                Gemini 2.5
              </Badge>
            </div>
            <p className="text-xs text-[#66736E] mt-0.5">
              Grounded strictly in verified ledger totals. No hallucinated figures.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {data?.cached && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-[#66736E] bg-[#F8F7F0] px-2.5 py-0.5 rounded-lg border border-[#E8E7DE]">
              <Clock size={12} />
              <span>Cached {data.cacheAgeSeconds}s ago</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh financial insights"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E8E7DE] bg-[#F8F7F0] text-[#66736E] hover:text-[#102A2A] hover:border-[#D5D3C8] transition disabled:opacity-50"
            title="Refresh Insights"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin text-[#087F68]" : ""} />
          </button>

          <Link to="/ai-assistant">
            <Button size="sm" variant="primary" className="hidden sm:flex text-xs">
              <MessageSquare size={13} className="mr-1.5" />
              <span>Ask Assistant</span>
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {/* Authoritative Verified Metric Strip */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F8F7F0] border border-[#E8E7DE]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E]">
                Monthly Income
              </p>
              <p className="text-sm sm:text-base font-bold text-[#087F68] font-mono mt-1">
                ₹{Number(metrics.currentIncome || 0).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E]">
                Monthly Expenses
              </p>
              <p className="text-sm sm:text-base font-bold text-[#102A2A] font-mono mt-1">
                ₹{Number(metrics.currentExpense || 0).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E]">
                Net Savings
              </p>
              <p className="text-sm sm:text-base font-bold text-[#3F8F46] font-mono mt-1">
                ₹{Number(metrics.currentSavings || 0).toLocaleString()}
                <span className="text-xs text-[#66736E] ml-1 font-normal">({metrics.savingsRatePct}%)</span>
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E]">
                Top Category
              </p>
              <p className="text-sm sm:text-base font-bold text-[#102A2A] truncate mt-1">
                {metrics.topCategory ? metrics.topCategory.category : "None"}
              </p>
            </div>
          </div>
        )}

        {/* Executive Summary */}
        {data?.executiveSummary && (
          <div className="rounded-2xl border border-[#087F68]/20 bg-[#087F68]/5 p-4 text-xs sm:text-sm text-[#102A2A] leading-relaxed">
            <span className="font-bold text-[#087F68] mr-1.5">Executive Summary:</span>
            {data.executiveSummary}
          </div>
        )}

        {/* Data Sufficiency Notice (if prior month had no records) */}
        {data?.dataNotes && (
          <div className="flex items-start gap-2.5 rounded-xl bg-[#F8F7F0] border border-[#E8E7DE] p-3 text-xs text-[#104E42] leading-relaxed">
            <Info size={16} className="shrink-0 mt-0.5 text-[#087F68]" />
            <span>{data.dataNotes}</span>
          </div>
        )}

        {/* Section 1: Verified Observations */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E] flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#087F68]" />
            <span>Verified Ledger Observations</span>
          </p>

          <div className="space-y-2.5">
            {observations.length > 0 ? (
              observations.map((obs, idx) => {
                let Icon = CheckCircle2;
                let colorClass = "text-[#087F68] bg-[#087F68]/10 border-[#087F68]/20";
                if (obs.sentiment === "negative") {
                  Icon = TrendingUp;
                  colorClass = "text-[#D9573B] bg-[#D9573B]/10 border-[#D9573B]/20";
                } else if (obs.sentiment === "positive") {
                  Icon = TrendingDown;
                  colorClass = "text-[#3F8F46] bg-[#3F8F46]/10 border-[#3F8F46]/20";
                }

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 rounded-2xl border border-[#E8E7DE] bg-[#F8F7F0] p-4 transition hover:border-[#D5D3C8]"
                  >
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${colorClass}`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="text-xs sm:text-sm leading-relaxed flex-1 min-w-0">
                      <p className="font-semibold text-[#102A2A]">{obs.title}</p>
                      <p className="text-[#66736E] mt-1 leading-relaxed text-xs sm:text-[13px]">{obs.detail}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs sm:text-sm text-[#66736E] py-2">
                No observations recorded yet. Add transactions to generate financial patterns.
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Actionable Suggestions */}
        {!compact && suggestions.length > 0 && (
          <div className="space-y-3 pt-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E] flex items-center gap-1.5">
              <Lightbulb size={14} className="text-[#D99016]" />
              <span>Actionable Guidance (Non-Judgmental)</span>
            </p>

            <div className="space-y-2.5">
              {suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 rounded-2xl border border-[#E8E7DE] bg-[#F8F7F0] p-4 transition hover:border-[#D5D3C8]"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#D99016]/20 bg-[#D99016]/10 text-[#D99016]">
                    <Lightbulb size={16} />
                  </div>
                  <div className="text-xs sm:text-sm leading-relaxed flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-[#102A2A]">{sug.title}</p>
                      {sug.impact && (
                        <span className="rounded-full bg-[#D99016]/10 border border-[#D99016]/20 px-2.5 py-0.5 text-xs font-medium text-[#D99016]">
                          {sug.impact}
                        </span>
                      )}
                    </div>
                    <p className="text-[#66736E] mt-1 text-xs sm:text-[13px] leading-relaxed">{sug.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="pt-3 border-t border-[#E8E7DE] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#66736E] font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-[#087F68]" />
            <span>Authoritative ledger calculations</span>
          </span>
          <span className="text-[#66736E]/80">
            {data?.disclaimer || "AI output is informational and not professional financial advice."}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
