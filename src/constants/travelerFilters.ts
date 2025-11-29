import {
  TravelerLocationFilter,
  TravelerOrigin,
  BitbitCategory,
  RestrictionFlag,
  KapalitPreference,
  TravelType,
  SwapMode,
  TravelerSortOption,
} from "../types/travelers";

export const TRAVELER_SORT_OPTIONS: TravelerSortOption[] = ["Best Match", "Earliest Return", "Most Active", "Nearest First"];

export const TRAVELER_LOCATION_FILTERS: TravelerLocationFilter[] = ["Current Area", "Nearby Districts", "City / Province", "Route / Trip Path", "Distance Radius"];

export const TRAVELER_ORIGINS: TravelerOrigin[] = ["Japan", "Korea", "USA", "UAE", "Local"];

export const BITBIT_OPTIONS: BitbitCategory[] = [
  "Gadgets",
  "Anime Merchandise",
  "Fashion",
  "Cosmetics",
  "Snacks & Pasalubong",
  "Home Items",
  "K-pop & Collectibles",
  "Errands",
];

export const RESTRICTION_OPTIONS: RestrictionFlag[] = ["No Liquids > 100ml", "No Fragile Items", "No Food", "No Electronics"];

export const KAPALIT_OPTIONS: KapalitPreference[] = [
  "Food",
  "Services",
  "Vouchers",
  "Electronics",
  "Handmade Items",
  "Household Items",
  "Open to Bundles",
  "Strict 1:1 Only",
];

export const TRAVEL_TYPE_OPTIONS: TravelType[] = ["Traveler (Flight)", "Commuter (Land)", "Returning OFW", "Daily Route Driver", "Group Host (Bulk Pasalubong pickup)"];

export const SWAP_MODE_OPTIONS: SwapMode[] = ["Strict 1:1 Only", "Open to Bundles", "Group Host (Bulk Pasalubong pickup)"];

export const MAX_WEIGHT_LIMIT = 35;
export const MAX_QUANTITY_LIMIT = 20;

