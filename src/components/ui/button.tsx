"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "default"
  | "amber"
  | "outline"
  | "ghost"
  | "destructive"
  | "secondary"
  | "white"
  | "white-outline";

type ButtonSize = "default" | "sm" | "lg" | "xl" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-[#1B3A5C] text-white hover:bg-[#152E4A] shadow-md",
  amber:
    "bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-md",
  outline:
    "border-2 border-[#1B3A5C] text-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white",
  ghost:
    "text-[#1B3A5C] hover:bg-[#EBF0F6]",
  destructive:
    "bg-red-600 text-white hover:bg-red-700",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200",
  white:
    "bg-white text-[#1B3A5C] hover:bg-slate-100 shadow-md",
  "white-outline":
    "border-2 border-white text-white hover:bg-white hover:text-[#1B3A5C]",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-5 py-2 text-sm",
  sm: "h-8 px-3 py-1 text-xs",
  lg: "h-12 px-8 py-3 text-base",
  xl: "h-14 px-10 py-4 text-lg",
  icon: "h-10 w-10",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A5C] focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
