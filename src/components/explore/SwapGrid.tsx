import { SwapListing } from "../../types/explore";
import { SwapCard } from "./SwapCard";
import { Button } from "@/components/ui";

type SwapGridProps = {
  listings: SwapListing[];
  layout: "grid" | "list";
  onLoadMore: () => void;
  hasMore: boolean;
  onChatHost?: (listing: SwapListing) => void;
  onJoinGroupSwap?: (listing: SwapListing) => void;
};

export function SwapGrid({ listings, layout, onLoadMore, hasMore, onChatHost, onJoinGroupSwap }: SwapGridProps) {
  if (listings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
        No swaps match your filters yet. Adjust filters to see more listings.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={layout === "grid" ? "grid gap-4 sm:grid-cols-2" : "flex flex-col gap-4"}>
        {listings.map((listing) => (
          <SwapCard
            key={listing.id}
            listing={listing}
            layout={layout}
            onChatHost={onChatHost}
            onJoinGroupSwap={onJoinGroupSwap}
          />
        ))}
      </div>


      {hasMore && (
        <Button
          type="button"
          variant="outline"
          pill
          onClick={onLoadMore}
          className="w-full py-3 h-auto text-sm font-semibold text-slate-700 border-slate-300 hover:border-slate-900 transition-colors"
        >
          Load more swaps
        </Button>
      )}

    </div>
  );
}


