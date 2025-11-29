import React, { useState } from 'react';
import {
   Clock,
   ChevronRight,
   Repeat,
   ListTodo,
   Star,
   ArrowUpRight,
   LogOut,
   MapPin,
   Mail,
   Calendar,
   ShieldCheck,
   X,             // New
   User,          // New
   ArrowRightLeft // New
} from 'lucide-react';
import { Card, Badge, Avatar } from '@/components/CustomComponents';

const ProfilePage = () => {
   const [showExchangeModal, setShowExchangeModal] = useState(false);
   const [exchangeType, setExchangeType] = useState('send'); // 'send' | 'request'

   // Fallback data
   const profile = {
      displayName: "Elena R.",
      email: "elena.rose@example.com",
      location: "Ortigas, RET44",
      joinedDate: "Sept 2023",
      reputationScore: 98,
      credits: 14.5,
      skills: ["Web Design", "Gardening", "Pet Sitting"],
      activeSwaps: 2,
      verificationProgress: 75,
      verificationSteps: "3/4"
   };

   const handleLogout = () => {
      window.location.href = "/";
   };

   return (
      <div className="text-center animate-in fade-in px-4 py-6 max-w-md mx-auto pb-15 relative">
         
         {/* --- Profile Header --- */}
         <div className="mt-4 mb-6">
            <Avatar name={profile.displayName} verified={true} size="lg" />
            <h2 className="text-xl font-bold text-slate-900 mt-3">{profile.displayName}</h2>

            <div className="flex flex-col items-center gap-3 mt-2">
               <Badge type="neutral">
                  <div className="flex items-center gap-1 leading-none">
                     <Star size={12} className="text-amber-500 fill-amber-500" />
                     <span>{profile.reputationScore}% Positive</span>
                  </div>
               </Badge>

               <div className="w-full max-w-[200px] flex flex-col gap-1">
                  <div className="flex justify-between items-end px-1">
                     <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        <ShieldCheck size={10} className="text-emerald-600" />
                        Identity Verified
                     </div>
                     <span className="text-[10px] font-medium text-emerald-700">{profile.verificationSteps}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${profile.verificationProgress}%` }}
                     />
                  </div>
               </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 mt-5">
               {profile.skills.map((skill, index) => (
                  <span key={index} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                     {skill}
                  </span>
               ))}
            </div>
         </div>

         {/* --- Main Action Grid --- */}
         <div className="grid grid-cols-1 gap-3 text-left">

            {/* Time Bank Wallet */}
            <Card className="p-4 flex items-center justify-between border-emerald-200 bg-emerald-50/50 relative overflow-hidden">
               <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-100/50 rounded-full blur-xl pointer-events-none" />
               <div className="flex items-center gap-3 z-10">
                  <div className="p-2.5 bg-emerald-100 rounded-full text-emerald-600 shadow-sm">
                     <Clock size={20} />
                  </div>
                  <div>
                     <div className="text-xs text-emerald-700 font-bold uppercase tracking-wide">Time Credits</div>
                     <div className="text-xl font-bold text-emerald-900 flex items-baseline gap-1">
                        {profile.credits} <span className="text-sm font-medium text-emerald-700">hrs</span>
                     </div>
                  </div>
               </div>
               <button 
                  onClick={() => setShowExchangeModal(true)}
                  className="z-10 text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm transition-colors"
               >
                  Exchange
               </button>
            </Card>

            {/* Active Swaps */}
            {profile.activeSwaps > 0 && (
               <Card className="p-3 bg-slate-900 text-white flex items-center justify-between shadow-lg shadow-slate-200">
                  <div className="flex items-center gap-2">
                     <div className="p-1.5 bg-slate-700 rounded-full animate-pulse">
                        <Repeat size={14} className="text-emerald-400" />
                     </div>
                     <span className="text-sm font-semibold text-emerald-700">
                        {profile.activeSwaps} Trade{profile.activeSwaps > 1 ? 's' : ''} in Progress
                     </span>
                  </div>
                  <ChevronRight size={16} className="text-emerald-400" />
               </Card>
            )}

            {/* Offers / Requests */}
            <div className="grid grid-cols-2 gap-3">
               <Card className="p-4 flex flex-col justify-between gap-2 hover:border-emerald-200 transition-colors cursor-pointer group">
                  <div className="p-2 w-fit bg-slate-50 text-slate-600 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                     <ListTodo size={18} />
                  </div>
                  <div>
                     <span className="block text-xs text-slate-500 font-medium">I Can Provide</span>
                     <span className="text-sm font-bold text-slate-800">My Offers</span>
                  </div>
               </Card>

               <Card className="p-4 flex flex-col justify-between gap-2 hover:border-emerald-200 transition-colors cursor-pointer group">
                  <div className="p-2 w-fit bg-slate-50 text-slate-600 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                     <ArrowUpRight size={18} />
                  </div>
                  <div>
                     <span className="block text-xs text-slate-500 font-medium">I Am Seeking</span>
                     <span className="text-sm font-bold text-slate-800">My Requests</span>
                  </div>
               </Card>
            </div>

            {/* Details */}
            <Card className="flex flex-col divide-y divide-slate-100">
               <div className="p-3.5 flex items-center gap-3">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600 font-medium truncate">{profile.email}</span>
               </div>
               <div className="p-3.5 flex items-center gap-3">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600 font-medium">{profile.location}</span>
               </div>
               <div className="p-3.5 flex items-center gap-3">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600 font-medium">Member since {profile.joinedDate}</span>
               </div>
            </Card>

            {/* Logout */}
            <button 
               onClick={handleLogout}
               className="mt-4 w-full p-3 flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm group"
            >
               <LogOut size={16} className="group-hover:stroke-2" />
               Log Out
            </button>
         </div>

         {/* --- EXCHANGE MODAL --- */}
         {showExchangeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
               {/* Backdrop */}
               <div 
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                  onClick={() => setShowExchangeModal(false)}
               />

               {/* Modal Content */}
               <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-lg text-slate-800">Exchange Credits</h3>
                     <button 
                        onClick={() => setShowExchangeModal(false)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  {/* Toggle Tabs */}
                  <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
                     <button 
                        onClick={() => setExchangeType('send')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${
                           exchangeType === 'send' 
                              ? 'bg-white text-emerald-700 shadow-sm' 
                              : 'text-slate-500 hover:text-slate-700'
                        }`}
                     >
                        Send
                     </button>
                     <button 
                        onClick={() => setExchangeType('request')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${
                           exchangeType === 'request' 
                              ? 'bg-white text-emerald-700 shadow-sm' 
                              : 'text-slate-500 hover:text-slate-700'
                        }`}
                     >
                        Request
                     </button>
                  </div>

                  <div className="space-y-4">
                     {/* Recipient Input */}
                     <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-slate-500 ml-1">
                           {exchangeType === 'send' ? 'Recipient' : 'Request From'}
                        </label>
                        <div className="relative">
                           <User size={18} className="absolute left-3 top-3 text-slate-400" />
                           <input 
                              type="text" 
                              placeholder="Name or Email" 
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                           />
                        </div>
                     </div>

                     {/* Amount Input */}
                     <div className="space-y-1.5 text-left">
                        <div className="flex justify-between items-center px-1">
                           <label className="text-xs font-semibold text-slate-500">Amount (Hours)</label>
                           {exchangeType === 'send' && (
                              <span className="text-[10px] text-emerald-600 font-medium cursor-pointer hover:underline">
                                 Max: {profile.credits}
                              </span>
                           )}
                        </div>
                        <div className="relative">
                           <Clock size={18} className="absolute left-3 top-3 text-emerald-500" />
                           <input 
                              type="number" 
                              placeholder="0.00" 
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                           />
                        </div>
                     </div>

                     {/* Note Input */}
                     <div className="pt-2">
                        <textarea 
                           placeholder="Add a note (e.g., for the gardening help)"
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-20"
                        />
                     </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                     <ArrowRightLeft size={18} />
                     {exchangeType === 'send' ? 'Transfer Credits' : 'Send Request'}
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default ProfilePage;