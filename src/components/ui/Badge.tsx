import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "neutral"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "navy"
    | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    navy: "bg-[#0B192C] text-white border-transparent",
    outline: "bg-transparent text-slate-700 border-slate-300",
  };

  const sizes = {
    sm: "text-[11px] font-semibold px-2 py-0.5 rounded-md",
    md: "text-xs font-semibold px-2.5 py-1 rounded-lg",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border leading-none tracking-wide select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
