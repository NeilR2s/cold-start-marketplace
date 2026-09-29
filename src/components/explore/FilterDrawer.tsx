import React, { useEffect, useRef } from "react";
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
  const drawerRef = useRef<HTMLElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const setFilters = (payload: Partial<FilterState>) => onChange({ ...filters, ...payload });

  const toggleTag = (group: TagCategory, value: TagValue) => {
    const groupValues = filters.tags[group] ?? [];
    const updatedGroup = groupValues.includes(value) ? groupValues.filter((v) => v !== value) : [...groupValues, value];
    setFilters({ tags: { ...filters.tags, [group]: updatedGroup } });
  };

  useEffect(() => {
    if (!open) return;
    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;

    const drawer = drawerRef.current;
    if (drawer) {
      const focusable = drawer.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        drawer.focus();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === "Tab" && drawer) {
        const focusable = Array.from(
          drawer.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
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
        ref={drawerRef}
        tabIndex={-1}
        className="relative w-full sm:max-w-lg md:max-w-xl max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-white p-5 shadow-2xl z-10 animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-150 outline-none"
      >
        <header className="mb-4 flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-600">Filters</p>
            <h3 id="explore-filters-title" className="text-lg font-bold text-slate-900">Sharpen your search</h3>
          </div>
          <Button 
            type="button" 
            variant="ghost"
            size="icon"
            onClick={onClose} 
            className="rounded-full border border-slate-200 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer h-9 w-9"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </Button>
        </header>

        <div className="space-y-4 overflow-y-auto pr-1 pb-4">
          <FilterGroup title="Barter Type" subtitle="Choose multiple">
            {BARTER_TYPES.map((type) => {
              const selected = filters.barterTypes.includes(type);
              return (
                <Button
                  key={type}
                  type="button"
                  variant={selected ? "emerald" : "outline"}
                  pill
                  size="sm"
                  onClick={() => setFilters({ barterTypes: toggleValue(filters.barterTypes, type) })}
                  className={
                    selected
                      ? "h-auto py-1.5 px-4 text-xs font-semibold shadow-xs"
                      : "h-auto py-1.5 px-4 text-xs font-semibold border-slate-200 text-slate-600 hover:border-slate-300"
                  }
                >
                  {type}
                </Button>
              );
            })}
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
            {EXCHANGE_METHODS.map((method) => {
              const selected = filters.exchangeMethods.includes(method);
              return (
                <Button
                  key={method}
                  type="button"
                  variant={selected ? "default" : "outline"}
                  pill
                  size="sm"
                  onClick={() => setFilters({ exchangeMethods: toggleValue(filters.exchangeMethods, method) })}
                  className={
                    selected
                      ? "h-auto py-1.5 px-4 text-xs font-semibold bg-slate-900 text-white shadow-xs"
                      : "h-auto py-1.5 px-4 text-xs font-semibold border-slate-200 text-slate-600 hover:border-slate-300"
                  }
                >
                  {method}
                </Button>
              );
            })}
          </FilterGroup>

          <FilterGroup title="Location Filter" subtitle="Choose one location focus">
            {LOCATION_FILTERS.map((loc) => {
              const selected = filters.location === loc;
              return (
                <Button
                  key={loc}
                  type="button"
                  variant={selected ? "emerald" : "outline"}
                  pill
                  size="sm"
                  onClick={() => setFilters({ location: filters.location === loc ? undefined : loc })}
                  className={
                    selected
                      ? "h-auto py-1.5 px-4 text-xs font-semibold shadow-xs"
                      : "h-auto py-1.5 px-4 text-xs font-semibold border-slate-200 text-slate-600 hover:border-slate-300"
                  }
                >
                  {loc}
                </Button>
              );
            })}
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
