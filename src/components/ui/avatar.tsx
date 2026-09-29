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
        sm: "h-6 w-6 text-[10px]",
        md: "h-9 w-9 text-xs",
        lg: "h-14 w-14 text-xl",
        xl: "h-24 w-24 text-2xl md:h-28 md:w-28",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

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

  return (
    <div className="relative inline-block shrink-0">
      <AvatarRoot size={size} className={className} {...props}>
        {src ? <AvatarImage src={src} alt={name || "User Avatar"} /> : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </AvatarRoot>
      {verified && (
        <div className="absolute -bottom-1 -right-1 z-10 rounded-full bg-white p-0.5 shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500/15" />
        </div>
      )}
    </div>
  );
}

export { AvatarRoot, AvatarImage, AvatarFallback };
