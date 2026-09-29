export interface UserProfile {
  uid: string;
  displayName: string;
  avatar: string;
  roles?: string[];
  verificationStatus?: string;
  reputationScore?: number;
  walletBalance?: number;
  email?: string;
  location?: string;
  joinedDate?: string;
  credits?: number;
  skills?: string[];
  activeSwaps?: number;
  verificationProgress?: number;
  verificationSteps?: string;
}

export interface TripCapacity {
  total: number;
  available: number;
  pricePerKg: number;
}

export interface TripTraveler {
  name: string;
  verified: boolean;
  rating: number;
}

export interface Trip {
  id: string;
  traveler: TripTraveler;
  origin: string;
  destination: string;
  date: string;
  capacity: TripCapacity;
  shops: string[];
  status: 'scheduled' | 'closing_soon' | string;
}

export interface GroupOrderItem {
  name: string;
  price: number;
}

export interface GroupOrderPooling {
  current: number;
  target: number;
  baseFee: number;
  minFee: number;
}

export interface GroupOrderManager {
  name: string;
  verified: boolean;
}

export interface GroupOrder {
  id: string;
  title: string;
  manager: GroupOrderManager;
  region: string;
  status: string;
  deadline: string;
  category: string;
  items: GroupOrderItem[];
  pooling: GroupOrderPooling;
  biases: string[];
}

export interface PriceBreakdownConfig {
  basePrice: number;
  tax: number;
  hostFee: number;
  handlingFee: number;
}

export const CURRENT_USER: UserProfile = {
  uid: "u123",
  displayName: "Clara the Collector",
  avatar: "https://i.pravatar.cc/150?u=clara",
  roles: ["buyer", "traveler"],
  verificationStatus: "verified",
  reputationScore: 4.8,
  walletBalance: 2450.00,
  email: "clara@example.com",
  location: "Ortigas, RET44",
  joinedDate: "Sept 2023",
  credits: 14.5,
  skills: ["Web Design", "Gardening", "Pet Sitting"],
  activeSwaps: 2,
  verificationProgress: 75,
  verificationSteps: "3/4"
};

export const MOCK_TRIPS: Trip[] = [
  {
    id: "t1",
    traveler: { name: "Miguel Travels", verified: true, rating: 4.9 },
    origin: "Tokyo, Japan",
    destination: "Manila, PH",
    date: "2023-12-15T10:00:00",
    capacity: { total: 20, available: 12, pricePerKg: 800 },
    shops: ["Don Quijote", "Nintendo Store", "IKEA Shibuya"],
    status: "scheduled"
  },
  {
    id: "t2",
    traveler: { name: "Sarah FA", verified: true, rating: 5.0 },
    origin: "Seoul, South Korea",
    destination: "Cebu, PH",
    date: "2023-11-28T14:00:00",
    capacity: { total: 15, available: 2, pricePerKg: 650 },
    shops: ["Olive Young", "K-Pop Popups"],
    status: "closing_soon"
  }
];

export const MOCK_GOS: GroupOrder[] = [
  {
    id: "go1",
    title: "Seventeen 'FML' Album GO",
    manager: { name: "HoshiCart_PH", verified: true },
    region: "South Korea",
    status: "open",
    deadline: "2023-12-01",
    category: "K-Pop",
    items: [
      { name: "Carat Version", price: 650 },
      { name: "Photobook Ver", price: 950 }
    ],
    pooling: {
      current: 45,
      target: 100,
      baseFee: 150,
      minFee: 50
    },
    biases: ["S.Coups", "Jeonghan", "Joshua", "Jun", "Hoshi", "Wonwoo", "Woozi", "The8", "Mingyu", "DK", "Seungkwan", "Vernon", "Dino"]
  },
  {
    id: "go2",
    title: "IKEA Pasabuy (Batch 24)",
    manager: { name: "NordicHome_MNL", verified: true },
    region: "Pasay (Local)",
    status: "packing",
    category: "Home",
    deadline: "2023-11-20",
    items: [
        { name: "Nordic Spirit", price: 135 },
        { name: "Stroogenstrub (Chair)", price: 1950 }
    ],
    pooling: {
      current: 12,
      target: 20,
      baseFee: 200,
      minFee: 100
    },
    biases: [] 
  }
];

export const PRICE_BREAKDOWN: PriceBreakdownConfig = {
  basePrice: 150,
  tax: 15,
  hostFee: 20,
  handlingFee: 10,
};
