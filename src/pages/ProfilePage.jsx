import React from 'react';
import { 
  Clock, 
  ChevronRight, 
  Repeat, 
  ListTodo, 
  Star,
  ArrowUpRight 
} from 'lucide-react';
import { Card, Badge, Avatar } from '@/components/CustomComponents';

const ProfilePage = ({ user }) => {
  // Fallback data if props aren't fully populated
  const profile = {
    displayName: "Elena R.",
    reputationScore: 98,
    credits: 14.5, // Hours available
    skills: ["Web Design", "Gardening", "Pet Sitting"],
    activeSwaps: 2
  };

  return (
    <div className="text-center animate-in fade-in px-4 py-6 max-w-md mx-auto">
      {/* --- Profile Header --- */}
      <div className="mt-4 mb-6">
         <Avatar name={profile.displayName} verified={true} size="lg" />
         <h2 className="text-xl font-bold text-slate-900 mt-3">{profile.displayName}</h2>
         
         <div className="flex flex-row justify-center items-center gap-2 mt-2">
            <Badge type="neutral" className="flex items-center gap-1">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              <span>{profile.reputationScore}% Positive</span>
            </Badge>
            <Badge type="success">Verified Swapper</Badge>
         </div>

         {/* Skill Tags - New Feature for Barter Context */}
         <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {profile.skills.map((skill, index) => (
              <span key={index} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                {skill}
              </span>
            ))}
         </div>
      </div>
      
      {/* --- Main Action Grid --- */}
      <div className="grid grid-cols-1 gap-3 text-left">
         
         {/* The "Wallet" is now a Time Bank */}
         <Card className="p-4 flex items-center justify-between border-emerald-200 bg-emerald-50/50 relative overflow-hidden">
           {/* Decorative background circle */}
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
           <button className="z-10 text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm transition-colors">
              Exchange
           </button>
         </Card>

         {/* Active Swaps Indicator */}
         {profile.activeSwaps > 0 && (
            <Card className="p-3 bg-slate-900 text-white flex items-center justify-between shadow-lg shadow-slate-200">
               <div className="flex items-center gap-2">
                 <div className="p-1.5 bg-slate-700 rounded-full animate-pulse">
                    <Repeat size={14} className="text-emerald-400" />
                 </div>
                 <span className="text-sm font-semibold text-slate-700">
                    {profile.activeSwaps} Trade{profile.activeSwaps > 1 ? 's' : ''} in Progress
                 </span>
               </div>
               <ChevronRight size={16} className="text-emerald-700" />
            </Card>
         )}

         {/* Menu Items */}
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

         <Card className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
           <span className="text-sm font-medium text-slate-700">Past Swap History</span>
           <ChevronRight size={16} className="text-slate-400" />
         </Card>
      </div>
    </div>
  );
};

export default ProfilePage;