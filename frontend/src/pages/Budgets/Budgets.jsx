import { useEffect, useState, useCallback } from "react";
import {
  Target,
  Plus,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  CheckCircle2,
  Trash2,
  Pencil,
  Power,
  TrendingDown,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

import {
  getBudgets,
  createBudget,
  updateBudget,
  toggleBudget,
  deleteBudget,
} from "../../services/budgetService";
import { getCategories } from "../../services/categoryService";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [overview, setOverview] = useState({
    totalBudgeted: 0,
    totalSpent: 0,
    totalRemaining: 0,
    overallPercentage: 0,
    activeCount: 0,
    exceededCount: 0,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formPeriod, setFormPeriod] = useState("monthly");
  const [formCategory, setFormCategory] = useState("all");
  const [formAmount, setFormAmount] = useState("");
  const [formThresholds, setFormThresholds] = useState([50, 75, 90, 100]);

  const loadBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getBudgets();
      if (res?.data) {
        setBudgets(res.data.budgets || []);
        if (res.data.overview) {
          setOverview(res.data.overview);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
    async function loadCats() {
      try {
        const catData = await getCategories();
        setCategories(catData || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadCats();
  }, [loadBudgets]);

  const handleOpenCreate = () => {
    setEditingBudget(null);
    setFormName("");
    setFormPeriod("monthly");
    setFormCategory("all");
    setFormAmount("");
    setFormThresholds([50, 75, 90, 100]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (budget) => {
    setEditingBudget(budget);
    setFormName(budget.name);
    setFormPeriod(budget.period);
    setFormCategory(budget.category || "all");
    setFormAmount(String(budget.amount));
    setFormThresholds(budget.thresholds || [50, 75, 90, 100]);
    setIsModalOpen(true);
  };

  const handleToggleThreshold = (th) => {
    if (formThresholds.includes(th)) {
      setFormThresholds(formThresholds.filter((t) => t !== th));
    } else {
      setFormThresholds([...formThresholds, th].sort((a, b) => a - b));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formAmount || Number(formAmount) <= 0) {
      toast.error("Please enter a valid budget name and positive limit amount");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formName.trim(),
        period: formPeriod,
        category: formCategory,
        amount: Number(formAmount),
        thresholds: formThresholds,
      };

      if (editingBudget) {
        await updateBudget(editingBudget._id, payload);
        toast.success("Budget updated successfully");
      } else {
        await createBudget(payload);
        toast.success("Budget created successfully");
      }

      setIsModalOpen(false);
      loadBudgets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save budget");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await toggleBudget(id);
      loadBudgets();
      toast.success("Budget status updated");
    } catch {
      toast.error("Failed to toggle budget status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    try {
      await deleteBudget(id);
      toast.success("Budget deleted");
      loadBudgets();
    } catch {
      toast.error("Failed to delete budget");
    }
  };

  const filteredBudgets = budgets.filter((b) => {
    if (filterPeriod === "all") return true;
    if (filterPeriod === "exceeded") return b.isExceeded;
    return b.period === filterPeriod;
  });

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A2A] dark:text-[#F8FAFC] flex items-center gap-2.5">
            <Target className="text-[#087F68] dark:text-[#00D09C]" size={28} />
            <span>Budgets & Spending Limits</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#66736E] dark:text-[#94A3B8] font-medium">
            Set automated weekly and monthly thresholds to keep expenditure strictly on track.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="w-full sm:w-auto px-5 h-11 text-xs sm:text-sm shadow-sm">
          <Plus size={16} className="mr-1.5" />
          <span>Create New Budget</span>
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <Card className="p-5 sm:p-6 min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">Total Allocated</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#087F68]/10 text-[#087F68] dark:bg-[#00D09C]/10 dark:text-[#00D09C]">
              <Layers size={18} />
            </div>
          </div>
          <div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#102A2A] dark:text-[#F8FAFC] font-mono tracking-tight leading-tight">
              ₹{overview.totalBudgeted.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8]">{overview.activeCount} active limits</p>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">Total Outflow</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D99016]/10 text-[#D99016] dark:bg-[#FBBF24]/10 dark:text-[#FBBF24]">
              <TrendingDown size={18} />
            </div>
          </div>
          <div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#102A2A] dark:text-[#F8FAFC] font-mono tracking-tight leading-tight">
              ₹{overview.totalSpent.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#087F68] dark:text-[#00D09C] font-mono font-bold">
              {overview.overallPercentage}% of total limit
            </p>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">Remaining Buffer</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3F8F46]/10 text-[#3F8F46] dark:bg-[#00D09C]/10 dark:text-[#00D09C]">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#3F8F46] dark:text-[#00D09C] font-mono tracking-tight leading-tight">
              ₹{overview.totalRemaining.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8]">Available to spend safely</p>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 min-h-[120px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">Exceeded Limits</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9573B]/10 text-[#D9573B] dark:bg-[#F87171]/10 dark:text-[#F87171]">
              <AlertOctagon size={18} />
            </div>
          </div>
          <div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#D9573B] dark:text-[#F87171] font-mono tracking-tight leading-tight">
              {overview.exceededCount}
            </p>
            <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8]">
              {overview.exceededCount === 0 ? "No active breaches" : "Needs attention"}
            </p>
          </div>
        </Card>
      </div>

      {/* Filter Tabs Segmented Toolbar */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FFFDF8] dark:bg-[#111C38] border border-[#E8E7DE] dark:border-[#1E2D4A] self-start sm:w-fit overflow-x-auto shadow-[0_1px_3px_0_rgba(16,42,42,0.04)]">
        {[
          { id: "all", label: "All Budgets" },
          { id: "monthly", label: "Monthly" },
          { id: "weekly", label: "Weekly" },
          { id: "exceeded", label: "Exceeded / Warning" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterPeriod(tab.id)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterPeriod === tab.id
                ? "bg-[#104E42] text-white dark:bg-[#00D09C] dark:text-[#060D1E] shadow-sm"
                : "text-[#66736E] dark:text-[#94A3B8] hover:text-[#102A2A] dark:hover:text-[#F8FAFC] hover:bg-[#F8F7F0] dark:hover:bg-[#0E172F]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Budgets Grid */}
      {loading ? (
        <div className="py-20 text-center text-[#66736E] dark:text-[#94A3B8] text-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#104E42] dark:border-[#00D09C] border-t-transparent mx-auto mb-3" />
          Calculating live budget records and transactions...
        </div>
      ) : filteredBudgets.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#087F68]/10 text-[#087F68] dark:bg-[#00D09C]/10 dark:text-[#00D09C] mx-auto mb-4 border border-[#087F68]/20 dark:border-[#00D09C]/20">
            <Target size={28} />
          </div>
          <h3 className="text-lg font-bold text-[#102A2A] dark:text-[#F8FAFC]">No Budgets Configured</h3>
          <p className="text-sm text-[#66736E] dark:text-[#94A3B8] max-w-md mx-auto mt-1">
            Establish a weekly or monthly spending limit to receive automated threshold warnings and track spending velocity.
          </p>
          <Button onClick={handleOpenCreate} className="mt-6 mx-auto px-5 h-11">
            <Plus size={16} className="mr-2" />
            <span>Create First Budget</span>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBudgets.map((b) => {
            const isExceeded = b.isExceeded;
            const isNear = b.percentage >= 80 && !isExceeded;

            let progressBg = "bg-[#087F68] dark:bg-[#00D09C]";
            if (isExceeded) progressBg = "bg-[#D9573B] dark:bg-[#F87171]";
            else if (isNear) progressBg = "bg-[#E69A20] dark:bg-[#FBBF24]";

            const startDateStr = b.startDate ? new Date(b.startDate).toLocaleDateString([], { month: "short", day: "numeric" }) : "";
            const endDateStr = b.endDate ? new Date(b.endDate).toLocaleDateString([], { month: "short", day: "numeric" }) : "";

            return (
              <Card
                key={b._id}
                className={`p-5 sm:p-6 relative transition-all duration-300 hover:shadow-sm ${
                  !b.active ? "opacity-60" : ""
                } ${isExceeded ? "border-[#D9573B]/50 dark:border-[#F87171]/50" : "hover:border-[#D5D3C8] dark:hover:border-[#2D3F66]"}`}
              >
                {/* Top Status & Controls */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-[#102A2A] dark:text-[#F8FAFC] truncate max-w-[180px]">
                        {b.name}
                      </h3>
                      {!b.active && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#F8F7F0] dark:bg-[#0E172F] text-[#66736E] dark:text-[#94A3B8] border border-[#E8E7DE] dark:border-[#1E2D4A]">
                          Disabled
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-[#087F68] dark:text-[#00D09C] capitalize font-medium">
                        {b.period}
                      </span>
                      <span className="text-[#66736E] dark:text-[#64748B]">•</span>
                      <span className="text-xs text-[#66736E] dark:text-[#94A3B8]">
                        {b.category === "all" ? "All Categories" : b.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(b._id)}
                      title={b.active ? "Disable budget" : "Enable budget"}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        b.active
                          ? "border-[#087F68]/30 text-[#087F68] dark:text-[#00D09C] bg-[#087F68]/10 dark:bg-[#00D09C]/15 hover:bg-[#087F68]/20"
                          : "border-[#E8E7DE] dark:border-[#1E2D4A] text-[#66736E] dark:text-[#94A3B8] bg-[#F8F7F0] dark:bg-[#0E172F] hover:text-[#102A2A] dark:hover:text-[#F8FAFC]"
                      }`}
                    >
                      <Power size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(b)}
                      className="p-1.5 rounded-lg border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] text-[#66736E] dark:text-[#94A3B8] hover:text-[#104E42] dark:hover:text-[#00D09C] hover:bg-[#FFFDF8] dark:hover:bg-[#162447] transition cursor-pointer"
                      title="Edit Budget"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(b._id)}
                      className="p-1.5 rounded-lg border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] text-[#66736E] dark:text-[#94A3B8] hover:text-[#D9573B] dark:hover:text-[#F87171] hover:bg-[#D9573B]/10 dark:hover:bg-[#F87171]/20 transition cursor-pointer"
                      title="Delete Budget"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Date Boundary Indicator */}
                <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736E] dark:text-[#94A3B8]">
                  <Calendar size={13} className="text-[#087F68] dark:text-[#00D09C]" />
                  <span>
                    {startDateStr} – {endDateStr}
                  </span>
                </div>

                {/* Exceeded / Near Warning Banner */}
                {isExceeded ? (
                  <div className="mt-3.5 flex items-center gap-2 p-2.5 rounded-xl bg-[#D9573B]/10 border border-[#D9573B]/25 text-[#D9573B] dark:text-[#F87171] text-xs font-semibold">
                    <AlertOctagon size={16} className="text-[#D9573B] dark:text-[#F87171] shrink-0" />
                    <span>Limit exceeded by ₹{(b.spent - b.amount).toLocaleString()}!</span>
                  </div>
                ) : isNear ? (
                  <div className="mt-3.5 flex items-center gap-2 p-2.5 rounded-xl bg-[#E69A20]/10 border border-[#E69A20]/25 text-[#E69A20] dark:text-[#FBBF24] text-xs font-semibold">
                    <AlertTriangle size={16} className="text-[#E69A20] dark:text-[#FBBF24] shrink-0" />
                    <span>80%+ consumed. Caution advised.</span>
                  </div>
                ) : null}

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#66736E] dark:text-[#94A3B8]">Spent: <strong className="text-[#102A2A] dark:text-[#F8FAFC] font-mono">₹{b.spent.toLocaleString()}</strong></span>
                    <span className={`font-mono font-bold ${isExceeded ? "text-[#D9573B] dark:text-[#F87171]" : isNear ? "text-[#E69A20] dark:text-[#FBBF24]" : "text-[#087F68] dark:text-[#00D09C]"}`}>
                      {b.percentage}%
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#E8E7DE] dark:bg-[#1E2D4A] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${progressBg}`}
                      style={{ width: `${Math.min(100, b.percentage)}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Limit & Remaining Buffer */}
                <div className="mt-4 pt-3.5 border-t border-[#E8E7DE] dark:border-[#1E2D4A] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#66736E] dark:text-[#94A3B8] text-xs font-medium block">Cap Limit</span>
                    <span className="text-[#102A2A] dark:text-[#F8FAFC] font-mono font-bold">₹{b.amount.toLocaleString()}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[#66736E] dark:text-[#94A3B8] text-xs font-medium block">Remaining</span>
                    <span className={`font-mono font-bold ${isExceeded ? "text-[#D9573B] dark:text-[#F87171]" : "text-[#3F8F46] dark:text-[#00D09C]"}`}>
                      {isExceeded ? "₹0" : `₹${b.remaining.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBudget ? "Edit Budget Limit" : "Create Budget Limit"}
        description="Establish weekly or monthly spending caps with automated threshold triggers."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Budget Name */}
          <Input
            label="Budget Name"
            placeholder="e.g. Monthly Groceries, Dining & Leisure"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />

          {/* Time Period & Category - 2 columns on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Time Period"
              value={formPeriod}
              onChange={(e) => setFormPeriod(e.target.value)}
              options={[
                { value: "monthly", label: "Monthly Cycle" },
                { value: "weekly", label: "Weekly Cycle" },
              ]}
            />

            <Select
              label="Expenditure Category"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              options={[
                { value: "all", label: "All Categories (Overall)" },
                ...categories.map((c) => ({ value: c.name, label: c.name })),
              ]}
            />
          </div>

          {/* Spending Cap Amount */}
          <Input
            label="Spending Cap Amount (₹)"
            type="number"
            min="1"
            placeholder="e.g. 15000"
            value={formAmount}
            onChange={(e) => setFormAmount(e.target.value)}
            required
          />

          {/* Alert Trigger Thresholds Card */}
          <div className="rounded-2xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#102A2A] dark:text-[#F8FAFC]">
                Alert Trigger Thresholds
              </label>
              <span className="text-xs text-[#087F68] dark:text-[#00D09C] font-mono font-bold">
                {formThresholds.length} Active {formThresholds.length === 1 ? "Trigger" : "Triggers"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[50, 75, 90, 100].map((th) => {
                const active = formThresholds.includes(th);
                const subLabels = {
                  50: "Halfway",
                  75: "Caution",
                  90: "Near Cap",
                  100: "Cap Exceeded",
                };
                return (
                  <button
                    key={th}
                    type="button"
                    onClick={() => handleToggleThreshold(th)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      active
                        ? "border-[#104E42] dark:border-[#00D09C] bg-[#104E42]/10 dark:bg-[#00D09C]/15 text-[#104E42] dark:text-[#00D09C] ring-1 ring-[#104E42] dark:ring-[#00D09C] shadow-sm font-semibold"
                        : "border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] text-[#66736E] dark:text-[#94A3B8] hover:border-[#D5D3C8] dark:hover:border-[#2D3F66] hover:text-[#102A2A] dark:hover:text-[#F8FAFC]"
                    }`}
                  >
                    <span className="text-sm font-bold font-mono tracking-tight text-[#102A2A] dark:text-[#F8FAFC]">
                      {th}%
                    </span>
                    <span className={`text-xs mt-0.5 font-medium ${active ? "text-[#104E42] dark:text-[#00D09C]" : "text-[#66736E] dark:text-[#94A3B8]"}`}>
                      {subLabels[th]}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-[#66736E] dark:text-[#94A3B8] leading-relaxed">
              Automated notifications will be dispatched when category expenditure crosses these percentage milestones.
            </p>
          </div>

          {/* Distinct Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E7DE] dark:border-[#1E2D4A]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="px-5 h-11"
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting} className="px-6 h-11 shadow-sm">
              <span>{editingBudget ? "Update Budget" : "Create Budget"}</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Budgets;
