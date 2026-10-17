import React from "react";
import { BarChart3, PieChart, Users, TrendingUp } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Track Expenses",
    description: "Monitor your spending in real time.",
    iconBg: "bg-[#E8F3EE]",
    iconColor: "text-[#087F68]",
  },
  {
    icon: PieChart,
    title: "Create Budgets",
    description: "Set limits and stay on track.",
    iconBg: "bg-[#FCF5E5]",
    iconColor: "text-[#D99016]",
  },
  {
    icon: Users,
    title: "Split Expenses",
    description: "Share and manage group bills easily.",
    iconBg: "bg-[#FDF0EB]",
    iconColor: "text-[#D9573B]",
  },
  {
    icon: TrendingUp,
    title: "Grow Smarter",
    description: "Get insights and make better financial decisions.",
    iconBg: "bg-[#E6F4F1]",
    iconColor: "text-[#087F68]",
  },
];

export default function AuthFeatureHighlights({ className = "" }) {
  return (
    <div
      className={`w-full max-w-[320px] xl:max-w-[340px] flex flex-col select-none ${className}`}
      style={{ display: "flex", flexDirection: "column", gap: "32px" }}
    >
      {features.map((feature, idx) => {
        const IconComponent = feature.icon;
        return (
          <div key={idx} className="flex items-center gap-4 sm:gap-5 group">
            {/* 68–76px Soft Pastel Icon Container */}
            <div
              className={`flex h-[68px] w-[68px] sm:h-[72px] sm:w-[72px] shrink-0 items-center justify-center rounded-[22px] ${feature.iconBg} ${feature.iconColor} transition-transform duration-200 group-hover:scale-105 shadow-[0_2px_10px_rgba(16,42,42,0.04)]`}
            >
              <IconComponent size={30} strokeWidth={2.2} />
            </div>

            {/* Feature Text: 18-20px Heading & 16-17px Description */}
            <div className="min-w-0 flex-1">
              <h3 className="text-[18px] sm:text-[19px] font-bold text-[#102A2A] tracking-tight leading-snug">
                {feature.title}
              </h3>
              <p className="text-[15px] sm:text-[16px] text-[#66736E] mt-1 font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
