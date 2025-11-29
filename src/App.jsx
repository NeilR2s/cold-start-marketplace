import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, ShoppingCart, Message, AccountCircle, TravelExplore } from '@mui/icons-material';
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
import { getLocalProfile } from "./utils/profileStorage";

// Import Modals
import GroupOrderModal from "./components/GroupOrderModal";
import PostTripModal from "./components/PostTripModal";

// Import Pages
import BrowsePage from "./pages/BrowsePage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import WelcomePage from './pages/WelcomePage';
import ExplorePage from './pages/ExplorePage';

export default function BitbitApp() {
  const navigate = useNavigate();
  const location = useLocation();

  // 'activeTab' is removed; we use location.pathname to determine the active view
  const [mode, setMode] = useState("swapper"); // 'swapper' | 'host'
  const [selectedGO, setSelectedGO] = useState(null);
  const [isPostTripOpen, setIsPostTripOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [travelerAvailability, setTravelerAvailability] = useState({
    active: false,
    until: null,
  });
  
  // User state from localStorage (with CURRENT_USER as fallback)
  const [user, setUser] = useState(() => getLocalProfile());

  // Listen for localStorage changes (for cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'bitbit_local_profile') {
        setUser(getLocalProfile());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom events for same-tab updates
    const handleProfileUpdate = () => {
      setUser(getLocalProfile());
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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

      {/* Main app content - mobile-first, expands on larger web screens */}
      <main className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <Routes>
          <Route path="/home" element={<BrowsePage mode={mode} setMode={setMode} setSelectedGO={setSelectedGO} setIsPostTripOpen={setIsPostTripOpen} />} />
          <Route path="/explore" element={<ExplorePage travelerAvailability={travelerAvailability} />} />
          <Route path="/orders" element={<OrdersPage user={user} />} />
          <Route
            path="/profile"
            element={
              <ProfilePage
                user={user}
                setUser={setUser}
                travelerAvailability={travelerAvailability}
                setTravelerAvailability={setTravelerAvailability}
              />
            }
          />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/" element={<WelcomePage />} />
        </Routes>
      </main>

      {/* Updated Navigation Bar - full width on mobile, centered container on larger web screens */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 safe-area-bottom">
        <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
          <BottomNavigation
            showLabels
            className="bg-white"
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
            <BottomNavigationAction label="Home" value="/home" icon={<Home sx={{ color: location.pathname === '/home' ? '#14A384' : 'inherit' }} />} />
            <BottomNavigationAction label="Explore" value="/explore" icon={<TravelExplore sx={{ color: location.pathname === '/explore' ? '#14A384' : 'inherit' }} />} />
            <BottomNavigationAction label="Pasabuys" value="/orders" icon={<ShoppingCart sx={{ color: location.pathname === '/orders' ? '#14A384' : 'inherit' }} />} />
            <BottomNavigationAction label="Messages" value="/messages" icon={<Message sx={{ color: location.pathname === '/messages' ? '#14A384' : 'inherit' }} />} />
            <BottomNavigationAction label="Profile" value="/profile" icon={<AccountCircle sx={{ color: location.pathname === '/profile' ? '#14A384' : 'inherit' }} />} />
          </BottomNavigation>
        </div>
      </div>

      {/* Modals remain global overlays */}
      <GroupOrderModal selectedGO={selectedGO} onClose={() => setSelectedGO(null)} showToast={showToast} />
      <PostTripModal isOpen={isPostTripOpen} onClose={() => setIsPostTripOpen(false)} showToast={showToast} />
      <style>{`
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
}
