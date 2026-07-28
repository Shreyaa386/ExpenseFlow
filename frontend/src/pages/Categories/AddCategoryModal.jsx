import { useEffect, useState } from "react";
import { X, Tag, Wallet } from "lucide-react";
import { categoryIcons } from "../../constants/categoryIcons";

function AddCategoryModal({ open, onClose, onSave }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Expense");
  const [selectedIcon, setSelectedIcon] = useState(categoryIcons[0]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSave?.({
      name,
      type,
      icon: selectedIcon.icon,
      color: selectedIcon.color,
      bg: selectedIcon.bg,
    });

    setName("");
    setType("Expense");
    setSelectedIcon(categoryIcons[0]);
    onClose();
  };

  const PreviewIcon = selectedIcon.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-[#0F172A] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Add Category
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Create a new category.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Name */}

        <div className="mb-6">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Tag size={16} />
            Category Name
          </label>

          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-500"
          />
        </div>

        {/* Category Type */}

        <div className="mb-8">
          <label className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Wallet size={16} />
            Category Type
          </label>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setType("Expense")}
              className={`flex-1 rounded-xl py-3 transition ${
                type === "Expense"
                  ? "bg-red-500 text-white"
                  : "border border-slate-700 bg-slate-900 text-slate-400"
              }`}
            >
              Expense
            </button>

            <button
              type="button"
              onClick={() => setType("Income")}
              className={`flex-1 rounded-xl py-3 transition ${
                type === "Income"
                  ? "bg-emerald-500 text-white"
                  : "border border-slate-700 bg-slate-900 text-slate-400"
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Icon Picker */}

        <div className="mb-8">
          <label className="mb-4 text-sm font-medium text-slate-300">
            Choose Icon
          </label>

          <div className="grid grid-cols-4 gap-3">
            {categoryIcons.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSelectedIcon(item)}
                  className={`rounded-2xl border p-4 transition-all duration-200 ${
                    selectedIcon.label === item.label
                      ? "border-indigo-500 bg-indigo-500/20"
                      : "border-slate-700 bg-slate-900 hover:border-slate-500"
                  }`}
                >
                  <div
                    className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl ${item.bg}`}
                  >
                    <Icon className={item.color} size={22} />
                  </div>

                  <p className="text-xs text-slate-300">
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Preview */}

        <div className="mb-8">
          <label className="mb-4 block text-sm font-medium text-slate-300">
            Preview
          </label>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <div
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${selectedIcon.bg}`}
            >
              <PreviewIcon
                size={26}
                className={selectedIcon.color}
              />
            </div>

            <h3 className="text-lg font-semibold text-white">
              {name || "Category Name"}
            </h3>

            <p
              className={`mt-1 text-sm ${
                type === "Expense"
                  ? "text-red-400"
                  : "text-emerald-400"
              }`}
            >
              {type}
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-slate-700 pt-4">
  <span className="text-sm text-slate-400">
    Transactions
  </span>

  <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-white">
    0
  </span>
</div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-5 py-3 text-slate-300 transition hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            disabled={!name.trim()}
            onClick={handleSubmit}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCategoryModal;