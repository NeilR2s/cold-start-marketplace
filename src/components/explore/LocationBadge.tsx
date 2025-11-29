import { MapPin, Route } from "lucide-react";
import { LocationFilter } from "../../types/explore";

type LocationBadgeProps = {
  label: string;
  distanceKm?: number;
  routeOrigin?: string;
  filter: LocationFilter;
};

export function LocationBadge({ label, distanceKm, routeOrigin, filter }: LocationBadgeProps) {
  const isRoute = filter === "Route / Trip Origin";
  return (
    <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
      {isRoute ? <Route className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
      <span>{label}</span>
      {typeof distanceKm === "number" && <span className="text-slate-400">• {distanceKm} km</span>}
      {isRoute && routeOrigin && <span className="text-slate-400">• {routeOrigin}</span>}
    </div>
  );
}


