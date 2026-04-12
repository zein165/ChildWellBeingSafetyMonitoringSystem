import { apiClient } from '../../../services/apiClient';

export interface LocationHistoryItem {
  id: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

const geocodeCache = new Map<
  string,
  { value: string; timestamp: number }
>();

const pendingRequests = new Map<string, Promise<string>>();

const TTL = 1000 * 60 * 24;

export const locationService = {
  getHistory: async (childId: string, date?: string): Promise<LocationHistoryItem[]> => {
    const response = await apiClient.get(`/tracking/location/history/${childId}`, {
      params: { date },
    });
    return response.data.data;
  },

  reverseGeocode: async (lat: number, lon: number): Promise<string> => {
    const key = `${lat.toFixed(5)},${lon.toFixed(5)}`;
    const now = Date.now();

    const cached = geocodeCache.get(key);
    if (cached && now - cached.timestamp < TTL) {
      return cached.value;
    }

    if (pendingRequests.has(key)) {
      return pendingRequests.get(key)!;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        {
          headers: {
            'User-Agent': 'ChildWellBeingApp/1.0',
          },
        }
      );

      const data = await response.json();
      const address = data.display_name || 'Unknown Address';

      geocodeCache.set(key, {
        value: address,
        timestamp: Date.now(),
      });

      pendingRequests.delete(key);

      return address;
    } catch (error: any) {
      console.error('Geocoding error:', error.message);
      return 'Address unavailable';
    }
  },
};
