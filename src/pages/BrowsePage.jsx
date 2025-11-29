import React, { useState, useMemo } from 'react';
import { 
  Globe, MapPin, ChevronRight, Plane, Plus, Bell, Package, 
  Filter, Star, Heart, SlidersHorizontal, Map, Tag 
} from 'lucide-react';
import { TextField, InputAdornment, IconButton, Box, Drawer, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// --- MOCK DATA (New Source of Truth) ---
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "Limited Starbucks Sakura Tumbler 2024",
    price: 1250,
    originalPrice: 1800,
    image: "https://images.unsplash.com/photo-1570784332176-fdd73da66f03?auto=format&fit=crop&q=80&w=600",
    location: "Quezon City",
    distance: 2.5, // km
    type: "Home",
    swapType: "Group Order",
    user: { name: "Sarah J.", rating: 4.9, image: "https://i.pravatar.cc/150?u=1" }
  },
  {
    id: 2,
    title: "Gentle Monster Sunglasses (Rick 01)",
    price: 15400,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600",
    location: "Makati",
    distance: 8.1,
    type: "Fashion",
    swapType: "Pasabuy", // Requesting a traveler to buy
    user: { name: "Mike T.", rating: 5.0, image: "https://i.pravatar.cc/150?u=2" }
  },
  {
    id: 3,
    title: "Hokkaido Butter Cookies (24pc)",
    price: 850,
    originalPrice: 1100,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR7t0BaVwnqTJze2hhwNNH1VWzzVcuktKeVg&s",
    location: "BGC, Taguig",
    distance: 4.2,
    type: "Food",
    swapType: "On Hand", // Selling current stock
    user: { name: "Japan Goodies PH", rating: 4.8, image: "https://i.pravatar.cc/150?u=3" }
  },
  {
    id: 4,
    title: "Aesop Resurrection Hand Wash",
    price: 2100,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
    location: "Quezon City",
    distance: 1.2,
    type: "Beauty",
    swapType: "Group Order",
    user: { name: "Beauty Haul", rating: 4.7, image: "https://i.pravatar.cc/150?u=4" }
  },
  {
    id: 5,
    title: "Uniqlo Airism Oversized Tee (Black/L)",
    price: 590,
    originalPrice: 790,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600",
    location: "Mandaluyong",
    distance: 5.5,
    type: "Fashion",
    swapType: "On Hand",
    user: { name: "Closet Find", rating: 4.5, image: "https://i.pravatar.cc/150?u=5" }
  },
  {
    id: 6,
    title: "Nintendo Switch OLED - White",
    price: 14500,
    originalPrice: 16999,
    image: "",
    location: "Pasig",
    distance: 6.0,
    type: "Gadgets",
    swapType: "Pasabuy",
    user: { name: "Gamer Zone", rating: 4.9, image: "https://i.pravatar.cc/150?u=6" }
  }
];

// --- UTILS & COMPONENTS ---
const formatPHP = (amount) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);

const Avatar = ({ src, name }) => (
  <img src={src} alt={name} className="w-6 h-6 rounded-full border border-slate-200" />
);

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

const BrowsePage = () => {
  const [mode, setMode] = useState('buyer');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterSwapType, setFilterSwapType] = useState('All');
  const [filterProductType, setFilterProductType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Filter Options
  const LOCATIONS = ["All", "Nearby (<5km)", "Quezon City", "Makati", "BGC", "Manila"];
  const SWAP_TYPES = ["All", "Group Order", "Pasabuy", "On Hand"];
  const PRODUCT_TYPES = ["All", "Food", "Fashion", "Beauty", "Gadgets", "Home"];

  // Derived filtered data
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
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" sx={{ color: 'grey.400' }}>
                    <PhotoCameraIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Box>
      </div>

      <div className="px-4 space-y-6">
        {/* --- HERO SECTION --- */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 p-6 shadow-xl shadow-emerald-900/10 mt-4">
          <div className="absolute top-0 right-0 p-24 bg-white/10 blur-[60px] rounded-full pointer-events-none transform translate-x-10 -translate-y-10" />
          <div className="relative z-10 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wide backdrop-blur-md border border-white/10">
                <Globe size={10} /> Community Buys
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2 leading-tight">
              Find goodies near you.
            </h1>
            <p className="text-emerald-100 text-xs mb-5 font-medium max-w-[200px]">
              Join group orders to save on shipping or request items from travelers.
            </p>
            <div className="flex p-1 bg-black/20 rounded-lg w-fit backdrop-blur-sm">
              <button 
                onClick={() => setMode('buyer')} 
                className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${mode === 'buyer' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-100 hover:bg-white/10'}`}
              >
                Buyer
              </button>
              <button 
                onClick={() => setMode('traveler')} 
                className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${mode === 'traveler' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-100 hover:bg-white/10'}`}
              >
                Traveler
              </button>
            </div>
          </div>
        </div>

        {mode === 'buyer' ? (
          <>
            {/* --- FILTER BAR --- */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sticky top-[80px] z-30 py-2 -mx-4 px-4 bg-slate-50">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${activeFiltersCount > 0 ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}
              >
                <SlidersHorizontal size={12} />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
              
              {/* Quick Filters (Pills) */}
              {PRODUCT_TYPES.map((cat, i) => (
                <button 
                  key={cat} 
                  onClick={() => setFilterProductType(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${filterProductType === cat ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* --- EXPANDED FILTERS PANEL (Conditional) --- */}
            {showFilters && (
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4 animate-in slide-in-from-top-2 fade-in duration-200">
                 <div className="flex justify-between items-center mb-3">
                   <h3 className="text-sm font-bold text-slate-800">Refine Search</h3>
                   <button onClick={() => {setFilterLocation('All'); setFilterSwapType('All'); setFilterProductType('All');}} className="text-[10px] font-bold text-red-500 hover:underline">Reset All</button>
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

            {/* --- PRODUCTS GRID --- */}
            {/* <div className="grid grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-3"> */}
            <div className="grid grid-cols-2  gap-3">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className="group bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
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
                      <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 hover:bg-white text-slate-700 backdrop-blur-sm transition-colors">
                        <Heart size={14} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug min-h-[2.5em]">
                          {product.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-sm font-bold text-emerald-700">{formatPHP(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">{formatPHP(product.originalPrice)}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-2">
                        <MapPin size={10} />
                        <span className="truncate max-w-[80px]">{product.location}</span>
                        <span className="text-slate-300">•</span>
                        <span>{product.distance}km</span>
                      </div>

                      <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                         <div className="flex items-center gap-1.5">
                           <Avatar src={product.user.image} name={product.user.name} />
                           <span className="text-[10px] font-medium text-slate-600 truncate max-w-[60px]">{product.user.name}</span>
                         </div>
                         <div className="flex items-center text-[10px] font-bold text-amber-500">
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
                  <button onClick={() => {setFilterLocation('All'); setFilterSwapType('All'); setFilterProductType('All'); setSearchQuery('');}} className="mt-2 text-xs font-bold text-emerald-600">Clear Filters</button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* --- TRAVELER PLACEHOLDER (No changes requested here) --- */
          <div className="py-10 text-center text-slate-400">
             <Plane size={48} className="mx-auto mb-4 opacity-20" />
             <p className="text-sm">Traveler dashboard is under construction.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;