import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
   X,
   User,
   ArrowRightLeft,
   Edit2,
   Save
} from 'lucide-react';
import { Card, Badge, Avatar } from '@/components/CustomComponents';
import { CURRENT_USER } from '@/data';
import { saveLocalProfile } from '@/utils/profileStorage';

// Shared mock pasabuy data (mirrors OrdersPage) so profile can cross-check host activity
const getUsers = (user) => ({
   current: {
      id: user?.uid || CURRENT_USER.uid,
      name: user?.displayName || CURRENT_USER.displayName,
      avatar: user?.avatar || CURRENT_USER.avatar,
   },
   sarah: {
      id: 'u201',
      name: 'Sarah J.',
      avatar: 'https://i.pravatar.cc/150?u=1',
   },
   mike: {
      id: 'u202',
      name: 'Mike R.',
      avatar: 'https://i.pravatar.cc/150?u=2',
   },
   jessica: {
      id: 'u203',
      name: 'Jessica L.',
      avatar: 'https://i.pravatar.cc/150?u=3',
   },
   david: {
      id: 'u204',
      name: 'David K.',
      avatar: 'https://i.pravatar.cc/150?u=4',
   },
});

const getMockTransactions = (user) => {
   const USERS = getUsers(user);
   return [
      {
         id: "tx_1",
         status: "ongoing",
         host: USERS.current,
      },
      {
         id: "tx_2",
         status: "ongoing",
         host: USERS.mike,
      },
      {
         id: "tx_3",
         status: "past",
         host: USERS.jessica,
      },
      {
         id: "tx_4",
         status: "past",
         host: USERS.current,
      }
   ];
};

