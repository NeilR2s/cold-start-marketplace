import { FilterState, SortOption, SwapListing, TagCategory } from "../types/explore";

const normalize = (value: string) => value.toLowerCase();

export const defaultFilters: FilterState = {
  sort: "Best Match",
  barterTypes: [],
  categories: [],
  exchangeMethods: [],
  location: undefined,
  tags: {},
  query: "",
};

export const filterListings = (listings: SwapListing[], filters: FilterState) =>
  listings.filter((listing) => {
    if (filters.query) {
      const text = `${listing.title} ${listing.subtitle} ${listing.offerSummary} ${listing.desiredSummary}`.toLowerCase();
      if (!text.includes(filters.query.toLowerCase())) {
        return false;
      }
    }

    if (filters.barterTypes.length > 0 && !filters.barterTypes.includes(listing.barterType)) {
      return false;
    }

    if (filters.categories.length > 0 && !filters.categories.includes(listing.category)) {
      return false;
    }

    if (filters.exchangeMethods.length > 0 && !filters.exchangeMethods.some((method) => listing.exchangeMethods.includes(method))) {
      return false;
    }

    if (filters.location && listing.locationFilter !== filters.location) {
      return false;
    }

    const tagFiltersActive = Object.values(filters.tags).some((group) => group && group.length > 0);
    if (tagFiltersActive) {
      return (Object.entries(filters.tags) as [TagCategory, string[]][]).every(([group, selected]) => {
        if (!selected || selected.length === 0) return true;
        const listingTags = listing.tags[group] ?? [];
        return selected.some((tag) => listingTags.includes(tag));
      });
    }

    return true;
  });

const sortScore = (listing: SwapListing) => {
  const recencyBoost = listing.postedAt.includes("m") ? 30 : listing.postedAt.includes("h") ? 20 : 10;
  return listing.likes * 0.5 + listing.commentCount * 0.3 + recencyBoost;
};

const timeToMinutes = (label: string) => {
  const match = label.match(/(\d+)\s*(m|h|d)/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  const value = Number(match[1]);
  const unit = match[2];
  if (unit === "m") return value;
  if (unit === "h") return value * 60;
  return value * 60 * 24;
};

export const sortListings = (listings: SwapListing[], sort: SortOption) => {
  const sorted = [...listings];
  switch (sort) {
    case "Most Recent":
      return sorted.sort((a, b) => timeToMinutes(a.postedAt) - timeToMinutes(b.postedAt));
    case "Most Popular":
      return sorted.sort((a, b) => b.likes + b.commentCount - (a.likes + a.commentCount));
    case "Nearest First":
      return sorted.sort((a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY));
    default:
      return sorted.sort((a, b) => sortScore(b) - sortScore(a));
  }
};

export const buildFilterPills = (filters: FilterState) => {
  const pills: { label: string; key: string }[] = [];

  if (filters.query) {
    pills.push({ label: `Search: ${filters.query}`, key: "query" });
  }

  filters.barterTypes.forEach((type) => pills.push({ label: type, key: `barter|${type}` }));
  filters.categories.forEach((category) => pills.push({ label: category, key: `category|${category}` }));
  filters.exchangeMethods.forEach((method) => pills.push({ label: method, key: `exchange|${method}` }));

  if (filters.location) {
    pills.push({ label: filters.location, key: "location" });
  }

  (Object.entries(filters.tags) as [TagCategory, string[]][]).forEach(([group, values]) => {
    values?.forEach((value) => pills.push({ label: `${value}`, key: `tag|${group}|${value}` }));
  });

  return pills;
};

