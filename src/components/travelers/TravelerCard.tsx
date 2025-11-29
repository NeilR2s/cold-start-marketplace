import { ArrowRight, BadgeCheck, MessageCircle, Plane, MapPin, ShieldCheck, Scale, Package } from "lucide-react";
import { TravelerProfile } from "../../types/travelers";

type TravelerCardProps = {
  traveler: TravelerProfile;
  variant?: "full" | "compact";
  onSelect?: (traveler: TravelerProfile) => void;
  onMessage?: (traveler: TravelerProfile) => void;
  onProposeSwap?: (traveler: TravelerProfile) => void;
};

const badgeClasses = "rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white";

export function TravelerCard({ traveler, variant = "full", onSelect, onMessage, onProposeSwap }: TravelerCardProps) {
  const capacityPct = Math.round((traveler.availabilityKg / traveler.totalCapacityKg) * 100);
  const messagePreview = traveler.messageTemplates[0] ?? `Hi ${traveler.name}!`;

  if (variant === "compact") {
    return (
      <article
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300"
        onClick={() => onSelect?.(traveler)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img src={traveler.avatar} alt={traveler.name} className="h-12 w-12 rounded-full border border-slate-100 object-cover" />
            <div>
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold text-slate-900">{traveler.name}</p>
                {traveler.verified && <BadgeCheck className="h-4 w-4 text-emerald-500" />}
              </div>
              <p className="text-xs text-slate-500">{traveler.trip.timelineLabel}</p>
            </div>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold text-emerald-600">{traveler.availabilityKg}kg left</p>
            <p className="text-slate-400">{traveler.pricePerKg.toLocaleString("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 })}/kg</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Plane className="h-3.5 w-3.5 text-emerald-500" />
          <span>
            {traveler.routePath} · {traveler.travelType}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {traveler.bitbit.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              {tag}
            </span>
          ))}
        </div>
      </article>
    );
  }

  return (
    <article
      className="flex flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5"
      onClick={() => onSelect?.(traveler)}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <img
            src={traveler.avatar}
            alt={traveler.name}
            className="h-14 w-14 rounded-full border-2 border-emerald-100 object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h3 className="text-lg font-bold text-slate-900">{traveler.name}</h3>
              {traveler.verified && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
            </div>
            <p className="text-sm text-slate-500">{traveler.currentArea}</p>
            <p className="text-xs text-slate-400">
              Rating {traveler.rating.toFixed(1)} · {traveler.completedSwaps} swaps done
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase text-slate-500">Swap Type</p>
          <p className="text-sm font-bold text-emerald-600">{traveler.swapMode}</p>
        </div>
      </header>

      {traveler.statusNote && (
        <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
          {traveler.statusNote}
        </div>
      )}

      <section className="mt-4 grid gap-3 text-sm text-slate-700">
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeClasses}>
            <MapPin className="mr-1 inline h-3.5 w-3.5 text-white/80" />
            {traveler.cityProvince}
          </span>
          <span className={badgeClasses}>{traveler.origin}</span>
          <span className={badgeClasses}>{traveler.travelType}</span>
        </div>

        <div className="rounded-2xl bg-slate-50/80 p-4">
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
            {traveler.bitbit.map((tag) => (
              <span key={tag} className="rounded-full bg-white px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
          {traveler.bitbitNotes && <p className="mt-3 text-xs text-slate-500">{traveler.bitbitNotes}</p>}
        </div>

        <div className="grid gap-3 rounded-2xl border border-slate-100 p-3 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="inline-flex items-center gap-1 font-semibold">
              <Scale className="h-4 w-4 text-emerald-500" />
              Capacity
            </span>
            <span className="text-slate-900">
              {traveler.availabilityKg}kg / {traveler.totalCapacityKg}kg ({capacityPct}% open)
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="inline-flex items-center gap-1 font-semibold">
              <Package className="h-4 w-4 text-emerald-500" />
              Quantity limit
            </span>
            <span className="text-slate-900">{traveler.restrictions.quantityLimit} items</span>
          </div>
          <div className="flex flex-wrap gap-1 text-[11px] font-semibold text-slate-600">
            {traveler.restrictions.flags.map((flag) => (
              <span key={flag} className="rounded-full bg-slate-100 px-2 py-0.5">
                {flag}
              </span>
            ))}
          </div>
          {traveler.restrictions.notes && <p className="text-[11px] text-slate-500">{traveler.restrictions.notes}</p>}
        </div>

        <div className="grid gap-2 rounded-2xl bg-emerald-50/80 p-3 text-xs font-semibold text-emerald-700">
          <div className="flex items-center gap-2 text-sm text-emerald-800">
            <Plane className="h-4 w-4" />
            {traveler.trip.timelineLabel}
          </div>
          <div className="text-[11px] text-emerald-700/90">
            Route: {traveler.routePath} · Nearby: {traveler.nearbyDistricts.join(", ")}
          </div>
          {traveler.trip.stayNotes && <div className="text-[11px] text-emerald-700/80">{traveler.trip.stayNotes}</div>}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Kapalit they want</p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold text-slate-700">
            {traveler.kapalitPreferences.map((pref) => (
              <span key={pref} className="rounded-full bg-slate-100 px-3 py-1">
                {pref}
              </span>
            ))}
          </div>
          {traveler.kapalitNotes && <p className="mt-2 text-xs text-slate-500">{traveler.kapalitNotes}</p>}
        </div>
      </section>

      <footer className="mt-4 flex flex-col gap-2 text-sm">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
          <p className="font-semibold text-slate-700">Chat template</p>
          <p className="text-slate-600">“{messagePreview}”</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onProposeSwap?.(traveler);
              onSelect?.(traveler);
            }}
            className="flex items-center justify-center gap-2 rounded-full border border-slate-900 px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
          >
            Propose Swap <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onMessage?.(traveler);
            }}
            disabled={!traveler.conversationId}
            className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 font-semibold transition ${
              traveler.conversationId ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            Message Traveler
          </button>
        </div>
      </footer>
    </article>
  );
}

