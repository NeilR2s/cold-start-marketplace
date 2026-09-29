import { ArrowUpDown, ListFilter } from "lucide-react";

export type SortDropdownProps<T extends string = string> = {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
  label?: string;
  className?: string;
};

export function SortDropdown<T extends string = string>({ 
  value, 
  options, 
  onChange, 
  onOpenFilters,
  activeFilterCount = 0,
  className = ""
}: SortDropdownProps<T>) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Sleek Sort Selector */}
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
          <ArrowUpDown className="h-3.5 w-3.5" />
        </div>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          aria-label="Sort options"
          className="h-10 sm:h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-8 pr-7 text-xs font-semibold text-slate-700 shadow-xs hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-colors"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2.5 flex items-center text-slate-400 text-[10px]">
          ▾
        </div>
      </div>

      {/* Sleek Filter Trigger Button */}
      {onOpenFilters && (
        <button
          type="button"
          onClick={onOpenFilters}
          className="h-10 sm:h-11 flex items-center gap-1.5 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <ListFilter className="h-3.5 w-3.5 text-slate-500" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white shadow-xs">
              {activeFilterCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
