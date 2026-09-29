import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui";

type SortDropdownProps<T extends string = string> = {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  onOpenFilters: () => void;
  label?: string;
};

export function SortDropdown<T extends string = string>({ value, options, onChange, onOpenFilters, label = "Sort" }: SortDropdownProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
      <label className="text-xs font-semibold uppercase text-slate-500">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <Button
        type="button"
        variant="outline"
        pill
        size="sm"
        onClick={onOpenFilters}
        className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
      >
        <ListFilter className="h-4 w-4" />
        Filters
      </Button>
    </div>
  );
}
