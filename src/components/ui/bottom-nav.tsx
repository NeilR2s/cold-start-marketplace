import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  value: string;
  icon: LucideIcon;
  badge?: number | string;
}

export interface AppBottomNavProps {
  items: NavItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const AppBottomNav: React.FC<AppBottomNavProps> = ({
  items,
  value,
  onChange,
  className,
}) => {
  return (
    <nav className={cn("grid grid-cols-5 bg-white select-none", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = value === item.value;

        return (
          <button
            key={item.value}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onChange(item.value)}
            className={cn(
              "group relative flex min-h-16 flex-col items-center justify-center gap-1 px-2 text-[11px] font-semibold transition-all duration-150 active:scale-95 cursor-pointer",
              isActive
                ? "text-emerald-600 font-bold"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className="relative">
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-emerald-600 stroke-[2.5]" : "text-slate-400"
                )}
              />
              {item.badge ? (
                <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-white shadow-xs">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="tracking-tight">{item.label}</span>
            {isActive && (
              <span className="absolute bottom-1 h-0.5 w-6 rounded-full bg-emerald-600 transition-all" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
