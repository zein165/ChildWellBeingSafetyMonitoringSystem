import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {LocationPoint} from '../../types/domain';

interface GeofenceConfig {
  homeLatitude: number;
  homeLongitude: number;
  radiusMeters: number;
}

interface LocationState {
  geofence: GeofenceConfig;
  history: LocationPoint[];
  outsideDurationMinutes: number;
}

const initialState: LocationState = {
  geofence: {
    homeLatitude: 0,
    homeLongitude: 0,
    radiusMeters: 50,
  },
  history: [],
  outsideDurationMinutes: 0,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setGeofence(state, action: PayloadAction<GeofenceConfig>) {
      state.geofence = action.payload;
    },
    addLocationPoint(state, action: PayloadAction<LocationPoint>) {
      state.history.unshift(action.payload);
      state.history = state.history.slice(0, 500);
    },
    setOutsideDuration(state, action: PayloadAction<number>) {
      state.outsideDurationMinutes = action.payload;
    },
  },
});

export const {setGeofence, addLocationPoint, setOutsideDuration} = locationSlice.actions;
export default locationSlice.reducer;
