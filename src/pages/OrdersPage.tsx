import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle, MoreHorizontal, Star, X, ArrowRight } from 'lucide-react';
import { Card, Avatar, Button } from '@/components/ui';
import { CURRENT_USER, UserProfile } from '@/data';
import { OrderTransaction, SavedRating, OrderStep } from '@/types/orders';
import { orderService } from '@/services/orderService';

export interface OrdersPageProps {
  user?: UserProfile | null;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transactions, setTransactions] = useState<OrderTransaction[]>([]);
  const [travelerTab, setTravelerTab] = useState<'ongoing' | 'past'>('ongoing');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingModalTx, setRatingModalTx] = useState<OrderTransaction | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [ratingComment, setRatingComment] = useState<string>('');
  const [savedRatings, setSavedRatings] = useState<Record<string, SavedRating>>({});
  const [statusActionMessage, setStatusActionMessage] = useState<string | null>(null);

  const locationState = location.state as { from?: string } | null;
  const fromHostTrip = locationState?.from === 'hostTrip';

  useEffect(() => {
    orderService.getOrders(user).then(setTransactions);
    orderService.getRatings().then(setSavedRatings);
  }, [user]);

  const filteredTransactions = (() => {
    const normalized = searchQuery.trim().toLowerCase();
    const matchesQuery = (t: OrderTransaction) =>
      t.product.title.toLowerCase().includes(normalized) ||
      t.host.name.toLowerCase().includes(normalized) ||
      t.swapper.name.toLowerCase().includes(normalized);

    return transactions.filter((t) => {
      if (normalized) {
        return matchesQuery(t);
      }
      return t.status === travelerTab;
    });
  })();

  const isSearching = searchQuery.trim().length > 0;

  const handleUpdateStatus = async (tx: OrderTransaction) => {
    const nextStep = orderService.getNextStep(tx.step);
    if (nextStep === tx.step) return;

    try {
      const updated = await orderService.updateOrderStatus({
        orderId: tx.id,
        nextStep,
      });

      setTransactions((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      setStatusActionMessage(`Order ${tx.id.toUpperCase()} updated to "${nextStep}"`);
      setTimeout(() => setStatusActionMessage(null), 3000);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleOpenRating = (tx: OrderTransaction) => {
    const existing = savedRatings[tx.id];
    setRatingModalTx(tx);
    setRatingValue(existing?.value || 0);
    setRatingComment(existing?.comment || '');
  };

  const handleSubmitRating = async () => {
    if (!ratingModalTx || ratingValue === 0) return;

    const currentUserId = user?.uid || CURRENT_USER.uid;
    const targetUserId = ratingModalTx.host.id === currentUserId ? ratingModalTx.swapper.id : ratingModalTx.host.id;

    try {
      const saved = await orderService.submitRating({
        orderId: ratingModalTx.id,
        targetUserId,
        value: ratingValue,
        comment: ratingComment,
      });

      setSavedRatings((prev) => ({
        ...prev,
        [ratingModalTx.id]: saved,
      }));

      setRatingModalTx(null);
      setRatingValue(0);
      setRatingComment('');
    } catch (err) {
      console.error("Failed to submit rating", err);
    }
  };

  const handleCloseRating = () => {
    setRatingModalTx(null);
    setRatingValue(0);
    setRatingComment('');
  };

  return (
    <div className="py-6 space-y-6 pb-28">
      <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center px-1">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Transactions</h2>
            <p className="text-xs text-slate-500">Manage your pasabuy requests</p>
          </div>
          <button
            type="button"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className="bg-slate-900 text-white p-2.5 rounded-full shadow-md shadow-slate-900/10 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle search"
          >
            <Search size={18} />
          </button>
        </div>

        {statusActionMessage && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-semibold text-emerald-800 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
            <span>{statusActionMessage}</span>
            <CheckCircle size={16} className="text-emerald-600" />
          </div>
        )}

        {fromHostTrip && (
          <div className="mt-2 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <p className="text-xs font-semibold text-emerald-800">
                Your pasabuy trip is live.
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                New orders will appear here once buyers book a slot. You can chat with each buyer from the order card.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              pill
              onClick={() => navigate('/messages', { state: { chatType: 'pasabuy' } })}
              className="shrink-0 border-emerald-200 text-emerald-700 hover:bg-emerald-100/50 text-[11px] font-bold"
            >
              Open Pasabuy Chats
            </Button>
          </div>
        )}

        {isSearchOpen && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 shadow-sm animate-in slide-in-from-top-2 duration-150">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, hosts, or swappers"
              className="flex-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        )}

        <div className="bg-slate-100 p-1 rounded-xl flex relative">
          <button
            type="button"
            onClick={() => setTravelerTab('ongoing')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 z-10 cursor-pointer ${travelerTab === 'ongoing' && !isSearching ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            disabled={isSearching}
          >
            Ongoing Orders ({transactions.filter(t => t.status === 'ongoing').length})
          </button>
          <button
            type="button"
            onClick={() => setTravelerTab('past')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 z-10 cursor-pointer ${travelerTab === 'past' && !isSearching ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            disabled={isSearching}
          >
            Past History ({transactions.filter(t => t.status === 'past').length})
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
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-400 text-sm font-medium">
                {isSearching ? 'No matches found.' : `No ${travelerTab} transactions found.`}
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const currentUserId = user?.uid || CURRENT_USER.uid;
              const isHost = tx.host.id === currentUserId;
              const isSwapper = tx.swapper.id === currentUserId;
              const existingRating = savedRatings[tx.id];
              const counterpartyName = isHost ? tx.swapper.name : tx.host.name;
              const nextStep = orderService.getNextStep(tx.step);
              const canAdvance = isHost && nextStep !== tx.step;

              return (
                <Card key={tx.id} className="p-0 overflow-hidden group">
                  <div className={`px-4 py-2.5 flex justify-between items-center text-[10px] font-bold uppercase tracking-wide ${tx.status === 'ongoing' ? 'bg-blue-50/80 text-blue-600 border-b border-blue-100/50' : 'bg-slate-100 text-slate-500 border-b border-slate-200/50'}`}>
                    <span className="flex items-center gap-1.5">
                      {tx.status === 'ongoing' ? <Clock size={12} /> : <CheckCircle size={12} />}
                      {tx.step}
                    </span>
                    <span>ID: {tx.id.toUpperCase()}</span>
                  </div>

                  <div className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl bg-slate-100 shrink-0 overflow-hidden border border-slate-100">
                        <img src={tx.product.image} alt={tx.product.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 truncate pr-2">
                              {tx.product.title}
                            </h3>
                            <p className="text-xs text-slate-500 truncate">
                              {tx.product.location}
                            </p>
                          </div>

                          <button 
                            type="button"
                            className="text-slate-300 hover:text-slate-600 shrink-0 ml-2 p-1 rounded-md"
                            aria-label="More options"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="flex items-center gap-2">
                            <Avatar name={tx.host.name} src={tx.host.avatar} size="xs" />
                            <div className="min-w-0">
                              <p className="text-[10px] text-slate-400 font-medium">Host</p>
                              <p className="text-xs font-semibold text-slate-800 truncate">
                                {tx.host.name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 justify-end text-right">
                            <div className="min-w-0">
                              <p className="text-[10px] text-slate-400 font-medium">Swapper</p>
                              <p className="text-xs font-semibold text-slate-800 truncate">
                                {tx.swapper.name}
                              </p>
                            </div>
                            <Avatar name={tx.swapper.name} src={tx.swapper.avatar} size="xs" />
                          </div>
                        </div>

                        {tx.status === 'past' && existingRating && (
                          <div className="mt-3 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-800">
                              <Star size={12} className="fill-amber-400 text-amber-400" />
                              <span>
                                You rated <span className="font-semibold">{counterpartyName}</span> {existingRating.value}/5
                              </span>
                            </div>
                            <button
                              type="button"
                              className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                              onClick={() => handleOpenRating(tx)}
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {tx.status === 'ongoing' ? (
                    <div className="px-4 py-3 border-t border-slate-100 flex gap-2 bg-slate-50/30">
                      {isHost ? (
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => handleUpdateStatus(tx)}
                          disabled={!canAdvance}
                        >
                          <span>{tx.step === 'Coordinating Swap' ? 'Mark In Transit' : 'Mark Completed'}</span>
                          <ArrowRight size={13} />
                        </Button>
                      ) : (
                        <Button
                          variant={isSwapper ? "outline" : "secondary"}
                          size="sm"
                          className="flex-1 text-xs"
                        >
                          {isSwapper ? 'View Status' : 'View Details'}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const conversationId = tx.conversationId || "c1";
                          navigate("/messages", {
                            state: { conversationId, chatType: "pasabuy" },
                          });
                        }}
                      >
                        Chat
                      </Button>
                    </div>
                  ) : (
                    <div className="px-4 py-3 border-t border-slate-100 flex gap-2 bg-slate-50/30">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          const conversationId = tx.conversationId || "c2";
                          navigate("/messages", {
                            state: { conversationId, chatType: "pasabuy" },
                          });
                        }}
                      >
                        Chat
                      </Button>
                      <Button
                        variant={existingRating ? "emerald" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => handleOpenRating(tx)}
                      >
                        {existingRating ? 'Update Rating' : 'Rate'}
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>

      {ratingModalTx && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rating-modal-title"
        >
          <div
            className="fixed inset-0"
            onClick={handleCloseRating}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 id="rating-modal-title" className="font-bold text-lg text-slate-900">Rate your pasabuy</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  How was your swap experience with{' '}
                  <span className="font-semibold text-slate-800">
                    {ratingModalTx.host.id === (user?.uid || CURRENT_USER.uid) ? ratingModalTx.swapper.name : ratingModalTx.host.name}
                  </span>
                  ?
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseRating}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingValue(star)}
                    className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      size={28}
                      className={
                        star <= ratingValue
                          ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                          : 'text-slate-200 hover:text-amber-200'
                      }
                    />
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 text-center min-h-[2.5em] flex items-center justify-center">
                {ratingValue === 0 && 'Tap a star to rate your experience.'}
                {ratingValue === 5 && 'Amazing! This really helps build trust in the community.'}
                {ratingValue === 4 && 'Great swap. Thanks for sharing the love.'}
                {ratingValue === 3 && 'Okay experience. Your feedback keeps things fair.'}
                {ratingValue === 2 && 'Not ideal. Let us know what could be better.'}
                {ratingValue === 1 && 'Sorry this wasn’t great. Your honesty helps keep pasabuy safe.'}
              </p>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-500 ml-1">
                  Optional note
                </label>
                <textarea
                  rows={3}
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Share any details (e.g., on-time meetup, careful with items, smooth coordination)."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

            <Button
              variant={ratingValue === 0 ? "secondary" : "emerald"}
              disabled={ratingValue === 0}
              onClick={handleSubmitRating}
              className="mt-5 w-full h-11 text-sm font-bold"
            >
              {savedRatings[ratingModalTx?.id] ? 'Update Rating' : 'Submit Rating'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
