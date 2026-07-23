import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import TransactionTable from "../../components/transactions/TransactionTable";
import DeleteTransactionModal from "../../components/transactions/DeleteTransactionModal";
import TransactionFilters from "../../components/transactions/TransactionFilters";

import {
  getTransactions,
  deleteTransaction,
} from "../../services/transactionService";

function Transactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] =
    useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      toast.error("Failed to load transactions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setSelectedTransactionId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);

      await deleteTransaction(selectedTransactionId);

      toast.success("Transaction deleted successfully");

      setTransactions((prev) =>
        prev.filter(
          (transaction) =>
            transaction._id !== selectedTransactionId
        )
      );

      setDeleteModalOpen(false);
      setSelectedTransactionId(null);
    } catch (error) {
      toast.error("Failed to delete transaction");
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    navigate(`/transactions/edit/${transaction._id}`);
  };

  // ==========================
  // Filter Logic
  // ==========================

  const filteredTransactions = useMemo(() => {
    let data = [...transactions];

    if (search.trim()) {
      data = data.filter((transaction) =>
        transaction.title
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (type !== "all") {
      data = data.filter(
        (transaction) => transaction.type === type
      );
    }

    if (category !== "all") {
      data = data.filter(
        (transaction) => transaction.category === category
      );
    }

    data.sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.date) - new Date(a.date);
      }

      return new Date(a.date) - new Date(b.date);
    });

    return data;
  }, [transactions, search, type, category, sort]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-slate-400">
          Loading Transactions...
        </p>
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

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Transactions
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your income and expenses.
            </p>
          </div>

          <Link to="/transactions/add">
            <Button className="w-auto px-6">
              <Plus size={18} className="mr-2" />
              Add Transaction
            </Button>
          </Link>
        </div>

        {/* Filters */}

        <TransactionFilters
          search={search}
          setSearch={setSearch}
          type={type}
          setType={setType}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
        />

        {/* Table */}

        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}

export default Transactions;