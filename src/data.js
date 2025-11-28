export const CURRENT_USER = {
  uid: "u123",
  displayName: "Clara the Collector",
  roles: ["buyer", "traveler"],
  verificationStatus: "verified",
  reputationScore: 4.8,
  walletBalance: 2450.00
};

export const MOCK_TRIPS = [
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

export const MOCK_GOS = [
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
