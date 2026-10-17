import {
  Utensils,
  Car,
  ShoppingBag,
  HeartPulse,
  Home,
  Briefcase,
  GraduationCap,
  Gamepad2,
  Wallet,
  Receipt,
  PiggyBank,
  Landmark,
} from "lucide-react";

export const categoryIcons = [
  {
    label: "Food",
    name: "Utensils",
    icon: Utensils,
    color: "text-orange-400",
    bg: "bg-orange-500/15",
  },
  {
    label: "Travel",
    name: "Car",
    icon: Car,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
  },
  {
    label: "Shopping",
    name: "ShoppingBag",
    icon: ShoppingBag,
    color: "text-pink-400",
    bg: "bg-pink-500/15",
  },
  {
    label: "Health",
    name: "HeartPulse",
    icon: HeartPulse,
    color: "text-red-400",
    bg: "bg-red-500/15",
  },
  {
    label: "Home",
    name: "Home",
    icon: Home,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
  },
  {
    label: "Salary",
    name: "Briefcase",
    icon: Briefcase,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
  },
  {
    label: "Education",
    name: "GraduationCap",
    icon: GraduationCap,
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
  },
  {
    label: "Entertainment",
    name: "Gamepad2",
    icon: Gamepad2,
    color: "text-yellow-400",
    bg: "bg-yellow-500/15",
  },
  {
    label: "Bills",
    name: "Receipt",
    icon: Receipt,
    color: "text-rose-400",
    bg: "bg-rose-500/15",
  },
  {
    label: "Savings",
    name: "PiggyBank",
    icon: PiggyBank,
    color: "text-lime-400",
    bg: "bg-lime-500/15",
  },
  {
    label: "Investment",
    name: "Landmark",
    icon: Landmark,
    color: "text-indigo-400",
    bg: "bg-indigo-500/15",
  },
  {
    label: "Other",
    name: "Wallet",
    icon: Wallet,
    color: "text-slate-400",
    bg: "bg-slate-500/15",
  },
];

export function getCategoryIconMeta(nameOrIcon) {
  if (!nameOrIcon) return categoryIcons[11]; // Other
  if (typeof nameOrIcon === "object" && nameOrIcon.icon) return nameOrIcon;

  const found = categoryIcons.find(
    (c) =>
      c.label.toLowerCase() === String(nameOrIcon).toLowerCase() ||
      c.name.toLowerCase() === String(nameOrIcon).toLowerCase()
  );

  return found || categoryIcons[11];
}