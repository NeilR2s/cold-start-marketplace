import { TagGroup, BarterType, CategoryName, ExchangeMethod, SortOption, LocationFilter } from "../types/explore";

export const SORT_OPTIONS: SortOption[] = ["Best Match", "Most Recent", "Most Popular", "Nearest First"];

export const BARTER_TYPES: BarterType[] = ["1:1 Swap", "1-to-Many Swap", "Group Swap"];

export const CATEGORIES: CategoryName[] = [
  "Food & Pasalubong",
  "Electronics",
  "Appliances",
  "Fashion & Accessories",
  "K-pop & Collectibles",
  "Home & Living",
  "Hobbies & Crafts",
  "Services",
  "Travel & Bitbit Trips",
];

export const EXCHANGE_METHODS: ExchangeMethod[] = ["Delivery", "Pickup", "Drop-off", "Meetup"];

export const LOCATION_FILTERS: LocationFilter[] = ["My Location", "City / Province", "Distance Radius", "Route / Trip Origin"];

export const TAG_GROUPS: TagGroup[] = [
  {
    label: "Item Condition",
    options: ["Brand New", "Like New", "Gently Used", "Used", "Vintage"],
  },
  {
    label: "Origin",
    options: ["Japan", "Korea", "USA", "UAE", "Local"],
  },
  {
    label: "Requested Kapalit",
    options: ["Food", "Services", "Vouchers", "Electronics", "Handmade Items", "Household Items"],
  },
  {
    label: "Urgency",
    options: ["Swap Today", "Time-Sensitive", "Flexible"],
  },
  {
    label: "Host Type",
    options: ["Traveler", "Regular User", "Group Host"],
  },
  {
    label: "Swap Flexibility",
    options: ["Strict 1:1 Only", "Open to Bundles", "Accepts Group Contributions"],
  },
];

