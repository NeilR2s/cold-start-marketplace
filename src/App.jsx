import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, ShoppingCart, Message, AccountCircle } from '@mui/icons-material';
import {
  Search,
  Package,
  Users,
  User,
  Plus,
  Globe,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// Data and Custom Components
import { Avatar, BitbitLogo, Header } from "./components/CustomComponents";
import { CURRENT_USER } from "./data";

// Import Modals
import GroupOrderModal from "./components/GroupOrderModal";
import PostTripModal from "./components/PostTripModal";

// Import Pages
import BrowsePage from "./pages/BrowsePage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";

export default function BitbitApp() {
  const navigate = useNavigate();
  const location = useLocation();

  // 'activeTab' is removed; we use location.pathname to determine the active view
  const [mode, setMode] = useState("buyer"); // 'buyer' | 'traveler'
  const [selectedGO, setSelectedGO] = useState(null);
  const [isPostTripOpen, setIsPostTripOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Helper to check active route for styling the nav buttons
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-[Figtree]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300 w-[90%] max-w-sm">
          <div className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-sm font-semibold ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
            {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
            {toast.message}
          </div>
        </div>
      )}

      <main className="max-w-md mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<BrowsePage mode={mode} setMode={setMode} setSelectedGO={setSelectedGO} setIsPostTripOpen={setIsPostTripOpen} />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route
            path="/profile"
            element={<ProfilePage user={CURRENT_USER} />}
          />
          <Route path="/messages" element={<MessagesPage />} />
        </Routes>
      </main>

      {/* Updated Navigation Bar */}
      <BottomNavigation
        showLabels
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 safe-area-bottom"
        value={location.pathname}
        onChange={(event, newValue) => navigate(newValue)}
        sx={{
          fontFamily: 'Figtree, Google Sans, sans-serif',
          '& .Mui-selected': {
            color: '#14A384',
            fontWeight: 700,
          },
          '& .MuiBottomNavigationAction-label': {
            fontFamily: 'Figtree, Google Sans, sans-serif',
          },
        }}
      >
        <BottomNavigationAction label="Home" value="/" icon={<Home sx={{ color: location.pathname === '/' ? '#14A384' : 'inherit' }} />} />
        <BottomNavigationAction label="Pasabuys" value="/orders" icon={<ShoppingCart sx={{ color: location.pathname === '/orders' ? '#14A384' : 'inherit' }} />} />
        <BottomNavigationAction label="Messages" value="/messages" icon={<Message sx={{ color: location.pathname === '/messages' ? '#14A384' : 'inherit' }} />} />
        <BottomNavigationAction label="Profile" value="/profile" icon={<AccountCircle sx={{ color: location.pathname === '/profile' ? '#14A384' : 'inherit' }} />} />
      </BottomNavigation>

      {/* Modals remain global overlays */}
      <GroupOrderModal selectedGO={selectedGO} onClose={() => setSelectedGO(null)} showToast={showToast} />
      <PostTripModal isOpen={isPostTripOpen} onClose={() => setIsPostTripOpen(false)} showToast={showToast} />
      <style>{`
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
}
