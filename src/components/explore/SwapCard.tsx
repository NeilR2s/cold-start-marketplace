import { MessageCircle, Users, Sparkles, ArrowRight } from "lucide-react";
import { SwapListing } from "../../types/explore";
import { SwapTypeBadge } from "./SwapTypeBadge";
import { LocationBadge } from "./LocationBadge";

type SwapCardProps = {
  listing: SwapListing;
  layout?: "grid" | "list";
};

export function SwapCard({ listing, layout = "grid" }: SwapCardProps) {
  const showContributorBar = listing.barterType === "Group Swap" || listing.barterType === "1-to-Many Swap";

  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-0.5">
      <div className="relative overflow-hidden rounded-3xl">
        <img
          src={listing.heroImage}
          alt={listing.title}
          className={`h-48 w-full object-cover ${layout === "list" ? "md:h-60" : ""}`}
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <SwapTypeBadge type={listing.barterType} />
          <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-slate-600">{listing.category}</span>
        </div>
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-rose-500"
        >
          {listing.likes} ♥
        </button>
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
          <h3 className="text-lg font-bold text-slate-900">{listing.title}</h3>
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
          <button
            type="button"
            className="rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
          >
            View Listing
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Make an Offer <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

