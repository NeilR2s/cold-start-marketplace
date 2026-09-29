import React, { useEffect } from "react";
import { X } from "lucide-react";
import { TravelerFilterState } from "../../types/travelers";
import {
  BITBIT_OPTIONS,
  KAPALIT_OPTIONS,
  MAX_QUANTITY_LIMIT,
  MAX_WEIGHT_LIMIT,
  RESTRICTION_OPTIONS,
  SWAP_MODE_OPTIONS,
  TRAVEL_TYPE_OPTIONS,
  TRAVELER_LOCATION_FILTERS,
  TRAVELER_ORIGINS,
} from "../../constants/travelerFilters";
import { TravelerFilterGroup } from "./TravelerFilterGroup";
import { Button } from "@/components/ui";

type TravelerFilterDrawerProps = {
  open: boolean;
  filters: TravelerFilterState;
  onChange: (filters: TravelerFilterState) => void;
  onClose: () => void;
  onReset: () => void;
};

const toggleValue = <T,>(values: T[], value: T) => (values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);

export function TravelerFilterDrawer({ open, filters, onChange, onClose, onReset }: TravelerFilterDrawerProps) {
  const setFilters = (payload: Partial<TravelerFilterState>) => onChange({ ...filters, ...payload });

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
      aria-labelledby="traveler-filters-title"
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
            <p className="text-xs font-semibold uppercase text-emerald-600">Traveler Filters</p>
            <h3 id="traveler-filters-title" className="text-lg font-bold text-slate-900">Dial in the perfect bitbit partner</h3>
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
          <TravelerFilterGroup title="Location Focus" subtitle="Multi-select">
            {TRAVELER_LOCATION_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilters({ locationFilters: toggleValue(filters.locationFilters, item) })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  filters.locationFilters.includes(item) ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {item}
              </button>
            ))}
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Origin" subtitle="Where travelers are flying from">
            {TRAVELER_ORIGINS.map((origin) => (
              <button
                key={origin}
                type="button"
                onClick={() => setFilters({ origins: toggleValue(filters.origins, origin) })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  filters.origins.includes(origin) ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {origin}
              </button>
            ))}
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Bitbit focus">
            {BITBIT_OPTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilters({ bitbit: toggleValue(filters.bitbit, item) })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  filters.bitbit.includes(item) ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"
                }`}
              >
                {item}
              </button>
            ))}
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Capacity available">
            <div className="w-full">
              <input
                type="range"
                min={0}
                max={MAX_WEIGHT_LIMIT}
                value={filters.minWeightCapacity ?? 0}
                onChange={(event) => setFilters({ minWeightCapacity: Number(event.target.value) || undefined })}
                className="w-full accent-emerald-500"
              />
              <p className="mt-1 text-xs font-semibold text-slate-600">
                ≥ {filters.minWeightCapacity ?? 0} kg capacity
              </p>
            </div>
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Quantity limit" subtitle="Minimum number of items they can take">
            <input
              type="number"
              min={0}
              max={MAX_QUANTITY_LIMIT}
              value={filters.minQuantityLimit ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                setFilters({ minQuantityLimit: value ? Math.min(Number(value), MAX_QUANTITY_LIMIT) : undefined });
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Exchange preference (Kapalit)">
            {KAPALIT_OPTIONS.map((pref) => (
              <button
                key={pref}
                type="button"
                onClick={() => setFilters({ kapalit: toggleValue(filters.kapalit, pref) })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  filters.kapalit.includes(pref) ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {pref}
              </button>
            ))}
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Travel type">
            {TRAVEL_TYPE_OPTIONS.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilters({ travelTypes: toggleValue(filters.travelTypes, type) })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  filters.travelTypes.includes(type) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {type}
              </button>
            ))}
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Swap mode">
            {SWAP_MODE_OPTIONS.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setFilters({ swapModes: toggleValue(filters.swapModes, mode) })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  filters.swapModes.includes(mode) ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {mode}
              </button>
            ))}
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Restrictions">
            {RESTRICTION_OPTIONS.map((flag) => (
              <button
                key={flag}
                type="button"
                onClick={() => setFilters({ restrictions: toggleValue(filters.restrictions, flag) })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  filters.restrictions.includes(flag) ? "border-amber-500 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {flag}
              </button>
            ))}
          </TravelerFilterGroup>
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
            Show travelers
          </Button>
        </div>
      </aside>
    </div>
  );
}
