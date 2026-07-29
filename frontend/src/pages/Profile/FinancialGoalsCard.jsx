function FinancialGoalsCard({
  monthlyIncome,
  monthlySavingGoal,
  onChange,
  onSave,
  loading,
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Financial Goals
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Monthly Income
          </label>

          <input
            type="number"
            name="monthlyIncome"
            value={monthlyIncome}
            onChange={onChange}
            placeholder="Enter monthly income"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Monthly Saving Goal
          </label>

          <input
            type="number"
            name="monthlySavingGoal"
            value={monthlySavingGoal}
            onChange={onChange}
            placeholder="Enter saving goal"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <button
          onClick={onSave}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium py-3 rounded-xl disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Financial Goals"}
        </button>
      </div>
    </div>
  );
}

export default FinancialGoalsCard;