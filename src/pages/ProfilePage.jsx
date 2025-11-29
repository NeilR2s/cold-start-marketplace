import React from 'react';
import { Wallet, ChevronRight } from 'lucide-react';
import { Card, Badge, Avatar } from '@/components/CustomComponents';

const ProfilePage = ({ user }) => (
  <div className="text-center animate-in fade-in px-4 py-6">
    <div className="mt-4 mb-6">
       <Avatar name={user.displayName} verified={true} size="lg" />
       <h2 className="text-xl font-bold text-slate-900 mt-3">{user.displayName}</h2>
       <div className="flex justify-center gap-2 mt-2">
          <Badge type="neutral">Trust Score: {user.reputationScore}</Badge>
          <Badge type="success">Verified ID</Badge>
       </div>
    </div>
    
    <div className="grid grid-cols-1 gap-3 text-left">
       <Card className="p-4 flex items-center justify-between border-emerald-200 bg-emerald-50/50">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                <Wallet size={18} />
            </div>
            <div>
                <div className="text-xs text-emerald-700 font-bold uppercase">Escrow Balance</div>
                <div className="text-lg font-bold text-emerald-900">₱2,450.00</div>
            </div>
         </div>
         <button className="text-xs font-bold bg-white text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200">Top Up</button>
       </Card>
       <Card className="p-4 flex items-center justify-between">
         <span className="text-sm font-medium text-slate-700">Saved Routes</span>
         <ChevronRight size={16} className="text-slate-400" />
       </Card>
       <Card className="p-4 flex items-center justify-between">
         <span className="text-sm font-medium text-slate-700">Transaction History</span>
         <ChevronRight size={16} className="text-slate-400" />
       </Card>
    </div>
  </div>
);

export default ProfilePage;