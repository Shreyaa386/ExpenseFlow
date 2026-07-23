import Input from "../ui/Input";

function TransactionFilters({
  search,
  setSearch,
  type,
  setType,
  category,
  setCategory,
  sort,
  setSort,
}) {
  return (
    <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:grid-cols-4">
      {/* Search */}
      <Input
        placeholder="Search transactions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Type */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
      >
        <option value="all">All Categories</option>

        <option value="Food">Food</option>
        <option value="Shopping">Shopping</option>
        <option value="Travel">Travel</option>
        <option value="Bills">Bills</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Salary">Salary</option>
        <option value="Freelancing">Freelancing</option>
        <option value="Investment">Investment</option>
      </select>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
}

export default TransactionFilters;