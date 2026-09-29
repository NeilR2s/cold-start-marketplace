import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  House,
  Compass,
  ShoppingCart,
  MessagesSquare,
  CircleUserRound,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import { getLocalProfile } from "@/utils/profileStorage";
import { AppBottomNav, NavItem } from "@/components/ui/bottom-nav";
import { GroupOrder, UserProfile } from "@/data";

// Import Modals
import { GroupOrderModal } from "@/components/GroupOrderModal";
import { PostTripModal } from "@/components/PostTripModal";

// Import Pages
import { BrowsePage } from "@/pages/BrowsePage";
import { OrdersPage } from "@/pages/OrdersPage";
import { ProfilePage, TravelerAvailability } from "@/pages/ProfilePage";
import { MessagesPage } from "@/pages/MessagesPage";
import { WelcomePage } from "@/pages/WelcomePage";
import ExplorePage from "@/pages/ExplorePage";

export default function BitbitApp() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { label: 'Home', value: '/home', icon: House },
    { label: 'Explore', value: '/explore', icon: Compass },
    { label: 'Pasabuys', value: '/orders', icon: ShoppingCart },
    { label: 'Messages', value: '/messages', icon: MessagesSquare },
    { label: 'Profile', value: '/profile', icon: CircleUserRound },
  ];

  const [mode, setMode] = useState<string>("swapper");
  const [selectedGO, setSelectedGO] = useState<GroupOrder | null>(null);
  const [isPostTripOpen, setIsPostTripOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [travelerAvailability, setTravelerAvailability] = useState<TravelerAvailability>({
    active: false,
    until: null,
  });

  // User state from localStorage (with CURRENT_USER as fallback)
  const [user, setUser] = useState<UserProfile>(() => getLocalProfile());

  // Listen for localStorage changes (cross-tab synchronization & same-tab updates)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bitbit_local_profile') {
        setUser(getLocalProfile());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    const handleProfileUpdate = () => {
      setUser(getLocalProfile());
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const isWelcomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-[Figtree] flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] animate-in fade-in slide-in-from-top-4 duration-300 w-[90%] max-w-sm">
          <div className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-sm font-semibold ${toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
            {toast.type === 'error' ? <AlertTriangle size={18} className="shrink-0" /> : <CheckCircle size={18} className="shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main app content with unified single-route management */}
      {isWelcomePage ? (
        <div className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
          </Routes>
        </div>
      ) : (
        <main className="flex-1 w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <Routes>
            <Route 
              path="/home" 
              element={
                <BrowsePage 
                  mode={mode} 
                  setMode={setMode} 
                  setSelectedGO={(go) => setSelectedGO(go as GroupOrder)} 
                  setIsPostTripOpen={setIsPostTripOpen} 
                />
              } 
            />
            <Route 
              path="/explore" 
              element={
                <ExplorePage 
                  travelerAvailability={travelerAvailability} 
                  onJoinGroupOrder={(go) => setSelectedGO(go as GroupOrder)}
                />
              } 
            />

            <Route 
              path="/orders" 
              element={<OrdersPage user={user} />} 
            />
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
            <Route 
              path="/messages" 
              element={<MessagesPage />} 
            />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
      )}

      {/* Bottom Navigation Bar - only rendered for authenticated/app views */}
      {!isWelcomePage && (
        <nav 
          aria-label="Primary Navigation"
          className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
        >
          <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
            <AppBottomNav items={navItems} value={location.pathname} onChange={navigate} />
          </div>
        </nav>
      )}

      {/* Global Modals */}
      <GroupOrderModal 
        key={selectedGO?.id ?? 'empty-group-order'} 
        selectedGO={selectedGO} 
        onClose={() => setSelectedGO(null)} 
        showToast={showToast} 
      />
      <PostTripModal 
        key={isPostTripOpen ? 'post-trip-open' : 'post-trip-closed'} 
        isOpen={isPostTripOpen} 
        onClose={() => setIsPostTripOpen(false)} 
        showToast={showToast} 
      />
      
      <style>{`
        .safe-area-bottom { padding-bottom: max(env(safe-area-inset-bottom), 0px); }
      `}</style>
    </div>
  );
}
