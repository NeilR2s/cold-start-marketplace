import { X } from "lucide-react";
import { FilterState, TagCategory } from "../../types/explore";
import { BARTER_TYPES, CATEGORIES, EXCHANGE_METHODS, LOCATION_FILTERS, TAG_GROUPS } from "../../constants/exploreFilters";
import { CategoryChip } from "./CategoryChip";
import { TagChip } from "./TagChip";
import { FilterGroup } from "./FilterGroup";

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

  const toggleTag = (group: TagCategory, value: string) => {
    const groupValues = filters.tags[group] ?? [];
    const updatedGroup = groupValues.includes(value) ? groupValues.filter((v) => v !== value) : [...groupValues, value];
    setFilters({ tags: { ...filters.tags, [group]: updatedGroup } });
  };

  return (
    <div className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-slate-900/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col rounded-t-3xl bg-white p-5 shadow-2xl transition-transform ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Filters</p>
            <h3 className="text-lg font-bold text-slate-900">Sharpen your search</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 p-2">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-4 overflow-y-auto pb-32">
          <FilterGroup title="Barter Type" subtitle="Choose multiple">
            {BARTER_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilters({ barterTypes: toggleValue(filters.barterTypes, type) })}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                  filters.barterTypes.includes(type) ? "bg-emerald-500 text-white" : "bg-white text-slate-600"
                } border`}
              >
                {type}
              </button>
            ))}
          </FilterGroup>

          <FilterGroup title="Category" subtitle="Icon + label chips">
            {CATEGORIES.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                selected={filters.categories.includes(category)}
                onToggle={() => setFilters({ categories: toggleValue(filters.categories, category) })}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Exchange Method" subtitle="Pickup, delivery, drop-off or meetup">
            {EXCHANGE_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setFilters({ exchangeMethods: toggleValue(filters.exchangeMethods, method) })}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                  filters.exchangeMethods.includes(method) ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"
                }`}
              >
                {method}
              </button>
            ))}
          </FilterGroup>

          <FilterGroup title="Location" subtitle="Choose one primary focus">
            <div className="grid grid-cols-2 gap-2">
              {LOCATION_FILTERS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilters({ location: filters.location === option ? undefined : option })}
                  className={`rounded-2xl border px-3 py-2 text-sm font-semibold ${
                    filters.location === option ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </FilterGroup>

          {TAG_GROUPS.map((group) => (
            <FilterGroup key={group.label} title={group.label} subtitle="Multi-select">
              {group.options.map((tag) => (
                <TagChip
                  key={tag}
                  label={tag}
                  selected={filters.tags[group.label]?.includes(tag)}
                  onToggle={() => toggleTag(group.label, tag)}
                />
              ))}
            </FilterGroup>
          ))}
        </div>

        <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex items-center gap-3 rounded-t-2xl border-t border-slate-100 bg-white/95 p-4">
          <button type="button" className="flex-1 rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600" onClick={onReset}>
            Reset
          </button>
          <button
            type="button"
            className="flex-1 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white"
            onClick={onClose}
          >
            Show results
          </button>
        </div>
      </aside>
    </div>
  );
}

