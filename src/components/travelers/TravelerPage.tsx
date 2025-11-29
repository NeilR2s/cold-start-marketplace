import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Rows3, Sparkles, ClipboardCheck, X } from "lucide-react";
import { SortDropdown } from "../explore/SortDropdown";
import { TravelerFilterDrawer } from "./TravelerFilterDrawer";
import { TravelerFilterPills } from "./TravelerFilterPills";
import { TravelerGrid } from "./TravelerGrid";
import { TRAVELER_SORT_OPTIONS } from "../../constants/travelerFilters";
import { TRAVELERS } from "../../data/travelers";
import { TravelerFilterState, TravelerProfile, TravelerSortOption } from "../../types/travelers";
import { buildTravelerFilterPills, defaultTravelerFilters, filterTravelers, sortTravelers } from "../../utils/travelerFilters";

const INITIAL_VISIBLE = 4;

export function TravelerPage() {
  const [filters, setFilters] = useState<TravelerFilterState>(defaultTravelerFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [layout, setLayout] = useState<"grid" | "list">("list");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [selectedTraveler, setSelectedTraveler] = useState<TravelerProfile | null>(null);
  const [chatToast, setChatToast] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => filterTravelers(TRAVELERS, filters), [filters]);
  const sorted = useMemo(() => sortTravelers(filtered, filters.sort), [filtered, filters.sort]);
  const visibleTravelers = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  const pills = buildTravelerFilterPills(filters);

  const updateFilters = (next: TravelerFilterState) => {
    setVisibleCount(INITIAL_VISIBLE);
    setFilters(next);
  };

  const handleSortChange = (value: TravelerSortOption) => updateFilters({ ...filters, sort: value });

  const removeFromArray = <T,>(arr: T[], value: T) => arr.filter((item) => item !== value);

  const handlePillRemove = (key: string) => {
    if (key === "query") return updateFilters({ ...filters, query: "" });
    if (key === "customOrigin") return updateFilters({ ...filters, customOrigin: "" });
    if (key === "customBitbit") return updateFilters({ ...filters, customBitbit: "" });
    if (key === "minWeightCapacity") return updateFilters({ ...filters, minWeightCapacity: undefined });
    if (key === "minQuantityLimit") return updateFilters({ ...filters, minQuantityLimit: undefined });

    const [type, value] = key.split("|");
    if (!value) return;

    switch (type) {
      case "location":
        return updateFilters({ ...filters, locationFilters: removeFromArray(filters.locationFilters, value as any) });
      case "origin":
        return updateFilters({ ...filters, origins: removeFromArray(filters.origins, value as any) });
      case "bitbit":
        return updateFilters({ ...filters, bitbit: removeFromArray(filters.bitbit, value as any) });
      case "restriction":
        return updateFilters({ ...filters, restrictions: removeFromArray(filters.restrictions, value as any) });
      case "kapalit":
        return updateFilters({ ...filters, kapalit: removeFromArray(filters.kapalit, value as any) });
      case "travelType":
        return updateFilters({ ...filters, travelTypes: removeFromArray(filters.travelTypes, value as any) });
      case "swap":
        return updateFilters({ ...filters, swapModes: removeFromArray(filters.swapModes, value as any) });
      default:
        return;
    }
  };

  const handleClearAll = () => {
    setDrawerOpen(false);
    updateFilters(defaultTravelerFilters);
  };

  const handleMessageTraveler = async (traveler: TravelerProfile) => {
    const template = traveler.messageTemplates[0] ?? `Hi ${traveler.name}! Interested in a swap?`;
    try {
      await navigator.clipboard?.writeText(template);
      setChatToast("Template copied. Launch chat to continue the convo!");
    } catch {
      setChatToast("Template ready. Paste it inside chat!");
    }
    setTimeout(() => setChatToast(null), 2500);
    navigate("/messages", { state: { conversationId: traveler.conversationId, chatType: "traveler" } });
  };

  return (
    <div className="space-y-5 pb-24 pt-6">
      {chatToast && (
        <div className="mx-4 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {chatToast}
        </div>
      )}

      <header className="space-y-3 px-4">
        <p className="text-xs font-semibold uppercase text-emerald-600">Traveler Discovery</p>
        <h1 className="text-2xl font-black text-slate-900">Match with active bitbit partners.</h1>
        <p className="text-sm text-slate-500">Filter by origin, route, kapalit, and restrictions to find a perfect barter match.</p>

        <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500">
          <Sparkles className="h-5 w-5 text-slate-400" />
          <input
            value={filters.query}
            onChange={(event) => updateFilters({ ...filters, query: event.target.value })}
            placeholder="Search traveler, bitbit, kapalit..."
            className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>
      </header>

      <section className="space-y-4 px-4">
        <div className="flex flex-col gap-3">
          <SortDropdown
            value={filters.sort}
            options={TRAVELER_SORT_OPTIONS}
            onChange={handleSortChange}
            onOpenFilters={() => setDrawerOpen(true)}
            label="Sort travelers"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`rounded-full border px-3 py-2 ${layout === "list" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400"}`}
              onClick={() => setLayout("list")}
              aria-label="List view"
            >
              <Rows3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              className={`rounded-full border px-3 py-2 ${layout === "grid" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400"}`}
              onClick={() => setLayout("grid")}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        <TravelerFilterPills pills={pills} onRemove={handlePillRemove} onClearAll={handleClearAll} />
      </section>

      <section className="px-4">
        <TravelerGrid
          travelers={visibleTravelers}
          layout={layout}
          onSelect={setSelectedTraveler}
          onMessage={handleMessageTraveler}
          onProposeSwap={setSelectedTraveler}
          onLoadMore={() => setVisibleCount((prev) => prev + 4)}
          hasMore={hasMore}
        />
      </section>

      <TravelerFilterDrawer
        open={drawerOpen}
        filters={filters}
        onChange={updateFilters}
        onClose={() => setDrawerOpen(false)}
        onReset={() => updateFilters(defaultTravelerFilters)}
      />

      <TravelerProfileModal traveler={selectedTraveler} onClose={() => setSelectedTraveler(null)} onMessage={handleMessageTraveler} />
    </div>
  );
}

