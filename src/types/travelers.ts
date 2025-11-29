export type TravelerLocationFilter = "Current Area" | "Nearby Districts" | "City / Province" | "Route / Trip Path" | "Distance Radius";

export type TravelerOrigin = "Japan" | "Korea" | "USA" | "UAE" | "Local";

export type BitbitCategory =
  | "Gadgets"
  | "Anime Merchandise"
  | "Fashion"
  | "Cosmetics"
  | "Snacks & Pasalubong"
  | "Home Items"
  | "K-pop & Collectibles"
  | "Errands";

export type RestrictionFlag = "No Liquids > 100ml" | "No Fragile Items" | "No Food" | "No Electronics";

export type KapalitPreference =
  | "Food"
  | "Services"
  | "Vouchers"
  | "Electronics"
  | "Handmade Items"
  | "Household Items"
  | "Open to Bundles"
  | "Strict 1:1 Only";

export type TravelType = "Traveler (Flight)" | "Commuter (Land)" | "Returning OFW" | "Daily Route Driver" | "Group Host (Bulk Pasalubong pickup)";

export type SwapMode = "Strict 1:1 Only" | "Open to Bundles" | "Group Host (Bulk Pasalubong pickup)";

export type TravelerSortOption = "Best Match" | "Earliest Return" | "Most Active" | "Nearest First";

export interface TripDetails {
  departureDate: string;
  returnDate: string;
  timelineLabel: string;
  stayNotes?: string;
}

export interface TravelerRestrictions {
  flags: RestrictionFlag[];
  weightLimitKg: number;
  quantityLimit: number;
  notes?: string;
}

export interface TravelerProfile {
  id: string;
  conversationId: string;
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  travelType: TravelType;
  currentArea: string;
  nearbyDistricts: string[];
  cityProvince: string;
  routePath: string;
  distanceKm: number;
  origin: TravelerOrigin | string;
  locationFocus: TravelerLocationFilter[];
  bitbit: (BitbitCategory | string)[];
  bitbitNotes?: string;
  restrictions: TravelerRestrictions;
  kapalitPreferences: KapalitPreference[];
  kapalitNotes?: string;
  swapMode: SwapMode;
  trip: TripDetails;
  availabilityKg: number;
  totalCapacityKg: number;
  pricePerKg: number;
  messageTemplates: string[];
  featuredRequests: string[];
  completedSwaps: number;
  activeSince: string;
  statusNote?: string;
}

export interface TravelerFilterState {
  sort: TravelerSortOption;
  query: string;
  locationFilters: TravelerLocationFilter[];
  origins: TravelerOrigin[];
  customOrigin?: string;
  bitbit: BitbitCategory[];
  customBitbit?: string;
  restrictions: RestrictionFlag[];
  minWeightCapacity?: number;
  minQuantityLimit?: number;
  kapalit: KapalitPreference[];
  travelTypes: TravelType[];
  swapModes: SwapMode[];
}

