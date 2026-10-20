import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  Search,
  CheckCircle2,
  Trash2,
  Calendar,
  History,
  Handshake,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

import { useAuth } from "../../context/AuthContext";
import {
  getSplitExpenses,
  createSplitExpense,
  recordSettlement,
  deleteSplitExpense,
} from "../../services/splitExpenseService";
import { getCategories } from "../../services/categoryService";

function SplitExpenses() {
  const { user } = useAuth();

  const [splits, setSplits] = useState([]);
  const [summary, setSummary] = useState({
    totalOwedToUser: 0,
    totalUserOwes: 0,
    netBalance: 0,
    userShareTotal: 0,
    activeCount: 0,
    settledCount: 0,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedSplitId, setExpandedSplitId] = useState(null);

  // New Split Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [payerName, setPayerName] = useState(user?.name || "You");

  // Participants array for form
  const [participantsList, setParticipantsList] = useState([
    { name: user?.name || "You", email: user?.email || "", isCreator: true, shareAmount: 0 },
    { name: "Friend 1", email: "", isCreator: false, shareAmount: 0 },
  ]);

  // Settlement Modal State
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [settleSplit, setSettleSplit] = useState(null);
  const [settleFrom, setSettleFrom] = useState("");
  const [settleTo, setSettleTo] = useState("");
  const [settleAmount, setSettleAmount] = useState("");
  const [settleNotes, setSettleNotes] = useState("");
  const [settling, setSettling] = useState(false);

  const loadSplits = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getSplitExpenses();
      if (res?.data) {
        setSplits(res.data.splits || []);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load split expenses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSplits();
    async function loadCats() {
      try {
        const catData = await getCategories();
        setCategories(catData || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadCats();
  }, [loadSplits]);

  // Dynamic share calculation for form preview
  const numTotal = Number(totalAmount) || 0;
  const count = participantsList.length;

  const equalSharePerPerson = count > 0 ? (numTotal / count).toFixed(2) : 0;
  const customAllocatedSum = participantsList.reduce((acc, p) => acc + (Number(p.shareAmount) || 0), 0);
  const customRemaining = Math.round((numTotal - customAllocatedSum) * 100) / 100;

  const handleOpenCreateModal = () => {
    setTitle("");
    setTotalAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("General");
    setDescription("");
    setSplitType("equal");
    setPayerName(user?.name || "You");
    setParticipantsList([
      { name: user?.name || "You", email: user?.email || "", isCreator: true, shareAmount: 0 },
      { name: "Friend 1", email: "", isCreator: false, shareAmount: 0 },
    ]);
    setIsCreateModalOpen(true);
  };

  const handleAddParticipant = () => {
    setParticipantsList([
      ...participantsList,
      { name: `Friend ${participantsList.length}`, email: "", isCreator: false, shareAmount: 0 },
    ]);
  };

  const handleRemoveParticipant = (index) => {
    if (participantsList.length <= 2) {
      toast.error("At least 2 participants required for splitting");
      return;
    }
    setParticipantsList(participantsList.filter((_, i) => i !== index));
  };

  const handleParticipantChange = (index, field, value) => {
    const updated = [...participantsList];
    updated[index][field] = value;
    setParticipantsList(updated);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || numTotal <= 0) {
      toast.error("Please provide a title and positive total bill amount");
      return;
    }

    if (splitType === "custom" && Math.abs(customRemaining) > 0.05) {
      toast.error(`Custom shares do not match total. Remaining to allocate: ₹${customRemaining}`);
      return;
    }

    try {
      setSubmitting(true);
      const payerIsCurrentUser = payerName === (user?.name || "You");

      const payload = {
        title: title.trim(),
        totalAmount: numTotal,
        date,
        category,
        description: description.trim(),
        splitType,
        payerName,
        payerIsCurrentUser,
        participants: participantsList.map((p) => ({
          name: p.name.trim(),
          email: p.email.trim(),
          isCreator: p.isCreator,
          shareAmount: splitType === "custom" ? Number(p.shareAmount) || 0 : 0,
        })),
      };

      await createSplitExpense(payload);
      toast.success("Split expense created successfully");
      setIsCreateModalOpen(false);
      loadSplits();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create split expense");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Settle Modal
  const handleOpenSettle = (split, debtPair = null) => {
    setSettleSplit(split);
    if (debtPair) {
      setSettleFrom(debtPair.from);
      setSettleTo(debtPair.to);
      setSettleAmount(String(debtPair.amount));
    } else {
      setSettleFrom(split.participants[0]?.name || "");
      setSettleTo(split.participants[1]?.name || "");
      setSettleAmount("");
    }
    setSettleNotes("Direct payment");
    setIsSettleModalOpen(true);
  };

  const handleSettleSubmit = async (e) => {
    e.preventDefault();
    if (!settleFrom || !settleTo || !settleAmount || Number(settleAmount) <= 0) {
      toast.error("Please fill in valid payer, receiver, and amount");
      return;
    }

    try {
      setSettling(true);
      await recordSettlement(settleSplit._id, {
        from: settleFrom,
        to: settleTo,
        amount: Number(settleAmount),
        notes: settleNotes,
        date: new Date().toISOString(),
      });

      toast.success("Settlement recorded successfully");
      setIsSettleModalOpen(false);
      loadSplits();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to record settlement");
    } finally {
      setSettling(false);
    }
  };

  const handleDeleteSplit = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shared expense record?")) return;
    try {
      await deleteSplitExpense(id);
      toast.success("Shared bill deleted");
      loadSplits();
    } catch {
      toast.error("Failed to delete shared bill");
    }
  };

  const toggleExpand = (id) => {
    setExpandedSplitId(expandedSplitId === id ? null : id);
  };

  const filteredSplits = splits.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.participants.some((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === "active") return s.status === "active";
    if (statusFilter === "settled") return s.status === "settled";
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A2A] flex items-center gap-2.5">
            <Users className="text-[#087F68]" size={28} />
            <span>Split Expenses & Shared Bills</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#66736E] font-medium">
            Share group purchases, track who owes who, review exact allocations, and settle cleanly.
          </p>
        </div>

        <Button onClick={handleOpenCreateModal} className="w-full sm:w-auto px-5 h-11 text-xs sm:text-sm shadow-sm">
          <Plus size={16} className="mr-1.5" />
          <span>New Split Bill</span>
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <Card className="p-5 sm:p-6 min-h-[136px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#66736E]">You are Owed</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#087F68]/10 border border-[#087F68]/20 text-[#087F68]">
              <ArrowDownLeft size={17} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-[#087F68] font-mono tracking-tight">
              ₹{summary.totalOwedToUser.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#66736E]">Pending claims from friends</p>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 min-h-[136px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#66736E]">You Owe</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9573B]/10 border border-[#D9573B]/20 text-[#D9573B]">
              <ArrowUpRight size={17} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-[#D9573B] font-mono tracking-tight">
              ₹{summary.totalUserOwes.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#66736E]">
              {summary.totalUserOwes === 0 ? "All shared debts settled" : "Pending payouts"}
            </p>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 min-h-[136px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#66736E]">Net Outstanding</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#104E42]/10 border border-[#104E42]/20 text-[#104E42]">
              <Handshake size={17} />
            </div>
          </div>
          <div>
            <p className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${summary.netBalance >= 0 ? "text-[#087F68]" : "text-[#D9573B]"}`}>
              ₹{summary.netBalance >= 0 ? `+${summary.netBalance.toLocaleString()}` : summary.netBalance.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#66736E]">Overall shared position</p>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 min-h-[136px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#66736E]">Your Personal Share</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D99016]/10 border border-[#D99016]/20 text-[#D99016]">
              <UserCheck size={17} />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-[#102A2A] font-mono tracking-tight">
              ₹{summary.userShareTotal.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[#66736E]">{summary.activeCount} active shared bills</p>
          </div>
        </Card>
      </div>

      {/* Filter Tabs & Search */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All Bills" },
              { id: "active", label: "Active Bills" },
              { id: "settled", label: "Settled" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-[#104E42] text-white shadow-sm"
                    : "text-[#66736E] hover:text-[#102A2A] hover:bg-[#F8F7F0]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66736E]" />
            <input
              type="text"
              placeholder="Search shared bills or friends..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E8E7DE] bg-[#F8F7F0] pl-9 pr-4 py-2 text-xs text-[#102A2A] placeholder:text-[#66736E] outline-none hover:border-[#D5D3C8] focus:border-[#087F68] focus:ring-2 focus:ring-[#087F68]/20 transition"
            />
          </div>
        </div>
      </Card>

      {/* Shared Bills List */}
      {loading ? (
        <div className="py-16 text-center text-[#66736E] text-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#104E42] border-t-transparent mx-auto mb-3" />
          Loading shared bills and settlement records...
        </div>
      ) : filteredSplits.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-[#E8E7DE] bg-[#FFFDF8]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#087F68]/10 text-[#087F68] mx-auto mb-4 border border-[#087F68]/20">
            <Receipt size={28} />
          </div>
          <h3 className="text-lg font-bold text-[#102A2A]">No Shared Bills Found</h3>
          <p className="text-sm text-[#66736E] max-w-md mx-auto mt-1">
            Splitting an outing, apartment rent, or group trip? Create a split bill to track who paid, allocate shares, and record settlements.
          </p>
          <Button onClick={handleOpenCreateModal} className="mt-6 mx-auto">
            <Plus size={16} className="mr-2" />
            <span>Create First Shared Bill</span>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSplits.map((split) => {
            const isSettled = split.status === "settled";
            const isExpanded = expandedSplitId === split._id;
            const dateStr = split.date
              ? new Date(split.date).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
              : "";

            return (
              <Card
                key={split._id}
                className={`p-5 transition-all duration-200 hover:border-[#D5D3C8] ${
                  isSettled ? "opacity-75" : ""
                }`}
              >
                {/* Main Card Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-[#087F68]/10 text-[#087F68] shrink-0 mt-0.5 border border-[#087F68]/20">
                      <Receipt size={20} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-[#102A2A]">
                          {split.title}
                        </h3>
                        <Badge
                          variant={isSettled ? "neutral" : "teal"}
                          dot={!isSettled}
                        >
                          {isSettled ? "Settled" : "Active"}
                        </Badge>
                        <span className="text-xs font-mono text-[#66736E] capitalize px-2.5 py-0.5 rounded-full bg-[#F8F7F0] border border-[#E8E7DE] font-medium">
                          {split.splitType} split
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-[#66736E]">
                        <span className="flex items-center gap-1 font-mono text-[#66736E]">
                          <Calendar size={13} className="text-[#087F68]" />
                          {dateStr}
                        </span>
                        <span>•</span>
                        <span>Paid by <strong className="text-[#102A2A]">{split.paidBy?.name}</strong></span>
                        <span>•</span>
                        <span>Category: <span className="text-[#087F68] font-medium">{split.category}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Amounts & Quick Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#E8E7DE]">
                    <div className="text-left lg:text-right">
                      <p className="text-xs text-[#66736E]">Total Bill</p>
                      <p className="text-lg font-bold text-[#102A2A] font-mono">
                        ₹{split.totalAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isSettled && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenSettle(split)}
                          className="bg-[#104E42] hover:bg-[#176453] text-white font-semibold"
                        >
                          <Handshake size={15} className="mr-1.5" />
                          <span>Settle Up</span>
                        </Button>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleExpand(split._id)}
                        className="p-2 rounded-xl border border-[#E8E7DE] bg-[#F8F7F0] text-[#66736E] hover:text-[#102A2A] hover:bg-[#FFFDF8] transition cursor-pointer"
                        title="View Allocations & Settlements"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSplit(split._id)}
                        className="p-2 rounded-xl border border-[#E8E7DE] bg-[#F8F7F0] text-[#66736E] hover:text-[#D9573B] hover:bg-[#D9573B]/10 transition cursor-pointer"
                        title="Delete Shared Bill"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pairwise Debt Recommendation Tags */}
                {split.pairwiseDebts && split.pairwiseDebts.length > 0 && !isSettled && (
                  <div className="mt-4 pt-3 border-t border-[#E8E7DE] flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#66736E] uppercase tracking-wider">
                      Outstanding:
                    </span>
                    {split.pairwiseDebts.map((d, i) => (
                      <span
                        key={i}
                        onClick={() => handleOpenSettle(split, d)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#F8F7F0] border border-[#E8E7DE] hover:border-[#087F68] hover:bg-[#FFFDF8] cursor-pointer transition text-[#102A2A]"
                        title="Click to settle this debt"
                      >
                        <span className="text-[#D9573B] font-bold">{d.from}</span>
                        <span className="text-[#66736E]">owes</span>
                        <span className="text-[#087F68] font-bold">{d.to}</span>
                        <strong className="text-[#102A2A]">₹{d.amount}</strong>
                      </span>
                    ))}
                  </div>
                )}

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-[#E8E7DE] space-y-4 animate-in fade-in duration-200">
                    {/* Participant Shares Grid */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#66736E] mb-3">
                        Participant Breakdown & Net Balances
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {split.participants.map((p) => {
                          const owes = p.netBalance < -0.01;
                          const gets = p.netBalance > 0.01;

                          return (
                            <div
                              key={p._id || p.name}
                              className="p-3.5 rounded-xl border border-[#E8E7DE] bg-[#F8F7F0] flex flex-col justify-between"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-[#102A2A] truncate">
                                  {p.name} {p.isCreator && "(You)"}
                                </span>
                                {p.settled ? (
                                  <span className="text-xs text-[#3F8F46] font-semibold flex items-center gap-1">
                                    <CheckCircle2 size={13} /> Settled
                                  </span>
                                ) : owes ? (
                                  <span className="text-xs font-mono font-bold text-[#D9573B]">
                                    Owes ₹{Math.abs(p.netBalance)}
                                  </span>
                                ) : gets ? (
                                  <span className="text-xs font-mono font-bold text-[#087F68]">
                                    Gets ₹{p.netBalance}
                                  </span>
                                ) : (
                                  <span className="text-xs text-[#66736E]">Even</span>
                                )}
                              </div>

                              <div className="mt-3 pt-2.5 border-t border-[#E8E7DE] flex items-center justify-between text-xs font-mono text-[#66736E]">
                                <span>Share: ₹{p.shareAmount}</span>
                                <span>Paid: ₹{p.paidAmount}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Settlement History */}
                    {split.settlements && split.settlements.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#66736E] mb-2.5 flex items-center gap-1.5">
                          <History size={14} className="text-[#087F68]" />
                          <span>Settlement Audit Log</span>
                        </h4>
                        <div className="space-y-1.5">
                          {split.settlements.map((s, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F7F0] border border-[#E8E7DE] text-xs font-mono"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-[#3F8F46]" />
                                <span className="text-[#102A2A]">
                                  {s.from} paid {s.to}
                                </span>
                                {s.notes && <span className="text-[#66736E] text-xs">({s.notes})</span>}
                              </div>
                              <div className="flex items-center gap-3">
                                <strong className="text-[#3F8F46] font-bold">
                                  ₹{s.amount.toLocaleString()}
                                </strong>
                                <span className="text-[#66736E] text-xs">
                                  {new Date(s.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal for Creating Split */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Shared Bill"
        description="Split group purchases, dinner checks, or rent with automatic rounding."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Bill Title"
            placeholder="e.g. Dinner at Olive Bistro, Goa Airbnb, Apartment Wifi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Total Bill Amount (₹)"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="e.g. 3500"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
            />

            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "General", label: "General" },
                { value: "Food & Dining", label: "Food & Dining" },
                { value: "Travel & Trips", label: "Travel & Trips" },
                { value: "Housing & Rent", label: "Housing & Rent" },
                { value: "Entertainment", label: "Entertainment" },
                { value: "Utilities", label: "Utilities" },
                ...categories.map((c) => ({ value: c.name, label: c.name })),
              ]}
            />

            <Select
              label="Split Mode"
              value={splitType}
              onChange={(e) => setSplitType(e.target.value)}
              options={[
                { value: "equal", label: "Split Equally (Exact Cents)" },
                { value: "custom", label: "Custom Shares per Person" },
              ]}
            />
          </div>

          {/* Paid By Selection */}
          <Select
            label="Who Paid the Bill?"
            value={payerName}
            onChange={(e) => setPayerName(e.target.value)}
            options={participantsList.map((p) => ({
              value: p.name,
              label: `${p.name} ${p.isCreator ? "(You)" : ""}`,
            }))}
          />

          {/* Participants & Allocations Section */}
          <div className="pt-2 border-t border-[#E8E7DE]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#102A2A]">
                Participants ({participantsList.length})
              </label>
              <button
                type="button"
                onClick={handleAddParticipant}
                className="text-xs text-[#087F68] hover:text-[#104E42] transition flex items-center gap-1 font-bold cursor-pointer"
              >
                <Plus size={14} /> Add Friend
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {participantsList.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-[#F8F7F0] border border-[#E8E7DE]"
                >
                  <input
                    type="text"
                    placeholder="Participant name"
                    value={p.name}
                    onChange={(e) => handleParticipantChange(idx, "name", e.target.value)}
                    className="flex-1 rounded-lg border border-[#E8E7DE] bg-[#FFFDF8] px-3 py-1.5 text-xs text-[#102A2A] placeholder:text-[#66736E] outline-none focus:border-[#087F68]"
                    required
                  />

                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={p.email}
                    onChange={(e) => handleParticipantChange(idx, "email", e.target.value)}
                    className="w-36 rounded-lg border border-[#E8E7DE] bg-[#FFFDF8] px-3 py-1.5 text-xs text-[#102A2A] placeholder:text-[#66736E] outline-none focus:border-[#087F68]"
                  />

                  {splitType === "custom" ? (
                    <div className="w-28 relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="₹ Share"
                        value={p.shareAmount || ""}
                        onChange={(e) => handleParticipantChange(idx, "shareAmount", e.target.value)}
                        className="w-full rounded-lg border border-[#E8E7DE] bg-[#FFFDF8] px-2 py-1.5 text-xs text-[#102A2A] font-mono placeholder:text-[#66736E] outline-none focus:border-[#087F68] text-right"
                        required
                      />
                    </div>
                  ) : (
                    <span className="w-24 text-right text-xs font-mono font-bold text-[#087F68]">
                      ₹{equalSharePerPerson}
                    </span>
                  )}

                  {!p.isCreator && (
                    <button
                      type="button"
                      onClick={() => handleRemoveParticipant(idx)}
                      className="p-1 text-[#66736E] hover:text-[#D9573B] transition cursor-pointer"
                      title="Remove participant"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Allocation Review Banner */}
            {splitType === "custom" && (
              <div className={`mt-3 p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
                Math.abs(customRemaining) <= 0.05
                  ? "bg-[#087F68]/10 border-[#087F68]/30 text-[#087F68] font-bold"
                  : "bg-[#D9573B]/10 border-[#D9573B]/30 text-[#D9573B] font-bold"
              }`}>
                <span>Allocated: ₹{customAllocatedSum} of ₹{numTotal}</span>
                <span>
                  {Math.abs(customRemaining) <= 0.05
                    ? "✓ Exact match"
                    : `Remaining: ₹${customRemaining}`}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E7DE]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-5 h-11"
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting} className="px-6 h-11 shadow-sm">
              <span>Create Shared Bill</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Settle Up Modal */}
      <Modal
        isOpen={isSettleModalOpen}
        onClose={() => setIsSettleModalOpen(false)}
        title="Record Debt Settlement"
        description="Mark a payment made between participants to clear debt balances."
      >
        <form onSubmit={handleSettleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Who Paid (Debtor)?"
              value={settleFrom}
              onChange={(e) => setSettleFrom(e.target.value)}
              options={
                settleSplit?.participants.map((p) => ({
                  value: p.name,
                  label: p.name,
                })) || []
              }
            />

            <Select
              label="Who Received (Creditor)?"
              value={settleTo}
              onChange={(e) => setSettleTo(e.target.value)}
              options={
                settleSplit?.participants.map((p) => ({
                  value: p.name,
                  label: p.name,
                })) || []
              }
            />
          </div>

          <Input
            label="Payment Amount (₹)"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="e.g. 500"
            value={settleAmount}
            onChange={(e) => setSettleAmount(e.target.value)}
            required
          />

          <Input
            label="Notes / Payment Method (Optional)"
            placeholder="e.g. UPI, Cash, Venmo, Bank transfer"
            value={settleNotes}
            onChange={(e) => setSettleNotes(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E7DE]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSettleModalOpen(false)}
              className="px-5 h-11"
            >
              Cancel
            </Button>
            <Button type="submit" loading={settling} className="px-6 h-11 shadow-sm">
              <span>Confirm Settlement</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default SplitExpenses;
