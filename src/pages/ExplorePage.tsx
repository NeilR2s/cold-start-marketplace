import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { Button } from "@/components/ui";
import { GroupOrder, MOCK_GOS } from "@/data";

const INITIAL_VISIBLE = 4;

type TravelerAvailability = {
    active: boolean;
    until: string | null;
};

type ExplorePageProps = {
    travelerAvailability?: TravelerAvailability;
    onJoinGroupOrder?: (go: GroupOrder) => void;
};


type ExploreLocationState = {
    activeTab?: "swaps" | "travelers";
};

const isExploreLocationState = (state: unknown): state is ExploreLocationState => {
    return typeof state === "object" && state !== null && "activeTab" in state;
};

const ExplorePage = ({ travelerAvailability, onJoinGroupOrder }: ExplorePageProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [filters, setFilters] = useState<FilterState>(defaultFilters);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [layout, setLayout] = useState<"grid" | "list">("grid");
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
    const initialTab = isExploreLocationState(location.state) && location.state.activeTab === "travelers" ? "travelers" : "swaps";
    const [activeTab, setActiveTab] = useState<"swaps" | "travelers">(initialTab);

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

    const handleChatHost = (listing: typeof SWAP_LISTINGS[number]) => {
        const conversationId = listing.conversationId || "swap-chat-sarah";
        navigate("/messages", {
            state: {
                conversationId,
                chatType: "host",
                productTag: listing.id,
            },
        });
    };

    const handleJoinGroupSwap = (listing: typeof SWAP_LISTINGS[number]) => {
        const matched = MOCK_GOS.find(
            (go) => go.title.toLowerCase().includes(listing.title.toLowerCase()) || go.category === listing.category
        ) || {
            id: `go_${listing.id}`,
            title: listing.title,
            manager: { name: listing.hostName, verified: true },
            region: listing.locationLabel,
            status: 'open',
            deadline: listing.postedAt,
            category: listing.category,
            items: [{ name: listing.title, price: 1000 }],
            pooling: { current: listing.contributorSlots?.filled || 5, target: listing.contributorSlots?.total || 10, baseFee: 150, minFee: 50 },
            biases: ["Standard Edition", "Special Set"],
        };
        onJoinGroupOrder?.(matched);
    };

    const renderSwapView = () => (
        <div className="space-y-5 pt-2">
            <header className="space-y-3 px-4">
                <p className="text-xs font-semibold uppercase text-emerald-600">Swap marketplace</p>
                <h2 className="text-xl font-bold text-slate-900">Discover active barter-only listings.</h2>
                <p className="text-sm text-slate-500">
                    Filter by barter type, kapalit, exchange method, and tags to find your next swap.
                </p>

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
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                        <Button
                            type="button"
                            variant={layout === "grid" ? "default" : "ghost"}
                            size="sm"
                            pill
                            className={`h-8 px-3 ${layout === "grid" ? "shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                            onClick={() => setLayout("grid")}
                            aria-label="Grid view"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant={layout === "list" ? "default" : "ghost"}
                            size="sm"
                            pill
                            className={`h-8 px-3 ${layout === "list" ? "shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                            onClick={() => setLayout("list")}
                            aria-label="List view"
                        >
                            <Rows3 className="h-4 w-4" />
                        </Button>
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
                    onChatHost={handleChatHost}
                    onJoinGroupSwap={handleJoinGroupSwap}
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
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 text-sm font-semibold">
                    <Button
                        type="button"
                        variant={activeTab === "swaps" ? "default" : "ghost"}
                        pill
                        onClick={() => setActiveTab("swaps")}
                        className={activeTab === "swaps" ? "bg-white text-slate-900 shadow-sm hover:bg-white" : "text-slate-500 hover:text-slate-900"}
                    >
                        Swap marketplace
                    </Button>
                    <Button
                        type="button"
                        variant={activeTab === "travelers" ? "default" : "ghost"}
                        pill
                        onClick={() => setActiveTab("travelers")}
                        className={activeTab === "travelers" ? "bg-white text-slate-900 shadow-sm hover:bg-white" : "text-slate-500 hover:text-slate-900"}
                    >
                        Traveler network
                    </Button>
                </div>
            </section>


            {activeTab === "swaps" ? (
                renderSwapView()
            ) : (
                <div className="space-y-3">
                    {travelerAvailability?.active && (
                        <div className="mx-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
                            <p className="font-semibold">You are visible as a traveler.</p>
                            <p className="mt-0.5">
                                Buyers can send you pasabuy requests
                                {travelerAvailability.until
                                    ? ` until ${new Date(travelerAvailability.until).toLocaleDateString()}.`
                                    : "."}
                            </p>
                        </div>
                    )}
                    <TravelerPage />
                </div>
            )}
        </div>
    );
};

export default ExplorePage;
