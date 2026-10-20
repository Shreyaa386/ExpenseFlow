import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Search,
  Plus,
  Tags,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

import CategoryCard from "./CategoryCard";
import AddCategoryModal from "./AddCategoryModal";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import { useTransactions } from "../../context/TransactionContext";

function Categories() {
  const { transactions } = useTransactions();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Safe Deletion Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deletionWarning, setDeletionWarning] = useState(null);

  const fetchCategoriesList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesList();
  }, [fetchCategoriesList]);

  // Merge real transaction counts and spending volumes into category items
  const enrichedCategories = useMemo(() => {
    return categories.map((cat) => {
      const matchingTransactions = (transactions || []).filter(
        (t) => (t.category || "").toLowerCase() === (cat.name || "").toLowerCase()
      );

      const totalAmount = matchingTransactions.reduce(
        (acc, curr) => acc + (Number(curr.amount) || 0),
        0
      );

      return {
        ...cat,
        transactionsCount: matchingTransactions.length,
        totalAmount,
      };
    });
  }, [categories, transactions]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return enrichedCategories.filter((cat) => {
      const matchesSearch = (cat.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const normalizedCatType =
        (cat.type || "").toLowerCase() === "income" ? "Income" : "Expense";

      const matchesFilter =
        filter === "All" || normalizedCatType === filter;

      return matchesSearch && matchesFilter;
    });
  }, [enrichedCategories, search, filter]);

  // Summary Metrics
  const totalCategoriesCount = enrichedCategories.length;
  const expenseCategoriesCount = enrichedCategories.filter(
    (c) => (c.type || "").toLowerCase() === "expense"
  ).length;
  const incomeCategoriesCount = enrichedCategories.filter(
    (c) => (c.type || "").toLowerCase() === "income"
  ).length;

  const mostActiveCategory = useMemo(() => {
    if (enrichedCategories.length === 0) return null;
    return [...enrichedCategories].sort(
      (a, b) => (b.transactionsCount || 0) - (a.transactionsCount || 0)
    )[0];
  }, [enrichedCategories]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      setActionLoading(true);

      if (editingCategory) {
        await updateCategory(editingCategory._id, categoryData);
        toast.success(`Category "${categoryData.name}" updated successfully`);
      } else {
        await createCategory(categoryData);
        toast.success(`Category "${categoryData.name}" created successfully`);
      }

      setModalOpen(false);
      setEditingCategory(null);
      await fetchCategoriesList();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save category."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleInitiateDelete = (category) => {
    setCategoryToDelete(category);

    // Check if real transactions depend on this category
    const associatedCount = category.transactionsCount || 0;
    if (associatedCount > 0) {
      setDeletionWarning(
        `Warning: There are ${associatedCount} transaction(s) assigned to "${category.name}". Safe deletion policy prevents deleting categories that have historical records attached.`
      );
    } else {
      setDeletionWarning(null);
    }

    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setActionLoading(true);
      await deleteCategory(categoryToDelete._id);
      toast.success(`Category "${categoryToDelete.name}" deleted`);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      await fetchCategoriesList();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Safe Deletion: Category has active transactions."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#104E42] border-t-transparent" />
        <p className="text-sm text-[#66736E] font-medium">Loading Categories...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 sm:space-y-7">
        {/* Top Header & Action Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A2A] dark:text-[#F8FAFC]">
              Categories Ledger
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#66736E] dark:text-[#94A3B8] font-medium">
              Manage custom classifications, income streams, and expense buckets.
            </p>
          </div>

          <Button onClick={handleOpenAddModal} className="w-full sm:w-auto px-5 h-11 text-xs sm:text-sm shadow-sm">
            <Plus size={16} className="mr-1.5" />
            <span>New Category</span>
          </Button>
        </div>

        {/* Category Summary Cards */}
        <div className="grid gap-3.5 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="p-5 sm:p-6 min-h-[120px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">
                Total Categories
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#087F68]/10 text-[#087F68] dark:bg-[#00D09C]/10 dark:text-[#00D09C]">
                <Tags size={18} />
              </div>
            </div>
            <div>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#102A2A] dark:text-[#F8FAFC] font-mono tracking-tight leading-tight">
                {totalCategoriesCount}
              </p>
              <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8]">Active classifications</p>
            </div>
          </Card>

          <Card className="p-5 sm:p-6 min-h-[120px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">
                Expense Types
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9573B]/10 text-[#D9573B] dark:bg-[#F87171]/10 dark:text-[#F87171]">
                <ArrowDownLeft size={18} />
              </div>
            </div>
            <div>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#D9573B] dark:text-[#F87171] font-mono tracking-tight leading-tight">
                {expenseCategoriesCount}
              </p>
              <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8]">Outflow categories</p>
            </div>
          </Card>

          <Card className="p-5 sm:p-6 min-h-[120px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">
                Income Types
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3F8F46]/10 text-[#3F8F46] dark:bg-[#00D09C]/10 dark:text-[#00D09C]">
                <ArrowUpRight size={18} />
              </div>
            </div>
            <div>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-[#3F8F46] dark:text-[#00D09C] font-mono tracking-tight leading-tight">
                {incomeCategoriesCount}
              </p>
              <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8]">Revenue streams</p>
            </div>
          </Card>

          <Card className="p-5 sm:p-6 min-h-[120px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">
                Most Active
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D99016]/10 text-[#D99016] dark:bg-[#FBBF24]/10 dark:text-[#FBBF24]">
                <PieChart size={18} />
              </div>
            </div>
            <div>
              <p className="mt-2 text-lg sm:text-xl font-bold text-[#102A2A] dark:text-[#F8FAFC] truncate">
                {mostActiveCategory ? mostActiveCategory.name : "None yet"}
              </p>
              <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8] font-mono truncate">
                {mostActiveCategory ? `${mostActiveCategory.transactionsCount} transaction entries` : "Awaiting records"}
              </p>
            </div>
          </Card>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66736E] dark:text-[#94A3B8]"
            />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] pl-10 pr-4 text-sm text-[#102A2A] dark:text-[#F8FAFC] placeholder:text-[#66736E] dark:placeholder:text-[#94A3B8] outline-none transition hover:border-[#D5D3C8] dark:hover:border-[#2D3F66] focus:border-[#087F68] dark:focus:border-[#00D09C] focus:ring-2 focus:ring-[#087F68]/20 dark:focus:ring-[#00D09C]/20 shadow-[0_1px_3px_0_rgba(16,42,42,0.04)]"
            />
          </div>

          {/* Filter Pills Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FFFDF8] dark:bg-[#111C38] border border-[#E8E7DE] dark:border-[#1E2D4A] self-start sm:self-auto shadow-[0_1px_3px_0_rgba(16,42,42,0.04)]">
            {["All", "Expense", "Income"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  filter === item
                    ? "bg-[#104E42] text-white dark:bg-[#00D09C] dark:text-[#060D1E] shadow-sm"
                    : "text-[#66736E] dark:text-[#94A3B8] hover:text-[#102A2A] dark:hover:text-[#F8FAFC] hover:bg-[#F8F7F0] dark:hover:bg-[#0E172F]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E8E7DE] bg-[#FFFDF8] py-16 px-4 text-center shadow-[0_1px_3px_0_rgba(16,42,42,0.04)]">
            <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#087F68]/10 text-[#087F68] border border-[#087F68]/20">
              <Tags size={22} />
            </div>
            <h3 className="text-base font-bold text-[#102A2A]">No Categories Match</h3>
            <p className="mt-1 text-xs text-[#66736E] max-w-sm mx-auto">
              No categories match your search or filter. Create a new category to expand your classifications.
            </p>
            <div className="mt-5">
              <Button onClick={handleOpenAddModal} size="sm" className="w-auto px-5 h-10">
                <Plus size={15} className="mr-1.5" />
                Add Category
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category._id || category.id}
                category={category}
                onEdit={handleOpenEditModal}
                onDelete={handleInitiateDelete}
                deleteLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      <AddCategoryModal
        open={modalOpen}
        category={editingCategory}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        loading={actionLoading}
      />

      {/* Safe Deletion Policy Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Category Deletion"
        description="Verify category status before permanent deletion."
      >
        <div className="space-y-4">
          {deletionWarning ? (
            <div className="rounded-2xl border border-[#D9573B]/30 bg-[#D9573B]/10 p-4 flex items-start gap-3">
              <AlertTriangle size={20} className="text-[#D9573B] shrink-0 mt-0.5" />
              <div className="text-xs text-[#D9573B] leading-relaxed">
                <p className="font-bold text-[#D9573B]">Safe Deletion Policy Triggered</p>
                <p className="mt-1 text-[#66736E]">{deletionWarning}</p>
                <p className="mt-2 text-[#D9573B] font-medium">
                  To proceed, reassign these transactions to another category in the Transactions ledger first.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#66736E] leading-relaxed">
              Are you sure you want to delete the category{" "}
              <strong className="text-[#102A2A]">"{categoryToDelete?.name}"</strong>?
              This action cannot be undone.
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E7DE]">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>

            {!deletionWarning && (
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                loading={actionLoading}
              >
                Delete Category
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Categories;