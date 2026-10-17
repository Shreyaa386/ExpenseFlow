import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import TransactionForm from "../../components/transactions/TransactionForm";
import { useTransactions } from "../../context/TransactionContext";
import {
  getTransactionById,
  updateTransaction,
} from "../../services/transactionService";

function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTransactions } = useTransactions();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchTransaction = useCallback(async () => {
    try {
      const data = await getTransactionById(id);
      setTransaction(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load transaction"
      );
      navigate("/transactions");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  const handleSubmit = async (formData) => {
    try {
      setUpdating(true);
      await updateTransaction(id, formData);
      await fetchTransactions();
      toast.success("Transaction updated successfully");
      navigate("/transactions");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update transaction"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#104E42] border-t-transparent" />
        <p className="text-sm text-[#66736E] font-medium">Loading Transaction Details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A2A]">
          Edit Transaction
        </h1>
        <p className="mt-1 text-sm text-[#66736E] font-medium">
          Modify the transaction details and re-balance your ledger.
        </p>
      </div>

      <TransactionForm
        onSubmit={handleSubmit}
        loading={updating}
        initialValues={transaction}
      />
    </div>
  );
}

export default EditTransaction;