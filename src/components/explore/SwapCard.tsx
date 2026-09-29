import { MessageCircle, Users, Sparkles, ArrowRight, Heart } from "lucide-react";
import { SwapListing } from "../../types/explore";
import { SwapTypeBadge } from "./SwapTypeBadge";
import { LocationBadge } from "./LocationBadge";
import { Button, Badge } from "@/components/ui";

type SwapCardProps = {
  listing: SwapListing;
  layout?: "grid" | "list";
  onChatHost?: (listing: SwapListing) => void;
  onJoinGroupSwap?: (listing: SwapListing) => void;
  onViewListing?: (listing: SwapListing) => void;
};

export function SwapCard({ listing, layout = "grid", onChatHost, onJoinGroupSwap, onViewListing }: SwapCardProps) {
  const showContributorBar = listing.barterType === "Group Swap" || listing.barterType === "1-to-Many Swap";

  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-0.5">
      <div 
        onClick={() => onViewListing?.(listing)}
        className="relative overflow-hidden rounded-3xl cursor-pointer"
      >
        <img
          src={listing.heroImage}
          alt={listing.title}
          className={`h-48 w-full object-cover transition-transform duration-300 hover:scale-105 ${layout === "list" ? "md:h-60" : ""}`}
        />
        <div className="absolute left-3 sm:left-4 top-3 sm:top-4 flex flex-wrap items-center gap-1.5 max-w-[calc(100%-80px)] z-10">
          <SwapTypeBadge type={listing.barterType} />
          <Badge variant="outline" pill className="bg-white/90 backdrop-blur-xs border-white/40 text-slate-700 max-w-[140px] truncate text-[11px]">
            {listing.category}
          </Badge>
        </div>
        <Button
          type="button"
          variant="ghost"
          pill
          size="sm"
          className="absolute right-4 top-4 h-7 bg-white/90 backdrop-blur-xs px-2.5 text-xs font-semibold text-rose-500 hover:bg-white hover:text-rose-600 shadow-xs cursor-pointer"
        >
          <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 mr-1 inline" />
          {listing.likes}
        </Button>
      </div>


      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <div className={`h-9 w-9 rounded-full ${listing.hostAvatarColor} text-white grid place-items-center text-sm font-bold`}>
            {listing.hostName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{listing.hostName}</p>
            <p className="text-xs text-slate-500">{listing.postedAt}</p>
          </div>
        </div>

        <div>
          <h3 
            onClick={() => onViewListing?.(listing)}
            className="text-lg font-bold text-slate-900 cursor-pointer hover:text-emerald-700 transition-colors"
          >
            {listing.title}
          </h3>
          <p className="text-sm text-slate-500">{listing.subtitle}</p>
        </div>

        <LocationBadge
          label={listing.locationLabel}
          distanceKm={listing.distanceKm}
          routeOrigin={listing.routeOrigin}
          filter={listing.locationFilter}
        />

        <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Offering</p>
          <p>{listing.offerSummary}</p>
          <p className="mt-2 font-semibold text-slate-900">Wants in Kapalit</p>
          <p>{listing.desiredSummary}</p>
        </div>

        {showContributorBar && listing.contributorSlots && (
          <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50 p-3 text-sm text-purple-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <Users className="h-4 w-4" />
                Contributor slots
              </div>
              <span>
                {listing.contributorSlots.filled}/{listing.contributorSlots.total}
              </span>
            </div>
            {listing.contributorSlots.notes && <p className="mt-1 text-xs text-purple-700">{listing.contributorSlots.notes}</p>}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {listing.commentCount} comments
          </span>
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-amber-500" />
            {listing.exchangeMethods.join(" · ")}
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          {listing.barterType === "Group Swap" && onJoinGroupSwap ? (
            <Button
              variant="default"
              pill
              size="sm"
              className="w-full text-xs font-semibold"
              onClick={() => onJoinGroupSwap(listing)}
            >
              <Users className="h-3.5 w-3.5 mr-1" /> Join Group Pool
            </Button>
          ) : (
            <Button
              variant="outline"
              pill
              size="sm"
              className="w-full text-xs font-semibold hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
              onClick={() => onViewListing?.(listing)}
            >
              View Listing
            </Button>
          )}
          <Button
            variant="emerald"
            pill
            size="sm"
            className="w-full text-xs font-semibold cursor-pointer"
            onClick={() => onChatHost?.(listing)}
          >
            Chat Host <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </article>
  );
}


