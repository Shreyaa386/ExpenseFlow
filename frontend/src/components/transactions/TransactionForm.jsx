import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

function TransactionForm({
  onSubmit,
  loading = false,
  initialValues = {},
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      amount: "",
      type: "expense",
      category: "",
      account: "Cash",
      date: new Date().toISOString().split("T")[0],
      note: "",
    },
  });

  useEffect(() => {
    // Only reset when editing an existing transaction
    if (!initialValues?._id) {
      return;
    }

    reset({
      title: initialValues.title || "",
      amount: initialValues.amount || "",
      type: initialValues.type || "expense",
      category: initialValues.category || "",
      account: initialValues.account || "Cash",
      date: initialValues.date
        ? new Date(initialValues.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      note: initialValues.note || "",
    });
  }, [initialValues?._id, reset]);

  return (
    <Card className="p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Title */}
        <Input
          label="Title"
          placeholder="Enter transaction title"
          error={errors.title?.message}
          {...register("title", {
            required: "Title is required",
          })}
        />

        {/* Amount */}
        <Input
          label="Amount"
          type="number"
          placeholder="Enter amount"
          error={errors.amount?.message}
          {...register("amount", {
            required: "Amount is required",
            min: {
              value: 1,
              message: "Amount must be greater than 0",
            },
            valueAsNumber: true,
          })}
        />

        {/* Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Type
          </label>

          <select
            {...register("type")}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Category
          </label>

          <select
            {...register("category", {
              required: "Category is required",
            })}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
          >
            <option value="">Select Category</option>

            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Salary">Salary</option>
            <option value="Freelancing">Freelancing</option>
            <option value="Investment">Investment</option>
          </select>

          {errors.category && (
            <p className="mt-2 text-sm text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Account */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Account
          </label>

          <select
            {...register("account")}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
          >
            <option value="Cash">Cash</option>
            <option value="Bank">Bank</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
          </select>
        </div>

        {/* Date */}
        <Input
          label="Date"
          type="date"
          {...register("date")}
        />

        {/* Note */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Note
          </label>

          <textarea
            rows={4}
            placeholder="Write a note..."
            {...register("note")}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
        >
          {initialValues?._id
            ? "Update Transaction"
            : "Save Transaction"}
        </Button>
      </form>
    </Card>
  );
}

export default TransactionForm;