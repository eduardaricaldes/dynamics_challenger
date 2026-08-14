"use client";

import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: number | string;
  description: string;
  variant: "indigo" | "emerald" | "violet" | "amber";
  loading?: boolean;
}

const VARIANTS = {
  indigo: {
    card: "border-l-indigo-500",
    icon: "bg-indigo-50 text-indigo-600",
    value: "text-indigo-700",
  },
  emerald: {
    card: "border-l-emerald-500",
    icon: "bg-emerald-50 text-emerald-600",
    value: "text-emerald-700",
  },
  violet: {
    card: "border-l-violet-500",
    icon: "bg-violet-50 text-violet-600",
    value: "text-violet-700",
  },
  amber: {
    card: "border-l-amber-500",
    icon: "bg-amber-50 text-amber-600",
    value: "text-amber-700",
  },
};

export function MetricCard({
  icon: Icon,
  title,
  value,
  description,
  variant,
  loading = false,
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          <div className="h-4 bg-gray-200 rounded w-28" />
        </div>
        <div className="h-9 bg-gray-200 rounded w-16 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-36" />
      </div>
    );
  }

  const v = VARIANTS[variant];

  return (
    <div className={`bg-white rounded-xl border border-gray-100 border-l-4 shadow-sm p-5 ${v.card}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${v.icon}`}>
          <Icon size={20} />
        </div>
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <p className={`text-3xl font-bold mb-1 ${v.value}`}>{value}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}
