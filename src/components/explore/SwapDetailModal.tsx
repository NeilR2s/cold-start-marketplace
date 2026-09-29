import React, { useEffect } from "react";
import { X, Heart, MessageCircle, Sparkles, Users, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { SwapListing } from "../../types/explore";
import { SwapTypeBadge } from "./SwapTypeBadge";
import { LocationBadge } from "./LocationBadge";
import { Badge, Button } from "@/components/ui";

export interface SwapDetailModalProps {
  listing: SwapListing | null;
  onClose: () => void;
  onChatHost?: (listing: SwapListing) => void;
  onJoinGroupSwap?: (listing: SwapListing) => void;
}

export const SwapDetailModal: React.FC<SwapDetailModalProps> = ({
  listing,
  onClose,
  onChatHost,
  onJoinGroupSwap,
}) => {
  useEffect(() => {
    if (!listing) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [listing, onClose]);

  if (!listing) return null;

  const isGroupSwap = listing.barterType === "Group Swap" || listing.barterType === "1-to-Many Swap";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="swap-detail-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 animate-in zoom-in-95 duration-150">
        {/* Header Hero Image */}
        <div className="relative h-56 sm:h-64 bg-slate-100 shrink-0">
          <img
            src={listing.heroImage}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-1.5 max-w-[calc(100%-80px)] z-10">
            <SwapTypeBadge type={listing.barterType} />
            <Badge variant="outline" pill className="bg-white/95 backdrop-blur-xs border-white/40 text-slate-800 text-xs font-semibold">
              {listing.category}
            </Badge>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 rounded-full transition-colors shadow-md backdrop-blur-sm cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Bottom Overlay Info */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs z-10">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-400" />
              <span className="font-semibold drop-shadow-sm">{listing.locationLabel}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold">
              <Heart size={12} className="fill-rose-500 text-rose-500" />
              <span>{listing.likes} likes</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Host info */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`h-11 w-11 rounded-full ${listing.hostAvatarColor} text-white grid place-items-center text-sm font-bold shadow-xs shrink-0`}>
                {listing.hostName
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-900">{listing.hostName}</h4>
                  <ShieldCheck size={14} className="text-emerald-600 fill-emerald-100" />
                </div>
                <p className="text-xs text-slate-500">Posted {listing.postedAt} • Verified Swapper</p>
              </div>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h2 id="swap-detail-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {listing.title}
            </h2>
            <p className="text-sm text-slate-500 mt-1">{listing.subtitle}</p>
          </div>

          {/* What's Offered & What's Wanted */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Item Being Offered</p>
              <p className="text-sm font-medium text-slate-800 mt-1">{listing.offerSummary}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Desired Kapalit / Trade Wants</p>
              <p className="text-sm font-medium text-slate-800 mt-1">{listing.desiredSummary}</p>
            </div>
          </div>

          {/* Contributor Slots / Group Pool */}
          {isGroupSwap && listing.contributorSlots && (
            <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/70 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-purple-900">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span>Contributor Pooling</span>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  {listing.contributorSlots.filled}/{listing.contributorSlots.total} Slots Filled
                </span>
              </div>
              <div className="h-2 w-full bg-purple-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (listing.contributorSlots.filled / listing.contributorSlots.total) * 100)}%` }}
                />
              </div>
              {listing.contributorSlots.notes && (
                <p className="text-xs text-purple-800/80 leading-relaxed pt-1">
                  {listing.contributorSlots.notes}
                </p>
              )}
            </div>
          )}

          {/* Tags & Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Listing Attributes</h4>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(listing.tags).flatMap(([category, tags]) =>
                tags?.map((tag) => (
                  <span
                    key={`${category}-${tag}`}
                    className="inline-flex items-center text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg"
                  >
                    {tag}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Exchange Methods */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Trade methods: <strong>{listing.exchangeMethods.join(", ")}</strong>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <MessageCircle className="h-4 w-4" />
              {listing.commentCount} comments
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center gap-3">
          {listing.barterType === "Group Swap" && onJoinGroupSwap ? (
            <Button
              type="button"
              variant="default"
              pill
              className="flex-1 font-bold text-sm py-2.5 cursor-pointer shadow-sm"
              onClick={() => {
                onClose();
                onJoinGroupSwap(listing);
              }}
            >
              <Users className="h-4 w-4 mr-1.5" />
              Join Group Pool
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              pill
              className="flex-1 font-bold text-sm py-2.5 text-slate-800 border-slate-300 hover:border-slate-800 hover:bg-slate-50 cursor-pointer shadow-xs"
              onClick={() => {
                onClose();
                onChatHost?.(listing);
              }}
            >
              Make Trade Offer
            </Button>
          )}

          <Button
            type="button"
            variant="emerald"
            pill
            className="flex-1 font-bold text-sm py-2.5 cursor-pointer shadow-sm"
            onClick={() => {
              onClose();
              onChatHost?.(listing);
            }}
          >
            Chat Host
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
