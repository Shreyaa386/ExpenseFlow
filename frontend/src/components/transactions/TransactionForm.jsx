import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { getCategories } from "../../services/categoryService";

const fallbackCategories = [
  { name: "Food", type: "Expense" },
  { name: "Shopping", type: "Expense" },
  { name: "Travel", type: "Expense" },
  { name: "Bills", type: "Expense" },
  { name: "Entertainment", type: "Expense" },
  { name: "Health", type: "Expense" },
  { name: "Home", type: "Expense" },
  { name: "Salary", type: "Income" },
  { name: "Freelancing", type: "Income" },
  { name: "Investment", type: "Income" },
  { name: "Other", type: "Expense" },
];

function TransactionForm({
  onSubmit,
  loading = false,
  initialValues = {},
}) {
  const [availableCategories, setAvailableCategories] = useState(fallbackCategories);

  const {
    register,
    handleSubmit,
    reset,
    watch,
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

  const selectedType = watch("type");

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await getCategories();
        if (cats && cats.length > 0) {
          setAvailableCategories(cats);
        }
      } catch (e) {
        console.warn("Could not load dynamic categories, using defaults:", e);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (!initialValues?._id) return;

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
  }, [initialValues, reset]);

  // Filter categories according to selected type (or show all if empty)
  const filteredCategories = availableCategories.filter((c) => {
    if (!selectedType) return true;
    const catType = (c.type || "").toLowerCase();
    return catType === selectedType.toLowerCase();
  });

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <Input
          label="Transaction Title"
          placeholder="e.g. Monthly Grocery Restock, Client Invoice"
          error={errors.title?.message}
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 2,
              message: "Title must be at least 2 characters",
            },
          })}
        />

        {/* Amount & Type Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Amount (₹)"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register("amount", {
              required: "Amount is required",
              min: {
                value: 0.01,
                message: "Amount must be greater than zero",
              },
              valueAsNumber: true,
            })}
          />

          <Select
            label="Transaction Type"
            error={errors.type?.message}
            {...register("type", { required: "Type is required" })}
          >
            <option value="expense">Expense (Outflow)</option>
            <option value="income">Income (Inflow)</option>
          </Select>
        </div>

        {/* Category & Account Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            label="Category"
            error={errors.category?.message}
            {...register("category", { required: "Category is required" })}
          >
            <option value="">Select a category</option>
            {filteredCategories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.type})
              </option>
            ))}
            {/* If selected category is not in filtered list (e.g. from initialValues), show it */}
            {initialValues?.category &&
              !filteredCategories.some((c) => c.name === initialValues.category) && (
                <option value={initialValues.category}>
                  {initialValues.category}
                </option>
              )}
          </Select>

          <Select
            label="Account / Payment Method"
            error={errors.account?.message}
            {...register("account")}
          >
            <option value="Cash">Cash</option>
            <option value="Bank">Bank Account</option>
            <option value="UPI">UPI / Digital Wallet</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
          </Select>
        </div>

        {/* Date */}
        <Input
          label="Transaction Date"
          type="date"
          error={errors.date?.message}
          {...register("date", { required: "Date is required" })}
        />

        {/* Note / Description */}
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#102A2A]">
            Note / Description (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Add memo, receipt reference, or context..."
            className="w-full rounded-xl border border-[#E8E7DE] hover:border-[#D5D3C8] bg-[#FFFDF8] px-4 py-3 text-sm text-[#102A2A] placeholder:text-[#66736E] outline-none transition focus:border-[#087F68] focus:ring-2 focus:ring-[#087F68]/20"
            {...register("note")}
          />
        </div>

        {/* Actions */}
        <div className="pt-2">
          <Button
            type="submit"
            loading={loading}
            className="w-full sm:w-auto px-8 h-11 shadow-sm"
          >
            {initialValues?._id ? "Update Transaction" : "Record Transaction"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default TransactionForm;