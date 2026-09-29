import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
  {
    variants: {
      variant: {
        default: "border-transparent bg-slate-900 text-white",
        neutral: "border-slate-200 bg-slate-100 text-slate-600",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
        warning: "border-amber-200 bg-amber-50 text-amber-700",
        accent: "border-emerald-200 bg-emerald-100 text-emerald-800",
        groupOrder: "border-blue-200 bg-blue-100 text-blue-700",
        pasabuy: "border-purple-200 bg-purple-100 text-purple-700",
        onHand: "border-emerald-200 bg-emerald-100 text-emerald-700",
        destructive: "border-rose-200 bg-rose-50 text-rose-700",
        outline: "border-slate-300 text-slate-700 bg-transparent",
      },
      pill: {
        true: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  type?: string;
}

function resolveBadgeVariant(type?: string, variant?: VariantProps<typeof badgeVariants>["variant"]) {
  if (variant) return variant;
  switch (type) {
    case "Group Order":
      return "groupOrder";
    case "Pasabuy":
      return "pasabuy";
    case "On Hand":
      return "onHand";
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "accent":
      return "accent";
    case "neutral":
      return "neutral";
    case "destructive":
      return "destructive";
    case "outline":
      return "outline";
    default:
      return "neutral";
  }
}

export function Badge({ className, variant, type, pill, ...props }: BadgeProps) {
  const resolvedVariant = resolveBadgeVariant(type, variant);
  const isPill = pill ?? (type === "Group Order" || type === "Pasabuy" || type === "On Hand");

  return (
    <span
      className={cn(badgeVariants({ variant: resolvedVariant, pill: isPill }), className)}
      {...props}
    />
  );
}

export { badgeVariants };
