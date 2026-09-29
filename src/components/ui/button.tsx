import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white shadow-sm hover:bg-slate-800",
        emerald: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700",
        warning: "bg-amber-500 text-white shadow-sm hover:bg-amber-600",
        destructive: "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
        outline: "border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        link: "text-emerald-600 underline-offset-4 hover:underline p-0 h-auto",

      },
      size: {
        default: "h-11 px-4 py-2.5 text-sm",
        sm: "h-8 rounded-lg px-2.5 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-9 w-9 p-0 rounded-full",
      },
      pill: {
        true: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, pill, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, pill, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
