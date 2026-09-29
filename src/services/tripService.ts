import { PostTripRequest, PostTripResponse } from '@/types/trips';

const TRIPS_STORAGE_KEY = 'bitbit_posted_trips';

class TripService {
  public async postTrip(request: PostTripRequest): Promise<PostTripResponse> {
    const tripId = `trip_${Date.now()}`;
    const newTrip = {
      id: tripId,
      ...request,
      postedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem(TRIPS_STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newTrip);
      localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }

    return {
      success: true,
      tripId,
      postedAt: newTrip.postedAt,
    };
  }
}

export const tripService = new TripService();
