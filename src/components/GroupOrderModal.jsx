import React, { useState } from 'react';
import { X, TrendingDown, ShieldCheck, CheckCircle } from 'lucide-react';
import { Card, Badge, Avatar } from './CustomComponents';
import { formatPHP } from '@/utils';
import { formatCurrency } from '../utils';
import { PRICE_BREAKDOWN } from '../data';


const GroupOrderModal = ({ selectedGO, onClose, showToast }) => {
  if (!selectedGO) return null;

  const [participants, setParticipants] = useState(selectedGO?.pooling?.current || 0);
  const [selectedBias, setSelectedBias] = useState(null);
  const [joined, setJoined] = useState(false);

  // Ambag Algorithm
  const calculateFee = (count) => {
    const { baseFee, minFee, target } = selectedGO.pooling;
    if (count >= target) return minFee;
    const discount = ((baseFee - minFee) / target) * count;
    return Math.round(baseFee - discount);
  };

  const currentFee = calculateFee(participants);
  const potentialNextFee = calculateFee(participants + 5);

  const handleJoin = () => {
    if (!selectedBias && selectedGO.biases.length > 0) {
      showToast("Please select a Bias first!", "error");
      return;
    }
    setJoined(true);
    setParticipants(p => p + 1);
    showToast("Successfully joined Group Order!");
  };

  const totalPrice = formatCurrency(
    PRICE_BREAKDOWN.basePrice + PRICE_BREAKDOWN.tax + PRICE_BREAKDOWN.hostFee + PRICE_BREAKDOWN.handlingFee
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="font-bold text-lg text-slate-800">Group Order Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-6 bg-slate-50/50">
          {/* Header Info */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <Badge type="accent">{selectedGO.category}</Badge>
              <span className="text-xs text-slate-500 font-medium">Ends {new Date(selectedGO.deadline).toLocaleDateString()}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{selectedGO.title}</h1>
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Avatar name={selectedGO.manager.name} verified={selectedGO.manager.verified} size="sm" />
              <span>Hosted by <span className="text-slate-900 font-medium">{selectedGO.manager.name}</span></span>
            </div>
          </div>

          {/* Ambag Visualizer */}
          <Card className="p-5 border-emerald-100 bg-gradient-to-b from-white to-emerald-50/30" noHover>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                  <TrendingDown size={18} />
                </div>
                <span className="font-semibold text-slate-800">Smart Ambag Rate</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">{formatPHP(currentFee)}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Service Fee / Item</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
              <div 
                className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-500 ease-out"
                style={{ width: `${(participants / selectedGO.pooling.target) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mb-4 font-medium">
              <span>{participants} neighbors joined</span>
              <span>Target: {selectedGO.pooling.target}</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-emerald-100 text-sm text-slate-600 flex justify-between shadow-sm">
              <span>Price drops at {participants + 5} pax:</span>
              <span className="font-bold text-emerald-600">{formatPHP(potentialNextFee)}</span>
            </div>
          </Card>

          {/* Bias Selector */}
          {selectedGO.biases.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Select Member (Bias)</label>
              <div className="grid grid-cols-3 gap-2">
                {selectedGO.biases.map(bias => (
                  <button
                    key={bias}
                    onClick={() => !joined && setSelectedBias(bias)}
                    disabled={joined}
                    className={`
                      text-xs py-2.5 px-1 rounded-lg border transition-all font-medium
                      ${selectedBias === bias 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600'}
                      ${joined ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {bias}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Escrow Note */}
          <div className="flex gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
             <ShieldCheck className="text-blue-600 flex-shrink-0" size={20} />
             <div>
               <h4 className="text-xs font-bold text-blue-800">Protected by Bitbit Escrow</h4>
               <p className="text-[10px] text-blue-600 leading-relaxed mt-0.5">
                 Your payment is held neutrally. The host only receives funds after items arrive in PH and are ready to ship to you.
               </p>
             </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Price Breakdown</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex justify-between">
                <span>Base Price</span>
                <span>{formatCurrency(PRICE_BREAKDOWN.basePrice)}</span>
              </li>
              <li className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(PRICE_BREAKDOWN.tax)}</span>
              </li>
              <li className="flex justify-between">
                <span>Host Fee</span>
                <span>{formatCurrency(PRICE_BREAKDOWN.hostFee)}</span>
              </li>
              <li className="flex justify-between">
                <span>Handling Fee</span>
                <span>{formatCurrency(PRICE_BREAKDOWN.handlingFee)}</span>
              </li>
              <li className="flex justify-between font-bold text-slate-800">
                <span>Total</span>
                <span>{totalPrice}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-slate-500">Total Estimate</span>
              <span className="font-bold text-slate-900">{formatPHP(selectedGO.items[0].price + currentFee)}</span>
          </div>
          {joined ? (
            <button disabled className="w-full py-3 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl font-bold flex justify-center items-center gap-2">
              <CheckCircle size={18} />
              Joined Successfully
            </button>
          ) : (
            <button 
              onClick={handleJoin}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
            >
              Join & Pay via Escrow
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupOrderModal;