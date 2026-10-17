import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import { addTransaction } from "../../services/transactionService";
import { useTransactions } from "../../context/TransactionContext";
import TransactionForm from "../../components/transactions/TransactionForm";

function AddTransaction() {
  const navigate = useNavigate();
  const { fetchTransactions } = useTransactions();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await addTransaction(formData);
      await fetchTransactions();
      toast.success("Transaction recorded successfully 💰");
      navigate("/transactions");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to record transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A2A]">
          Record Transaction
        </h1>
        <p className="mt-1 text-sm text-[#66736E] font-medium">
          Enter deposit or expenditure parameters to reconcile your ledger.
        </p>
      </div>

      <TransactionForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}

export default AddTransaction;