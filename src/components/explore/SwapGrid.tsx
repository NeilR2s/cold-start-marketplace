import { SwapListing } from "../../types/explore";
import { SwapCard } from "./SwapCard";

type SwapGridProps = {
  listings: SwapListing[];
  layout: "grid" | "list";
  onChatHost?: (listing: SwapListing) => void;
  onJoinGroupSwap?: (listing: SwapListing) => void;
  onViewListing?: (listing: SwapListing) => void;
};

export function SwapGrid({ listings, layout, onChatHost, onJoinGroupSwap, onViewListing }: SwapGridProps) {
  if (listings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
        No swaps match your filters yet. Adjust filters to see more listings.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={layout === "grid" ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
        {listings.map((listing) => (
          <SwapCard
            key={listing.id}
            listing={listing}
            layout={layout}
            onChatHost={onChatHost}
            onJoinGroupSwap={onJoinGroupSwap}
            onViewListing={onViewListing}
          />
        ))}
      </div>
    </div>
  );
}
