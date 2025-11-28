import React from 'react';
import { Globe, MapPin, ChevronRight, Plane, Plus, Bell, Package } from 'lucide-react';
import { Card, Badge, Avatar } from '@/components/CustomComponents';
import { formatPHP } from '@/utils';
import { MOCK_GOS, MOCK_TRIPS } from '@/data';

const BrowsePage = ({ mode, setMode, setSelectedGO, setIsPostTripOpen }) => (
  <div className="space-y-8 pb-28">
    {/* Hero Section */}
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-600 to-teal-700 p-6 sm:p-10 shadow-lg shadow-emerald-900/20">
      <div className="absolute top-0 right-0 p-32 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="relative z-10 text-white">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wide mb-3 backdrop-blur-md">
          <Globe size={10} /> Pasabuy & Group Orders
        </div>
        <h1 className="text-3xl font-bold mb-2">
          Local flavor, <br/> global reach.
        </h1>
        <p className="text-emerald-100 max-w-xs text-sm mb-6 leading-relaxed">
          Verified travelers and community group buys. Save on shipping, safe on payments.
        </p>
        <div className="flex gap-2">
          <button onClick={() => setMode('buyer')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${mode === 'buyer' ? 'bg-white text-emerald-700 shadow-md' : 'bg-emerald-800/40 text-emerald-100 hover:bg-emerald-800/60'}`}>
            I'm a Buyer
          </button>
          <button onClick={() => setMode('traveler')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${mode === 'traveler' ? 'bg-white text-emerald-700 shadow-md' : 'bg-emerald-800/40 text-emerald-100 hover:bg-emerald-800/60'}`}>
            I'm a Traveler
          </button>
        </div>
      </div>
    </div>

    {mode === 'buyer' ? (
      <>
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
              <Card key={go.id} onClick={() => setSelectedGO(go)} className="p-0 flex flex-col">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Badge type={go.status === 'open' ? 'success' : 'warning'}>{go.status.replace('_', ' ').toUpperCase()}</Badge>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{go.pooling.current}/{go.pooling.target} Joined</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{go.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                    <MapPin size={12} /> {go.region} • Ends {new Date(go.deadline).toLocaleDateString()}
                  </p>
                  
                  {/* Mini Ambag Viz */}
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
              </Card>
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
              <Card key={trip.id} className="p-4">
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
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {trip.shops.map(shop => (
                    <span key={shop} className="whitespace-nowrap px-2 py-1 bg-slate-100 rounded text-[10px] font-semibold text-slate-600 border border-slate-200">
                      {shop}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </>
    ) : (
      /* TRAVELER DASHBOARD */
      <div className="space-y-6 animate-in fade-in">
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setIsPostTripOpen(true)} className="group p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-emerald-100 transition-all text-center flex flex-col items-center justify-center gap-3 h-32">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={20} />
            </div>
            <span className="text-sm font-bold text-slate-700">Post New Trip</span>
          </button>
          <button className="group p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-blue-100 transition-all text-center flex flex-col items-center justify-center gap-3 h-32">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package size={20} />
            </div>
            <span className="text-sm font-bold text-slate-700">Manage Orders</span>
          </button>
        </div>

        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Active Requests</h3>
          <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center bg-slate-50/50">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100">
              <Bell size={20} className="text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm font-medium">No new requests for your trips yet.</p>
            <button className="mt-3 text-xs text-emerald-600 font-bold">Promote your trip</button>
          </div>
        </section>
      </div>
    )}
  </div>
);

export default BrowsePage;