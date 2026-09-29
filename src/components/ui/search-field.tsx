import * as React from "react";
import { Search, X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  icon?: LucideIcon;
  inputClassName?: string;
}

export const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      value,
      onChange,
      onClear,
      placeholder = "Search...",
      icon: Icon = Search,
      className,
      inputClassName,
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={cn(
          "flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20",
          className
        )}
      >
        <Icon className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400",
            inputClassName
          )}
          {...props}
        />
        {onClear && value && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </label>
    );
  }
);
SearchField.displayName = "SearchField";
