export type SwapSortOption = "Best Match" | "Most Recent" | "Most Popular" | "Nearest First";

export type BarterType = "1:1 Swap" | "1-to-Many Swap" | "Group Swap";

export type CategoryName =
  | "Food & Pasalubong"
  | "Electronics"
  | "Appliances"
  | "Fashion & Accessories"
  | "K-pop & Collectibles"
  | "Home & Living"
  | "Hobbies & Crafts"
  | "Services"
  | "Travel & Bitbit Trips";

export type ExchangeMethod = "Delivery" | "Pickup" | "Drop-off" | "Meetup";

export type LocationFilter = "My Location" | "City / Province" | "Distance Radius" | "Route / Trip Origin";

export type TagCategory =
  | "Item Condition"
  | "Origin"
  | "Requested Kapalit"
  | "Urgency"
  | "Host Type"
  | "Swap Flexibility";

export type TagValue =
  | "Brand New"
  | "Like New"
  | "Gently Used"
  | "Used"
  | "Vintage"
  | "Japan"
  | "Korea"
  | "USA"
  | "UAE"
  | "Local"
  | "Food"
  | "Services"
  | "Vouchers"
  | "Electronics"
  | "Handmade Items"
  | "Household Items"
  | "Swap Today"
  | "Time-Sensitive"
  | "Flexible"
  | "Traveler"
  | "Regular User"
  | "Group Host"
  | "Strict 1:1 Only"
  | "Open to Bundles"
  | "Accepts Group Contributions";

export interface TagGroup {
  label: TagCategory;
  options: TagValue[];
}

export interface UserLocation {
  city: string;
  province: string;
  latitude: number;
  longitude: number;
}

export interface ContributorSlots {
  total: number;
  filled: number;
  notes?: string;
}

export interface SwapListing {
  id: string;
  title: string;
  subtitle: string;
  barterType: BarterType;
  category: CategoryName;
  exchangeMethods: ExchangeMethod[];
  locationLabel: string;
  locationFilter: LocationFilter;
  distanceKm?: number;
  routeOrigin?: string;
  offerSummary: string;
  desiredSummary: string;
  hostName: string;
  hostAvatarColor: string;
  heroImage: string;
  tags: Partial<Record<TagCategory, TagValue[]>>;
  commentCount: number;
  likes: number;
  postedAt: string;
  contributorSlots?: ContributorSlots;
}

export interface FilterState {
  sort: SwapSortOption;
  barterTypes: BarterType[];
  categories: CategoryName[];
  exchangeMethods: ExchangeMethod[];
  location?: LocationFilter;
  tags: Partial<Record<TagCategory, TagValue[]>>;
  query: string;
}

