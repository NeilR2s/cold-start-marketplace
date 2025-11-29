import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe, MapPin, Plane, Plus, Package,
  Star, Heart, SlidersHorizontal, Map, Tag, X,
  ShieldCheck, Calendar, Info, CheckCircle, TrendingDown, Users, HeartHandshake, ArrowLeftRight
} from 'lucide-react';
import { TextField, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PinoyNeighborsLogo from '../assets/amazing.jpg';
import { TravelerCard } from "../components/travelers/TravelerCard";
import { TRAVELERS } from "../data/travelers";

// --- EXPANDED DATA SCHEMA ---

const MOCK_PRODUCTS = [
  {
    id: 1,
    conversationId: "swap-chat-sarah",
    tag: "sakura-tumbler",
    title: "Limited Starbucks Sakura Tumbler 2024",
    description: "Japan Exclusive 2024 Spring Collection. Double-walled stainless steel. Keeps drinks hot/cold for 6 hours. Includes box and shop bag.",
    swapHeadline: "Need 3 more pastry bundles or cafe GCs to close the pool.",
    whatOffering: "Sakura 2024 tumbler + reusable tote straight from Starbucks Shibuya.",
    whatWant: "Pastry bundles, service hours, or local merch worth ₱250 each.",
    openToBundles: true,
    acceptsGroup: true,
    price: 1250,
    originalPrice: 1800,
    image: "https://images.unsplash.com/photo-1570784332176-fdd73da66f03?auto=format&fit=crop&q=80&w=600",
    location: "Quezon City",
    distance: 2.5,
    type: "Home",
    swapType: "Group Order",
    deadline: "2024-03-10",
    pooling: { target: 15, current: 12, minFee: 50, baseFee: 150 },
    user: { name: "Sarah J.", verified: true, rating: 4.9, image: "https://i.pravatar.cc/150?u=1" },
    hostView: {
      type: "group",
      announcement: "Pooling closes once 15 slots are filled. Handling fee drops to ₱50.",
      swappers: [
        { id: "sw1", name: "Andrea C.", avatar: "https://i.pravatar.cc/150?u=21", offer: "₱250 + Brownie Box", status: "Paid" },
        { id: "sw2", name: "Kultura Hub", avatar: "https://i.pravatar.cc/150?u=22", offer: "Crochet Keychains bundle", status: "Confirmed" },
        { id: "sw3", name: "Jam P.", avatar: "https://i.pravatar.cc/150?u=23", offer: "2hrs piano lessons", status: "Pending" }
      ],
      totalSlots: 15,
      filledSlots: 12
    },
    comments: [
      { id: "cm1", user: "Paolo V.", avatar: "https://i.pravatar.cc/150?u=31", message: "Can swap 2 hrs drum lessons + Benguet coffee beans.", timestamp: "2m ago", status: "pending" },
      { id: "cm2", user: "Faye D.", avatar: "https://i.pravatar.cc/150?u=32", message: "Offering matcha cookies + tote bag. Keen to join!", timestamp: "18m ago", status: "accepted" }
    ]
  },
  {
    id: 2,
    conversationId: "swap-chat-mike",
    tag: "gentle-monster",
    title: "Gentle Monster Sunglasses (Rick 01)",
    description: "Buying strictly from the flagship store in Haus Dosan. Comes with official warranty card and white packaging.",
    swapHeadline: "Looking for film stock + service hours for styling.",
    whatOffering: "Legit Gentle Monster Rick 01 frame with travel receipt + box.",
    whatWant: "Kodak Gold film packs or styling / content services of equal value.",
    openToBundles: true,
    acceptsGroup: false,
    price: 15400,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600",
    location: "Makati",
    distance: 8.1,
    type: "Fashion",
    swapType: "Pasabuy",
    deadline: "2024-03-14",
    pooling: null,
    user: { name: "Mike T.", verified: true, rating: 5.0, image: "https://i.pravatar.cc/150?u=2" },
    hostView: {
      type: "single",
      swapper: {
        name: "Luna Park",
        avatar: "https://i.pravatar.cc/150?u=41",
        offer: "Custom crochet bag + ₱500 courier credits",
        status: "Negotiating",
        timeline: [
          { label: "Offer Sent", state: "done" },
          { label: "Host Review", state: "active" },
          { label: "Drop-off", state: "pending" },
          { label: "Swap Complete", state: "pending" }
        ]
      },
      meetupNote: "Preferred meetup at Greenbelt weekends."
    },
    comments: [
      { id: "cm3", user: "Noah Film", avatar: "https://i.pravatar.cc/150?u=33", message: "Can trade 5 rolls Kodak Portra + lookbook shoot.", timestamp: "1h ago", status: "pending" }
    ]
  },
  {
    id: 3,
    tag: "hokkaido-cookies",
    title: "Hokkaido Butter Cookies (24pc)",
    description: "Extra boxes from my recent trip. Expiry date: Sept 2024. Sealed and kept in cool storage.",
    swapHeadline: "Wants craft supplies or hand-poured candles.",
    whatOffering: "Factory-sealed 24pc cookie tins, hand-carried from Sapporo.",
    whatWant: "Handmade candles, crochet services, or grocery GCs.",
    openToBundles: false,
    acceptsGroup: false,
    price: 850,
    originalPrice: 1100,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR7t0BaVwnqTJze2hhwNNH1VWzzVcuktKeVg&s",
    location: "BGC, Taguig",
    distance: 4.2,
    type: "Food",
    swapType: "On Hand",
    deadline: null,
    pooling: null,
    user: { name: "Japan Goodies PH", verified: false, rating: 4.8, image: "https://i.pravatar.cc/150?u=3" },
    hostView: null,
    comments: [
      { id: "cm4", user: "Iris Crafts", avatar: "https://i.pravatar.cc/150?u=34", message: "Offering 2 soy candles + delivery coverage.", timestamp: "3h ago", status: "declined" }
    ]
  },
  {
    id: 4,
    conversationId: "swap-chat-lex",
    tag: "mirrorless-camera-kit",
    title: "Mirrorless Camera Kit",
    description: "Fujifilm X-S20 travel-ready pack with kit lens, extra batteries, and SD card — mirrored from Explore.",
    swapHeadline: "Open to bundle of K-pop albums + handmade crafts.",
    whatOffering: "Body + kit lens + 2 batteries + 128GB SD, same as the Explore listing.",
    whatWant: "Creative bundles, collectibles, or services of similar value.",
    openToBundles: true,
    acceptsGroup: false,
    price: 15400,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1508898578281-774ac4893c0c?auto=format&fit=crop&w=800&q=60",
    location: "Makati",
    distance: 8.1,
    type: "Gadgets",
    swapType: "On Hand",
    deadline: null,
    pooling: null,
    user: { name: "Ken of BGC", verified: true, rating: 5.0, image: "https://i.pravatar.cc/150?u=2" },
    hostView: null,
    comments: [
      { id: "cm5", user: "Studio Nine", avatar: "https://i.pravatar.cc/150?u=35", message: "Offering product shots + promo clips.", timestamp: "45m ago", status: "pending" }
    ]
  }
];

// --- UTILS & SHARED COMPONENTS ---
const formatPHP = (amount) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

const Avatar = ({ src, name, verified, size = "md" }) => {
  const sizeClasses = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-12 h-12" : "w-6 h-6";
  return (
    <div className="relative">
      <img src={src} alt={name} className={`${sizeClasses} rounded-full border border-slate-200 object-cover`} />
      {verified && (
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[1px]">
          <CheckCircle size={size === "lg" ? 14 : 10} className="text-blue-500 fill-white" />
        </div>
      )}
    </div>
  );
};

const Badge = ({ children, type }) => {
  const styles = {
    'Group Order': 'bg-blue-100 text-blue-700 border-blue-200',
    'Pasabuy': 'bg-purple-100 text-purple-700 border-purple-200',
    'On Hand': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[type] || 'bg-slate-100 text-slate-600'}`}>
      {children}
    </span>
  );
};

const BID_STATUS_META = {
  accepted: { label: 'Accepted', classes: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  declined: { label: 'Not Accepted', classes: 'bg-rose-50 text-rose-700 border-rose-100' },
  pending: { label: 'Bid Pending', classes: 'bg-slate-100 text-slate-600 border-slate-200' }
};

const getBidStatusBadge = (status = 'pending') => BID_STATUS_META[status] || BID_STATUS_META.pending;

// --- MODAL COMPONENTS ---

const ProductDetailModal = ({ product, onClose, onMessageHost }) => {
  if (!product) return null;

  const isGroupOrder = product.swapType === 'Group Order';
  const isPasabuy = product.swapType === 'Pasabuy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Image */}
        <div className="h-48 bg-slate-200 relative shrink-0">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full text-slate-600 transition-colors backdrop-blur-sm">
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
                            <h2 className="text-xl font-bold text-slate-900 leading-tight flex-1 mr-4">{product.title}</h2>
                            <div className="text-right">
                                <div className="text-sm text-slate-500 font-medium">{product.swapType}</div>
                              </div>
                        </div>
                        <div className="mt-3 flex items-center gap-3 pb-4 border-b border-slate-100">
                            <Avatar src={product.user.image} name={product.user.name} verified={product.user.verified} size="lg" />
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
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(product.pooling.current / product.pooling.target) * 100}%` }}
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
              <Plane className="text-purple-600 flex-shrink-0" size={20} />
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
                      className="w-10 h-10 rounded-full border border-slate-100 object-cover"
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
            <ShieldCheck className="text-slate-400 flex-shrink-0" size={20} />
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
          <button
            className="w-full py-3 rounded-xl font-bold transition-all border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
            onClick={() => onMessageHost?.(product)}
          >
            Message Host
          </button>
          <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98]">
            {isGroupOrder ? "Join Group Order" : isPasabuy ? "Request to Buy" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

const TravelerDetailModal = ({ traveler, onClose, onMessage }) => {
  if (!traveler) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="font-bold text-lg text-slate-800">{traveler.name}</h2>
            <p className="text-xs text-slate-500">{traveler.trip.timelineLabel}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto bg-slate-50/50">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Plane className="text-emerald-500" size={18} />
              {traveler.routePath}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar size={14} className="text-emerald-500" />
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
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${(traveler.availabilityKg / traveler.totalCapacityKg) * 100}%` }}
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
          <button
            className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] ${
              traveler?.conversationId
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                : "bg-slate-200 text-slate-500 cursor-not-allowed shadow-transparent"
            }`}
            onClick={() => onMessage?.(traveler)}
            disabled={!traveler?.conversationId}
          >
            Message Traveler
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

function BrowsePage({ setIsPostTripOpen }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedTraveler, setSelectedTraveler] = useState(null);

  // Filter States
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterSwapType, setFilterSwapType] = useState('All');
  const [filterProductType, setFilterProductType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // local browse mode only; dashboard is always buyer view for now

  // Filter Options
  const LOCATIONS = ["All", "Nearby (<5km)", "Quezon City", "Makati", "BGC", "Manila"];
  const SWAP_TYPES = ["All", "Group Order", "Pasabuy", "On Hand"];
  const PRODUCT_TYPES = ["All", "Food", "Fashion", "Beauty", "Gadgets", "Home"];

  // Derived filtered data
  const handleMessageTraveler = async (traveler) => {
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

  const handleMessageHost = (product) => {
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
    return MOCK_PRODUCTS.filter(item => {
      // Search Logic
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());

      // Location Logic
      let matchLocation = true;
      if (filterLocation === "Nearby (<5km)") matchLocation = item.distance < 5;
      else if (filterLocation !== "All") matchLocation = item.location.includes(filterLocation);

      // Swap Type Logic
      const matchSwap = filterSwapType === "All" || item.swapType === filterSwapType;

      // Product Type Logic
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
      />
      <TravelerDetailModal traveler={selectedTraveler} onClose={() => setSelectedTraveler(null)} onMessage={handleMessageTraveler} />

      {/* --- HEADER SECTION --- */}
      <div className="px-4 pt-6 pb-2 sticky top-0 z-40 bg-slate-50/95 backdrop-blur-sm">
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          border: '1px solid #f1f5f9',
          px: 2,
          py: 1.5,
          maxWidth: '100%',
        }}>
          <SearchIcon sx={{ color: 'grey.400', fontSize: 24, mr: 1.5 }} />
          <TextField
            variant="standard"
            placeholder="Search items, travelers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: 15, fontFamily: 'inherit', flex: 1, fontWeight: 500 },
            }}
            fullWidth
          />
        </Box>
      </div>

      <div className="px-4 space-y-6">
        {/* --- HERO SECTION --- */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-emerald-900/10 mt-4 h-[280px] flex flex-col justify-end group">

          {/* 1. VISUAL STORYTELLING IMAGE */}
          {/* Placeholder: An image showing a warm interaction between two neighbors. 
            One is handing over a home-baked pie, while the other is fixing a bike or holding a tool. 
            This visually explains "Goods for Services" without words. */}
          <img
            // src="https://media.istockphoto.com/id/507831862/photo/woman-bringing-meal-for-elderly-neighbour.jpg?s=612x612&w=0&k=20&c=VgQWMNvj1d3dPb0Qxiyf5ttb1GlLMzg5Rj5FftVqwjc="
            src={PinoyNeighborsLogo}
            alt="Two neighbors exchanging a home-cooked meal for a repair service"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* 2. GRADIENT OVERLAY */}
          {/* Darker gradient at bottom to ensure text readability over the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent" />

          {/* 3. ATMOSPHERIC GLOW */}
          <div className="absolute top-0 right-0 p-24 bg-amber-400/20 blur-[60px] rounded-full pointer-events-none transform translate-x-10 -translate-y-10 mix-blend-screen" />

          {/* CONTENT */}
          <div className="relative z-10 p-6 text-white">
            <div className="flex items-center justify-between mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 text-[10px] font-bold uppercase tracking-wide backdrop-blur-md border border-emerald-200/20 text-emerald-100">
                <HeartHandshake size={12} /> Cashless Community
              </div>
            </div>

            <h1 className="text-3xl font-semibold mb-2 leading-tight">
              Swap items, <br /> skip the cash
            </h1>

            <p className="text-emerald-100/90 text-sm mb-5 font-medium max-w-[260px] leading-relaxed">
              Trade albums, gadgets, food, and more with your community.
            </p>

            {/* Primary actions: browse vs host a pasabuy */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => navigate('/explore')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-900 shadow-md shadow-emerald-900/20 hover:bg-emerald-50 transition-colors"
              >
                <ArrowLeftRight size={14} className="text-emerald-700" />
                Browse Swaps
              </button>
              <button
                type="button"
                onClick={() => setIsPostTripOpen?.(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-emerald-900/30 hover:bg-emerald-500 transition-colors"
              >
                <Plus size={14} />
                Host a Pasabuy
              </button>
            </div>
          </div>
        </div>

        {/* DASHBOARD: Trending products with filters, then travelers */}
            {/* --- FILTER BAR --- */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sticky top-[80px] z-30 py-2 -mx-4 px-4 bg-slate-50">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${activeFiltersCount > 0 ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}
              >
                <SlidersHorizontal size={12} />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>

              {PRODUCT_TYPES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterProductType(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${filterProductType === cat ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* --- EXPANDED FILTERS PANEL --- */}
            {showFilters && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-slate-800">Refine Search</h3>
                  <button onClick={() => { setFilterLocation('All'); setFilterSwapType('All'); setFilterProductType('All'); }} className="text-[10px] font-bold text-red-500 hover:underline">Reset All</button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-1"><Tag size={10} /> Swap Type</label>
                    <div className="flex flex-wrap gap-2">
                      {SWAP_TYPES.map(type => (
                        <button
                          key={type}
                          onClick={() => setFilterSwapType(type)}
                          className={`px-2 py-1 rounded text-[10px] font-semibold border ${filterSwapType === type ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-1"><Map size={10} /> Location</label>
                    <div className="flex flex-wrap gap-2">
                      {LOCATIONS.map(loc => (
                        <button
                          key={loc}
                          onClick={() => setFilterLocation(loc)}
                          className={`px-2 py-1 rounded text-[10px] font-semibold border ${filterLocation === loc ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
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
            <div className="flex items-center justify-between px-1 mt-1">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Trending Swaps</h2>
                <p className="text-xs text-slate-500">Showing featured listings with active bids.</p>
              </div>
              <button
                onClick={() => navigate('/explore')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                View more
              </button>
            </div>

            {/* --- PRODUCTS GRID --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="group bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
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
                      <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 hover:bg-white text-slate-700 backdrop-blur-sm transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Heart size={14} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug min-h-[2.5em]">
                          {product.title}
                        </h3>
                      </div>

                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-sm text-slate-600 line-clamp-1">{product.swapHeadline}</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                        <MapPin size={10} />
                        <span className="truncate max-w-[80px]">{product.location}</span>
                        <span className="text-slate-300">•</span>
                        <span>{product.distance}km</span>
                      </div>

                      <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Avatar src={product.user.image} name={product.user.name} />
                          <span className="text-xs font-medium text-slate-600 truncate max-w-[60px]">{product.user.name}</span>
                        </div>
                        <div className="flex items-center text-xs font-bold text-amber-500">
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
                  <button onClick={() => { setFilterLocation('All'); setFilterSwapType('All'); setFilterProductType('All'); setSearchQuery(''); }} className="mt-2 text-xs font-bold text-emerald-600">Clear Filters</button>
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
                <button className="text-xs text-emerald-600 font-bold hover:underline">See All</button>
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