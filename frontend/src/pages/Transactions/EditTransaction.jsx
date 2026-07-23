import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import TransactionForm from "../../components/transactions/TransactionForm";

import {
  getTransactionById,
  updateTransaction,
} from "../../services/transactionService";

function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTransaction();
  }, []);

  const fetchTransaction = async () => {
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
  };

  const handleSubmit = async (formData) => {
    try {
      setUpdating(true);

      await updateTransaction(id, formData);

      toast.success("Transaction updated successfully");

      navigate("/transactions");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update transaction"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-slate-400">
          Loading Transaction...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Edit Transaction
        </h1>

        <p className="mt-2 text-slate-400">
          Update your transaction details.
        </p>
      </div>

      <TransactionForm
        initialValues={transaction}
        onSubmit={handleSubmit}
        loading={updating}
      />
    </div>
  );
}

export default EditTransaction;