const ProfilePage = ({ user, setUser, travelerAvailability, setTravelerAvailability }) => {
   const navigate = useNavigate();
   const [showExchangeModal, setShowExchangeModal] = useState(false);
   const [exchangeType, setExchangeType] = useState('send'); // 'send' | 'request'
   const [showCreditsInfo, setShowCreditsInfo] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);
   const [showListingsModal, setShowListingsModal] = useState(false);
   const [showWantsModal, setShowWantsModal] = useState(false);
   const [listingsNote, setListingsNote] = useState('Summarize what you usually host or offer for swaps.');
   const [wantsNote, setWantsNote] = useState('List the kinds of things you are currently looking for.');
   const [editForm, setEditForm] = useState({
      displayName: user?.displayName || CURRENT_USER.displayName,
      email: user?.email || "clara@example.com",
      location: user?.location || "Ortigas, RET44",
   });

   // Fallback data
   const profile = {
      displayName: user?.displayName || CURRENT_USER.displayName,
      email: user?.email || "clara@example.com",
      location: user?.location || "Ortigas, RET44",
      joinedDate: "Sept 2023",
      reputationScore: Math.round((CURRENT_USER.reputationScore || 4.8) * 20),
      credits: 14.5,
      skills: ["Web Design", "Gardening", "Pet Sitting"],
      activeSwaps: 2,
      verificationProgress: 75,
      verificationSteps: "3/4"
   };

   const isTravelerActive = travelerAvailability?.active;
   const travelerUntil = travelerAvailability?.until;

   // Cross-check with pasabuys: how many active trips is this user currently hosting?
   const hostPasabuySummary = useMemo(() => {
      const USERS = getUsers(user);
      const MOCK_TRANSACTIONS = getMockTransactions(user);
      const activeHostTrips = MOCK_TRANSACTIONS.filter(
         (t) => t.host.id === USERS.current.id && t.status === 'ongoing'
      ).length;

      const pastHostTrips = MOCK_TRANSACTIONS.filter(
         (t) => t.host.id === USERS.current.id && t.status === 'past'
      ).length;

      return { activeHostTrips, pastHostTrips };
   }, [user]);

   const handleToggleTraveler = () => {
      if (!setTravelerAvailability) return;
      if (isTravelerActive) {
         setTravelerAvailability({ active: false, until: null });
      } else {
         const sevenDaysFromNow = new Date();
         sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
         setTravelerAvailability({
            active: true,
            until: sevenDaysFromNow.toISOString().slice(0, 10),
         });
      }
   };

   const handleTravelerUntilChange = (value) => {
      if (!setTravelerAvailability) return;
      setTravelerAvailability({
         active: true,
         until: value || null,
      });
   };

   const handleLogout = () => {
      window.location.href = "/";
   };

   const handleEditSave = () => {
      try {
         const updated = saveLocalProfile({
            displayName: editForm.displayName.trim(),
            email: editForm.email.trim(),
            location: editForm.location.trim(),
         });
         
         // Update the user state in App.jsx
         if (setUser) {
            setUser(updated);
         }
         
         // Trigger custom event for same-tab updates
         window.dispatchEvent(new Event('profileUpdated'));
         
         setShowEditModal(false);
      } catch (error) {
         console.error('Error saving profile:', error);
      }
   };

   const handleOpenEdit = () => {
      setEditForm({
         displayName: profile.displayName,
         email: profile.email,
         location: profile.location,
      });
      setShowEditModal(true);
   };

   return (
      <div className="animate-in fade-in py-6 pb-24 md:py-10 relative min-h-screen">

         <div className="md:grid md:grid-cols-12 md:gap-8 items-start">
            
            {/* --- LEFT COLUMN: Profile Identity (Sidebar on Desktop) --- */}
            <div className="md:col-span-5 lg:col-span-4 mb-6 md:mb-0">
               <div className="md:sticky md:top-24">
                  <Card className="p-2 border-none shadow-none bg-transparent md:bg-white md:border md:border-slate-200 md:shadow-sm md:p-6 text-center md:text-left">
                     
                     {/* Avatar, Name & Edit */}
                     <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-col items-center md:items-start">
                           <Avatar
                              name={profile.displayName}
                              verified={true}
                              size="lg"
                              className="w-24 h-24 md:w-28 md:h-28"
                           />
                           <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-4">
                              {profile.displayName}
                           </h2>
                           <div className="mt-2 flex items-center justify-center md:justify-start gap-2">
                              <Badge type="neutral">
                                 <div className="flex items-center gap-1 leading-none">
                                    <Star size={12} className="text-amber-500 fill-amber-500" />
                                    <span>{profile.reputationScore}% Positive</span>
                                 </div>
                              </Badge>
                           </div>
                        </div>

                        {/* Edit profile trigger */}
                        <button
                           type="button"
                           onClick={handleOpenEdit}
                           className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-500 hover:text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                        >
                           <Edit2 size={14} />
                           Edit
                        </button>
                     </div>

                     {/* Mobile edit button */}
                     <button
                        type="button"
                        onClick={handleOpenEdit}
                        className="mt-4 inline-flex md:hidden items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-500 hover:text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                     >
                        <Edit2 size={14} />
                        Edit Profile
                     </button>

                     {/* Verification Progress */}
                     <div className="mt-6 w-full max-w-[240px] md:max-w-full mx-auto md:mx-0 flex flex-col gap-1">
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

                     {/* Skills */}
                     <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mt-5">
                        {profile.skills.map((skill, index) => (
                           <span key={index} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                              {skill}
                           </span>
                        ))}
                     </div>

                     {/* Contact Details (Moved here for Desktop View) */}
                     <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                           <Mail size={16} className="text-slate-400" />
                           <span className="text-sm text-slate-600 font-medium truncate">{profile.email}</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                           <MapPin size={16} className="text-slate-400" />
                           <span className="text-sm text-slate-600 font-medium">{profile.location}</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                           <Calendar size={16} className="text-slate-400" />
                           <span className="text-sm text-slate-600 font-medium">Joined {profile.joinedDate}</span>
                        </div>
                     </div>

                     {/* Logout (Desktop Only location, hidden on mobile logic handled via CSS usually, but here we render both and hide via classes if needed, or keep simpler) */}
                     <div className="hidden md:block mt-6 pt-4 border-t border-slate-100">
                         <button 
                           onClick={handleLogout}
                           className="w-full py-2 flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors font-medium text-sm"
                        >
                           <LogOut size={16} />
                           Log Out
                        </button>
                     </div>
                  </Card>
               </div>
            </div>

            {/* --- RIGHT COLUMN: Actions Dashboard --- */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-4">
               
               {/* Top Row: Time Bank & Traveler Mode (Side-by-side on Desktop) */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Time Bank Wallet */}
                  <Card className="p-5 flex flex-col justify-between h-full border-emerald-200 bg-emerald-50/50 relative overflow-hidden min-h-[160px]">
                     <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-100/50 rounded-full blur-xl pointer-events-none" />
                     <div className="flex items-start justify-between z-10">
                        <div className="flex items-center gap-3">
                           <div className="p-2.5 bg-emerald-100 rounded-full text-emerald-600 shadow-sm">
                              <Clock size={20} />
                           </div>
                           <div>
                              <button
                                 type="button"
                                 onClick={() => setShowCreditsInfo(true)}
                                 className="text-left text-xs text-emerald-700 font-bold uppercase tracking-wide underline underline-offset-2 decoration-emerald-300 hover:text-emerald-800"
                              >
                                 Time Credits
                              </button>
                              <div className="text-2xl font-bold text-emerald-900 flex items-baseline gap-1">
                                 {profile.credits} <span className="text-sm font-medium text-emerald-700">hrs</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="mt-4 flex items-center justify-between z-10 gap-2">
                        <p className="text-[10px] text-emerald-800/80 leading-snug max-w-[60%]">
                           Earn hours by helping, spend hours to request help.
                        </p>
                        <button 
                           onClick={() => setShowExchangeModal(true)}
                           className="text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-200 shadow-sm transition-colors whitespace-nowrap"
                        >
                           Exchange
                        </button>
                     </div>
                  </Card>

                  {/* Traveler Availability */}
                  <Card className="p-5 flex flex-col justify-between h-full border-slate-200 bg-white min-h-[160px]">
                     <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                           <div className="p-2.5 bg-slate-100 rounded-full text-emerald-600">
                              <ArrowRightLeft size={18} />
                           </div>
                           <div>
                              <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Traveler Mode</div>
                              <div className="text-sm font-bold text-slate-900 leading-tight mt-0.5">
                                 {isTravelerActive ? "Accepting requests" : "Not traveling"}
                              </div>
                           </div>
                        </div>
                        <button
                           type="button"
                           onClick={handleToggleTraveler}
                           className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
                              isTravelerActive ? "bg-emerald-500 border-emerald-500" : "bg-slate-200 border-slate-200"
                           }`}
                        >
                           <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isTravelerActive ? "translate-x-5" : "translate-x-1"}`} />
                        </button>
                     </div>

                     <div className="mt-3 pt-3 border-t border-slate-50">
                        {isTravelerActive ? (
                           <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                 <label className="text-[10px] font-bold text-slate-400 uppercase">Until</label>
                                 <input
                                    type="date"
                                    value={travelerUntil || ""}
                                    onChange={(e) => handleTravelerUntilChange(e.target.value)}
                                    className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                 />
                              </div>
                              <button
                                 type="button"
                                 onClick={() => navigate("/explore", { state: { activeTab: "travelers" } })}
                                 className="w-full text-left inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
                              >
                                 <ArrowUpRight size={12} /> View traveler feed
                              </button>
                           </div>
                        ) : (
                           <p className="text-[11px] text-slate-400 leading-relaxed">
                              Toggle on if you have a trip and can bring items back for neighbors.
                           </p>
                        )}
                     </div>
                  </Card>
               </div>

               {/* Active Swaps (Full Width) */}
               {profile.activeSwaps > 0 && (
                  <Card className="p-4 bg-slate-900 text-white flex items-center justify-between shadow-lg shadow-slate-200 hover:shadow-xl transition-shadow cursor-pointer">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-full animate-pulse">
                           <Repeat size={16} className="text-emerald-400" />
                        </div>
                        <div>
                           <span className="block text-sm font-bold text-emerald-400">Action Required</span>
                           <span className="text-xs text-emerald-600">
                              You have {profile.activeSwaps} trade{profile.activeSwaps > 1 ? 's' : ''} currently in progress
                           </span>
                        </div>
                     </div>
                     <div className="bg-slate-800 p-1.5 rounded-lg">
                        <ChevronRight size={18} className="text-white" />
                     </div>
                  </Card>
               )}

               {/* Offers / Requests Grid */}
               <div className="grid grid-cols-2 gap-4">
                  {/* My Listings / Host summary */}
                  <Card className="p-5 flex flex-col justify-between gap-4 hover:border-emerald-200 transition-all group h-full">
                     <div className="flex justify-between items-start">
                        <div className="p-2.5 w-fit bg-slate-50 text-slate-600 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                           <ListTodo size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-300 group-hover:text-emerald-300">OFFERS</span>
                     </div>
                     <div>
                        <span className="block text-xs text-slate-500 font-medium">I Can Provide</span>
                        <span className="text-lg font-bold text-slate-800 group-hover:text-emerald-900">
                           My Listings
                        </span>
                        <p className="mt-2 text-[11px] text-slate-500 leading-snug">
                           {hostPasabuySummary.activeHostTrips > 0
                              ? `You are hosting ${hostPasabuySummary.activeHostTrips} active pasabuy trip${hostPasabuySummary.activeHostTrips > 1 ? 's' : ''}.`
                              : 'No active pasabuy trips right now.'}
                        </p>
                     </div>
                     <div className="mt-3 flex flex-wrap gap-2">
                        <button
                           type="button"
                           onClick={() => navigate('/orders')}
                           className="flex-1 text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                           View in Pasabuys
                        </button>
                        <button
                           type="button"
                           onClick={() => setShowListingsModal(true)}
                           className="flex-1 text-xs font-bold px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                        >
                           <Edit2 size={14} />
                           Edit
                        </button>
                     </div>
                  </Card>

                  {/* My Wants / Traveler indicator */}
                  <Card className="p-5 flex flex-col justify-between gap-4 hover:border-emerald-200 transition-all group h-full">
                     <div className="flex justify-between items-start">
                        <div className="p-2.5 w-fit bg-slate-50 text-slate-600 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                           <ArrowUpRight size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-300 group-hover:text-emerald-300">REQUESTS</span>
                     </div>
                     <div>
                        <span className="block text-xs text-slate-500 font-medium">I Am Seeking</span>
                        <span className="text-lg font-bold text-slate-800 group-hover:text-emerald-900">
                           My Wants
                        </span>
                        <p className="mt-2 text-[11px] text-slate-500 leading-snug">
                           {isTravelerActive
                              ? travelerUntil
                                 ? `Traveler mode is ON until ${travelerUntil}. Neighbors can send you pasabuy requests while you travel.`
                                 : 'Traveler mode is ON. You are currently open to carrying pasabuy requests.'
                              : 'Share what you are looking for so neighbors and travelers can offer swaps.'}
                        </p>
                     </div>
                     <div className="mt-3 flex flex-wrap gap-2">
                        <button
                           type="button"
                           onClick={() => navigate('/home')}
                           className="flex-1 text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                           View Matches
                        </button>
                        <button
                           type="button"
                           onClick={() => setShowWantsModal(true)}
                           className="flex-1 text-xs font-bold px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                        >
                           <Edit2 size={14} />
                           Edit
                        </button>
                     </div>
                  </Card>
               </div>

               {/* Mobile Only: Logout (Shown at bottom of stack on small screens) */}
               <button 
                  onClick={handleLogout}
                  className="md:hidden mt-2 w-full p-3 flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm group"
               >
                  <LogOut size={16} className="group-hover:stroke-2" />
                  Log Out
               </button>
            </div>
         </div>

         {/* --- EXCHANGE MODAL --- */}
         {showExchangeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
               {/* Backdrop */}
               <div 
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                  onClick={() => setShowExchangeModal(false)}
               />

               {/* Modal Content */}
               <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-5">
                     <h3 className="font-bold text-xl text-slate-800">Exchange Credits</h3>
                     <button 
                        onClick={() => setShowExchangeModal(false)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                     >
                        <X size={20} />
                     </button>
                  </div>

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

                     <div className="pt-2">
                        <textarea 
                           placeholder="Add a note (e.g., for the gardening help)"
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-20"
                        />
                     </div>
                  </div>

                  <button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                     <ArrowRightLeft size={18} />
                     {exchangeType === 'send' ? 'Transfer Credits' : 'Send Request'}
                  </button>
               </div>
            </div>
         )}

         {/* --- TIME CREDITS INFO MODAL --- */}
         {showCreditsInfo && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
               <div
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                  onClick={() => setShowCreditsInfo(false)}
               />
               <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 text-left">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-lg text-slate-900">What are Time Credits?</h3>
                     <button
                        onClick={() => setShowCreditsInfo(false)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                     >
                        <X size={18} />
                     </button>
                  </div>
                  <div className="space-y-3 text-sm text-slate-600">
                     <p>
                        Time credits are this community&apos;s way of rewarding swaps without using cash.
                        For every hour you help someone, you earn <span className="font-semibold text-emerald-700">1 hour</span> of time credit.
                     </p>
                     <p>
                        You can then spend those hours to request help from others or to top up a swap deal.
                     </p>
                     <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 mt-2">
                        This makes every favor traceable and fair, and nudges the community to keep giving.
                     </p>
                  </div>
               </div>
            </div>
         )}

         {/* --- EDIT PROFILE MODAL --- */}
         {showEditModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
               {/* Backdrop */}
               <div 
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                  onClick={() => setShowEditModal(false)}
               />

               {/* Modal Content */}
               <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-lg text-slate-800">Edit Profile</h3>
                     <button 
                        onClick={() => setShowEditModal(false)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <div className="space-y-4">
                     {/* Display Name Input */}
                     <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-slate-500 ml-1">
                           Display Name
                        </label>
                        <div className="relative">
                           <User size={18} className="absolute left-3 top-3 text-slate-400" />
                           <input 
                              type="text" 
                              value={editForm.displayName}
                              onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                              placeholder="Your name" 
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                           />
                        </div>
                     </div>

                     {/* Email Input */}
                     <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-slate-500 ml-1">
                           Email
                        </label>
                        <div className="relative">
                           <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
                           <input 
                              type="email" 
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              placeholder="your.email@example.com" 
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                           />
                        </div>
                     </div>

                     {/* Location Input */}
                     <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-slate-500 ml-1">
                           Location
                        </label>
                        <div className="relative">
                           <MapPin size={18} className="absolute left-3 top-3 text-slate-400" />
                           <input 
                              type="text" 
                              value={editForm.location}
                              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                              placeholder="City, Area" 
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                           />
                        </div>
                     </div>
                  </div>

                  <p className="mt-4 text-[10px] text-slate-500 text-center">
                     Changes are saved locally and will update across all tabs
                  </p>

                  {/* Action Button */}
                  <button 
                     onClick={handleEditSave}
                     className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                  >
                     <Save size={18} />
                     Save Changes
                  </button>
               </div>
            </div>
         )}

         {/* --- EDIT LISTINGS MODAL --- */}
         {showListingsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
               <div
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  onClick={() => setShowListingsModal(false)}
               />
               <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-lg text-slate-800">Edit My Listings</h3>
                     <button
                        onClick={() => setShowListingsModal(false)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-3">
                     Describe the kinds of pasabuy trips or on-hand items you usually host. This helps buyers understand what to expect from you.
                  </p>

                  <div className="space-y-1.5 text-left">
                     <label className="text-xs font-semibold text-slate-500 ml-1">
                        My typical listings
                     </label>
                     <textarea
                        rows={4}
                        value={listingsNote}
                        onChange={(e) => setListingsNote(e.target.value)}
                        placeholder="e.g., Japan snacks pasabuys, K-pop merch, surplus home goods..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                     />
                  </div>

                  <button
                     type="button"
                     onClick={() => setShowListingsModal(false)}
                     className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                  >
                     <Save size={18} />
                     Save
                  </button>
               </div>
            </div>
         )}

         {/* --- EDIT WANTS MODAL --- */}
         {showWantsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
               <div
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  onClick={() => setShowWantsModal(false)}
               />
               <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-lg text-slate-800">Edit My Wants</h3>
                     <button
                        onClick={() => setShowWantsModal(false)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-3">
                     Share the items or services you are currently looking for so neighbors and travelers know what offers to send.
                  </p>

                  <div className="space-y-1.5 text-left">
                     <label className="text-xs font-semibold text-slate-500 ml-1">
                        Things I&apos;m looking for
                     </label>
                     <textarea
                        rows={4}
                        value={wantsNote}
                        onChange={(e) => setWantsNote(e.target.value)}
                        placeholder="e.g., Japan skincare, home repair help, pet sitting, etc."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                     />
                  </div>

                  <button
                     type="button"
                     onClick={() => setShowWantsModal(false)}
                     className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                  >
                     <Save size={18} />
                     Save
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default ProfilePage;