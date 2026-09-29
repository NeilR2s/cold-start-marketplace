import React, { useEffect, useRef } from "react";
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
import { Button, Input } from "@/components/ui";

type TravelerFilterDrawerProps = {
  open: boolean;
  filters: TravelerFilterState;
  onChange: (filters: TravelerFilterState) => void;
  onClose: () => void;
  onReset: () => void;
};

const toggleValue = <T,>(values: T[], value: T) => (values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);

export function TravelerFilterDrawer({ open, filters, onChange, onClose, onReset }: TravelerFilterDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const setFilters = (payload: Partial<TravelerFilterState>) => onChange({ ...filters, ...payload });

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
      aria-labelledby="traveler-filters-title"
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
            <p className="text-xs font-semibold uppercase text-emerald-600">Traveler Filters</p>
            <h3 id="traveler-filters-title" className="text-lg font-bold text-slate-900">Dial in the perfect bitbit partner</h3>
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
          <TravelerFilterGroup title="Location Focus" subtitle="Multi-select">
            {TRAVELER_LOCATION_FILTERS.map((item) => {
              const selected = filters.locationFilters.includes(item);
              return (
                <Button
                  key={item}
                  type="button"
                  variant={selected ? "emerald" : "outline"}
                  pill
                  size="sm"
                  onClick={() => setFilters({ locationFilters: toggleValue(filters.locationFilters, item) })}
                  className={
                    selected
                      ? "h-auto py-1.5 px-3 text-xs font-semibold shadow-xs"
                      : "h-auto py-1.5 px-3 text-xs font-semibold border-slate-200 text-slate-600 hover:border-slate-300"
                  }
                >
                  {item}
                </Button>
              );
            })}
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Origin" subtitle="Where travelers are flying from">
            {TRAVELER_ORIGINS.map((origin) => {
              const selected = filters.origins.includes(origin);
              return (
                <Button
                  key={origin}
                  type="button"
                  variant={selected ? "emerald" : "outline"}
                  pill
                  size="sm"
                  onClick={() => setFilters({ origins: toggleValue(filters.origins, origin) })}
                  className={
                    selected
                      ? "h-auto py-1.5 px-3 text-xs font-semibold shadow-xs"
                      : "h-auto py-1.5 px-3 text-xs font-semibold border-slate-200 text-slate-600 hover:border-slate-300"
                  }
                >
                  {origin}
                </Button>
              );
            })}
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Bitbit focus">
            {BITBIT_OPTIONS.map((item) => {
              const selected = filters.bitbit.includes(item);
              return (
                <Button
                  key={item}
                  type="button"
                  variant={selected ? "emerald" : "outline"}
                  pill
                  size="sm"
                  onClick={() => setFilters({ bitbit: toggleValue(filters.bitbit, item) })}
                  className={
                    selected
                      ? "h-auto py-1.5 px-3 text-xs font-semibold shadow-xs"
                      : "h-auto py-1.5 px-3 text-xs font-semibold border-slate-200 text-slate-600 hover:border-slate-300"
                  }
                >
                  {item}
                </Button>
              );
            })}
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Capacity available">
            <div className="w-full">
              <input
                type="range"
                min={0}
                max={MAX_WEIGHT_LIMIT}
                value={filters.minWeightCapacity ?? 0}
                onChange={(event) => setFilters({ minWeightCapacity: Number(event.target.value) || undefined })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="mt-1 text-xs font-semibold text-slate-600">
                ≥ {filters.minWeightCapacity ?? 0} kg capacity
              </p>
            </div>
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Quantity limit" subtitle="Minimum number of items they can take">
            <Input
              type="number"
              min={0}
              max={MAX_QUANTITY_LIMIT}
              value={filters.minQuantityLimit ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                setFilters({ minQuantityLimit: value ? Math.min(Number(value), MAX_QUANTITY_LIMIT) : undefined });
              }}
              placeholder="e.g. 5"
              className="w-full"
            />
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Exchange preference (Kapalit)">
            {KAPALIT_OPTIONS.map((pref) => {
              const selected = filters.kapalit.includes(pref);
              return (
                <Button
                  key={pref}
                  type="button"
                  variant={selected ? "emerald" : "outline"}
                  pill
                  size="sm"
                  onClick={() => setFilters({ kapalit: toggleValue(filters.kapalit, pref) })}
                  className={
                    selected
                      ? "h-auto py-1.5 px-3 text-xs font-semibold shadow-xs"
                      : "h-auto py-1.5 px-3 text-xs font-semibold border-slate-200 text-slate-600 hover:border-slate-300"
                  }
                >
                  {pref}
                </Button>
              );
            })}
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Travel type">
            {TRAVEL_TYPE_OPTIONS.map((type) => {
              const selected = filters.travelTypes.includes(type);
              return (
                <Button
                  key={type}
                  type="button"
                  variant={selected ? "default" : "outline"}
                  pill
                  size="sm"
                  onClick={() => setFilters({ travelTypes: toggleValue(filters.travelTypes, type) })}
                  className={
                    selected
                      ? "h-auto py-1.5 px-3 text-xs font-semibold bg-slate-900 text-white shadow-xs"
                      : "h-auto py-1.5 px-3 text-xs font-semibold border-slate-200 text-slate-600 hover:border-slate-300"
                  }
                >
                  {type}
                </Button>
              );
            })}
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Swap mode">
            {SWAP_MODE_OPTIONS.map((mode) => {
              const selected = filters.swapModes.includes(mode);
              return (
                <Button
                  key={mode}
                  type="button"
                  variant={selected ? "emerald" : "outline"}
                  pill
                  size="sm"
                  onClick={() => setFilters({ swapModes: toggleValue(filters.swapModes, mode) })}
                  className={
                    selected
                      ? "h-auto py-1.5 px-3 text-xs font-semibold shadow-xs"
                      : "h-auto py-1.5 px-3 text-xs font-semibold border-slate-200 text-slate-600 hover:border-slate-300"
                  }
                >
                  {mode}
                </Button>
              );
            })}
          </TravelerFilterGroup>

          <TravelerFilterGroup title="Restrictions">
            {RESTRICTION_OPTIONS.map((flag) => {
              const selected = filters.restrictions.includes(flag);
              return (
                <Button
                  key={flag}
                  type="button"
                  variant={selected ? "warning" : "outline"}
                  pill
                  size="sm"
                  onClick={() => setFilters({ restrictions: toggleValue(filters.restrictions, flag) })}
                  className={
                    selected
                      ? "h-auto py-1.5 px-3 text-xs font-semibold bg-amber-50 border-amber-400 text-amber-800 shadow-xs"
                      : "h-auto py-1.5 px-3 text-xs font-semibold border-slate-200 text-slate-600 hover:border-slate-300"
                  }
                >
                  {flag}
                </Button>
              );
            })}
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
