import { TravelerFilterState, TravelerProfile, TravelerSortOption } from "../types/travelers";

export const defaultTravelerFilters: TravelerFilterState = {
  sort: "Best Match",
  query: "",
  locationFilters: [],
  origins: [],
  bitbit: [],
  restrictions: [],
  kapalit: [],
  travelTypes: [],
  swapModes: [],
};

const textIncludes = (haystack: string, needle: string) => haystack.toLowerCase().includes(needle.toLowerCase());

const matchesCustomOrigin = (traveler: TravelerProfile, filters: TravelerFilterState) => {
  if (!filters.customOrigin?.trim()) return true;
  return textIncludes(traveler.origin, filters.customOrigin.trim());
};

const matchesCustomBitbit = (traveler: TravelerProfile, filters: TravelerFilterState) => {
  if (!filters.customBitbit?.trim()) return true;
  return traveler.bitbit.some((item) => textIncludes(item, filters.customBitbit!.trim()));
};

export const filterTravelers = (travelers: TravelerProfile[], filters: TravelerFilterState) =>
  travelers.filter((traveler) => {
    if (filters.query) {
      const blob = `${traveler.name} ${traveler.currentArea} ${traveler.trip.timelineLabel} ${traveler.bitbit.join(" ")} ${traveler.kapalitPreferences.join(" ")}`.toLowerCase();
      if (!blob.includes(filters.query.toLowerCase())) {
        return false;
      }
    }

    if (filters.locationFilters.length > 0) {
      const hasAll = filters.locationFilters.every((filter) => traveler.locationFocus.includes(filter));
      if (!hasAll) return false;
    }

    if (filters.origins.length > 0 && !filters.origins.some((origin) => traveler.origin === origin)) {
      return false;
    }

    if (!matchesCustomOrigin(traveler, filters)) {
      return false;
    }

    if (filters.bitbit.length > 0 && !filters.bitbit.every((item) => traveler.bitbit.includes(item))) {
      return false;
    }

    if (!matchesCustomBitbit(traveler, filters)) {
      return false;
    }

    if (filters.restrictions.length > 0 && !filters.restrictions.every((flag) => traveler.restrictions.flags.includes(flag))) {
      return false;
    }

    if (filters.minWeightCapacity && traveler.restrictions.weightLimitKg < filters.minWeightCapacity) {
      return false;
    }

    if (filters.minQuantityLimit && traveler.restrictions.quantityLimit < filters.minQuantityLimit) {
      return false;
    }

    if (filters.kapalit.length > 0 && !filters.kapalit.every((pref) => traveler.kapalitPreferences.includes(pref))) {
      return false;
    }

    if (filters.travelTypes.length > 0 && !filters.travelTypes.includes(traveler.travelType)) {
      return false;
    }

    if (filters.swapModes.length > 0 && !filters.swapModes.includes(traveler.swapMode)) {
      return false;
    }

    return true;
  });

const bestMatchScore = (traveler: TravelerProfile) => {
  const capacityScore = (traveler.availabilityKg / traveler.totalCapacityKg) * 40;
  const ratingScore = traveler.rating * 10;
  const hoursSinceActive = Math.max(1, (Date.now() - Date.parse(traveler.activeSince)) / (1000 * 60 * 60));
  const recencyScore = 30 / hoursSinceActive;
  const swapScore = traveler.completedSwaps;
  return capacityScore + ratingScore + recencyScore + swapScore;
};

export const sortTravelers = (travelers: TravelerProfile[], sort: TravelerSortOption) => {
  const sorted = [...travelers];
  switch (sort) {
    case "Earliest Return":
      return sorted.sort((a, b) => Date.parse(a.trip.returnDate) - Date.parse(b.trip.returnDate));
    case "Most Active":
      return sorted.sort(
        (a, b) =>
          b.completedSwaps - a.completedSwaps ||
          Date.parse(b.activeSince) - Date.parse(a.activeSince),
      );
    case "Nearest First":
      return sorted.sort((a, b) => a.distanceKm - b.distanceKm);
    default:
      return sorted.sort((a, b) => bestMatchScore(b) - bestMatchScore(a));
  }
};

export const buildTravelerFilterPills = (filters: TravelerFilterState) => {
  const pills: { label: string; key: string }[] = [];

  if (filters.query) pills.push({ label: `Search: ${filters.query}`, key: "query" });

  filters.locationFilters.forEach((filter) => pills.push({ label: filter, key: `location|${filter}` }));
  filters.origins.forEach((origin) => pills.push({ label: `Origin: ${origin}`, key: `origin|${origin}` }));
  if (filters.customOrigin) pills.push({ label: `Origin: ${filters.customOrigin}`, key: "customOrigin" });

  filters.bitbit.forEach((item) => pills.push({ label: `Bitbit: ${item}`, key: `bitbit|${item}` }));
  if (filters.customBitbit) pills.push({ label: `Bitbit: ${filters.customBitbit}`, key: "customBitbit" });

  filters.restrictions.forEach((flag) => pills.push({ label: flag, key: `restriction|${flag}` }));

  if (filters.minWeightCapacity) pills.push({ label: `≥ ${filters.minWeightCapacity}kg capacity`, key: "minWeightCapacity" });
  if (filters.minQuantityLimit) pills.push({ label: `≥ ${filters.minQuantityLimit} items`, key: "minQuantityLimit" });

  filters.kapalit.forEach((pref) => pills.push({ label: `Kapalit: ${pref}`, key: `kapalit|${pref}` }));
  filters.travelTypes.forEach((type) => pills.push({ label: type, key: `travelType|${type}` }));
  filters.swapModes.forEach((mode) => pills.push({ label: mode, key: `swap|${mode}` }));

  return pills;
};

