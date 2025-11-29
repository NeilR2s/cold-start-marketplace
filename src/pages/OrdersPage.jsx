import React from 'react';
import { Package, MapPin, Camera, ArrowRight } from 'lucide-react';
import { Card, Badge } from '@/components/CustomComponents';

const OrdersPage = () => (
  <div className="pb-24 space-y-6 px-4 py-6">
    <h1 className="text-2xl font-bold text-slate-900 mb-6">My Orders</h1>
    
    <Card className="p-0 border-l-4 border-l-emerald-500">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <span className="text-xs font-bold text-slate-500">#ORD-9281</span>
        <div className="flex gap-2">
           <Badge type="warning">En Route</Badge>
           <Badge type="neutral">NETA (Sea)</Badge>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
            <Package size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Seventeen 'FML' Album</h3>
            <p className="text-xs text-slate-500 mt-1">Carat Ver • Wonwoo Bias</p>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
               <MapPin size={10} /> Arriving at PH Hub: Dec 5
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Camera size={12} /> Packaging Proof
            </span>
            <span className="text-[10px] text-slate-400">2h ago</span>
          </div>
          <div className="h-24 w-full bg-slate-200 rounded flex items-center justify-center relative group cursor-pointer overflow-hidden">
             <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
             <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center z-10 scale-100 group-hover:scale-110 transition-transform">
               <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-emerald-500 border-b-[5px] border-b-transparent ml-1" />
             </div>
          </div>
        </div>
      </div>
      <div className="p-3 bg-white border-t border-slate-100 text-center">
        <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center justify-center gap-1">
          Track Delivery <ArrowRight size={12} />
        </button>
      </div>
    </Card>
  </div>
);

export default OrdersPage;