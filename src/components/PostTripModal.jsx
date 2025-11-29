import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, AlertTriangle, Calendar, Plane } from 'lucide-react';
import { Card } from './CustomComponents';

const PostTripModal = ({ isOpen, onClose, showToast }) => {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const [origin, setOrigin] = useState("Tokyo");
  const [destination, setDestination] = useState("Manila");
  const [capacityKg, setCapacityKg] = useState(20);
  const [pricePerKg, setPricePerKg] = useState(800);
  const [returnDate, setReturnDate] = useState("");

  const handlePublish = () => {
    showToast("Pasabuy trip posted! Track it under Pasabuys.");
    onClose();
    navigate("/orders", { state: { from: "hostTrip" } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-10 duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 h-[85vh] sm:h-auto flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-600">Host a Pasabuy</p>
            <h2 className="text-xl font-bold text-slate-900">Post a Trip</h2>
          </div>
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
                <input
                  type="text"
                  className="bg-transparent text-sm text-slate-900 focus:outline-none w-full font-medium"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-bold">Destination</label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                <MapPin size={16} className="text-slate-400" />
                <input
                  type="text"
                  className="bg-transparent text-sm text-slate-900 focus:outline-none w-full font-medium"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-bold">Return date</label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                <Calendar size={16} className="text-slate-400" />
                <input
                  type="date"
                  className="bg-transparent text-sm text-slate-900 focus:outline-none w-full font-medium"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-bold">Trip focus</label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                <Plane size={16} className="text-emerald-500" />
                <span>
                  This trip will show up as a <span className="font-semibold text-slate-800">Pasabuy</span> for buyers along your route.
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500 uppercase font-bold">Capacity & Pricing</label>
            <Card className="p-4 bg-slate-50 border-slate-200" noHover>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-slate-900">
                  {capacityKg} <span className="text-sm font-normal text-slate-500">kg</span>
                </span>
                <div className="text-right">
                  <span className="block text-xs text-slate-500">Starting rate</span>
                  <span className="text-emerald-600 font-bold">₱{pricePerKg}/kg</span>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={capacityKg}
                onChange={(e) => setCapacityKg(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Price per kg</span>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(Number(e.target.value) || 0)}
                  className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
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
          onClick={handlePublish}
          className="mt-6 w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
        >
          Publish Trip & View Pasabuys
        </button>
      </div>
    </div>
  );
};

export default PostTripModal;