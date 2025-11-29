import { TravelerProfile } from "../../types/travelers";
import { TravelerCard } from "./TravelerCard";

type TravelerGridProps = {
  travelers: TravelerProfile[];
  layout?: "grid" | "list";
  onSelect: (traveler: TravelerProfile) => void;
  onMessage: (traveler: TravelerProfile) => void;
  onProposeSwap: (traveler: TravelerProfile) => void;
  onLoadMore: () => void;
  hasMore: boolean;
};

export function TravelerGrid({
  travelers,
  layout = "list",
  onSelect,
  onMessage,
  onProposeSwap,
  onLoadMore,
  hasMore,
}: TravelerGridProps) {
  if (travelers.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
        No travelers match these filters yet. Try widening your search radius or relaxing restrictions.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className={layout === "grid" ? "grid gap-4 sm:grid-cols-2" : "flex flex-col gap-4"}>
        {travelers.map((traveler) => (
          <TravelerCard
            key={traveler.id}
            traveler={traveler}
            variant="full"
            onSelect={onSelect}
            onMessage={onMessage}
            onProposeSwap={onProposeSwap}
          />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={onLoadMore}
          className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900"
        >
          Load more travelers
        </button>
      )}
    </div>
  );
}

