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

  return (
    <div className={`fixed inset-0 z-40 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-slate-900/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <aside
        className={`absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col rounded-t-3xl bg-white p-5 shadow-2xl transition-transform ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Traveler Filters</p>
            <h3 className="text-lg font-bold text-slate-900">Dial in the perfect bitbit partner</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 p-2">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-4 overflow-y-auto pb-32">
          <TravelerFilterGroup title="Location Focus" subtitle="Multi-select">
            {TRAVELER_LOCATION_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilters({ locationFilters: toggleValue(filters.locationFilters, item) })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  filters.locationFilters.includes(item) ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"
                }`}
              >
                {item}
              </button>
            ))}
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Origin (Travel Source)" subtitle="Select all that apply">
            {TRAVELER_ORIGINS.map((origin) => (
              <button
                key={origin}
                type="button"
                onClick={() => setFilters({ origins: toggleValue(filters.origins, origin) })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  filters.origins.includes(origin) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-600"
                }`}
              >
                {origin}
              </button>
            ))}
            <input
              type="text"
              value={filters.customOrigin ?? ""}
              placeholder="Custom country"
              onChange={(event) => setFilters({ customOrigin: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
            />
          </TravelerFilterGroup>

          <TravelerFilterGroup title="What they can bitbit" subtitle="Tap to toggle">
            {BITBIT_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilters({ bitbit: toggleValue(filters.bitbit, option) })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  filters.bitbit.includes(option) ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"
                }`}
              >
                {option}
              </button>
            ))}
            <input
              type="text"
              value={filters.customBitbit ?? ""}
              placeholder="Custom bitbit request"
              onChange={(event) => setFilters({ customBitbit: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
            />
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Restrictions">
            {RESTRICTION_OPTIONS.map((restriction) => (
              <button
                key={restriction}
                type="button"
                onClick={() => setFilters({ restrictions: toggleValue(filters.restrictions, restriction) })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  filters.restrictions.includes(restriction) ? "border-amber-500 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-600"
                }`}
              >
                {restriction}
              </button>
            ))}
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Weight limit (kg slider)" subtitle="Show travelers who can carry at least this much">
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
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
            />
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Exchange preference (Kapalit)">
            {KAPALIT_OPTIONS.map((pref) => (
              <button
                key={pref}
                type="button"
                onClick={() => setFilters({ kapalit: toggleValue(filters.kapalit, pref) })}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  filters.kapalit.includes(pref) ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"
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
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  filters.travelTypes.includes(type) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-600"
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
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  filters.swapModes.includes(mode) ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"
                }`}
              >
                {mode}
              </button>
            ))}
          </TravelerFilterGroup>
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
            Show travelers
          </button>
        </div>
      </aside>
    </div>
  );
}

