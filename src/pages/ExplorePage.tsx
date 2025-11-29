import { useMemo, useState } from "react";
import { Search, LayoutGrid, Rows3 } from "lucide-react";
import { SortDropdown } from "../components/explore/SortDropdown";
import { FilterPills } from "../components/explore/FilterPills";
import { FilterDrawer } from "../components/explore/FilterDrawer";
import { SwapGrid } from "../components/explore/SwapGrid";
import { SWAP_LISTINGS } from "../data/swapListings";
import { buildFilterPills, defaultFilters, filterListings, sortListings } from "../utils/exploreFilters";
import { FilterState, SwapSortOption } from "../types/explore";
import { SWAP_SORT_OPTIONS } from "../constants/exploreFilters";
import { TravelerPage } from "../components/travelers/TravelerPage";

const INITIAL_VISIBLE = 4;  

const ExplorePage = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [activeTab, setActiveTab] = useState<"swaps" | "travelers">("swaps");

  const filteredListings = useMemo(() => filterListings(SWAP_LISTINGS, filters), [filters]);
  const sortedListings = useMemo(() => sortListings(filteredListings, filters.sort), [filteredListings, filters.sort]);
  const visibleListings = sortedListings.slice(0, visibleCount);
  const hasMore = visibleCount < sortedListings.length;

  const pills = buildFilterPills(filters);

  const updateFilters = (next: FilterState) => {
    setVisibleCount(INITIAL_VISIBLE);
    setFilters(next);
  };

  const handleSortChange = (value: SwapSortOption) => updateFilters({ ...filters, sort: value });

  const handlePillRemove = (key: string) => {
    if (key === "query") {
      updateFilters({ ...filters, query: "" });
      return;
    }
    if (key === "location") {
      updateFilters({ ...filters, location: undefined });
      return;
    }
    const [type, group, value] = key.split("|");
    if (type === "barter" && group) {
      updateFilters({ ...filters, barterTypes: filters.barterTypes.filter((item) => item !== group) });
      return;
    }
    if (type === "category" && group) {
      updateFilters({ ...filters, categories: filters.categories.filter((item) => item !== group) });
      return;
    }
    if (type === "exchange" && group) {
      updateFilters({ ...filters, exchangeMethods: filters.exchangeMethods.filter((item) => item !== group) });
      return;
    }
    if (type === "tag" && group && value) {
      const existing = filters.tags[group as keyof FilterState["tags"]] ?? [];
      updateFilters({
        ...filters,
        tags: { ...filters.tags, [group]: existing.filter((tag) => tag !== value) },
      });
    }
  };

  const handleClearAll = () => {
    setDrawerOpen(false);
    updateFilters(defaultFilters);
  };

  const handleSearchChange = (value: string) => updateFilters({ ...filters, query: value });

  const renderSwapView = () => (
    <div className="space-y-5 pt-4">
      <header className="space-y-4 px-4">
        <div>
          <p className="text-xs font-semibold uppercase text-emerald-600">Explore Swaps</p>
          <h2 className="text-2xl font-black text-slate-900">Trade stories, not cash.</h2>
          <p className="text-sm text-slate-500">Browse curated barter listings powered by the Bitbit community.</p>
        </div>

        <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={filters.query}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search swap items, kapalit, tags..."
            className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>
      </header>

      <section className="space-y-4 px-4">
        <div className="flex flex-col gap-3">
          <SortDropdown
            value={filters.sort}
            options={SWAP_SORT_OPTIONS}
            onChange={handleSortChange}
            onOpenFilters={() => setDrawerOpen(true)}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`rounded-full border px-3 py-2 ${layout === "grid" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400"}`}
              onClick={() => setLayout("grid")}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              className={`rounded-full border px-3 py-2 ${layout === "list" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400"}`}
              onClick={() => setLayout("list")}
              aria-label="List view"
            >
              <Rows3 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <FilterPills pills={pills} onRemove={handlePillRemove} onClearAll={handleClearAll} />
      </section>

      <section className="px-4">
        <SwapGrid
          listings={visibleListings}
          layout={layout}
          onLoadMore={() => setVisibleCount((prev) => prev + 4)}
          hasMore={hasMore}
        />
      </section>

      <FilterDrawer
        open={drawerOpen}
        filters={filters}
        onChange={updateFilters}
        onClose={() => setDrawerOpen(false)}
        onReset={() => updateFilters(defaultFilters)}
      />
    </div>
  );

  return (
    <div className="space-y-6 pb-24 pt-6">
      <section className="space-y-4 px-4">
        <div>
          <p className="text-xs font-semibold uppercase text-emerald-600">Explore Bitbit</p>
          <h1 className="text-2xl font-black text-slate-900">Choose your swap adventure.</h1>
          <p className="text-sm text-slate-500">Toggle between curated swap listings and the traveler network.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-full bg-slate-100 p-1 text-sm font-semibold">
          <button
            type="button"
            className={`rounded-full px-4 py-2 ${activeTab === "swaps" ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}
            onClick={() => setActiveTab("swaps")}
          >
            Swap marketplace
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 ${activeTab === "travelers" ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}
            onClick={() => setActiveTab("travelers")}
          >
            Traveler network
          </button>
        </div>
      </section>

      {activeTab === "swaps" ? renderSwapView() : <TravelerPage />}
    </div>
  );
};

export default ExplorePage;

