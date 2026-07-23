import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import { addTransaction } from "../../services/transactionService";
import TransactionForm from "../../components/transactions/TransactionForm";

function AddTransaction() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      await addTransaction(formData);

      toast.success("Transaction added successfully 💰");

      navigate("/transactions");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add transaction"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Add Transaction
        </h1>

        <p className="mt-2 text-slate-400">
          Record your income and expenses.
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