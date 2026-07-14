"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Star, MapPin, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import clsx from "clsx";

// ─── Badge ───
export function Badge({
  children,
  variant = "default",
  size = "sm",
}: {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
}) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-primary-50 text-primary-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    info: "bg-blue-50 text-blue-700",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      {children}
    </span>
  );
}

// ─── Star Rating ───
export function StarRating({
  rating,
  reviews,
}: {
  rating: number;
  reviews?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={clsx(
            "w-3.5 h-3.5",
            i < Math.floor(rating) ? "text-amber-400" : "text-gray-200"
          )}
          fill={i < Math.floor(rating) ? "currentColor" : "none"}
        />
      ))}
      <span className="text-sm font-medium text-gray-700 ml-1">{rating}</span>
      {reviews !== undefined && (
        <span className="text-xs text-gray-400">({reviews})</span>
      )}
    </div>
  );
}

// ─── User Avatar ───
export function UserAvatar({
  name,
  avatar,
  size = "md",
  verified,
}: {
  name: string;
  avatar: string;
  size?: "sm" | "md" | "lg";
  verified?: boolean;
}) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
  return (
    <div className="relative">
      <div
        className={clsx(
          "gradient-health rounded-full flex items-center justify-center text-white font-bold",
          sizes[size]
        )}
      >
        {avatar}
      </div>
      {verified && (
        <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-health-green bg-white rounded-full" />
      )}
    </div>
  );
}

// ─── Search Bar ───
export function SearchBar({ placeholder }: { placeholder?: string }) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
      />
      <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 gradient-health rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity">
        Search
      </button>
    </div>
  );
}

// ─── Filter Tabs ───
export function FilterTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={clsx(
            "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
            active === tab
              ? "gradient-health text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ─── Section Header ───
export function SectionHeader({
  title,
  subtitle,
  action,
  actionHref,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>
      {action && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {action}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

// ─── Empty State ───
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionHref,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-6 py-3 gradient-health text-white rounded-xl font-medium hover:opacity-90"
        >
          {action}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
