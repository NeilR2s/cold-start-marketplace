export interface PostTripRequest {
  origin: string;
  destination: string;
  returnDate: string;
  capacityKg: number;
  pricePerKg: number;
  notes?: string;
}

export interface PostTripResponse {
  success: boolean;
  tripId: string;
  postedAt: string;
}
