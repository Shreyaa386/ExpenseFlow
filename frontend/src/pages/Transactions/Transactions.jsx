import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TransactionTable from "../../components/transactions/TransactionTable";
import DeleteTransactionModal from "../../components/transactions/DeleteTransactionModal";
import TransactionFilters from "../../components/transactions/TransactionFilters";

import { deleteTransaction } from "../../services/transactionService";
import { useTransactions } from "../../context/TransactionContext";

const PAGE_SIZE = 10;

function Transactions() {
  const navigate = useNavigate();
  const { transactions, loading, fetchTransactions } = useTransactions();

  // Filters State
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [dateRange, setDateRange] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = (id) => {
    setSelectedTransactionId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteTransaction(selectedTransactionId);
      await fetchTransactions();
      toast.success("Transaction deleted successfully");
      setDeleteModalOpen(false);
      setSelectedTransactionId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete transaction");
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    navigate(`/transactions/edit/${transaction._id}`);
  };

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    let data = [...transactions];
    const now = new Date();

    // 1. Text Search (title or note)
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.note && t.note.toLowerCase().includes(q))
      );
    }

    // 2. Type Filter
    if (type !== "all") {
      data = data.filter((t) => t.type === type);
    }

    // 3. Category Filter
    if (category !== "all") {
      data = data.filter(
        (t) => (t.category || "").toLowerCase() === category.toLowerCase()
      );
    }

    // 4. Date Range Filter
    if (dateRange === "this-month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      data = data.filter((t) => new Date(t.date) >= startOfMonth);
    } else if (dateRange === "30days") {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      data = data.filter((t) => new Date(t.date) >= thirtyDaysAgo);
    } else if (dateRange === "this-year") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      data = data.filter((t) => new Date(t.date) >= startOfYear);
    } else if (dateRange === "custom") {
      if (startDate) {
        const start = new Date(startDate);
        data = data.filter((t) => new Date(t.date) >= start);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        data = data.filter((t) => new Date(t.date) <= end);
      }
    }

    // 5. Sorting
    data.sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.date) - new Date(a.date);
      }
      if (sort === "oldest") {
        return new Date(a.date) - new Date(b.date);
      }
      if (sort === "highest") {
        return Number(b.amount) - Number(a.amount);
      }
      if (sort === "lowest") {
        return Number(a.amount) - Number(b.amount);
      }
      return 0;
    });

    return data;
  }, [transactions, search, type, category, sort, dateRange, startDate, endDate]);

  // Pagination calculation
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredTransactions, safePage]);

  // Aggregate Metrics for Current Filter View
  const filteredMetrics = useMemo(() => {
    let inc = 0;
    let exp = 0;
    filteredTransactions.forEach((t) => {
      const amt = Number(t.amount) || 0;
      if (t.type === "income") inc += amt;
      else exp += amt;
    });
    return {
      income: inc,
      expense: exp,
      net: inc - exp,
    };
  }, [filteredTransactions]);

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#104E42] border-t-transparent" />
        <p className="text-sm text-[#66736E] font-medium">Loading Transactions...</p>
      </div>
    );
  }

  return (
    <>
      <DeleteTransactionModal
        isOpen={deleteModalOpen}
        loading={deleteLoading}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTransactionId(null);
        }}
        onConfirm={confirmDelete}
      />

      <div className="space-y-6 sm:space-y-7">
        {/* Header Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A2A] dark:text-[#F8FAFC]">
              Transactions Ledger
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#66736E] dark:text-[#94A3B8] font-medium">
              Complete history of verified income, expenditures, and transfers.
            </p>
          </div>

          <Link to="/transactions/add">
            <Button className="w-full sm:w-auto px-5 h-11 text-xs sm:text-sm shadow-sm">
              <Plus size={16} className="mr-1.5" />
              <span>Record Transaction</span>
            </Button>
          </Link>
        </div>

        {/* Filtered Financial Scope Badges */}
        <div className="grid gap-3.5 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="p-5 sm:p-6 min-h-[112px] flex flex-col justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8] truncate">
              Matched Entries
            </p>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#102A2A] dark:text-[#F8FAFC] font-mono leading-tight">
              {totalItems}
            </p>
          </Card>

          <Card className="p-5 sm:p-6 min-h-[112px] flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8] truncate">
              <ArrowDownLeft size={14} className="text-[#3F8F46] dark:text-[#00D09C] shrink-0" />
              <span>Scope Inflow</span>
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#3F8F46] dark:text-[#00D09C] font-mono truncate leading-tight">
              ₹{filteredMetrics.income.toLocaleString()}
            </p>
          </Card>

          <Card className="p-5 sm:p-6 min-h-[112px] flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8] truncate">
              <ArrowUpRight size={14} className="text-[#D9573B] dark:text-[#F87171] shrink-0" />
              <span>Scope Outflow</span>
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#D9573B] dark:text-[#F87171] font-mono truncate leading-tight">
              ₹{filteredMetrics.expense.toLocaleString()}
            </p>
          </Card>

          <Card className="p-5 sm:p-6 min-h-[112px] flex flex-col justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8] truncate">
              Net Scope Balance
            </p>
            <p
              className={`mt-2 text-2xl sm:text-3xl font-bold font-mono truncate leading-tight ${
                filteredMetrics.net >= 0 ? "text-[#087F68] dark:text-[#00D09C]" : "text-[#D9573B] dark:text-[#F87171]"
              }`}
            >
              ₹{filteredMetrics.net.toLocaleString()}
            </p>
          </Card>
        </div>

        {/* Dynamic Filters & Search */}
        <TransactionFilters
          search={search}
          setSearch={setSearch}
          type={type}
          setType={setType}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
          dateRange={dateRange}
          setDateRange={setDateRange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        {/* Transactions Table */}
        <div className="space-y-4">
          <TransactionTable
            transactions={paginatedTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] px-5 py-3 shadow-[0_1px_3px_0_rgba(16,42,42,0.04)]">
              <p className="text-xs text-[#66736E] dark:text-[#94A3B8] font-medium">
                Showing{" "}
                <span className="text-[#102A2A] dark:text-[#F8FAFC] font-mono font-bold">
                  {(safePage - 1) * PAGE_SIZE + 1}
                </span>{" "}
                to{" "}
                <span className="text-[#102A2A] dark:text-[#F8FAFC] font-mono font-bold">
                  {Math.min(safePage * PAGE_SIZE, totalItems)}
                </span>{" "}
                of <span className="text-[#102A2A] dark:text-[#F8FAFC] font-mono font-bold">{totalItems}</span> transactions
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={safePage === 1}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  <span>Previous</span>
                </Button>

                <div className="flex items-center gap-1 px-2">
                  <span className="text-xs text-[#102A2A] dark:text-[#F8FAFC] font-mono font-bold">
                    Page {safePage} of {totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={safePage === totalPages}
                >
                  <span>Next</span>
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Transactions;