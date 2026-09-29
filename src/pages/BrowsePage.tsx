import React, { useState, useMemo, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import {
    MapPin, Plane, Plus, Package,
    Star, Heart, SlidersHorizontal, Map, Tag, X,
    ShieldCheck, Calendar, Info, TrendingDown, HeartHandshake, ArrowLeftRight
} from 'lucide-react';
import PinoyNeighborsLogo from '@/assets/amazing.jpg';
import { Avatar, Badge, Button, SearchField } from '@/components/ui';
import { TravelerCard } from "@/components/travelers/TravelerCard";
import { TRAVELERS } from "@/data/travelers";
import { MOCK_PRODUCTS } from '@/data/browseListings';
import { formatPHP } from '@/utils';
import { BrowseProduct } from '@/types/browse';
import { TravelerProfile } from '@/types/travelers';
import { GroupOrder } from '@/types/groupOrder';
import { MOCK_GOS } from '@/data';

const BID_STATUS_META = {
    accepted: { label: 'Accepted', classes: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    declined: { label: 'Not Accepted', classes: 'bg-rose-50 text-rose-700 border-rose-100' },
    pending: { label: 'Bid Pending', classes: 'bg-slate-100 text-slate-600 border-slate-200' }
};

const getBidStatusBadge = (status: 'pending' | 'accepted' | 'declined' = 'pending') => 
    BID_STATUS_META[status] || BID_STATUS_META.pending;

// --- MODAL COMPONENTS ---

interface ProductDetailModalProps {
    product: BrowseProduct | null;
    onClose: () => void;
    onMessageHost?: (product: BrowseProduct) => void;
    onJoinGroupOrder?: (product: BrowseProduct) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
    product, 
    onClose, 
    onMessageHost,
    onJoinGroupOrder,
}) => {
    useEffect(() => {
        if (!product) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [product, onClose]);

    if (!product) return null;

    const isGroupOrder = product.swapType === 'Group Order' || product.acceptsGroup;
    const isPasabuy = product.swapType === 'Pasabuy';

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-title"
        >
            <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 animate-in zoom-in-95 duration-150">
                {/* Header Image */}
                <div className="h-48 sm:h-56 bg-slate-200 relative shrink-0">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full text-slate-600 transition-colors backdrop-blur-sm cursor-pointer shadow-sm"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-4 left-4">
                        <Badge type={product.swapType}>{product.swapType}</Badge>
                    </div>
                </div>


                <div className="overflow-y-auto p-5 space-y-6">
                    {/* Title & Price */}
                    <div>
                        <div className="flex justify-between items-start">
                            <h2 id="product-detail-title" className="text-xl font-bold text-slate-900 leading-tight flex-1 mr-4">
                                {product.title}
                            </h2>
                            <div className="text-right">
                                <div className="text-sm text-slate-500 font-medium">{product.swapType}</div>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-3 pb-4 border-b border-slate-100">
                            <Avatar src={product.user.image} name={product.user.name} verified={product.user.verified} size="md" />
                            <div>
                                <div className="text-sm font-bold text-slate-900">{product.user.name}</div>
                                <div className="flex items-center text-xs text-slate-500">
                                    <Star size={12} className="text-amber-400 fill-amber-400 mr-1" />
                                    <span>{product.user.rating} Rating</span>
                                    <span className="mx-1">•</span>
                                    <MapPin size={12} className="mr-0.5" /> {product.location}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Group Order Visualizer */}
                    {isGroupOrder && product.pooling && (
                        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-800">
                                    <TrendingDown size={16} /> Pooling Progress
                                </div>
                                <span className="text-xs font-medium text-emerald-600">{product.pooling.current}/{product.pooling.target} Joined</span>
                            </div>
                            <div className="h-2.5 bg-emerald-200/50 rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, (product.pooling.current / product.pooling.target) * 100)}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-emerald-700">
                                Join now to lower the handling fee to <strong>{formatPHP(product.pooling.minFee)}</strong>! Ends {new Date(product.deadline).toLocaleDateString()}.
                            </p>
                        </div>
                    )}

                    {/* Pasabuy Specifics */}
                    {isPasabuy && (
                        <div className="flex gap-3 p-3 bg-purple-50 border border-purple-100 rounded-xl">
                            <Plane className="text-purple-600 shrink-0" size={20} />
                            <div>
                                <h4 className="text-xs font-bold text-purple-800">Traveler Request</h4>
                                <p className="text-[10px] text-purple-600 leading-relaxed mt-0.5">
                                    Seller is traveling soon. Request usually closes 2 days before flight.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-2">Description</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{product.description || "No description provided."}</p>
                    </div>

                    {/* Comments & Bids */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-800">Comments & Bids</h3>
                            <span className="text-[10px] text-slate-400 font-semibold">
                                {product.comments?.length || 0} active
                            </span>
                        </div>
                        <div className="space-y-3">
                            {product.comments?.map((comment) => {
                                const badge = getBidStatusBadge(comment.status);
                                return (
                                    <div key={comment.id} className="flex gap-3">
                                        <img
                                            src={comment.avatar}
                                            alt={comment.user}
                                            className="w-10 h-10 rounded-full border border-slate-100 object-cover shrink-0"
                                        />
                                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-sm font-semibold text-slate-800">{comment.user}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                                                    <span
                                                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.classes}`}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600">{comment.message}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Trust Badge */}
                    <div className="flex gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <ShieldCheck className="text-slate-400 shrink-0" size={20} />
                        <div>
                            <h4 className="text-xs font-bold text-slate-700">Escrow Protected</h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                                Your payment is held securely until you receive the item.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 bg-white mt-auto space-y-2">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onMessageHost?.(product)}
                    >
                        Message Host
                    </Button>
                    <Button 
                        variant={isGroupOrder ? "emerald" : "default"}
                        className="w-full h-12 text-sm font-bold shadow-lg shadow-slate-900/10"
                        onClick={() => {
                            if (isGroupOrder) {
                                onJoinGroupOrder?.(product);
                            }
                        }}
                    >
                        {isGroupOrder ? "Join Group Order (Ambag)" : isPasabuy ? "Request to Buy" : "Buy Now"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

interface TravelerDetailModalProps {
    traveler: TravelerProfile | null;
    onClose: () => void;
    onMessage?: (traveler: TravelerProfile) => void;
}

const TravelerDetailModal: React.FC<TravelerDetailModalProps> = ({ traveler, onClose, onMessage }) => {
    useEffect(() => {
        if (!traveler) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [traveler, onClose]);

    if (!traveler) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans"
            role="dialog"
            aria-modal="true"
            aria-labelledby="traveler-detail-title"
        >
            <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 animate-in zoom-in-95 duration-150">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">

                    <div>
                        <h2 id="traveler-detail-title" className="font-bold text-lg text-slate-800">{traveler.name}</h2>
                        <p className="text-xs text-slate-500">{traveler.trip.timelineLabel}</p>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto bg-slate-50/50">
                    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Plane className="text-emerald-500 shrink-0" size={18} />
                            {traveler.routePath}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar size={14} className="text-emerald-500 shrink-0" />
                            Returning: <span className="font-semibold text-slate-700">{traveler.trip.returnDate}</span>
                        </div>
                        {traveler.trip.stayNotes && <p className="text-xs text-slate-500">{traveler.trip.stayNotes}</p>}
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Luggage Capacity</h3>
                                <p className="text-xs text-slate-500">Available space for pasabuy</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-emerald-600">{traveler.availabilityKg}kg</span>
                                <span className="text-xs text-slate-400"> / {traveler.totalCapacityKg}kg</span>
                            </div>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (traveler.availabilityKg / traveler.totalCapacityKg) * 100)}%` }}
                            />
                        </div>
                        <div className="text-xs font-medium text-emerald-700 bg-emerald-50 inline-block px-2 py-1 rounded">
                            Rate: {formatPHP(traveler.pricePerKg)} per kg
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Tag size={16} /> Bitbit Focus
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {traveler.bitbit.map(tag => (
                                <span key={tag} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {traveler.bitbitNotes && <p className="mt-3 text-xs text-slate-500">{traveler.bitbitNotes}</p>}
                    </div>

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1 flex items-center gap-2">
                            <Info size={14} /> Restrictions
                        </h3>
                        <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-amber-800/80">
                            {traveler.restrictions.flags.map(flag => (
                                <span key={flag} className="px-2 py-0.5 bg-white rounded-full border border-amber-100">
                                    {flag}
                                </span>
                            ))}
                        </div>
                        <p className="mt-3 text-[11px] text-amber-900">
                            Weight limit: <strong>{traveler.restrictions.weightLimitKg}kg</strong> · Quantity limit: <strong>{traveler.restrictions.quantityLimit} items</strong>
                        </p>
                        {traveler.restrictions.notes && <p className="text-[11px] text-amber-900/80 mt-2">{traveler.restrictions.notes}</p>}
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <HeartHandshake size={16} /> Preferred Kapalit
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {traveler.kapalitPreferences.map(pref => (
                                <span key={pref} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 shadow-sm">
                                    {pref}
                                </span>
                            ))}
                        </div>
                        {traveler.kapalitNotes && <p className="mt-2 text-xs text-slate-500">{traveler.kapalitNotes}</p>}
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Map size={16} /> Featured Requests
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {traveler.featuredRequests.map(item => (
                                <span key={item} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 shadow-sm">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-white">
                    <Button
                        variant={traveler?.conversationId ? "emerald" : "secondary"}
                        className="w-full h-12 text-sm font-bold"
                        onClick={() => onMessage?.(traveler)}
                        disabled={!traveler?.conversationId}
                    >
                        Message Traveler
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

export interface BrowsePageProps {
    setIsPostTripOpen?: (open: boolean) => void;
    mode?: string;
    setMode?: (mode: string) => void;
    setSelectedGO?: (go: GroupOrder | null) => void;
}

export const BrowsePage: React.FC<BrowsePageProps> = ({ setIsPostTripOpen, setSelectedGO }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [selectedProduct, setSelectedProduct] = useState<BrowseProduct | null>(null);
    const [selectedTraveler, setSelectedTraveler] = useState<TravelerProfile | null>(null);

    // Filter States
    const [filterLocation, setFilterLocation] = useState('All');
    const [filterSwapType, setFilterSwapType] = useState('All');
    const [filterProductType, setFilterProductType] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    // Filter Options
    const LOCATIONS = ["All", "Nearby (<5km)", "Quezon City", "Makati", "BGC", "Manila"];
    const SWAP_TYPES = ["All", "Group Order", "Pasabuy", "On Hand"];
    const PRODUCT_TYPES = ["All", "Food", "Fashion", "Beauty", "Gadgets", "Home"];

    const handleJoinGroupOrder = (product: BrowseProduct) => {
        setSelectedProduct(null);
        const matched = MOCK_GOS.find(
            (go) => go.title.toLowerCase().includes(product.title.toLowerCase()) || go.category === product.type
        ) || {
            id: `go_${product.id}`,
            title: product.title,
            manager: { name: product.user.name, verified: product.user.verified },
            region: product.location,
            status: 'open',
            deadline: product.deadline,
            category: product.type,
            items: [{ name: product.title, price: product.price }],
            pooling: product.pooling || { current: 12, target: 20, baseFee: 150, minFee: 50 },
            biases: ["Standard Edition", "Deluxe Pack", "Collector's Box"],
        };
        setSelectedGO?.(matched);
    };

    const handleMessageTraveler = async (traveler: TravelerProfile) => {
        if (!traveler?.conversationId) return;
        const template = traveler.messageTemplates?.[0];
        if (template && navigator?.clipboard) {
            try {
                await navigator.clipboard.writeText(template);
            } catch (error) {
                console.warn("Clipboard unavailable", error);
            }
        }
        setSelectedTraveler(null);
        navigate("/messages", { state: { conversationId: traveler.conversationId, chatType: "traveler" } });
    };

    const handleMessageHost = (product: BrowseProduct) => {
        const conversationId = product?.conversationId || "swap-chat-sarah";
        setSelectedProduct(null);
        navigate("/messages", {
            state: {
                conversationId,
                chatType: "host",
                productTag: product.tag,
            },
        });
    };

    const filteredProducts = useMemo(() => {
        return (MOCK_PRODUCTS as BrowseProduct[]).filter(item => {
            const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());

            let matchLocation = true;
            if (filterLocation === "Nearby (<5km)") matchLocation = item.distance < 5;
            else if (filterLocation !== "All") matchLocation = item.location.includes(filterLocation);

            const matchSwap = filterSwapType === "All" || item.swapType === filterSwapType;
            const matchType = filterProductType === "All" || item.type === filterProductType;

            return matchSearch && matchLocation && matchSwap && matchType;
        });
    }, [searchQuery, filterLocation, filterSwapType, filterProductType]);

    const activeFiltersCount = [filterLocation, filterSwapType, filterProductType].filter(x => x !== 'All').length;

    return (
        <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-900">
            {/* --- MODALS --- */}
            <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onMessageHost={handleMessageHost}
                onJoinGroupOrder={handleJoinGroupOrder}
            />
            <TravelerDetailModal 
                traveler={selectedTraveler} 
                onClose={() => setSelectedTraveler(null)} 
                onMessage={handleMessageTraveler} 
            />

            {/* --- HEADER SEARCH SECTION --- */}
            <div className="pt-6 pb-2 sticky top-0 z-40 bg-slate-50/95 backdrop-blur-sm">
                <SearchField
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onClear={() => setSearchQuery('')}
                    placeholder="Search items, travelers..."
                    className="border-slate-100 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
                />
            </div>

            <div className="space-y-6">
                {/* --- HERO SECTION --- */}
                <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-emerald-900/10 mt-4 h-[280px] flex flex-col justify-end group">
                    <img
                        src={PinoyNeighborsLogo}
                        alt="Two neighbors exchanging items"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent" />

                    {/* Atmospheric Glow */}
                    <div className="absolute top-0 right-0 p-24 bg-amber-400/20 blur-[60px] rounded-full pointer-events-none transform translate-x-10 -translate-y-10 mix-blend-screen" />

                    {/* Content */}
                    <div className="relative z-10 p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 text-[10px] font-bold uppercase tracking-wide backdrop-blur-md border border-emerald-200/20 text-emerald-100">
                                <HeartHandshake size={12} /> Cashless Community
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold mb-2 leading-tight">
                            Swap items, <br /> skip the cash
                        </h1>

                        <p className="text-emerald-100/90 text-sm mb-5 font-medium max-w-[280px] leading-relaxed">
                            Trade albums, gadgets, food, and more with your community.
                        </p>

                        <div className="flex flex-wrap gap-2.5 items-center">
                            <Button
                                variant="secondary"
                                pill
                                size="sm"
                                onClick={() => navigate('/explore')}
                                className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold uppercase tracking-wide text-xs h-9 px-4"
                            >
                                <ArrowLeftRight size={14} className="text-emerald-700" />
                                Browse Swaps
                            </Button>
                            <Button
                                variant="emerald"
                                pill
                                size="sm"
                                onClick={() => setIsPostTripOpen?.(true)}
                                className="font-bold uppercase tracking-wide text-xs h-9 px-4"
                            >
                                <Plus size={14} />
                                Host a Pasabuy
                            </Button>
                        </div>
                    </div>
                </div>

                {/* --- FILTER BAR --- */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sticky top-[76px] z-30 py-2 -mx-4 px-4 bg-slate-50/95 backdrop-blur-sm">
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors cursor-pointer ${activeFiltersCount > 0 ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                    >
                        <SlidersHorizontal size={12} />
                        Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                    </button>

                    {PRODUCT_TYPES.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setFilterProductType(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors cursor-pointer ${filterProductType === cat ? 'bg-emerald-600 text-white border-emerald-600 font-semibold' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* --- EXPANDED FILTERS PANEL --- */}
                {showFilters && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-slate-800">Refine Search</h3>
                            <button 
                                type="button"
                                onClick={() => { setFilterLocation('All'); setFilterSwapType('All'); setFilterProductType('All'); }} 
                                className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                            >
                                Reset All
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Tag size={10} /> Swap Type
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SWAP_TYPES.map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFilterSwapType(type)}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-colors cursor-pointer ${filterSwapType === type ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Map size={10} /> Location
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {LOCATIONS.map(loc => (
                                        <button
                                            key={loc}
                                            type="button"
                                            onClick={() => setFilterLocation(loc)}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-colors cursor-pointer ${filterLocation === loc ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                        >
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TRENDING HEADER --- */}
                <div className="flex items-center justify-between px-1">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Trending Swaps</h2>
                        <p className="text-xs text-slate-500">Showing featured listings with active bids.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/explore')}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                    >
                        View more
                    </button>
                </div>

                {/* --- PRODUCTS GRID --- */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                className="group bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="aspect-[4/5] w-full bg-slate-200 relative overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 left-2">
                                        <Badge type={product.swapType}>{product.swapType}</Badge>
                                    </div>
                                    <button 
                                        type="button"
                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/60 hover:bg-white text-slate-700 backdrop-blur-sm transition-colors cursor-pointer" 
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label="Save item"
                                    >
                                        <Heart size={14} />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-3 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug min-h-[2.5em]">
                                            {product.title}
                                        </h3>

                                        <p className="text-xs text-slate-600 line-clamp-1 mt-1 mb-2">
                                            {product.swapHeadline}
                                        </p>

                                        <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                                            <MapPin size={10} className="shrink-0" />
                                            <span className="truncate max-w-[80px]">{product.location}</span>
                                            <span className="text-slate-300">•</span>
                                            <span>{product.distance}km</span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <Avatar src={product.user.image} name={product.user.name} size="xs" />
                                            <span className="text-xs font-medium text-slate-600 truncate max-w-[70px]">{product.user.name}</span>
                                        </div>
                                        <div className="flex items-center text-xs font-bold text-amber-500 shrink-0">
                                            <Star size={10} className="fill-amber-500 mr-0.5" />
                                            {product.user.rating}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
                            <Package size={48} className="mb-4 opacity-20" />
                            <p className="text-sm font-medium">No items found matching your filters.</p>
                            <Button 
                                variant="link"
                                onClick={() => { setFilterLocation('All'); setFilterSwapType('All'); setFilterProductType('All'); setSearchQuery(''); }} 
                                className="mt-2 text-xs font-bold"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>

                {/* --- TRAVELER FEED SECTION --- */}
                <section className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Upcoming Travelers</h2>
                            <p className="text-xs text-slate-500">Request items from verified travelers</p>
                        </div>
                        <button 
                            type="button"
                            onClick={() => navigate('/explore', { state: { activeTab: 'travelers' } })}
                            className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
                        >
                            See All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {TRAVELERS.slice(0, 3).map(traveler => (
                            <TravelerCard key={traveler.id} traveler={traveler} variant="compact" onSelect={setSelectedTraveler} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BrowsePage;
