import React, { useEffect } from "react";
import { X } from "lucide-react";
import { FilterState, TagCategory, TagValue } from "../../types/explore";
import { BARTER_TYPES, CATEGORIES, EXCHANGE_METHODS, LOCATION_FILTERS, TAG_GROUPS } from "../../constants/exploreFilters";
import { CategoryChip } from "./CategoryChip";
import { TagChip } from "./TagChip";
import { FilterGroup } from "./FilterGroup";
import { Button } from "@/components/ui";

type FilterDrawerProps = {
  open: boolean;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClose: () => void;
  onReset: () => void;
};

const toggleValue = <T,>(values: T[], value: T) => (values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);

export function FilterDrawer({ open, filters, onChange, onClose, onReset }: FilterDrawerProps) {
  const setFilters = (payload: Partial<FilterState>) => onChange({ ...filters, ...payload });

  const toggleTag = (group: TagCategory, value: TagValue) => {
    const groupValues = filters.tags[group] ?? [];
    const updatedGroup = groupValues.includes(value) ? groupValues.filter((v) => v !== value) : [...groupValues, value];
    setFilters({ tags: { ...filters.tags, [group]: updatedGroup } });
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explore-filters-title"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-white p-5 shadow-2xl z-10 animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-150"
      >
        <header className="mb-4 flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-600">Filters</p>
            <h3 id="explore-filters-title" className="text-lg font-bold text-slate-900">Sharpen your search</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="rounded-full border border-slate-200 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-4 overflow-y-auto pr-1 pb-4">
          <FilterGroup title="Barter Type" subtitle="Choose multiple">
            {BARTER_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilters({ barterTypes: toggleValue(filters.barterTypes, type) })}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  filters.barterTypes.includes(type) ? "bg-emerald-600 text-white border border-emerald-600" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {type}
              </button>
            ))}
          </FilterGroup>

          <FilterGroup title="Categories" subtitle="Filter by type of item or service">
            {CATEGORIES.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                selected={filters.categories.includes(category)}
                onToggle={() => setFilters({ categories: toggleValue(filters.categories, category) })}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Exchange Methods" subtitle="How trades can happen">
            {EXCHANGE_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setFilters({ exchangeMethods: toggleValue(filters.exchangeMethods, method) })}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  filters.exchangeMethods.includes(method) ? "bg-slate-900 text-white border border-slate-900" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {method}
              </button>
            ))}
          </FilterGroup>

          <FilterGroup title="Location Filter" subtitle="Choose one location focus">
            {LOCATION_FILTERS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setFilters({ location: filters.location === loc ? undefined : loc })}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  filters.location === loc ? "bg-emerald-600 text-white border border-emerald-600" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {loc}
              </button>
            ))}
          </FilterGroup>

          {TAG_GROUPS.map((group) => (
            <FilterGroup key={group.label} title={group.label} subtitle="Specific item & barter attributes">
              {group.options.map((option) => (
                <TagChip
                  key={option}
                  label={option}
                  selected={Boolean(filters.tags[group.label]?.includes(option))}
                  onToggle={() => toggleTag(group.label, option)}
                />
              ))}
            </FilterGroup>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t border-slate-100 bg-white pt-4">
          <Button 
            variant="outline"
            className="flex-1"
            onClick={onReset}
          >
            Reset
          </Button>
          <Button
            variant="emerald"
            className="flex-1 font-bold"
            onClick={onClose}
          >
            Show results
          </Button>
        </div>
      </aside>
    </div>
  );
}
