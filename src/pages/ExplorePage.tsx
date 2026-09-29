import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, LayoutGrid, Rows3 } from "lucide-react";
import { SortDropdown } from "../components/explore/SortDropdown";
import { FilterPills } from "../components/explore/FilterPills";
import { FilterDrawer } from "../components/explore/FilterDrawer";
import { SwapGrid } from "../components/explore/SwapGrid";
import { SwapDetailModal } from "../components/explore/SwapDetailModal";
import { SWAP_LISTINGS } from "../data/swapListings";
import { buildFilterPills, defaultFilters, filterListings, sortListings } from "../utils/exploreFilters";
import { FilterState, SwapListing, SwapSortOption } from "../types/explore";
import { SWAP_SORT_OPTIONS } from "../constants/exploreFilters";
import { TravelerPage } from "../components/travelers/TravelerPage";
import { GroupOrder, MOCK_GOS } from "@/data";

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
    const [selectedSwapListing, setSelectedSwapListing] = useState<SwapListing | null>(null);
    const initialTab = isExploreLocationState(location.state) && location.state.activeTab === "travelers" ? "travelers" : "swaps";
    const [activeTab, setActiveTab] = useState<"swaps" | "travelers">(initialTab);

    const filteredListings = useMemo(() => filterListings(SWAP_LISTINGS, filters), [filters]);
    const sortedListings = useMemo(() => sortListings(filteredListings, filters.sort), [filteredListings, filters.sort]);

    const pills = buildFilterPills(filters);

    const updateFilters = (next: FilterState) => {
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
        <div className="space-y-4 pt-1">
            {/* Search & Filter Toolbar */}
            <section className="space-y-3 px-1">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                        <input
                            value={filters.query}
                            onChange={(event) => handleSearchChange(event.target.value)}
                            placeholder="Search swap items, kapalit, tags..."
                            className="w-full h-10 sm:h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <SortDropdown
                            value={filters.sort}
                            options={SWAP_SORT_OPTIONS}
                            onChange={handleSortChange}
                            onOpenFilters={() => setDrawerOpen(true)}
                            activeFilterCount={pills.length}
                        />

                        {/* View Switcher */}
                        <div className="h-10 sm:h-11 flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 shrink-0">
                            <button
                                type="button"
                                onClick={() => setLayout("grid")}
                                className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                    layout === "grid" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-400 hover:text-slate-700"
                                }`}
                                aria-label="Grid view"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setLayout("list")}
                                className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                    layout === "list" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-400 hover:text-slate-700"
                                }`}
                                aria-label="List view"
                            >
                                <Rows3 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <FilterPills pills={pills} onRemove={handlePillRemove} onClearAll={handleClearAll} />
            </section>

            <section className="px-1">
                <SwapGrid
                    listings={sortedListings}
                    layout={layout}
                    onChatHost={handleChatHost}
                    onJoinGroupSwap={handleJoinGroupSwap}
                    onViewListing={(listing) => setSelectedSwapListing(listing)}
                />
            </section>

            <FilterDrawer
                open={drawerOpen}
                filters={filters}
                onChange={updateFilters}
                onClose={() => setDrawerOpen(false)}
                onReset={() => updateFilters(defaultFilters)}
            />

            <SwapDetailModal
                listing={selectedSwapListing}
                onClose={() => setSelectedSwapListing(null)}
                onChatHost={handleChatHost}
                onJoinGroupSwap={handleJoinGroupSwap}
            />
        </div>
    );

    return (
        <div className="space-y-5 pb-24 md:pb-8 pt-4 md:pt-6 animate-in fade-in">
            {/* Standardized Header matching /messages and /orders conventions */}
            <div className="flex justify-between items-center px-1">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Explore</h1>
                    <p className="text-xs text-slate-500">Discover active barter listings and verified traveler network</p>
                </div>
                <div className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold">
                    {activeTab === "swaps" ? `${filteredListings.length} Listings` : "Verified Network"}
                </div>
            </div>

            {/* Standardized Segmented Tab Switcher matching /messages */}
            <div className="flex p-1 bg-slate-200/60 rounded-xl overflow-x-auto no-scrollbar">
                <button
                    type="button"
                    onClick={() => setActiveTab("swaps")}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
                        activeTab === "swaps"
                            ? "bg-white text-emerald-700 shadow-xs"
                            : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Swap Marketplace
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("travelers")}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
                        activeTab === "travelers"
                            ? "bg-white text-emerald-700 shadow-xs"
                            : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Traveler Network
                </button>
            </div>

            {activeTab === "swaps" ? (
                renderSwapView()
            ) : (
                <div className="space-y-3">
                    {travelerAvailability?.active && (
                        <div className="mx-1 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
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
