import { useState } from "react";
import {
  Search,
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  HeartPulse,
  Home,
  Briefcase,
} from "lucide-react";

import CategoryCard from "./CategoryCard";

const categories = [
  {
    id: 1,
    name: "Food",
    type: "Expense",
    transactions: 45,
    icon: Utensils,
    color: "text-orange-400",
    bg: "bg-orange-500/15",
  },
  {
    id: 2,
    name: "Travel",
    type: "Expense",
    transactions: 18,
    icon: Car,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
  },
  {
    id: 3,
    name: "Shopping",
    type: "Expense",
    transactions: 27,
    icon: ShoppingBag,
    color: "text-pink-400",
    bg: "bg-pink-500/15",
  },
  {
    id: 4,
    name: "Health",
    type: "Expense",
    transactions: 12,
    icon: HeartPulse,
    color: "text-red-400",
    bg: "bg-red-500/15",
  },
  {
    id: 5,
    name: "Home",
    type: "Expense",
    transactions: 9,
    icon: Home,
    color: "text-green-400",
    bg: "bg-green-500/15",
  },
  {
    id: 6,
    name: "Salary",
    type: "Income",
    transactions: 8,
    icon: Briefcase,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
  },
];

function Categories() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || category.type === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Toolbar */}
      {/* Toolbar */}

<div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

  <div className="w-full xl:w-[72%]">
    <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-5">
      <Search
        size={20}
        className="text-slate-500"
      />

      <input
        type="text"
        placeholder="Search categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none"
      />
    </div>
  </div>

  <button className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 font-medium text-white transition hover:bg-indigo-500">
    <Plus size={20} />
    Add Category
  </button>

</div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {["All", "Income", "Expense"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              filter === item
                ? "bg-indigo-600 text-white"
                : "border border-slate-700 bg-slate-900 text-slate-400 hover:border-indigo-500 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>
    </div>
  );
}

export default Categories;