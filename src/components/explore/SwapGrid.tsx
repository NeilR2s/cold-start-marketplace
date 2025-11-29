import { SwapListing } from "../../types/explore";
import { SwapCard } from "./SwapCard";

type SwapGridProps = {
  listings: SwapListing[];
  layout: "grid" | "list";
  onLoadMore: () => void;
  hasMore: boolean;
  onChatHost?: (listing: SwapListing) => void;
};

export function SwapGrid({ listings, layout, onLoadMore, hasMore, onChatHost }: SwapGridProps) {
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
          />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={onLoadMore}
          className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900"
        >
          Load more swaps
        </button>
      )}
    </div>
  );
}


