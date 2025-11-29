import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle, MoreHorizontal } from 'lucide-react';
import { Card as CustomCard, Avatar } from '@/components/CustomComponents';
import { CURRENT_USER } from '@/data';

const USERS = {
  current: {
    id: CURRENT_USER.uid,
    name: CURRENT_USER.displayName,
    avatar: CURRENT_USER.avatar,
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
};

const MOCK_TRANSACTIONS = [
  {
    id: "tx_1",
    conversationId: "c1",
    status: "ongoing",
    step: "Coordinating Swap",
    product: {
      id: 1,
      title: "Limited Starbucks Sakura Tumbler 2024",
      price: 1250,
      image: "https://images.unsplash.com/photo-1570784332176-fdd73da66f03?auto=format&fit=crop&q=80&w=600",
      location: "Tokyo, JP",
    },
    host: USERS.current,
    swapper: USERS.sarah,
    deadline: "2024-03-25"
  },
  {
    id: "tx_2",
    conversationId: "c2",
    status: "ongoing",
    step: "In Transit to Meet-up",
    product: {
      id: 3,
      title: "Don Quijote Matcha KitKats (12 Pack)",
      price: 450,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ318pT1StZ1ZlM4fkIoI6SfcTCGdi_9TG7-Q&s",
      location: "Osaka, JP",
    },
    host: USERS.mike,
    swapper: USERS.current,
    deadline: "2024-03-22"
  },
  {
    id: "tx_3",
    conversationId: "c1",
    status: "past",
    step: "Swap Completed",
    product: {
      id: 5,
      title: "Gentle Monster Sunglasses",
      price: 15200,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600",
      location: "Seoul, KR",
    },
    host: USERS.jessica,
    swapper: USERS.current,
    deadline: "2024-02-10"
  },
  {
    id: "tx_4",
    conversationId: "c2",
    status: "past",
    step: "Swap Cancelled",
    product: {
      id: 8,
      title: "Olive Young Skin Care Set",
      price: 3200,
      image: "https://sugarpeachesloves.net/wp-content/uploads/2022/08/Olive-Young-Global-5-step-skincare-routine-scaled.jpeg",
      location: "Seoul, KR",
    },
    host: USERS.current,
    swapper: USERS.david,
    deadline: "2024-01-15"
  }
];

const OrdersPage = () => {
  const navigate = useNavigate();
  const [travelerTab, setTravelerTab] = useState('ongoing');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    const matchesQuery = (t) =>
      t.product.title.toLowerCase().includes(normalized) ||
      t.host.name.toLowerCase().includes(normalized) ||
      t.swapper.name.toLowerCase().includes(normalized);

    return MOCK_TRANSACTIONS.filter((t) => {
      if (normalized) {
        return matchesQuery(t);
      }
      if (t.status !== travelerTab) return false;
      return (
        true
      );
    });
  }, [travelerTab, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="px-4 py-6 space-y-6 pb-28">
      <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Transactions</h2>
            <p className="text-xs text-slate-500">Manage your pasabuy requests</p>
          </div>
          <button
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className="bg-slate-900 text-white p-2 rounded-full shadow-lg shadow-slate-200"
            aria-label="Toggle search"
          >
            <Search size={20} />
          </button>
        </div>

        {isSearchOpen && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-sm">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, hosts, or swappers"
              className="flex-1 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        )}

        <div className="bg-slate-100 p-1 rounded-xl flex relative">
          <button 
            onClick={() => setTravelerTab('ongoing')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 z-10 ${travelerTab === 'ongoing' && !isSearching ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            disabled={isSearching}
          >
            Ongoing Orders ({MOCK_TRANSACTIONS.filter(t => t.status === 'ongoing').length})
          </button>
          <button 
            onClick={() => setTravelerTab('past')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 z-10 ${travelerTab === 'past' && !isSearching ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            disabled={isSearching}
          >
            Past History
          </button>
        </div>

        {isSearching && (
          <p className="text-xs text-slate-500 px-1">
            Showing matches for “{searchQuery.trim()}”
          </p>
        )}

        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package size={24} className="text-slate-300"/>
              </div>
              <p className="text-slate-400 text-sm">
                {isSearching ? 'No matches found.' : `No ${travelerTab} transactions found.`}
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isHost = tx.host.id === CURRENT_USER.uid;
              const isSwapper = tx.swapper.id === CURRENT_USER.uid;

              return (
                <CustomCard key={tx.id} className="p-0 overflow-hidden group">
                  <div className={`px-4 py-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-wide ${tx.status === 'ongoing' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    <span className="flex items-center gap-1.5">
                      {tx.status === 'ongoing' ? <Clock size={12}/> : <CheckCircle size={12}/>}
                      {tx.step}
                    </span>
                    <span>ID: {tx.id.toUpperCase()}</span>
                  </div>

                  <div className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-100">
                        <img src={tx.product.image} alt={tx.product.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 truncate pr-2">{tx.product.title}</h3>
                            <p className="text-xs text-slate-500 truncate">{tx.product.location}</p>
                          </div>
                          <button className="text-slate-300 hover:text-slate-600">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="flex items-center gap-2">
                            <Avatar name={tx.host.name} src={tx.host.avatar} size="xs" />
                            <div>
                              <p className="text-[10px] text-slate-400 font-medium">Host</p>
                              <p className="text-xs font-semibold text-slate-800 truncate">{tx.host.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 justify-end text-right">
                            <div>
                              <p className="text-[10px] text-slate-400 font-medium">Swapper</p>
                              <p className="text-xs font-semibold text-slate-800 truncate">{tx.swapper.name}</p>
                            </div>
                            <Avatar name={tx.swapper.name} src={tx.swapper.avatar} size="xs" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {tx.status === 'ongoing' ? (
                    <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
                      <button
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                          isHost
                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                            : isSwapper
                              ? 'bg-white border border-slate-300 text-slate-900 hover:bg-slate-50'
                              : 'bg-white text-slate-500 border border-transparent'
                        }`}
                      >
                        {isHost ? 'Update Status' : isSwapper ? 'View Status' : 'View Details'}
                      </button>
                      <button
                        className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                        onClick={() => {
                          const conversationId = tx.conversationId || "c1";
                          navigate("/messages", {
                            state: { conversationId, chatType: "pasabuy" },
                          });
                        }}
                      >
                        Chat
                      </button>
                    </div>
                  ) : (
                    <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
                      <button
                        className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                        onClick={() => {
                          const conversationId = tx.conversationId || "c2";
                          navigate("/messages", {
                            state: { conversationId, chatType: "pasabuy" },
                          });
                        }}
                      >
                        Chat
                      </button>
                      <button className="flex-1 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 hover:bg-emerald-100 transition-colors">
                        Rate
                      </button>
                    </div>
                  )}
                </CustomCard>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;