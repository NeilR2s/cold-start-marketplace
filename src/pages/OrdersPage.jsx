import React, { useState } from 'react';
import { Globe, MapPin, ChevronRight, Plane, Plus, Bell, Package, Clock, CheckCircle, MoreHorizontal, Filter } from 'lucide-react';
import { TextField, InputAdornment, IconButton, Box, Tab, Tabs } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Card as CustomCard, Badge, Avatar } from '@/components/CustomComponents';
import { formatPHP } from '@/utils';
import { MOCK_GOS, MOCK_TRIPS } from '@/data';

// --- NEW MOCK DATA BASED ON SCHEMA ---
const MOCK_TRANSACTIONS = [
  {
    id: "tx_1",
    status: "ongoing",
    step: "Purchasing", // Granular status
    product: {
      id: 1,
      title: "Limited Starbucks Sakura Tumbler 2024",
      price: 1250,
      image: "https://images.unsplash.com/photo-1570784332176-fdd73da66f03?auto=format&fit=crop&q=80&w=600",
      location: "Tokyo, JP",
      user: { name: "Sarah J.", image: "https://i.pravatar.cc/150?u=1" }
    },
    travelerEarnings: 150,
    deadline: "2024-03-25"
  },
  {
    id: "tx_2",
    status: "ongoing",
    step: "In Transit",
    product: {
      id: 3,
      title: "Don Quijote Matcha KitKats (12 Pack)",
      price: 450,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ318pT1StZ1ZlM4fkIoI6SfcTCGdi_9TG7-Q&s",
      location: "Osaka, JP",
      user: { name: "Mike R.", image: "https://i.pravatar.cc/150?u=2" }
    },
    travelerEarnings: 50,
    deadline: "2024-03-22"
  },
  {
    id: "tx_3",
    status: "past",
    step: "Delivered",
    product: {
      id: 5,
      title: "Gentle Monster Sunglasses",
      price: 15200,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600",
      location: "Seoul, KR",
      user: { name: "Jessica L.", image: "https://i.pravatar.cc/150?u=3" }
    },
    travelerEarnings: 1200,
    deadline: "2024-02-10"
  },
  {
    id: "tx_4",
    status: "past",
    step: "Cancelled",
    product: {
      id: 8,
      title: "Olive Young Skin Care Set",
      price: 3200,
      image: "https://sugarpeachesloves.net/wp-content/uploads/2022/08/Olive-Young-Global-5-step-skincare-routine-scaled.jpeg",
      location: "Seoul, KR",
      user: { name: "David K.", image: "https://i.pravatar.cc/150?u=4" }
    },
    travelerEarnings: 0,
    deadline: "2024-01-15"
  }
];

