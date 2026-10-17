import { useEffect, useState } from "react";
import { Tag, Wallet } from "lucide-react";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { categoryIcons, getCategoryIconMeta } from "../../constants/categoryIcons";

function AddCategoryModal({
  open,
  onClose,
  onSave,
  category = null,
  loading = false,
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Expense");
  const [selectedIcon, setSelectedIcon] = useState(categoryIcons[0]);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setType(
        category.type && category.type.toLowerCase() === "income"
          ? "Income"
          : "Expense"
      );
      setSelectedIcon(getCategoryIconMeta(category.icon || category.name));
    } else {
      setName("");
      setType("Expense");
      setSelectedIcon(categoryIcons[0]);
    }
  }, [category, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave?.({
      name: name.trim(),
      type,
      icon: selectedIcon.name || selectedIcon.label,
      color: selectedIcon.color,
      bg: selectedIcon.bg,
    });
  };

  const PreviewIcon = selectedIcon.icon;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={category ? "Edit Category" : "Create New Category"}
      description={
        category
          ? "Modify category parameters or visual classification."
          : "Add a custom spending or revenue category to your ledger."
      }
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Name */}
        <Input
          label="Category Name"
          placeholder="e.g. Subscriptions, Groceries, Dividends"
          icon={Tag}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Category Type */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#102A2A]">
            <Wallet size={14} className="text-[#087F68]" />
            <span>Category Flow Type</span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("Expense")}
              className={`flex items-center justify-center gap-2 rounded-xl h-11 text-xs font-bold transition cursor-pointer ${
                type === "Expense"
                  ? "border border-[#D9573B]/50 bg-[#D9573B]/10 text-[#D9573B] ring-1 ring-[#D9573B]/30 shadow-sm"
                  : "border border-[#E8E7DE] bg-[#F8F7F0] text-[#66736E] hover:text-[#102A2A] hover:bg-[#FFFDF8]"
              }`}
            >
              <span>Expense (Debit)</span>
            </button>

            <button
              type="button"
              onClick={() => setType("Income")}
              className={`flex items-center justify-center gap-2 rounded-xl h-11 text-xs font-bold transition cursor-pointer ${
                type === "Income"
                  ? "border border-[#3F8F46]/50 bg-[#3F8F46]/10 text-[#3F8F46] ring-1 ring-[#3F8F46]/30 shadow-sm"
                  : "border border-[#E8E7DE] bg-[#F8F7F0] text-[#66736E] hover:text-[#102A2A] hover:bg-[#FFFDF8]"
              }`}
            >
              <span>Income (Credit)</span>
            </button>
          </div>
        </div>

        {/* Icon Selector Grid */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#102A2A]">
            Visual Icon & Accent
          </label>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-44 overflow-y-auto p-1.5 rounded-xl bg-[#F8F7F0] border border-[#E8E7DE]">
            {categoryIcons.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedIcon.label === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSelectedIcon(item)}
                  className={`flex flex-col items-center justify-center rounded-xl p-2.5 transition cursor-pointer ${
                    isSelected
                      ? "border border-[#104E42] bg-[#104E42]/10 ring-1 ring-[#104E42] text-[#104E42] shadow-sm font-semibold"
                      : "border border-[#E8E7DE] bg-[#FFFDF8] hover:border-[#D5D3C8]"
                  }`}
                >
                  <Icon size={20} className={item.color} />
                  <span className="mt-1 text-xs text-[#66736E] truncate w-full text-center">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="rounded-2xl border border-[#E8E7DE] bg-[#F8F7F0] p-4 flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${selectedIcon.bg} border border-[#E8E7DE]`}
          >
            <PreviewIcon size={22} className={selectedIcon.color} />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="truncate text-sm font-bold text-[#102A2A]">
              {name || "Category Preview"}
            </h4>
            <span
              className={`text-xs font-semibold ${
                type === "Expense" ? "text-[#D9573B]" : "text-[#3F8F46]"
              }`}
            >
              {type} Allocation
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E7DE]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="px-5 h-11"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={loading}
            disabled={!name.trim()}
            className="px-6 h-11 shadow-sm"
          >
            {category ? "Update Category" : "Save Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddCategoryModal;