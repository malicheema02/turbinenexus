import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "outline" | "secondary";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[#1B3A5C] text-white",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
  outline: "border border-[#1B3A5C] text-[#1B3A5C]",
  secondary: "bg-slate-100 text-slate-700",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