const OrdersPage = ({ mode, setMode, setSelectedGO, setIsPostTripOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  // State for Traveler Transaction Toggle
  const [travelerTab, setTravelerTab] = useState('ongoing');

  // Filter transactions
  const filteredTransactions = MOCK_TRANSACTIONS.filter(t => t.status === travelerTab);

  return (
    <div className="px-4 py-6 space-y-8 pb-28">
      
      {/* Search Bar */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        px: 2,
        py: 1.5,
        mt: 2,
        mb: 3,
        maxWidth: '100%',
      }}>
        <SearchIcon sx={{ color: 'grey.500', fontSize: 32, mr: 1 }} />
        <TextField
          variant="standard"
          placeholder={mode === 'buyer' ? "Search a product" : "Search orders"}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: 16, fontFamily: 'Figtree', flex: 1 },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" sx={{ color: 'grey.500' }}>
                  <PhotoCameraIcon sx={{ fontSize: 28 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </Box>

      {/* Mode Switcher - Moved outside Hero for Traveler View */}
      <div className="flex gap-2 justify-center mb-4">
        <button onClick={() => setMode('buyer')} className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${mode === 'buyer' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-500 border border-slate-200'}`}>
          I'm a Buyer
        </button>
        <button onClick={() => setMode('traveler')} className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${mode === 'traveler' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-500 border border-slate-200'}`}>
          I'm a Traveler
        </button>
      </div>

      {mode === 'buyer' ? (
        <>
          {/* Hero Section - ONLY for Buyer */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-600 to-teal-700 p-6 sm:p-10 shadow-lg shadow-emerald-900/20">
            <div className="absolute top-0 right-0 p-32 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10 text-white">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wide mb-3 backdrop-blur-md">
                <Globe size={10} /> Pasabuy & Group Orders
              </div>
              <h1 className="text-3xl font-bold mb-2">
                Local flavor, <br /> global reach.
              </h1>
              <p className="text-emerald-100 max-w-xs text-sm mb-6 leading-relaxed">
                Verified travelers and community group buys. Save on shipping, safe on payments.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["All", "K-Pop", "Food", "Fashion", "Gadgets", "Home"].map((cat, i) => (
              <button key={cat} className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${i === 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Group Orders Section */}
          <section>
            <div className="flex justify-between items-end mb-4 px-1">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Trending Group Orders</h2>
                <p className="text-xs text-slate-500">Join neighbors to lower shipping fees</p>
              </div>
              <button className="text-xs text-emerald-600 font-bold hover:underline">See All</button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {MOCK_GOS.map(go => (
                <CustomCard key={go.id} onClick={() => setSelectedGO(go)} className="p-0 flex flex-col">
                   <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge type={go.status === 'open' ? 'success' : 'warning'}>{go.status.replace('_', ' ').toUpperCase()}</Badge>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{go.pooling.current}/{go.pooling.target} Joined</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{go.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                      <MapPin size={12} /> {go.region} • Ends {new Date(go.deadline).toLocaleDateString()}
                    </p>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(go.pooling.current / go.pooling.target) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>Base Fee: {formatPHP(go.pooling.baseFee)}</span>
                      <span className="text-emerald-600 font-bold">Current: {formatPHP(go.pooling.baseFee - (((go.pooling.baseFee - go.pooling.minFee) / go.pooling.target) * go.pooling.current))}</span>
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar name={go.manager.name} verified={go.manager.verified} size="sm" />
                      <span className="text-xs font-semibold text-slate-600">{go.manager.name}</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      <ChevronRight size={14} className="text-slate-400" />
                    </div>
                  </div>
                </CustomCard>
              ))}
            </div>
          </section>

          {/* Traveler Feed Section */}
          <section>
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Travelers</h2>
              <button className="text-xs text-emerald-600 font-bold hover:underline">See All</button>
            </div>
            <div className="space-y-4">
              {MOCK_TRIPS.map(trip => (
                <CustomCard key={trip.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <Avatar name={trip.traveler.name} verified={trip.traveler.verified} />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{trip.traveler.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 font-medium">
                          <span>{trip.origin}</span>
                          <Plane size={10} className="text-slate-400" />
                          <span>{trip.destination}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-600">{trip.capacity.available}kg Left</div>
                      <div className="text-[10px] text-slate-400 font-medium">{formatPHP(trip.capacity.pricePerKg)}/kg</div>
                    </div>
                  </div>
                </CustomCard>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* ================= TRAVELER DASHBOARD (MODIFIED) ================= */
        <div className="space-y-6 animate-in fade-in">
          
          {/* Dashboard Header */}
          <div className="flex justify-between items-center px-1">
             <div>
                <h2 className="text-xl font-bold text-slate-900">My Transactions</h2>
                <p className="text-xs text-slate-500">Manage your pasabuy requests</p>
             </div>
             <button onClick={() => setIsPostTripOpen(true)} className="bg-slate-900 text-white p-2 rounded-full shadow-lg shadow-slate-200">
                <Plus size={20} />
             </button>
          </div>

          {/* Toggle Switch */}
          <div className="bg-slate-100 p-1 rounded-xl flex relative">
            <button 
                onClick={() => setTravelerTab('ongoing')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 z-10 ${travelerTab === 'ongoing' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Ongoing Orders ({MOCK_TRANSACTIONS.filter(t => t.status === 'ongoing').length})
            </button>
            <button 
                onClick={() => setTravelerTab('past')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 z-10 ${travelerTab === 'past' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Past History
            </button>
          </div>

          {/* Transaction List */}
          <div className="space-y-4">
             {filteredTransactions.length === 0 ? (
                <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Package size={24} className="text-slate-300"/>
                    </div>
                    <p className="text-slate-400 text-sm">No {travelerTab} transactions found.</p>
                </div>
             ) : (
                 filteredTransactions.map((tx) => (
                    <CustomCard key={tx.id} className="p-0 overflow-hidden group">
                        {/* Header Status Bar */}
                        <div className={`px-4 py-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-wide ${tx.status === 'ongoing' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                            <span className="flex items-center gap-1.5">
                                {tx.status === 'ongoing' ? <Clock size={12}/> : <CheckCircle size={12}/>}
                                {tx.step}
                            </span>
                            <span>ID: {tx.id.toUpperCase()}</span>
                        </div>

                        {/* Main Content */}
                        <div className="p-4">
                            <div className="flex gap-4">
                                {/* Product Image */}
                                <div className="w-20 h-20 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-100">
                                    <img src={tx.product.image} alt={tx.product.title} className="w-full h-full object-cover" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-bold text-slate-900 truncate pr-2">{tx.product.title}</h3>
                                        <button className="text-slate-300 hover:text-slate-600">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-2 truncate">{tx.product.location}</p>
                                    
                                    {/* Buyer Info & Earnings */}
                                    <div className="flex justify-between items-end mt-2">
                                        <div className="flex items-center gap-2">
                                            <Avatar name={tx.product.user.name} src={tx.product.user.image} size="xs" />
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-medium">Buyer</p>
                                                <p className="text-xs font-bold text-slate-700">{tx.product.user.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-medium">You Earn</p>
                                            <p className="text-sm font-bold text-emerald-600">{formatPHP(tx.travelerEarnings)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Footer (Only for Ongoing) */}
                        {tx.status === 'ongoing' && (
                            <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
                                <button className="flex-1 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors">
                                    Update Status
                                </button>
                                <button className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors">
                                    Chat
                                </button>
                            </div>
                        )}
                    </CustomCard>
                 ))
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;