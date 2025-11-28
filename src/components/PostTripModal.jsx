import React from 'react';
import { X, MapPin, AlertTriangle } from 'lucide-react';
import { Card } from './CustomComponents';

const PostTripModal = ({ isOpen, onClose, showToast }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-10 duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 h-[85vh] sm:h-auto flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Post a Trip</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-5 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-bold">Origin</label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                <MapPin size={16} className="text-slate-400" />
                <input type="text" className="bg-transparent text-sm text-slate-900 focus:outline-none w-full font-medium" defaultValue="Tokyo" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-bold">Destination</label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                <MapPin size={16} className="text-slate-400" />
                <input type="text" className="bg-transparent text-sm text-slate-900 focus:outline-none w-full font-medium" defaultValue="Manila" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold">Capacity & Pricing</label>
            <Card className="p-4 bg-slate-50 border-slate-200" noHover>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-slate-900">20 <span className="text-sm font-normal text-slate-500">kg</span></span>
                <div className="text-right">
                   <span className="block text-xs text-slate-500">Potential Earnings</span>
                   <span className="text-emerald-600 font-bold">₱15,000</span>
                </div>
              </div>
              <input type="range" min="5" max="50" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </Card>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex gap-3">
             <AlertTriangle className="text-amber-500 shrink-0" size={18} />
             <div>
                <h4 className="text-xs font-bold text-amber-800">Customs Warning (De Minimis)</h4>
                <p className="text-[10px] text-amber-700 mt-0.5 leading-relaxed">
                  Values under ₱10,000 are tax-free. If you accept commercial quantities, please declare them properly to avoid airport seizure.
                </p>
             </div>
          </div>
        </div>

        <button 
          onClick={() => {
            showToast("Trip posted! Waiting for buyers.");
            onClose();
          }}
          className="mt-6 w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
        >
          Publish Trip
        </button>
      </div>
    </div>
  );
};

export default PostTripModal;