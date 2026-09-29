import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { ShieldCheck } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm select-none",
  {
    variants: {
      size: {
        xs: "h-7 w-7 text-[10px]",
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-14 w-14 text-xl",
        xl: "h-20 w-20 text-xl md:h-24 md:w-24 md:text-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const shieldConfig: Record<string, { container: string; icon: string }> = {
  xs: {
    container: "absolute -bottom-0.5 -right-0.5 z-10 rounded-full bg-white p-[1px] shadow-xs",
    icon: "h-2 w-2 text-emerald-600 fill-emerald-100",
  },
  sm: {
    container: "absolute -bottom-0.5 -right-0.5 z-10 rounded-full bg-white p-[1.5px] shadow-xs",
    icon: "h-2.5 w-2.5 text-emerald-600 fill-emerald-100",
  },
  md: {
    container: "absolute -bottom-0.5 -right-0.5 z-10 rounded-full bg-white p-0.5 shadow-xs",
    icon: "h-3.5 w-3.5 text-emerald-600 fill-emerald-100",
  },
  lg: {
    container: "absolute bottom-0 right-0 z-10 rounded-full bg-white p-1 shadow-xs",
    icon: "h-4 w-4 text-emerald-600 fill-emerald-100",
  },
  xl: {
    container: "absolute bottom-0.5 right-0.5 z-10 rounded-full bg-white p-1 md:p-1.5 shadow-md",
    icon: "h-5 w-5 md:h-6 md:w-6 text-emerald-600 fill-emerald-100",
  },
};

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarVariants>
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size, className }))}
    {...props}
  />
));
AvatarRoot.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 font-bold text-white shadow-sm",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarRoot> {
  src?: string;
  name?: string;
  verified?: boolean;
}

export function Avatar({
  src,
  name,
  verified = false,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const initials = (name || "?").trim().substring(0, 2).toUpperCase();
  const currentSize = (typeof size === "string" && shieldConfig[size] ? size : "md");
  const currentShield = shieldConfig[currentSize];

  return (
    <div className="relative inline-block shrink-0">
      <AvatarRoot size={size} className={className} {...props}>
        {src ? <AvatarImage src={src} alt={name || "User Avatar"} /> : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </AvatarRoot>
      {verified && (
        <div className={currentShield.container}>
          <ShieldCheck className={currentShield.icon} />
        </div>
      )}
    </div>
  );
}

export { AvatarRoot, AvatarImage, AvatarFallback };