type TravelerProfileModalProps = {
  traveler: TravelerProfile | null;
  onClose: () => void;
  onMessage: (traveler: TravelerProfile) => void;
};

function TravelerProfileModal({ traveler, onClose, onMessage }: TravelerProfileModalProps) {
  if (!traveler) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Traveler Profile</p>
            <h3 className="text-lg font-bold text-slate-900">{traveler.name}</h3>
          </div>
          <button onClick={onClose} className="rounded-full border border-slate-200 p-2">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-4 overflow-y-auto px-5 py-6">
          <section className="rounded-2xl border border-slate-100 p-4">
            <p className="text-xs font-semibold uppercase text-slate-400">Route</p>
            <p className="text-sm font-semibold text-slate-800">{traveler.routePath}</p>
            <p className="text-xs text-slate-500">{traveler.trip.timelineLabel}</p>
            {traveler.trip.stayNotes && <p className="mt-2 text-xs text-slate-500">{traveler.trip.stayNotes}</p>}
          </section>

          <section className="rounded-2xl bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase text-slate-400">Bitbit focus</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
              {traveler.bitbit.map((item) => (
                <span key={item} className="rounded-full bg-white px-3 py-1">
                  {item}
                </span>
              ))}
            </div>
            {traveler.bitbitNotes && <p className="mt-2 text-xs text-slate-500">{traveler.bitbitNotes}</p>}
          </section>

          <section className="rounded-2xl border border-slate-100 p-4 text-xs">
            <p className="font-semibold text-slate-700">Restrictions</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              {traveler.restrictions.flags.map((flag) => (
                <span key={flag} className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">
                  {flag}
                </span>
              ))}
            </div>
            <p className="mt-3 text-slate-600">
              Weight limit: <strong>{traveler.restrictions.weightLimitKg}kg</strong> · Quantity limit:{" "}
              <strong>{traveler.restrictions.quantityLimit} items</strong>
            </p>
            {traveler.restrictions.notes && <p className="mt-2 text-slate-500">{traveler.restrictions.notes}</p>}
          </section>

          <section className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-xs">
            <p className="font-semibold uppercase text-emerald-700">Kapalit sweet spot</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-emerald-800">
              {traveler.kapalitPreferences.map((pref) => (
                <span key={pref} className="rounded-full bg-white px-3 py-1">
                  {pref}
                </span>
              ))}
            </div>
            {traveler.kapalitNotes && <p className="mt-2 text-emerald-700/80">{traveler.kapalitNotes}</p>}
          </section>

          <section className="rounded-2xl border border-slate-100 p-4 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Message templates</p>
            <div className="mt-3 space-y-3">
              {traveler.messageTemplates.map((template, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    onMessage(traveler);
                    onClose();
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:border-emerald-300"
                >
                  <span className="inline-flex items-center gap-2 text-xs uppercase text-slate-400">
                    <ClipboardCheck className="h-3.5 w-3.5" /> Copy & chat
                  </span>
                  <p className="mt-1 text-slate-600">“{template}”</p>
                </button>
              ))}
            </div>
          </section>
        </div>

        <footer className="border-t border-slate-100 p-4">
          <button
            type="button"
            className="w-full rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            onClick={() => {
              onMessage(traveler);
              onClose();
            }}
          >
            Copy message & open chat
          </button>
        </footer>
      </div>
    </div>
  );
}

