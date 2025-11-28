import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'; // Import Router hooks
import { Search, Package, Users, User, Plus, Globe, AlertTriangle, CheckCircle } from 'lucide-react';

// Data and Custom Components
import { Avatar, BitbitLogo, Header } from './components/CustomComponents';
import { CURRENT_USER } from './data';

// Import Modals
import GroupOrderModal from './components/GroupOrderModal';
import PostTripModal from './components/PostTripModal';

// Import Pages
import BrowsePage from './pages/BrowsePage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';

export default function BitbitApp() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 'activeTab' is removed; we use location.pathname to determine the active view
  const [mode, setMode] = useState('buyer'); // 'buyer' | 'traveler'
  const [selectedGO, setSelectedGO] = useState(null);
  const [isPostTripOpen, setIsPostTripOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Helper to check active route for styling the nav buttons
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300 w-[90%] max-w-sm">
          <div className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-sm font-semibold
            ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}
          `}>
            {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
            {toast.message}
          </div>
        </div>
      )}

      {/* Header */}
      <Header userName={CURRENT_USER.displayName} verified={true}/>

      <main className="max-w-md mx-auto px-4 py-6">
        <Routes>
          <Route 
            path="/" 
            element={
              <BrowsePage 
                mode={mode} 
                setMode={setMode} 
                setSelectedGO={setSelectedGO} 
                setIsPostTripOpen={setIsPostTripOpen} 
              />
            } 
          />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage user={CURRENT_USER} />} />
        </Routes>
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 safe-area-bottom pb-1">
        <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
          <button 
            onClick={() => navigate('/')}
            className={`flex flex-col items-center gap-1 w-16 p-1 rounded-lg transition-colors ${isActive('/') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Search size={22} strokeWidth={isActive('/') ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Explore</span>
          </button>
          
          <button 
            onClick={() => navigate('/orders')}
            className={`flex flex-col items-center gap-1 w-16 p-1 rounded-lg transition-colors ${isActive('/orders') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Package size={22} strokeWidth={isActive('/orders') ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Orders</span>
          </button>

          {/* Floating Action Button */}
          <div className="relative -top-6">
             <button 
               onClick={() => mode === 'traveler' ? setIsPostTripOpen(true) : navigate('/')}
               className="w-14 h-14 rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/40 flex items-center justify-center border-4 border-slate-50 active:scale-95 transition-transform"
             >
               {mode === 'traveler' ? <Plus size={26} /> : <Globe size={26} />}
             </button>
          </div>

          <button 
            onClick={() => showToast("Messages feature coming soon!", "neutral")}
            className="flex flex-col items-center gap-1 w-16 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Users size={22} strokeWidth={2} />
            <span className="text-[10px] font-bold">Comm</span>
          </button>

          <button 
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center gap-1 w-16 p-1 rounded-lg transition-colors ${isActive('/profile') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <User size={22} strokeWidth={isActive('/profile') ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      </nav>

      {/* Modals remain global overlays */}
      <GroupOrderModal 
        selectedGO={selectedGO} 
        onClose={() => setSelectedGO(null)} 
        showToast={showToast}
      />
      <PostTripModal 
        isOpen={isPostTripOpen} 
        onClose={() => setIsPostTripOpen(false)}
        showToast={showToast}
      />
      
      <style>{`
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}