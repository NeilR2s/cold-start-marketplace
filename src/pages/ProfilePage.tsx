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
import { Card, Badge, Avatar, Button, Input } from '@/components/ui';
import { CURRENT_USER, UserProfile } from '@/data';
import { saveLocalProfile } from '@/utils/profileStorage';

export interface TravelerAvailability {
   active: boolean;
   until: string | null;
}

export interface ProfilePageProps {
   user?: UserProfile | null;
   setUser?: React.Dispatch<React.SetStateAction<UserProfile>>;
   travelerAvailability?: TravelerAvailability;
   setTravelerAvailability?: React.Dispatch<React.SetStateAction<TravelerAvailability>>;
}

interface MockTransaction {
   id: string;
   status: 'ongoing' | 'past';
   host: { id: string };
}

const getMockTransactions = (currentUserId: string): MockTransaction[] => [
   { id: "tx_1", status: "ongoing", host: { id: currentUserId } },
   { id: "tx_2", status: "ongoing", host: { id: "u202" } },
   { id: "tx_3", status: "past", host: { id: "u203" } },
   { id: "tx_4", status: "past", host: { id: currentUserId } }
];

export const ProfilePage: React.FC<ProfilePageProps> = ({
   user,
   setUser,
   travelerAvailability,
   setTravelerAvailability
}) => {
   const navigate = useNavigate();
   const [showExchangeModal, setShowExchangeModal] = useState(false);
   const [exchangeType, setExchangeType] = useState<'send' | 'request'>('send');
   const [showCreditsInfo, setShowCreditsInfo] = useState(false);
   const [showEditModal, setShowEditModal] = useState(false);
   const [showListingsModal, setShowListingsModal] = useState(false);
   const [showWantsModal, setShowWantsModal] = useState(false);
   const [listingsNote, setListingsNote] = useState('Summarize what you usually host or offer for swaps.');
   const [wantsNote, setWantsNote] = useState('List the kinds of things you are currently looking for.');
   
   const currentUserId = user?.uid || CURRENT_USER.uid;
   const profile = {
      displayName: user?.displayName || CURRENT_USER.displayName,
      email: user?.email || "clara@example.com",
      location: user?.location || "Ortigas, RET44",
      joinedDate: user?.joinedDate || "Sept 2023",
      reputationScore: Math.round((user?.reputationScore || CURRENT_USER.reputationScore || 4.8) * 20),
      credits: user?.credits ?? 14.5,
      skills: user?.skills || ["Web Design", "Gardening", "Pet Sitting"],
      activeSwaps: user?.activeSwaps ?? 2,
      verificationProgress: user?.verificationProgress ?? 75,
      verificationSteps: user?.verificationSteps || "3/4"
   };

   const [editForm, setEditForm] = useState({
      displayName: profile.displayName,
      email: profile.email,
      location: profile.location,
   });

   const isTravelerActive = Boolean(travelerAvailability?.active);
   const travelerUntil = travelerAvailability?.until;

   const hostPasabuySummary = useMemo(() => {
      const transactions = getMockTransactions(currentUserId);
      const activeHostTrips = transactions.filter(
         (t) => t.host.id === currentUserId && t.status === 'ongoing'
      ).length;

      const pastHostTrips = transactions.filter(
         (t) => t.host.id === currentUserId && t.status === 'past'
      ).length;

      return { activeHostTrips, pastHostTrips };
   }, [currentUserId]);

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

   const handleTravelerUntilChange = (value: string) => {
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
         
         if (setUser) {
            setUser(updated);
         }
         
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
      <div className="animate-in fade-in py-6 pb-24 md:py-8 relative min-h-screen max-w-5xl mx-auto">
         <div className="md:grid md:grid-cols-12 md:gap-6 items-start">
            
            {/* --- LEFT COLUMN: Profile Identity (Sidebar on Desktop) --- */}
            <div className="md:col-span-5 lg:col-span-4 mb-6 md:mb-0">
               <div className="md:sticky md:top-20">
                  <Card className="p-2 border-none shadow-none bg-transparent md:bg-white md:border md:border-slate-200 md:shadow-xs md:p-5 text-center md:text-left rounded-2xl">
                     
                     {/* Avatar, Name & Edit */}
                     <div className="flex flex-col items-center gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-col items-center md:items-start">
                           <Avatar
                              name={profile.displayName}
                              verified={true}
                              size="xl"
                           />
                           <h2 className="text-xl font-bold text-slate-900 mt-3">
                              {profile.displayName}
                           </h2>
                           <div className="mt-1.5 flex items-center justify-center md:justify-start gap-2">
                              <Badge variant="neutral">
                                 <div className="flex items-center gap-1 leading-none text-xs">
                                    <Star size={12} className="text-amber-500 fill-amber-500" />
                                    <span>{profile.reputationScore}% Positive</span>
                                 </div>
                              </Badge>
                           </div>
                        </div>

                        {/* Edit profile trigger (Desktop) */}
                        <button
                           type="button"
                           onClick={handleOpenEdit}
                           className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                           <Edit2 size={12} />
                           Edit
                        </button>
                     </div>

                     {/* Mobile edit button */}
                     <button
                        type="button"
                        onClick={handleOpenEdit}
                        className="mt-3 inline-flex md:hidden items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer"
                     >
                        <Edit2 size={12} />
                        Edit Profile
                     </button>

                     {/* Verification Progress */}
                     <div className="mt-5 w-full max-w-[240px] md:max-w-full mx-auto md:mx-0 flex flex-col gap-1.5">
                        <div className="flex justify-between items-end px-1">
                           <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                              <ShieldCheck size={12} className="text-emerald-600" />
                              Identity Verified
                           </div>
                           <span className="text-[10px] font-bold text-emerald-700">{profile.verificationSteps}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out" 
                              style={{ width: `${profile.verificationProgress}%` }}
                           />
                        </div>
                     </div>

                     {/* Skills */}
                     <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mt-4">
                        {profile.skills.map((skill, index) => (
                           <span key={index} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {skill}
                           </span>
                        ))}
                     </div>

                     {/* Contact Details */}
                     <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                        <div className="flex items-center justify-center md:justify-start gap-2.5">
                           <Mail size={15} className="text-slate-400 shrink-0" />
                           <span className="text-xs text-slate-600 font-medium truncate">{profile.email}</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2.5">
                           <MapPin size={15} className="text-slate-400 shrink-0" />
                           <span className="text-xs text-slate-600 font-medium">{profile.location}</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2.5">
                           <Calendar size={15} className="text-slate-400 shrink-0" />
                           <span className="text-xs text-slate-600 font-medium">Joined {profile.joinedDate}</span>
                        </div>
                     </div>

                     {/* Logout (Desktop) */}
                     <div className="hidden md:block mt-5 pt-3.5 border-t border-slate-100">
                        <button 
                           type="button"
                           onClick={handleLogout}
                           className="w-full py-1.5 flex items-center gap-2 text-rose-500 hover:text-rose-700 transition-colors font-semibold text-xs cursor-pointer"
                        >
                           <LogOut size={15} />
                           Log Out
                        </button>
                     </div>
                  </Card>
               </div>
            </div>

            {/* --- RIGHT COLUMN: Actions Dashboard --- */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-3.5">
               
               {/* Top Row: Time Bank & Traveler Mode */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Time Bank Wallet */}
                  <Card className="p-4.5 flex flex-col justify-between border-emerald-200 bg-emerald-50/50 rounded-2xl relative overflow-hidden">
                     <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-100/50 rounded-full blur-xl pointer-events-none" />
                     <div className="flex items-start justify-between z-10">
                        <div className="flex items-center gap-2.5">
                           <div className="p-2 bg-emerald-100 rounded-full text-emerald-600 shadow-xs">
                              <Clock size={18} />
                           </div>
                           <div>
                              <button
                                 type="button"
                                 onClick={() => setShowCreditsInfo(true)}
                                 className="text-left text-[11px] text-emerald-700 font-bold uppercase tracking-wide underline underline-offset-2 decoration-emerald-300 hover:text-emerald-800 cursor-pointer"
                              >
                                 Time Credits
                              </button>
                              <div className="text-xl font-bold text-emerald-900 flex items-baseline gap-1">
                                 {profile.credits} <span className="text-xs font-semibold text-emerald-700">hrs</span>
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="mt-3 pt-2.5 border-t border-emerald-200/50 flex items-center justify-between z-10 gap-2">
                        <p className="text-[10px] text-emerald-800/80 leading-snug">
                           Earn hours by helping, spend to request help.
                        </p>
                        <button 
                           type="button"
                           onClick={() => setShowExchangeModal(true)}
                           className="text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                        >
                           Exchange
                        </button>
                     </div>
                  </Card>

                  {/* Traveler Availability */}
                  <Card className="p-4.5 flex flex-col justify-between border-slate-200 bg-white rounded-2xl">
                     <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                           <div className="p-2 bg-slate-100 rounded-full text-emerald-600">
                              <ArrowRightLeft size={16} />
                           </div>
                           <div>
                              <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">Traveler Mode</div>
                              <div className="text-sm font-bold text-slate-900 leading-tight mt-0.5">
                                 {isTravelerActive ? "Accepting requests" : "Not traveling"}
                              </div>
                           </div>
                        </div>
                        <button
                           type="button"
                           onClick={handleToggleTraveler}
                           aria-label="Toggle traveler mode"
                           className={`relative inline-flex h-5 w-10 shrink-0 items-center rounded-full border transition-colors cursor-pointer ${
                              isTravelerActive ? "bg-emerald-500 border-emerald-500" : "bg-slate-200 border-slate-200"
                           }`}
                        >
                           <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${isTravelerActive ? "translate-x-5" : "translate-x-1"}`} />
                        </button>
                     </div>

                     <div className="mt-3 pt-2.5 border-t border-slate-100">
                        {isTravelerActive ? (
                           <div className="space-y-1.5">
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
                                 className="w-full text-left inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                              >
                                 <ArrowUpRight size={11} /> View traveler feed
                              </button>
                           </div>
                        ) : (
                           <p className="text-[10px] text-slate-400 leading-relaxed">
                              Toggle on when traveling to carry items for neighbors.
                           </p>
                        )}
                     </div>
                  </Card>
               </div>

               {/* Active Swaps Alert */}
               {profile.activeSwaps > 0 && (
                  <Card 
                     className="p-3.5 px-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-md shadow-slate-900/10 hover:shadow-lg transition-shadow cursor-pointer"
                     onClick={() => navigate('/orders')}
                  >
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-full animate-pulse text-emerald-400">
                           <Repeat size={15} />
                        </div>
                        <div>
                           <span className="block text-xs font-bold text-emerald-400">Action Required</span>
                           <span className="text-xs text-slate-300">
                              You have {profile.activeSwaps} trade{profile.activeSwaps > 1 ? 's' : ''} currently in progress
                           </span>
                        </div>
                     </div>
                     <div className="bg-slate-800 p-1.5 rounded-lg">
                        <ChevronRight size={16} className="text-white" />
                     </div>
                  </Card>
               )}

               {/* Offers / Requests Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* My Listings */}
                  <Card className="p-4.5 flex flex-col justify-between gap-3 hover:border-emerald-200 transition-all rounded-2xl group">
                     <div className="flex justify-between items-start">
                        <div className="p-2 w-fit bg-slate-50 text-slate-600 rounded-xl group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                           <ListTodo size={18} />
                        </div>
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 group-hover:text-emerald-500">OFFERS</span>
                     </div>
                     <div>
                        <span className="block text-[11px] text-slate-400 font-medium">I Can Provide</span>
                        <span className="text-base font-bold text-slate-900 group-hover:text-emerald-950">
                           My Listings
                        </span>
                        <p className="mt-1.5 text-xs text-slate-500 leading-snug">
                           {hostPasabuySummary.activeHostTrips > 0
                              ? `Hosting ${hostPasabuySummary.activeHostTrips} active pasabuy trip.`
                              : 'No active pasabuy trips currently hosted.'}
                        </p>
                     </div>
                     <div className="pt-2">
                        <Button
                           variant="default"
                           size="sm"
                           pill
                           onClick={() => setShowListingsModal(true)}
                           className="w-full text-xs font-semibold shadow-xs"
                        >
                           <Edit2 size={12} className="mr-1.5" />
                           Manage Offers & Listings
                        </Button>
                     </div>
                  </Card>

                  {/* My Wants */}
                  <Card className="p-4.5 flex flex-col justify-between gap-3 hover:border-emerald-200 transition-all rounded-2xl group">
                     <div className="flex justify-between items-start">
                        <div className="p-2 w-fit bg-slate-50 text-slate-600 rounded-xl group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                           <ArrowUpRight size={18} />
                        </div>
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 group-hover:text-emerald-500">REQUESTS</span>
                     </div>
                     <div>
                        <span className="block text-[11px] text-slate-400 font-medium">I Am Seeking</span>
                        <span className="text-base font-bold text-slate-900 group-hover:text-emerald-950">
                           My Wants
                        </span>
                        <p className="mt-1.5 text-xs text-slate-500 leading-snug">
                           {isTravelerActive
                              ? travelerUntil
                                 ? `Traveler mode ON until ${travelerUntil}.`
                                 : 'Traveler mode ON. Open to requests.'
                              : 'Looking for tech, vintage fashion, or specialty coffee.'}
                        </p>
                     </div>
                     <div className="pt-2">
                        <Button
                           variant="default"
                           size="sm"
                           pill
                           onClick={() => setShowWantsModal(true)}
                           className="w-full text-xs font-semibold shadow-xs"
                        >
                           <Edit2 size={12} className="mr-1.5" />
                           Manage Barter Wishlist
                        </Button>
                     </div>
                  </Card>
               </div>

               {/* Mobile Only: Logout */}
               <button 
                  type="button"
                  onClick={handleLogout}
                  className="md:hidden mt-2 w-full p-3 flex items-center justify-center gap-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-semibold text-sm cursor-pointer"
               >
                  <LogOut size={16} />
                  Log Out
               </button>
            </div>
         </div>

         {/* --- EXCHANGE MODAL --- */}
         {showExchangeModal && (
            <div 
               className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
               role="dialog"
               aria-modal="true"
               aria-labelledby="exchange-credits-title"
            >
               <div 
                  className="fixed inset-0"
                  onClick={() => setShowExchangeModal(false)}
                  aria-hidden="true"
               />

               <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-center mb-5">
                     <h3 id="exchange-credits-title" className="font-bold text-xl text-slate-800">Exchange Credits</h3>
                     <button 
                        type="button"
                        onClick={() => setShowExchangeModal(false)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        aria-label="Close modal"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                     <button 
                        type="button"
                        onClick={() => setExchangeType('send')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                           exchangeType === 'send' 
                              ? 'bg-white text-emerald-700 shadow-sm' 
                              : 'text-slate-500 hover:text-slate-700'
                        }`}
                     >
                        Send
                     </button>
                     <button 
                        type="button"
                        onClick={() => setExchangeType('request')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
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
                           <User size={18} className="absolute left-3.5 top-3 text-slate-400" />
                           <Input 
                              type="text" 
                              placeholder="Name or Email" 
                              className="pl-10"
                           />
                        </div>
                     </div>

                     <div className="space-y-1.5 text-left">
                        <div className="flex justify-between items-center px-1">
                           <label className="text-xs font-semibold text-slate-500">Amount (Hours)</label>
                           {exchangeType === 'send' && (
                              <span className="text-[10px] text-emerald-600 font-semibold cursor-pointer hover:underline">
                                 Max: {profile.credits}
                              </span>
                           )}
                        </div>
                        <div className="relative">
                           <Clock size={18} className="absolute left-3.5 top-3 text-emerald-500" />
                           <Input 
                              type="number" 
                              placeholder="0.00" 
                              className="pl-10 font-medium"
                           />
                        </div>
                     </div>

                     <div className="pt-2">
                        <textarea 
                           placeholder="Add a note (e.g., for the gardening help)"
                           className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-20 placeholder:text-slate-400"
                        />
                     </div>
                  </div>

                  <Button 
                     variant="emerald"
                     className="w-full mt-6 h-12 font-bold"
                  >
                     <ArrowRightLeft size={18} />
                     {exchangeType === 'send' ? 'Transfer Credits' : 'Send Request'}
                  </Button>
               </div>
            </div>
         )}

         {/* --- TIME CREDITS INFO MODAL --- */}
         {showCreditsInfo && (
            <div 
               className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
               role="dialog"
               aria-modal="true"
               aria-labelledby="credits-info-title"
            >
               <div
                  className="fixed inset-0"
                  onClick={() => setShowCreditsInfo(false)}
                  aria-hidden="true"
               />
               <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150 text-left">
                  <div className="flex justify-between items-center mb-4">
                     <h3 id="credits-info-title" className="font-bold text-lg text-slate-900">What are Time Credits?</h3>
                     <button
                        type="button"
                        onClick={() => setShowCreditsInfo(false)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        aria-label="Close modal"
                     >
                        <X size={18} />
                     </button>
                  </div>
                  <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                     <p>
                        Time credits are this community&apos;s way of rewarding swaps without using cash.
                        For every hour you help someone, you earn <span className="font-semibold text-emerald-700">1 hour</span> of time credit.
                     </p>
                     <p>
                        You can then spend those hours to request help from others or to top up a swap deal.
                     </p>
                     <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
                        This makes every favor traceable and fair, and nudges the community to keep giving.
                     </p>
                  </div>
               </div>
            </div>
         )}

         {/* --- EDIT PROFILE MODAL --- */}
         {showEditModal && (
            <div 
               className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
               role="dialog"
               aria-modal="true"
               aria-labelledby="edit-profile-title"
            >
               <div 
                  className="fixed inset-0"
                  onClick={() => setShowEditModal(false)}
                  aria-hidden="true"
               />

               <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-center mb-4">
                     <h3 id="edit-profile-title" className="font-bold text-lg text-slate-800">Edit Profile</h3>
                     <button 
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        aria-label="Close modal"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <div className="space-y-4">
                     <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-slate-500 ml-1">
                           Display Name
                        </label>
                        <div className="relative">
                           <User size={18} className="absolute left-3.5 top-3 text-slate-400" />
                           <Input 
                              type="text" 
                              value={editForm.displayName}
                              onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                              placeholder="Your name" 
                              className="pl-10"
                           />
                        </div>
                     </div>

                     <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-slate-500 ml-1">
                           Email
                        </label>
                        <div className="relative">
                           <Mail size={18} className="absolute left-3.5 top-3 text-slate-400" />
                           <Input 
                              type="email" 
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              placeholder="your.email@example.com" 
                              className="pl-10"
                           />
                        </div>
                     </div>

                     <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-slate-500 ml-1">
                           Location
                        </label>
                        <div className="relative">
                           <MapPin size={18} className="absolute left-3.5 top-3 text-slate-400" />
                           <Input 
                              type="text" 
                              value={editForm.location}
                              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                              placeholder="City, Area" 
                              className="pl-10"
                           />
                        </div>
                     </div>
                  </div>

                  <p className="mt-4 text-[10px] text-slate-500 text-center">
                     Changes are saved locally and will update across all views
                  </p>

                  <Button 
                     variant="emerald"
                     onClick={handleEditSave}
                     className="w-full mt-4 h-11 font-bold"
                  >
                     <Save size={18} />
                     Save Changes
                  </Button>
               </div>
            </div>
         )}

         {/* --- EDIT LISTINGS MODAL --- */}
         {showListingsModal && (
            <div 
               className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
               role="dialog"
               aria-modal="true"
               aria-labelledby="edit-listings-title"
            >
               <div
                  className="fixed inset-0"
                  onClick={() => setShowListingsModal(false)}
                  aria-hidden="true"
               />
               <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-center mb-4">
                     <h3 id="edit-listings-title" className="font-bold text-lg text-slate-800">Edit My Listings</h3>
                     <button
                        type="button"
                        onClick={() => setShowListingsModal(false)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        aria-label="Close modal"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
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
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                     />
                  </div>

                  <Button
                     variant="emerald"
                     onClick={() => setShowListingsModal(false)}
                     className="mt-5 w-full h-11 font-bold"
                  >
                     <Save size={18} />
                     Save
                  </Button>
               </div>
            </div>
         )}

         {/* --- EDIT WANTS MODAL --- */}
         {showWantsModal && (
            <div 
               className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
               role="dialog"
               aria-modal="true"
               aria-labelledby="edit-wants-title"
            >
               <div
                  className="fixed inset-0"
                  onClick={() => setShowWantsModal(false)}
                  aria-hidden="true"
               />
               <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-center mb-4">
                     <h3 id="edit-wants-title" className="font-bold text-lg text-slate-800">Edit My Wants</h3>
                     <button
                        type="button"
                        onClick={() => setShowWantsModal(false)}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        aria-label="Close modal"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
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
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                     />
                  </div>

                  <Button
                     variant="emerald"
                     onClick={() => setShowWantsModal(false)}
                     className="mt-5 w-full h-11 font-bold"
                  >
                     <Save size={18} />
                     Save
                  </Button>
               </div>
            </div>
         )}
      </div>
   );
};

export default ProfilePage;
